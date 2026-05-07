-- ToyCycle MVP Database Schema
-- Run this migration in Supabase SQL Editor or via CLI

-- ===== Enable Extensions =====
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== Profiles =====
-- Extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  display_name TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  credit_balance INTEGER NOT NULL DEFAULT 50,  -- 新用户赠送 50 积分
  locale TEXT NOT NULL DEFAULT 'zh',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Toys =====
CREATE TABLE IF NOT EXISTS toys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN (
    'building', 'figures', 'vehicles', 'puzzles', 'outdoor',
    'electronic', 'stuffed', 'educational', 'creative', 'other'
  )),
  age_range TEXT NOT NULL CHECK (age_range IN ('0-1', '1-3', '3-6', '6-9', '9-12', '12+')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'used')),
  estimated_value INTEGER NOT NULL CHECK (estimated_value > 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'exchanged')),
  is_cleaned BOOLEAN NOT NULL DEFAULT false,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_toys_location ON toys (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_toys_status ON toys (status);
CREATE INDEX IF NOT EXISTS idx_toys_owner ON toys (owner_id);
CREATE INDEX IF NOT EXISTS idx_toys_category ON toys (category);

-- ===== Toy Images =====
CREATE TABLE IF NOT EXISTS toy_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  toy_id UUID NOT NULL REFERENCES toys(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_toy_images_toy ON toy_images (toy_id);

-- ===== Exchange Requests =====
CREATE TABLE IF NOT EXISTS exchange_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  toy_id UUID NOT NULL REFERENCES toys(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  credits_amount INTEGER NOT NULL CHECK (credits_amount > 0),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent duplicate pending requests
  CONSTRAINT unique_pending_request UNIQUE (requester_id, toy_id)
);

CREATE INDEX IF NOT EXISTS idx_exchange_owner ON exchange_requests (owner_id);
CREATE INDEX IF NOT EXISTS idx_exchange_requester ON exchange_requests (requester_id);

-- ===== Conversations =====
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exchange_request_id UUID REFERENCES exchange_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Conversation Participants =====
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants (user_id);

-- ===== Messages =====
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);

-- ===== Credit Transactions =====
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,  -- positive = earn, negative = spend
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'bonus', 'purchase')),
  description TEXT NOT NULL DEFAULT '',
  related_exchange_id UUID REFERENCES exchange_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions (user_id, created_at);

-- ===== Row Level Security =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE toys ENABLE ROW LEVEL SECURITY;
ALTER TABLE toy_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Toys: anyone can read available, owner can manage
CREATE POLICY "Available toys are viewable by everyone" ON toys FOR SELECT USING (true);
CREATE POLICY "Users can insert own toys" ON toys FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own toys" ON toys FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own toys" ON toys FOR DELETE USING (auth.uid() = owner_id);

-- Toy Images: follow toy access
CREATE POLICY "Toy images are viewable by everyone" ON toy_images FOR SELECT USING (true);
CREATE POLICY "Users can manage own toy images" ON toy_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM toys WHERE toys.id = toy_id AND toys.owner_id = auth.uid()));
CREATE POLICY "Users can delete own toy images" ON toy_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM toys WHERE toys.id = toy_id AND toys.owner_id = auth.uid()));

-- Exchange Requests: participants can view
CREATE POLICY "Exchange participants can view" ON exchange_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = owner_id);
CREATE POLICY "Users can create exchange requests" ON exchange_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Owners can update exchange requests" ON exchange_requests FOR UPDATE
  USING (auth.uid() = owner_id);

-- Conversations: participants only
CREATE POLICY "Conversation participants can view" ON conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));

-- Conversation Participants
CREATE POLICY "Participants can view" ON conversation_participants FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()
  ));

-- Messages: conversation participants can view and send
CREATE POLICY "Conversation members can view messages" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  ));

-- Credit Transactions: own only
CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- ===== Trigger: Auto-create profile on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, credit_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', '新用户'),
    50  -- 初始赠送积分
  );
  -- Record the bonus transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 50, 'bonus', '新用户注册赠送');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== Trigger: Update updated_at =====
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_toys_updated_at BEFORE UPDATE ON toys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_exchange_requests_updated_at BEFORE UPDATE ON exchange_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
