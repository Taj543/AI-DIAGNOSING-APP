import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Import components and utilities
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { logout } from '../../store/reducers/authReducer';
import { fetchHealthRecords } from '../../store/reducers/healthReducer';
import { fetchMedications } from '../../store/reducers/medicationReducer';

const PatientDashboard = ({ navigation }) => {
  // Component state
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { healthRecords } = useSelector((state) => state.health);
  const { medications } = useSelector((state) => state.medication);

  // Set greeting based on time of day
  useEffect(() => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Fetch all necessary dashboard data
  const fetchDashboardData = async () => {
    try {
      // For a real app, we would use the user's ID to fetch their specific data
      await Promise.all([
        dispatch(fetchHealthRecords()),
        dispatch(fetchMedications())
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Sample appointment data (in a real app, this would come from an API)
  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Jane Smith',
      specialty: 'Cardiology',
      date: '2024-04-15',
      time: '10:00 AM',
      location: 'Medical Center, Room 305',
      isPast: false,
    },
    {
      id: '2',
      doctorName: 'Dr. Robert Johnson',
      specialty: 'General Practice',
      date: '2024-04-22',
      time: '2:30 PM',
      location: 'Community Clinic',
      isPast: false,
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Chen',
      specialty: 'Dermatology',
      date: '2024-05-05',
      time: '11:15 AM',
      location: 'Medical Center, Room 210',
      isPast: false,
    },
  ];

  // Filter appointments to show only the next 2 unless "View All" is clicked
  const displayedAppointments = showAllAppointments
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 2);

  // Render appointment item
  const renderAppointmentItem = (appointment) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentItem}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentIconContainer}>
        <Ionicons
          name="calendar"
          size={24}
          color={COLORS.white}
        />
      </View>
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentDoctor}>{appointment.doctorName}</Text>
        <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
        <View style={styles.appointmentTimeContainer}>
          <Ionicons name="time-outline" size={14} color={COLORS.gray} />
          <Text style={styles.appointmentTimeText}>
            {appointment.date} at {appointment.time}
          </Text>
        </View>
        <View style={styles.appointmentLocationContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.gray} />
          <Text style={styles.appointmentLocationText}>
            {appointment.location}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={COLORS.gray}
        style={styles.appointmentChevron}
      />
    </TouchableOpacity>
  );

  // Render quick stats
  const QuickStatCard = ({ icon, label, value, color, onPress }) => (
    <TouchableOpacity
      style={[styles.quickStatCard, { borderLeftColor: color }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.quickStatIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.quickStatContent}>
        <Text style={styles.quickStatValue}>{value}</Text>
        <Text style={styles.quickStatLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Dashboard Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {/* Navigate to profile screen */}}
        >
          {user?.profilePic ? (
            <Image
              source={{ uri: user.profilePic }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <QuickStatCard
            icon={<Ionicons name="fitness" size={20} color={COLORS.white} />}
            label="Health Score"
            value="85%"
            color={COLORS.secondary}
            onPress={() => navigation.navigate('HealthRecords')}
          />
          
          <QuickStatCard
            icon={<Ionicons name="medkit" size={20} color={COLORS.white} />}
            label="Medications"
            value={medications.length}
            color={COLORS.primary}
            onPress={() => navigation.navigate('MedicationManager')}
          />
          
          <QuickStatCard
            icon={<MaterialIcons name="report" size={20} color={COLORS.white} />}
            label="Reports"
            value={healthRecords.length}
            color={COLORS.accent1}
            onPress={() => navigation.navigate('HealthRecords')}
          />
        </View>
        
        {/* AI Health Insights Card */}
        <Card
          title="AI Health Insights"
          leftIcon={<FontAwesome5 name="robot" size={20} color={COLORS.accent2} />}
          style={styles.insightsCard}
        >
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: COLORS.secondary }]}>
              <Ionicons name="trending-up" size={18} color={COLORS.white} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Improved Sleep Pattern</Text>
              <Text style={styles.insightText}>
                Your sleep quality has improved by 15% over the last month.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightItem}>
            <View style={[styles.insightIcon, { backgroundColor: COLORS.accent1 }]}>
              <Ionicons name="nutrition" size={18} color={COLORS.white} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Nutrition Recommendation</Text>
              <Text style={styles.insightText}>
                Consider increasing your vitamin D intake for better immune health.
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.viewAllInsights}
            onPress={() => navigation.navigate('AIChat')}
          >
            <Text style={styles.viewAllInsightsText}>Get Personalized Health Advice</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>
        
        {/* Upcoming Appointments */}
        <Card
          title="Upcoming Appointments"
          leftIcon={<Ionicons name="calendar" size={20} color={COLORS.primary} />}
          rightIcon={
            <TouchableOpacity onPress={() => {/* Navigate to appointments screen */}}>
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>
          }
          style={styles.appointmentsCard}
        >
          {displayedAppointments.length > 0 ? (
            <>
              {displayedAppointments.map(renderAppointmentItem)}
              
              {upcomingAppointments.length > 2 && (
                <TouchableOpacity
                  style={styles.viewAllContainer}
                  onPress={() => setShowAllAppointments(!showAllAppointments)}
                >
                  <Text style={styles.viewAllText}>
                    {showAllAppointments ? 'Show Less' : 'View All Appointments'}
                  </Text>
                  <Ionicons
                    name={showAllAppointments ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming appointments</Text>
              <Button
                title="Schedule Appointment"
                type="outline"
                size="small"
                style={styles.scheduleButton}
              />
            </View>
          )}
        </Card>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('SymptomChecker')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent2 }]}>
                <FontAwesome5 name="stethoscope" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Check Symptoms</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('MedicationManager')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
                <MaterialIcons name="medication" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Manage Medications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('HealthRecords')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
                <MaterialIcons name="history" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>View Health Records</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('AIChat')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent1 }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Ask AI Assistant</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout button at bottom (for development purposes) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 0.5,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h3,
    color: COLORS.textDark,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h4,
    color: COLORS.white,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.md,
  },
  quickStatCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderLeftWidth: 3,
    padding: SIZES.sm,
    ...SHADOWS.small,
  },
  quickStatIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  quickStatContent: {
    marginTop: SIZES.xs,
  },
  quickStatValue: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h4,
    color: COLORS.textDark,
  },
  quickStatLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginTop: 2,
  },
  insightsCard: {
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body1,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  insightText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  viewAllInsights: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.sm,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewAllInsightsText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.primary,
    marginRight: SIZES.xs,
  },
  appointmentsCard: {
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.md,
  },
  addText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
    color: COLORS.primary,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appointmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentDoctor: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body1,
    color: COLORS.textDark,
  },
  appointmentSpecialty: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.primary,
    marginBottom: 4,
  },
  appointmentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  appointmentTimeText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  appointmentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentLocationText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  appointmentChevron: {
    marginLeft: SIZES.xs,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
  },
  viewAllText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
    color: COLORS.primary,
    marginRight: SIZES.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SIZES.sm,
  },
  scheduleButton: {
    minWidth: 180,
  },
  quickActionsContainer: {
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.lg,
  },
  quickActionsTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body1,
    color: COLORS.textDark,
    marginBottom: SIZES.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    alignItems: 'center',
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  quickActionText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.lg,
    marginHorizontal: SIZES.padding,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: SIZES.radius,
  },
  logoutText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.error,
    marginLeft: SIZES.xs,
  },
});

export default PatientDashboard;