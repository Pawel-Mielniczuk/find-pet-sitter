import { create } from "zustand";

import { Conversation, Message, UserProfile } from "../lib/types";
import { chatService } from "../services/chatService";

type ChatState = {
  conversation: Conversation | null;
  otherUser: UserProfile | null;
  messages: Message[];
  loading: boolean;
  error: Error | null;
  subscription: { unsubscribe: () => void } | null;
  newMessage: string;
  sending: boolean;
  conversations: Conversation[];
  unreadMessages: Record<string, number>;
  conversationsLoading: boolean;
  conversationsSubscription: { unsubscribe: () => void } | null;

  fetchConversationData: (conversationId: string, user: any) => Promise<void>;
  setConversation: (conversation: Conversation | null) => void;
  setOtherUser: (user: UserProfile | null) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setSubscription: (subscription: { unsubscribe: () => void } | null) => void;
  subscribeToConversation: (conversationId: string, user: any) => void;
  unsubscribeFromConversation: () => void;
  setNewMessage: (message: string) => void;
  setSending: (sending: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
  setUnreadMessages: (unreadMessages: Record<string, number>) => void;
  setConversationsLoading: (loading: boolean) => void;
  setConversationsSubscription: (subscription: { unsubscribe: () => void } | null) => void;
  handleSendMessage: (
    conversationId: string,
    user: any,
    otherUser: UserProfile | null,
  ) => Promise<void>;
  fetchConversationsData: (userId: string) => Promise<void>;
  subscribeToConversationsList: (userId: string) => void;
  unsubscribeFromConversationsList: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversation: null,
  otherUser: null,
  messages: [],
  loading: false,
  error: null,
  subscription: null,
  newMessage: "",
  sending: false,
  conversations: [],
  unreadMessages: {},
  conversationsLoading: false,
  conversationsSubscription: null,

  setConversation: conversation => set({ conversation }),
  setOtherUser: user => set({ otherUser: user }),
  setMessages: messages => set({ messages }),
  setLoading: loading => set({ loading }),
  setSubscription: subscription => set({ subscription }),
  setNewMessage: message => set({ newMessage: message }),
  setSending: sending => set({ sending }),
  setConversations: conversations => set({ conversations }),
  setUnreadMessages: unreadMessages => set({ unreadMessages }),
  setConversationsLoading: loading => set({ conversationsLoading: loading }),
  setConversationsSubscription: subscription => set({ conversationsSubscription: subscription }),

  fetchConversationData: async (conversationId: string, user: any) => {
    set({ loading: true, error: null });
    try {
      const conversation = await chatService.fetchConversation(conversationId);
      set({ conversation });

      if (!user) {
        throw new Error("fetchConversationData: user is null");
      }

      const otherUser =
        user.id === conversation.owner_id ? conversation.sitter : conversation.owner;

      set({ otherUser });

      const messages = await chatService.fetchMessages(conversationId);
      const uniqueMessages = messages.filter(
        (message, index, self) => index === self.findIndex(m => m.id === message.id),
      );

      set({ messages: uniqueMessages });

      const unreadMessages = uniqueMessages.filter(
        msg => msg.recipient_id === user.id && !msg.read,
      );

      if (unreadMessages.length > 0) {
        await chatService.markMessagesAsRead(unreadMessages.map(msg => msg.id));
      }
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  subscribeToConversation: (conversationId: string, user: any) => {
    if (!conversationId || !user) return;

    const subscription = chatService.subscribeToMessages(conversationId, newMessage => {
      set(state => {
        if (!state.messages.some(msg => msg.id === newMessage.id)) {
          return { messages: [...state.messages, newMessage] };
        }
        return state;
      });
    });

    set({ subscription });
  },
  unsubscribeFromConversation: () => {
    const subscription = get().subscription;
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
    }
  },
  handleSendMessage: async (conversationId: string, user: any, otherUser: UserProfile | null) => {
    if (!get().newMessage.trim() || !get().conversation || !user || !otherUser) return;

    set({ sending: true });

    try {
      await chatService.sendMessage(conversationId, user.id, otherUser.id, get().newMessage);

      set({ newMessage: "" });
    } catch (error) {
      throw error;
    } finally {
      set({ sending: false });
    }
  },
  fetchConversationsData: async (userId: string) => {
    set({ conversationsLoading: true });
    try {
      const conversations = await chatService.fetchConversations(userId);
      set({ conversations });

      const unreadMessagesMap: Record<string, number> = {};
      for (const conversation of conversations) {
        const unreadCount = await chatService.fetchUnreadMessagesCount(conversation.id);
        unreadMessagesMap[conversation.id] = unreadCount;
      }
      set({ unreadMessages: unreadMessagesMap });
    } catch (error) {
      throw new Error("Error fetching conversations", { cause: error });
    } finally {
      set({ conversationsLoading: false });
    }
  },

  subscribeToConversationsList: (userId: string) => {
    const subscription = chatService.subscribeToConversations(userId, () =>
      get().fetchConversationsData(userId),
    );
    set({ conversationsSubscription: subscription });
  },

  unsubscribeFromConversationsList: () => {
    const subscription = get().conversationsSubscription;
    if (subscription) {
      subscription.unsubscribe();
      set({ conversationsSubscription: null });
    }
  },
}));
