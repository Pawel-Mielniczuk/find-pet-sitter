import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const MESSAGES = [
  {
    id: "1",
    sender: "Sarah Johnson",
    message: "Hi! I'm available to watch Luna next week...",
    time: "2m ago",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: "2",
    sender: "Michael Chen",
    message: "Thanks for booking! I'll see you tomorrow at 9am",
    time: "1h ago",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    id: "3",
    sender: "Emily Davis",
    message: "Your booking has been confirmed for next...",
    time: "3h ago",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <ScrollView style={styles.messageList}>
        {MESSAGES.map(message => (
          <Pressable key={message.id} style={styles.messageCard}>
            <Image source={{ uri: message.avatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{message.sender}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text
                style={[styles.messageText, message.unread && styles.unreadMessage]}
                numberOfLines={1}
              >
                {message.message}
              </Text>
            </View>
            {message.unread && <View style={styles.unreadDot} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  messageList: {
    padding: 24,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messageTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  messageText: {
    fontSize: 14,
    color: "#6B7280",
  },
  unreadMessage: {
    color: "#111827",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7C3AED",
    marginLeft: 8,
  },
});
