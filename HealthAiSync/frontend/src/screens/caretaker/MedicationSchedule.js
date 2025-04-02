import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SectionList,
  Switch,
  Alert
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';

const MedicationSchedule = ({ route, navigation }) => {
  const { patientId } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllPatients, setShowAllPatients] = useState(!patientId);
  
  // Generate dates for the week
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  // Sample patient data - in a real app, this would be fetched from API
  const [patients, setPatients] = useState([
    {
      id: '1',
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      id: '2',
      name: 'Martha Smith',
      image: 'https://randomuser.me/api/portraits/women/74.jpg',
    },
    {
      id: '3',
      name: 'Robert Wilson',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
    }
  ]);
  
  // Sample medication schedule data
  const [medicationSchedule, setMedicationSchedule] = useState([
    {
      title: 'Morning (6:00 AM - 12:00 PM)',
      data: [
        {
          id: '1',
          patientId: '1',
          patientName: 'John Doe',
          patientImage: 'https://randomuser.me/api/portraits/men/75.jpg',
          medicationName: 'Lisinopril',
          dosage: '10mg',
          time: '9:00 AM',
          instructions: 'Take with food',
          status: 'upcoming', // upcoming, completed, missed
          isEmergency: false
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Martha Smith',
          patientImage: 'https://randomuser.me/api/portraits/women/74.jpg',
          medicationName: 'Metformin',
          dosage: '500mg',
          time: '10:00 AM',
          instructions: 'Take with food',
          status: 'upcoming',
          isEmergency: false
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Robert Wilson',
          patientImage: 'https://randomuser.me/api/portraits/men/65.jpg',
          medicationName: 'Synthroid',
          dosage: '75mcg',
          time: '7:00 AM',
          instructions: 'Take on empty stomach',
          status: 'completed',
          isEmergency: false
        }
      ]
    },
    {
      title: 'Afternoon (12:00 PM - 6:00 PM)',
      data: [
        {
          id: '4',
          patientId: '1',
          patientName: 'John Doe',
          patientImage: 'https://randomuser.me/api/portraits/men/75.jpg',
          medicationName: 'Hydrochlorothiazide',
          dosage: '25mg',
          time: '2:00 PM',
          instructions: 'Take with food',
          status: 'upcoming',
          isEmergency: false
        },
        {
          id: '5',
          patientId: '2',
          patientName: 'Martha Smith',
          patientImage: 'https://randomuser.me/api/portraits/women/74.jpg',
          medicationName: 'Insulin',
          dosage: '10 units',
          time: '12:30 PM',
          instructions: 'Inject before lunch',
          status: 'upcoming',
          isEmergency: true
        }
      ]
    },
    {
      title: 'Evening (6:00 PM - 12:00 AM)',
      data: [
        {
          id: '6',
          patientId: '1',
          patientName: 'John Doe',
          patientImage: 'https://randomuser.me/api/portraits/men/75.jpg',
          medicationName: 'Atorvastatin',
          dosage: '20mg',
          time: '8:00 PM',
          instructions: 'Take at night',
          status: 'upcoming',
          isEmergency: false
        },
        {
          id: '7',
          patientId: '2',
          patientName: 'Martha Smith',
          patientImage: 'https://randomuser.me/api/portraits/women/74.jpg',
          medicationName: 'Metformin',
          dosage: '500mg',
          time: '6:00 PM',
          instructions: 'Take with dinner',
          status: 'upcoming',
          isEmergency: false
        },
        {
          id: '8',
          patientId: '3',
          patientName: 'Robert Wilson',
          patientImage: 'https://randomuser.me/api/portraits/men/65.jpg',
          medicationName: 'Warfarin',
          dosage: '2mg',
          time: '7:00 PM',
          instructions: 'Take consistently at same time',
          status: 'upcoming',
          isEmergency: true
        }
      ]
    }
  ]);

  // Format day of the week
  const formatDayOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Format day of the month
  const formatDayOfMonth = (date) => {
    return date.getDate();
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Filter medications based on selected patient
  const filteredSchedule = patientId
    ? medicationSchedule.map(section => ({
        ...section,
        data: section.data.filter(med => med.patientId === patientId)
      })).filter(section => section.data.length > 0)
    : medicationSchedule;

  // Mark medication as completed
  const markMedication = (id, status) => {
    // Deep copy of the medication schedule
    const updatedSchedule = medicationSchedule.map(section => ({
      ...section,
      data: section.data.map(med => 
        med.id === id ? { ...med, status } : med
      )
    }));
    
    setMedicationSchedule(updatedSchedule);
    
    // Show confirmation
    if (status === 'completed') {
      Alert.alert('Success', 'Medication marked as taken');
    } else if (status === 'missed') {
      Alert.alert('Noted', 'Medication marked as missed');
    }
  };

  // Show medication details
  const showMedicationDetails = (medication) => {
    Alert.alert(
      `${medication.medicationName} ${medication.dosage}`,
      `Instructions: ${medication.instructions}\nPatient: ${medication.patientName}\nTime: ${medication.time}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Mark as Taken',
          onPress: () => markMedication(medication.id, 'completed'),
          style: 'default'
        }
      ]
    );
  };

  // Section header component
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  // Render a medication item
  const renderMedicationItem = ({ item }) => {
    let statusColor, statusIcon;
    
    switch(item.status) {
      case 'completed':
        statusColor = Colors.success;
        statusIcon = <Ionicons name="checkmark-circle" size={24} color={statusColor} />;
        break;
      case 'missed':
        statusColor = Colors.danger;
        statusIcon = <Ionicons name="close-circle" size={24} color={statusColor} />;
        break;
      default:
        statusColor = Colors.gray400;
        statusIcon = <MaterialCommunityIcons name="clock-outline" size={24} color={statusColor} />;
    }
    
    return (
      <TouchableOpacity 
        onPress={() => showMedicationDetails(item)}
        style={[
          styles.medicationItem,
          item.status === 'completed' && styles.completedItem,
          item.status === 'missed' && styles.missedItem
        ]}
      >
        <View style={styles.medicationHeader}>
          {!patientId && (
            <Image source={{ uri: item.patientImage }} style={styles.patientImage} />
          )}
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>
              {item.medicationName} {item.dosage}
              {item.isEmergency && (
                <Text style={styles.emergencyTag}> • Critical</Text>
              )}
            </Text>
            {!patientId && (
              <Text style={styles.patientName}>{item.patientName}</Text>
            )}
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            {statusIcon}
          </View>
        </View>
        
        <View style={styles.medicationFooter}>
          <Text style={styles.instructionsText}>{item.instructions}</Text>
          
          {item.status === 'upcoming' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => markMedication(item.id, 'completed')}
              >
                <Text style={[styles.actionButtonText, { color: Colors.success }]}>Mark Taken</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => markMedication(item.id, 'missed')}
              >
                <Text style={[styles.actionButtonText, { color: Colors.danger }]}>Skip</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Empty component for sections with no data
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="pill" size={40} color={Colors.gray300} />
      <Text style={styles.emptyText}>No medications scheduled</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Medication Schedule</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      {!patientId && (
        <View style={styles.patientsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.patientsScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.patientBubble,
                !patientId && styles.activePatientBubble
              ]}
              onPress={() => navigation.navigate('MedicationSchedule')}
            >
              <Text style={[
                styles.allPatientsText,
                !patientId && styles.activePatientText
              ]}>All</Text>
            </TouchableOpacity>
            
            {patients.map(patient => (
              <TouchableOpacity
                key={patient.id}
                style={[
                  styles.patientBubble,
                  patientId === patient.id && styles.activePatientBubble
                ]}
                onPress={() => navigation.navigate('MedicationSchedule', { patientId: patient.id })}
              >
                <Image 
                  source={{ uri: patient.image }} 
                  style={styles.bubbleImage} 
                />
                <Text 
                  style={[
                    styles.bubbleName,
                    patientId === patient.id && styles.activePatientText
                  ]}
                >
                  {patient.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScrollContent}
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isToday(date) && styles.todayItem,
                selectedDate.getDate() === date.getDate() && styles.selectedDateItem
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text 
                style={[
                  styles.dayOfWeek,
                  isToday(date) && styles.todayText,
                  selectedDate.getDate() === date.getDate() && styles.selectedDateText
                ]}
              >
                {formatDayOfWeek(date)}
              </Text>
              <Text 
                style={[
                  styles.dayOfMonth,
                  isToday(date) && styles.todayText,
                  selectedDate.getDate() === date.getDate() && styles.selectedDateText
                ]}
              >
                {formatDayOfMonth(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.medicationSummary}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryItem, { backgroundColor: Colors.success + '20' }]}>
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>Taken</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: Colors.danger + '20' }]}>
            <Text style={styles.summaryValue}>1</Text>
            <Text style={styles.summaryLabel}>Missed</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: Colors.warning + '20' }]}>
            <Text style={styles.summaryValue}>8</Text>
            <Text style={styles.summaryLabel}>Upcoming</Text>
          </View>
        </View>
      </View>
      
      <SectionList
        sections={filteredSchedule}
        keyExtractor={(item) => item.id}
        renderItem={renderMedicationItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.medicationList}
        ListEmptyComponent={renderEmptyComponent}
      />
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
    paddingBottom: 15,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.caretakerTheme,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.Shadows.small,
  },
  patientsContainer: {
    marginBottom: 15,
  },
  patientsScrollContent: {
    paddingHorizontal: 15,
  },
  patientBubble: {
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    minWidth: 65,
    ...Colors.Shadows.small,
  },
  activePatientBubble: {
    backgroundColor: Colors.caretakerTheme,
  },
  bubbleImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  bubbleName: {
    fontSize: 12,
    fontFamily: 'roboto-medium',
    color: Colors.textPrimary,
  },
  allPatientsText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textPrimary,
    marginVertical: 10,
  },
  activePatientText: {
    color: Colors.white,
  },
  calendarContainer: {
    marginBottom: 15,
  },
  calendarScrollContent: {
    paddingHorizontal: 15,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: Colors.white,
    ...Colors.Shadows.small,
  },
  todayItem: {
    borderWidth: 1,
    borderColor: Colors.caretakerTheme,
  },
  selectedDateItem: {
    backgroundColor: Colors.caretakerTheme,
  },
  dayOfWeek: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  dayOfMonth: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  todayText: {
    color: Colors.caretakerTheme,
  },
  selectedDateText: {
    color: Colors.white,
  },
  medicationSummary: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...Colors.Shadows.small,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  medicationList: {
    paddingBottom: 20,
  },
  medicationItem: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    padding: 15,
    ...Colors.Shadows.small,
  },
  completedItem: {
    opacity: 0.8,
    backgroundColor: Colors.gray100,
  },
  missedItem: {
    opacity: 0.8,
    backgroundColor: Colors.danger + '10',
  },
  medicationHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  emergencyTag: {
    color: Colors.danger,
    fontFamily: 'roboto-medium',
  },
  patientName: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationFooter: {
    marginTop: 5,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginTop: 10,
  },
});

export default MedicationSchedule;