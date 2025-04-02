import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';

const Telemedicine = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data - in a real app, this would come from backend
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: '1',
      patientName: 'John Doe',
      patientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: 'Today',
      time: '11:30 AM',
      duration: '30 min',
      reason: 'Follow-up Consultation',
      status: 'scheduled',
      notes: 'Review medication effectiveness, discuss recent test results'
    },
    {
      id: '2',
      patientName: 'Emily Wilson',
      patientImage: 'https://randomuser.me/api/portraits/women/17.jpg',
      date: 'Today',
      time: '03:15 PM',
      duration: '45 min',
      reason: 'Asthma Management',
      status: 'scheduled',
      notes: 'Patient reported increased episodes, review inhaler technique'
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      patientImage: 'https://randomuser.me/api/portraits/men/67.jpg',
      date: 'Tomorrow',
      time: '09:00 AM',
      duration: '30 min',
      reason: 'Test Results Discussion',
      status: 'confirmed',
      notes: 'Review cardiac stress test results'
    },
    {
      id: '4',
      patientName: 'Jane Smith',
      patientImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: 'Tomorrow',
      time: '02:30 PM',
      duration: '30 min',
      reason: 'Diabetes Check-up',
      status: 'pending',
      notes: 'Review glucose monitoring logs, adjust insulin if needed'
    }
  ]);
  
  const [pastAppointments, setPastAppointments] = useState([
    {
      id: '101',
      patientName: 'Michael Brown',
      patientImage: 'https://randomuser.me/api/portraits/men/55.jpg',
      date: 'Yesterday',
      time: '10:00 AM',
      duration: '30 min',
      reason: 'Medication Review',
      status: 'completed',
      notes: 'Adjusted pain medication, follow-up in 2 weeks'
    },
    {
      id: '102',
      patientName: 'Sarah Johnson',
      patientImage: 'https://randomuser.me/api/portraits/women/60.jpg',
      date: '2 days ago',
      time: '01:45 PM',
      duration: '45 min',
      reason: 'Initial Consultation',
      status: 'completed',
      notes: 'New patient with hypertension, prescribed medication'
    },
    {
      id: '103',
      patientName: 'James Wilson',
      patientImage: 'https://randomuser.me/api/portraits/men/42.jpg',
      date: '1 week ago',
      time: '11:30 AM',
      duration: '30 min',
      reason: 'Post-Surgery Follow-up',
      status: 'completed',
      notes: 'Healing well, physical therapy recommended'
    }
  ]);
  
  // Filter appointments based on search query
  const filteredUpcoming = upcomingAppointments.filter(
    appointment => appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPast = pastAppointments.filter(
    appointment => appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Join a video call
  const joinCall = (appointmentId) => {
    Alert.alert(
      'Join Video Call',
      'Starting secure video call...',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Join',
          onPress: () => {
            // In a real app, this would navigate to video call screen
            // navigation.navigate('VideoCall', { appointmentId });
            Alert.alert('Info', 'Video call functionality would start here');
          }
        }
      ]
    );
  };
  
  // Prepare for consultation
  const prepareConsultation = (appointment) => {
    // Navigate to preparation screen
    Alert.alert('Info', `Preparing for consultation with ${appointment.patientName}`);
    // navigation.navigate('ConsultationPrep', { appointmentId: appointment.id });
  };
  
  // View medical history
  const viewMedicalHistory = (patientName) => {
    Alert.alert('Info', `Viewing ${patientName}'s medical history`);
    // navigation.navigate('PatientHistory', { patientName });
  };
  
  // Reschedule appointment
  const rescheduleAppointment = (appointmentId) => {
    Alert.alert('Info', `Rescheduling appointment ${appointmentId}`);
    // navigation.navigate('RescheduleAppointment', { appointmentId });
  };

  // Render appointment card
  const renderAppointmentItem = ({ item }) => {
    // Determine status color
    let statusColor;
    switch(item.status) {
      case 'scheduled':
        statusColor = Colors.info;
        break;
      case 'confirmed':
        statusColor = Colors.success;
        break;
      case 'pending':
        statusColor = Colors.warning;
        break;
      case 'completed':
        statusColor = Colors.gray500;
        break;
      case 'cancelled':
        statusColor = Colors.danger;
        break;
      default:
        statusColor = Colors.gray500;
    }
    
    // Format time for display
    const isToday = item.date === 'Today';
    const startTime = item.time;
    
    return (
      <Card style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.patientInfo}>
            <Image 
              source={{ uri: item.patientImage }} 
              style={styles.patientImage} 
            />
            <View>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <View style={styles.appointmentTimeContainer}>
                <FontAwesome5 name="calendar-alt" size={12} color={Colors.textSecondary} />
                <Text style={styles.appointmentTime}>{item.date}, {startTime}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Reason:</Text>
            <Text style={styles.detailValue}>{item.reason}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{item.duration}</Text>
          </View>
          
          {item.notes && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.detailValue}>{item.notes}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.appointmentActions}>
          {activeTab === 'upcoming' && (
            <>
              {isToday && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryActionButton]}
                  onPress={() => joinCall(item.id)}
                >
                  <FontAwesome5 name="video" size={14} color="#FFFFFF" />
                  <Text style={styles.primaryActionText}>Start Call</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => prepareConsultation(item)}
              >
                <MaterialCommunityIcons name="clipboard-text" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>Prepare</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => viewMedicalHistory(item.patientName)}
              >
                <FontAwesome5 name="file-medical-alt" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>Records</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => rescheduleAppointment(item.id)}
              >
                <MaterialCommunityIcons name="calendar-edit" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>Reschedule</Text>
              </TouchableOpacity>
            </>
          )}
          
          {activeTab === 'past' && (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => viewMedicalHistory(item.patientName)}
              >
                <FontAwesome5 name="file-medical-alt" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>View Records</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
              >
                <MaterialCommunityIcons name="file-document-edit" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>Edit Notes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
              >
                <MaterialCommunityIcons name="calendar-plus" size={14} color={Colors.doctorTheme} />
                <Text style={styles.actionText}>Schedule Follow-up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Card>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Telemedicine</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome5 name="sliders-h" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.gray600} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments or patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.gray500}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray600} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'upcoming' ? filteredUpcoming : filteredPast}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.appointmentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={60} color={Colors.gray400} />
            <Text style={styles.emptyText}>No appointments found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try adjusting your search' 
                : `You don't have any ${activeTab} appointments`
              }
            </Text>
          </View>
        }
      />
      
      {activeTab === 'upcoming' && (
        <TouchableOpacity style={styles.floatingButton}>
          <FontAwesome5 name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.Shadows.small,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Colors.BorderRadius.default,
    paddingHorizontal: 15,
    paddingVertical: 10,
    ...Colors.Shadows.small,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'roboto-regular',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: Colors.gray200,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: Colors.white,
    ...Colors.Shadows.small,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.doctorTheme,
  },
  appointmentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    marginBottom: 15,
    padding: 15,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  appointmentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  appointmentTime: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    marginLeft: 5,
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
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textPrimary,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    marginRight: 10,
  },
  primaryActionButton: {
    backgroundColor: Colors.doctorTheme,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.doctorTheme,
    fontFamily: 'roboto-medium',
  },
  primaryActionText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'roboto-medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'roboto-medium',
    color: Colors.textPrimary,
    marginVertical: 10,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.doctorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.Shadows.large,
  },
});

export default Telemedicine;