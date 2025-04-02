import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList,
  RefreshControl
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';

const DoctorDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: '1', patientName: 'John Doe', time: '09:00 AM', reason: 'Follow-up', status: 'confirmed' },
    { id: '2', patientName: 'Jane Smith', time: '10:30 AM', reason: 'Consultation', status: 'confirmed' },
    { id: '3', patientName: 'Robert Johnson', time: '01:15 PM', reason: 'Test Results', status: 'pending' }
  ]);
  
  const [patientAlerts, setPatientAlerts] = useState([
    { id: '1', patientName: 'Emily Wilson', condition: 'Abnormal Heart Rate', severity: 'critical', time: '15 min ago' },
    { id: '2', patientName: 'Michael Brown', condition: 'Elevated Blood Pressure', severity: 'warning', time: '1 hr ago' }
  ]);

  // Simulated refresh function
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Appointment card
  const renderAppointmentItem = ({ item }) => {
    let statusColor;
    switch(item.status) {
      case 'confirmed':
        statusColor = Colors.success;
        break;
      case 'pending':
        statusColor = Colors.warning;
        break;
      default:
        statusColor = Colors.gray500;
    }

    return (
      <Card style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.appointmentDetails}>
          <View style={styles.appointmentInfo}>
            <FontAwesome5 name="clock" size={14} color={Colors.textSecondary} />
            <Text style={styles.appointmentText}>{item.time}</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <FontAwesome5 name="notes-medical" size={14} color={Colors.textSecondary} />
            <Text style={styles.appointmentText}>{item.reason}</Text>
          </View>
        </View>
        <View style={styles.appointmentActions}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="video" size={14} color={Colors.doctorTheme} />
            <Text style={[styles.actionText, { color: Colors.doctorTheme }]}>Start Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="text-box-edit" size={14} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  // Alert card
  const renderAlertItem = ({ item }) => {
    let severityColor;
    switch(item.severity) {
      case 'critical':
        severityColor = Colors.critical;
        break;
      case 'severe':
        severityColor = Colors.severe;
        break;
      case 'warning':
        severityColor = Colors.warning;
        break;
      default:
        severityColor = Colors.gray500;
    }

    return (
      <Card style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.conditionText}>{item.condition}</Text>
        <View style={styles.alertFooter}>
          <Text style={styles.timeText}>{item.time}</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.doctorTheme]}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.doctorName}>Dr. Sarah Connor</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.patientTheme + '20' }]}>
            <FontAwesome5 name="user-injured" size={20} color={Colors.patientTheme} />
          </View>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Patients</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.doctorTheme + '20' }]}>
            <FontAwesome5 name="calendar-check" size={20} color={Colors.doctorTheme} />
          </View>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Today's Appointments</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: Colors.warning + '20' }]}>
            <Ionicons name="alert-circle" size={20} color={Colors.warning} />
          </View>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Pending Reports</Text>
        </Card>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={upcomingAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.appointmentsList}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Patient Alerts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={patientAlerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.alertsList}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
        </View>
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <MaterialCommunityIcons name="brain" size={24} color={Colors.doctorTheme} />
            <Text style={styles.insightTitle}>Latest Research Analysis</Text>
          </View>
          <Text style={styles.insightText}>
            Based on recent medical journals, there's new evidence supporting the efficacy of combined therapy for patients with your specialty conditions. 3 of your patients might benefit from this approach.
          </Text>
          <TouchableOpacity style={styles.insightButton}>
            <Text style={styles.insightButtonText}>View Detailed Analysis</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  doctorName: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.doctorTheme,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '30%',
    padding: 15,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'roboto-regular',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.doctorTheme,
    fontFamily: 'roboto-regular',
  },
  appointmentsList: {
    paddingHorizontal: 10,
  },
  appointmentCard: {
    width: 280,
    padding: 15,
    marginHorizontal: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: 'roboto-bold',
  },
  appointmentDetails: {
    marginBottom: 10,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  appointmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  alertsList: {
    paddingHorizontal: 20,
  },
  alertCard: {
    marginBottom: 10,
    padding: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: 'roboto-bold',
  },
  conditionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: 'roboto-medium',
    marginBottom: 10,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: 'roboto-regular',
  },
  viewButton: {
    padding: 5,
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.doctorTheme,
    fontFamily: 'roboto-medium',
  },
  insightCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  insightText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    lineHeight: 20,
    marginBottom: 15,
  },
  insightButton: {
    alignSelf: 'flex-end',
  },
  insightButtonText: {
    fontSize: 14,
    color: Colors.doctorTheme,
    fontFamily: 'roboto-medium',
  },
  footer: {
    height: 20,
  },
});

export default DoctorDashboard;