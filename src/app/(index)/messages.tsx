import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Conversation } from "@/src/lib/types";
import { useChatStore } from "@/src/stores/chatStore";

import { useAuth } from "../../context/AuthContext";

export default function MessagesScreen() {
  const { user } = useAuth();

  const {
    conversations,
    unreadMessages,
    conversationsLoading,
    fetchConversationsData,
    subscribeToConversationsList,
    unsubscribeFromConversationsList,
  } = useChatStore();

  React.useEffect(() => {
    if (user) {
      fetchConversationsData(user.id);
      subscribeToConversationsList(user.id);
    }

    return () => {
      unsubscribeFromConversationsList();
    };
  }, [
    user,
    fetchConversationsData,
    subscribeToConversationsList,
    unsubscribeFromConversationsList,
  ]);

  const navigateToChat = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    if (!user) return null;

    const isOwner = user.id === item.owner_id;
    const otherPerson = isOwner ? item.sitter : item.owner;

    const messageDate = new Date(item.created_at);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();

    const dateDisplay = isToday
      ? messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : messageDate.toLocaleDateString([], { month: "short", day: "numeric" });

    const unreadCount = unreadMessages[item.id] || 0;
    const conversationStyle =
      unreadCount > 0 ? styles.conversationItemUnread : styles.conversationItem;

    return (
      <TouchableOpacity style={conversationStyle} onPress={() => navigateToChat(item.id)}>
        <Image
          source={{ uri: otherPerson?.avatar_url || "https://via.placeholder.com/50" }}
          style={styles.avatar}
        />

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.personName}>
              {otherPerson?.first_name} {otherPerson?.last_name}
            </Text>
            <Text style={styles.messageTime}>{dateDisplay}</Text>
          </View>

          <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
            {item.last_message || "No messages yet"}
          </Text>

          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (conversationsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/search-pet-sitter")}
          >
            <Text style={styles.searchButtonText}>Find Pet Sitters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LegendList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          estimatedItemSize={300}
        />
      )}
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationItemUnread: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  personName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  lastMessage: {
    fontSize: 14,
    color: "#4B5563",
  },
  unreadBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
