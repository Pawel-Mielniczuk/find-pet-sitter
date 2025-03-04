import { Calendar, Clock, DollarSign, Filter, MapPin } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const JOBS = [
  {
    id: "1",
    petOwner: "Jessica Wilson",
    petName: "Luna",
    petType: "Dog",
    breed: "Golden Retriever",
    date: "May 20, 2025",
    time: "9:00 AM - 11:00 AM",
    location: "Brooklyn, NY",
    distance: "1.2 miles away",
    rate: 35,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "2",
    petOwner: "Michael Brown",
    petName: "Oliver",
    petType: "Cat",
    breed: "Siamese",
    date: "May 22, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Manhattan, NY",
    distance: "2.5 miles away",
    rate: 30,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "3",
    petOwner: "Emily Davis",
    petName: "Charlie",
    petType: "Bird",
    breed: "Cockatiel",
    date: "May 25, 2025",
    time: "10:00 AM - 11:00 AM",
    location: "Queens, NY",
    distance: "3.8 miles away",
    rate: 25,
    image:
      "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function JobsScreen() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterJobs = () => {
    if (activeFilter === "all") return JOBS;
    if (activeFilter === "nearby") return JOBS.filter(job => parseFloat(job.distance) < 2);
    if (activeFilter === "today") return JOBS.filter(job => job.date === "May 20, 2025");
    return JOBS;
  };

  const filteredJobs = filterJobs();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Jobs</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === "all" && styles.activeFilterTab]}
          onPress={() => setActiveFilter("all")}
        >
          <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeFilter === "nearby" && styles.activeFilterTab]}
          onPress={() => setActiveFilter("nearby")}
        >
          <Text style={[styles.filterText, activeFilter === "nearby" && styles.activeFilterText]}>
            Nearby
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeFilter === "today" && styles.activeFilterTab]}
          onPress={() => setActiveFilter("today")}
        >
          <Text style={[styles.filterText, activeFilter === "today" && styles.activeFilterText]}>
            Today
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs available with current filters</Text>
          </View>
        ) : (
          filteredJobs.map(job => (
            <Pressable key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Image source={{ uri: job.image }} style={styles.petImage} />
                <View style={styles.jobInfo}>
                  <Text style={styles.petName}>{job.petName}</Text>
                  <Text style={styles.petDetails}>
                    {job.breed} • {job.petType}
                  </Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.locationText}>{job.distance}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.location}</Text>
                </View>

                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>${job.rate}/hour</Text>
                </View>
              </View>

              <View style={styles.jobActions}>
                <Pressable style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </Pressable>

                <Pressable style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </Pressable>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  filterButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: "#F3E8FF",
  },
  filterText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  content: {
    padding: 24,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
    justifyContent: "center",
  },
  petName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  jobDetails: {
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
  jobActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  detailsButton: {
    flex: 1,
    backgroundColor: "#F3E8FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  detailsButtonText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
