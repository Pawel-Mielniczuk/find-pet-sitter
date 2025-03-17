import { supabase } from "../lib/supabase";
import { Conversation, conversationSchema, Message } from "../lib/types";

export const chatService = {
  fetchConversation: async (conversationId: string): Promise<Conversation> => {
    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .select(
        `
          id,
          owner_id,
          sitter_id,
          last_message,
          created_at,
          owner:profiles!owner_id(id, first_name, last_name, avatar_url),
          sitter:profiles!sitter_id(id, first_name, last_name, avatar_url)
        `,
      )
      .eq("id", conversationId)
      .single();

    if (conversationError) {
      throw conversationError;
    }

    const validatedConversationData = conversationSchema.parse(conversationData);
    const parsedConversation = conversationSchema.parse(validatedConversationData);

    return parsedConversation;
  },

  fetchMessages: async (conversationId: string): Promise<Message[]> => {
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      throw messagesError;
    }

    return messagesData || [];
  },

  markMessagesAsRead: async (messageIds: string[]): Promise<void> => {
    await supabase.from("messages").update({ read: true }).in("id", messageIds);
  },
  subscribeToMessages: (conversationId: string, onMessageReceived: (message: Message) => void) => {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          const newMessage = payload.new as Message;
          if (newMessage && newMessage.id) {
            onMessageReceived(newMessage);
          }
        },
      )
      .subscribe();

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
  sendMessage: async (
    conversationId: string,
    senderId: string,
    recipientId: string,
    content: string,
  ): Promise<void> => {
    const messageToSend = {
      sender_id: senderId,
      recipient_id: recipientId,
      content: content.trim(),
      read: false,
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("messages").insert(messageToSend).select("*").single();

    if (error) {
      throw error;
    }

    await supabase
      .from("conversations")
      .update({ last_message: content.trim() })
      .eq("id", conversationId);
  },
  fetchConversations: async (userId: string): Promise<Conversation[]> => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
          id, 
          owner_id, 
          sitter_id, 
          last_message, 
          created_at,
          owner:profiles!owner_id(id, first_name, last_name, avatar_url),
          sitter:profiles!sitter_id(id, first_name, last_name, avatar_url)
        `,
      )
      .or(`owner_id.eq.${userId},sitter_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const validatedData = data.map(conversation => conversationSchema.parse(conversation));

    const updatedConversations = validatedData.map(conversation =>
      conversationSchema.parse(conversation),
    );

    return updatedConversations;
  },

  fetchUnreadMessagesCount: async (conversationId: string): Promise<number> => {
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("read", false);

    if (messagesError) {
      throw messagesError;
    }

    return messages?.length || 0;
  },

  subscribeToConversations: (userId: string, onConversationsChanged: () => void) => {
    const subscription = supabase
      .channel("conversations_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `owner_id=eq.${userId},sitter_id=eq.${userId}`,
        },
        () => {
          onConversationsChanged();
        },
      )
      .subscribe();

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
