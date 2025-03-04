import { Calendar, Clock, MapPin } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const BOOKINGS = [
  {
    id: "1",
    petOwner: "Jessica Wilson",
    petName: "Luna",
    petType: "Dog",
    date: "May 15, 2025",
    time: "9:00 AM - 11:00 AM",
    location: "Brooklyn, NY",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "2",
    petOwner: "Michael Brown",
    petName: "Oliver",
    petType: "Cat",
    date: "May 18, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Manhattan, NY",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "3",
    petOwner: "Sarah Johnson",
    petName: "Max",
    petType: "Dog",
    date: "May 10, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Queens, NY",
    status: "completed",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function BookingsScreen() {
  const upcomingBookings = BOOKINGS.filter(booking => booking.status === "upcoming");
  const completedBookings = BOOKINGS.filter(booking => booking.status === "completed");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
        {upcomingBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No upcoming bookings</Text>
          </View>
        ) : (
          upcomingBookings.map(booking => (
            <Pressable key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Image source={{ uri: booking.image }} style={styles.petImage} />
                <View style={styles.bookingInfo}>
                  <Text style={styles.petName}>{booking.petName}</Text>
                  <Text style={styles.petOwner}>Owner: {booking.petOwner}</Text>
                  <Text style={styles.petType}>{booking.petType}</Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.location}</Text>
                </View>
              </View>

              <View style={styles.bookingActions}>
                <Pressable style={[styles.actionButton, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>View Details</Text>
                </Pressable>

                <Pressable style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Message Owner</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}

        <Text style={styles.sectionTitle}>Past Bookings</Text>
        {completedBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No past bookings</Text>
          </View>
        ) : (
          completedBookings.map(booking => (
            <Pressable key={booking.id} style={[styles.bookingCard, styles.completedBooking]}>
              <View style={styles.bookingHeader}>
                <Image source={{ uri: booking.image }} style={styles.petImage} />
                <View style={styles.bookingInfo}>
                  <Text style={styles.petName}>{booking.petName}</Text>
                  <Text style={styles.petOwner}>Owner: {booking.petOwner}</Text>
                  <Text style={styles.petType}>{booking.petType}</Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{booking.location}</Text>
                </View>
              </View>

              <View style={styles.completedLabel}>
                <Text style={styles.completedText}>Completed</Text>
              </View>
            </Pressable>
          ))
        )}
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
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    marginTop: 8,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedBooking: {
    opacity: 0.8,
  },
  bookingHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
    justifyContent: "center",
  },
  petName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  petOwner: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: "#7C3AED",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  bookingDetails: {
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  bookingActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#F3E8FF",
  },
  secondaryButtonText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  completedLabel: {
    backgroundColor: "#D1FAE5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  completedText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
