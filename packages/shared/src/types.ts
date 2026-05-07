/**
 * Shared TypeScript types for the ToyCycle platform.
 * These types mirror the Supabase database schema and are
 * used by both web and mobile clients.
 */

// ===== User / Profile =====

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  display_name: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  credit_balance: number;
  locale: string;
  created_at: string;
}

// ===== Toy =====

export type ToyStatus = 'available' | 'reserved' | 'exchanged';

export type ToyCondition = 'new' | 'like_new' | 'used';

export type ToyCategory =
  | 'building'
  | 'figures'
  | 'vehicles'
  | 'puzzles'
  | 'outdoor'
  | 'electronic'
  | 'stuffed'
  | 'educational'
  | 'creative'
  | 'other';

export type AgeRange = '0-1' | '1-3' | '3-6' | '6-9' | '9-12' | '12+';

export interface Toy {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: ToyCategory;
  age_range: AgeRange;
  condition: ToyCondition;
  estimated_value: number;
  status: ToyStatus;
  is_cleaned: boolean;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface ToyImage {
  id: string;
  toy_id: string;
  image_url: string;
  display_order: number;
}

export interface ToyWithImages extends Toy {
  images: ToyImage[];
  owner?: Profile;
}

// ===== Exchange =====

export type ExchangeStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface ExchangeRequest {
  id: string;
  requester_id: string;
  toy_id: string;
  owner_id: string;
  status: ExchangeStatus;
  credits_amount: number;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExchangeRequestWithDetails extends ExchangeRequest {
  toy?: ToyWithImages;
  requester?: Profile;
  owner?: Profile;
}

// ===== Chat =====

export interface Conversation {
  id: string;
  exchange_request_id: string | null;
  created_at: string;
  last_message_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  participants: Profile[];
  last_message?: Message;
  unread_count?: number;
}

// ===== Credits =====

export type CreditTransactionType = 'earn' | 'spend' | 'bonus' | 'purchase';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: CreditTransactionType;
  description: string;
  related_exchange_id: string | null;
  created_at: string;
}

// ===== Map / Geo =====

export interface Coordinates {
  lng: number;
  lat: number;
}

export type TravelMode = 'walking' | 'driving';
