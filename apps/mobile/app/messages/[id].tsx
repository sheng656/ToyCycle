import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, BorderRadius } from '../../constants/Spacing';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // This is the exchange_request_id
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [request, setRequest] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user && id) {
      loadData();
    }
  }, [user, id]);

  useEffect(() => {
    if (!conversation) return;

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Get exchange request
      const { data: reqData, error: reqError } = await supabase
        .from('exchange_requests')
        .select('*, toy:toys(title), requester:profiles!exchange_requests_requester_id_fkey(display_name), owner:profiles!exchange_requests_owner_id_fkey(display_name)')
        .eq('id', id)
        .single();
        
      if (reqError) throw reqError;
      setRequest(reqData);

      // 2. Get or create conversation
      let { data: convData } = await supabase
        .from('conversations')
        .select('*')
        .eq('exchange_request_id', id)
        .single();

      if (!convData) {
        // Create conversation
        const { data: newConv, error: newConvError } = await supabase
          .from('conversations')
          .insert({ exchange_request_id: id })
          .select()
          .single();
          
        if (newConvError) throw newConvError;
        convData = newConv;
      }
      setConversation(convData);

      // 3. Load messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convData.id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgData || []);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !conversation || !user) return;

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content: inputText.trim(),
      });

      if (error) throw error;
      setInputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('exchange_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setRequest((prev: any) => ({ ...prev, status: newStatus }));
      
      // Send a system-like message indicating status change
      await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: user?.id,
        content: `Exchange request was ${newStatus}.`,
      });

    } catch (error) {
      Alert.alert('Error', `Failed to ${newStatus} request`);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageThem]}>
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : null]}>{item.content}</Text>
      </View>
    );
  };

  const isOwner = request?.owner_id === user?.id;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 24, color: Colors.light.primary }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {request?.toy?.title || 'Chat'}
        </Text>
      </View>

      {/* Action Bar for Owner (Pending Requests) */}
      {isOwner && request?.status === 'pending' && (
        <View style={styles.actionBar}>
          <Text style={styles.actionText}>Approve this exchange?</Text>
          <View style={styles.actionButtons}>
            <Button title="Reject" variant="ghost" onPress={() => handleStatusUpdate('rejected')} />
            <Button title="Accept" onPress={() => handleStatusUpdate('accepted')} style={{ marginLeft: Spacing.sm }} />
          </View>
        </View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.light.outline}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!inputText.trim()}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.md,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  backBtn: {
    paddingRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.headlineMd,
    color: Colors.light.onSurface,
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: Colors.light.surfaceContainerHigh,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.outlineVariant,
  },
  actionText: {
    ...Typography.labelMd,
    color: Colors.light.onSurface,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  messagesList: {
    padding: Spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  messageMe: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  messageThem: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
  },
  messageText: {
    ...Typography.bodyMd,
    color: Colors.light.onSurface,
  },
  messageTextMe: {
    color: Colors.light.onPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.outlineVariant,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.bodyMd,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  sendText: {
    ...Typography.labelMd,
    color: Colors.light.primary,
  },
});
