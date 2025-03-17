import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Message } from "@/src/lib/types";
import { useChatStore } from "@/src/stores/chatStore";

import { useAuth } from "../../../context/AuthContext";

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const flatListRef = React.useRef<React.ElementRef<typeof LegendList> | null>(null);

  const {
    conversation,
    otherUser,
    messages,
    loading,
    sending,
    fetchConversationData,
    subscribeToConversation,
    unsubscribeFromConversation,
    newMessage,
    setNewMessage,
    handleSendMessage,
  } = useChatStore();

  React.useEffect(() => {
    if (conversationId && user) {
      fetchConversationData(conversationId, user);
      subscribeToConversation(conversationId, user);
    }

    return () => {
      unsubscribeFromConversation();
    };
  }, [
    conversationId,
    user,
    fetchConversationData,
    subscribeToConversation,
    unsubscribeFromConversation,
  ]);

  React.useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const onMessageSend = async () => {
    if (conversationId && user && otherUser) {
      await handleSendMessage(conversationId, user, otherUser);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.sender_id === user?.id;

    const timestamp = new Date(item.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[styles.messageBubble, isCurrentUser ? styles.sentBubble : styles.receivedBubble]}
        >
          <Text style={[styles.messageText, isCurrentUser ? styles.sentText : styles.receivedText]}>
            {item.content}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {timestamp}
          {isCurrentUser && (
            <Text style={styles.readStatus}>{item.read ? " • Read" : " • Delivered"}</Text>
          )}
        </Text>
      </View>
    );
  };

  React.useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversation not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          {otherUser ? (
            <>
              <Image
                source={{ uri: otherUser.avatar_url || "https://via.placeholder.com/40" }}
                style={styles.avatar}
              />
              <Text style={styles.headerName}>
                {otherUser.first_name} {otherUser.last_name}
              </Text>
            </>
          ) : (
            <Text style={styles.headerName}>Loading...</Text>
          )}
        </View>

        <View style={{ width: 40 }} />
      </View>

      <LegendList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        }
        estimatedItemSize={100}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={onMessageSend}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
  },
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    marginLeft: 4,
  },
  readStatus: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    fontSize: 16,
    color: "#111827",
    maxHeight: 120,
  },
  sendButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#C4B5FD",
  },
  loadingText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  sentBubble: {
    backgroundColor: "#7C3AED",
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sentText: {
    color: "#FFFFFF",
  },
  receivedText: {
    color: "#111827",
  },
});
