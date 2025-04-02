import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';

const PatientMonitoring = ({ route, navigation }) => {
  const { patientId } = route.params || { patientId: '1' }; // Default to first patient if no ID passed
  
  // Sample patient data - in a real app, this would be fetched based on patientId
  const [patient, setPatient] = useState({
    id: '1',
    name: 'John Doe',
    age: 78,
    dateOfBirth: 'May 12, 1945',
    relationship: 'Father',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    address: '123 Maple Street, Springfield, IL',
    emergencyContact: 'Mary Doe (Wife) - (555) 123-4567',
    medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'Arthritis'],
    primaryPhysician: 'Dr. Sarah Connor',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '9:00 AM', purpose: 'Blood pressure' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '9:00 AM, 6:00 PM', purpose: 'Diabetes' },
      { name: 'Acetaminophen', dosage: '500mg', frequency: 'As needed', time: 'For pain', purpose: 'Arthritis pain' }
    ],
    upcomingAppointments: [
      { id: '1', doctor: 'Dr. Sarah Connor', specialty: 'Primary Care', date: 'June 15, 2025', time: '10:30 AM', location: 'Springfield Medical Center' },
      { id: '2', doctor: 'Dr. Mark Wilson', specialty: 'Endocrinology', date: 'June 22, 2025', time: '2:15 PM', location: 'Metro Diabetes Clinic' }
    ],
    recentVitals: {
      heartRate: '78 bpm',
      bloodPressure: '138/85',
      temperature: '98.6°F',
      oxygenSaturation: '96%',
      glucoseLevel: '110 mg/dL',
      weight: '175 lbs'
    },
    activityLevel: 'Low',
    sleepQuality: 'Fair',
    painLevel: '3/10',
    medicationAdherence: '85%',
    recentEvents: [
      { type: 'medication', description: 'Missed Lisinopril dose', date: 'Today', time: '9:00 AM', status: 'attention' },
      { type: 'activity', description: 'Daily walk completed', date: 'Yesterday', time: '4:30 PM', status: 'good' },
      { type: 'vital', description: 'Blood pressure elevated', date: 'Yesterday', time: '8:00 PM', status: 'caution' },
      { type: 'appointment', description: 'Telehealth with Dr. Connor', date: '3 days ago', time: '11:00 AM', status: 'completed' }
    ]
  });
  
  // Chart data for blood pressure over time
  const [bpData, setBpData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [135, 142, 138, 130, 135, 140, 138],
        color: (opacity = 1) => `rgba(77, 124, 254, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [85, 88, 85, 80, 82, 87, 85],
        color: (opacity = 1) => `rgba(106, 213, 250, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Systolic', 'Diastolic']
  });
  
  // Chart data for blood glucose over time
  const [glucoseData, setGlucoseData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [120, 115, 125, 110, 118, 122, 110],
        color: (opacity = 1) => `rgba(168, 123, 250, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['mg/dL']
  });
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('overview'); // overview, vitals, events, care

  // Call patient
  const callPatient = () => {
    Alert.alert('Contact Patient', 'Would you like to call John Doe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling patient...') }
    ]);
  };

  // Message patient
  const messagePatient = () => {
    Alert.alert('Message Patient', 'Would you like to send a message to John Doe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Message', onPress: () => console.log('Messaging patient...') }
    ]);
  };

  // Alert healthcare provider
  const alertHealthcareProvider = () => {
    Alert.alert(
      'Alert Healthcare Provider',
      'This will send an alert to Dr. Sarah Connor about John\'s condition. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Alert Provider', onPress: () => console.log('Alerting healthcare provider...') }
      ]
    );
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.patientHeader}>
      <View style={styles.headerProfile}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Image source={{ uri: patient.image }} style={styles.patientImage} />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientDetails}>{patient.age} years • {patient.relationship}</Text>
        </View>
      </View>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={callPatient}>
          <FontAwesome5 name="phone-alt" size={16} color={Colors.caretakerTheme} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={messagePatient}>
          <FontAwesome5 name="comment" size={16} color={Colors.caretakerTheme} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.alertButton} onPress={alertHealthcareProvider}>
          <FontAwesome5 name="exclamation-triangle" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text
          style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}
        >
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'vitals' && styles.activeTab]}
        onPress={() => setActiveTab('vitals')}
      >
        <Text
          style={[styles.tabText, activeTab === 'vitals' && styles.activeTabText]}
        >
          Vitals
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'events' && styles.activeTab]}
        onPress={() => setActiveTab('events')}
      >
        <Text
          style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}
        >
          Events
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'care' && styles.activeTab]}
        onPress={() => setActiveTab('care')}
      >
        <Text
          style={[styles.tabText, activeTab === 'care' && styles.activeTabText]}
        >
          Care Plan
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render vital sign card
  const renderVitalCard = (title, value, icon, normalRange, isNormal = true) => (
    <Card style={styles.vitalCard}>
      <View style={styles.vitalCardHeader}>
        {icon}
        <Text style={styles.vitalTitle}>{title}</Text>
      </View>
      <Text style={[styles.vitalValue, !isNormal && styles.abnormalValue]}>{value}</Text>
      <Text style={styles.vitalRange}>Normal: {normalRange}</Text>
    </Card>
  );

  // Render recent event
  const renderEvent = (event, index) => {
    let eventIcon;
    let statusColor;
    
    // Set icon based on event type
    switch(event.type) {
      case 'medication':
        eventIcon = <FontAwesome5 name="pills" size={16} color={Colors.caretakerTheme} />;
        break;
      case 'activity':
        eventIcon = <MaterialCommunityIcons name="walk" size={16} color={Colors.caretakerTheme} />;
        break;
      case 'vital':
        eventIcon = <FontAwesome5 name="heartbeat" size={16} color={Colors.caretakerTheme} />;
        break;
      case 'appointment':
        eventIcon = <FontAwesome5 name="calendar-check" size={16} color={Colors.caretakerTheme} />;
        break;
      default:
        eventIcon = <MaterialCommunityIcons name="information" size={16} color={Colors.caretakerTheme} />;
    }
    
    // Set status color
    switch(event.status) {
      case 'attention':
        statusColor = Colors.danger;
        break;
      case 'caution':
        statusColor = Colors.warning;
        break;
      case 'good':
        statusColor = Colors.success;
        break;
      case 'completed':
        statusColor = Colors.gray500;
        break;
      default:
        statusColor = Colors.gray500;
    }
    
    return (
      <View key={index} style={styles.eventItem}>
        <View style={[styles.eventIcon, { backgroundColor: statusColor + '20' }]}>
          {eventIcon}
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventMeta}>
            <Text style={styles.eventTime}>{event.date}, {event.time}</Text>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          </View>
        </View>
      </View>
    );
  };

  // Render medication item
  const renderMedication = (medication, index) => (
    <Card key={index} style={styles.medicationCard}>
      <View style={styles.medicationHeader}>
        <Text style={styles.medicationName}>{medication.name}</Text>
        <View style={styles.dosageContainer}>
          <Text style={styles.dosageText}>{medication.dosage}</Text>
        </View>
      </View>
      <View style={styles.medicationDetails}>
        <View style={styles.medicationInfo}>
          <MaterialCommunityIcons name="pill" size={14} color={Colors.textSecondary} />
          <Text style={styles.medicationInfoText}>{medication.frequency}</Text>
        </View>
        <View style={styles.medicationInfo}>
          <MaterialCommunityIcons name="clock-time-four-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.medicationInfoText}>{medication.time}</Text>
        </View>
        <View style={styles.medicationInfo}>
          <MaterialCommunityIcons name="information-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.medicationInfoText}>For: {medication.purpose}</Text>
        </View>
      </View>
      <View style={styles.medicationActions}>
        <TouchableOpacity style={styles.medicationAction}>
          <Text style={styles.medicationActionText}>Mark as Taken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.medicationAction}>
          <Text style={styles.medicationActionText}>Set Reminder</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  // Render charts
  const renderChart = (data, title, height = 220) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={height}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );

  // Render overview tab content
  const renderOverviewContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.vitalsOverview}>
        <Text style={styles.sectionTitle}>Current Vitals</Text>
        <View style={styles.vitalsGrid}>
          {renderVitalCard(
            'Blood Pressure',
            patient.recentVitals.bloodPressure,
            <FontAwesome5 name="heart" size={16} color={Colors.caretakerTheme} />,
            '120/80 mmHg',
            false
          )}
          {renderVitalCard(
            'Heart Rate',
            patient.recentVitals.heartRate,
            <FontAwesome5 name="heartbeat" size={16} color={Colors.caretakerTheme} />,
            '60-100 bpm',
            true
          )}
          {renderVitalCard(
            'Glucose',
            patient.recentVitals.glucoseLevel,
            <MaterialCommunityIcons name="water-percent" size={16} color={Colors.caretakerTheme} />,
            '70-99 mg/dL',
            false
          )}
          {renderVitalCard(
            'Oxygen',
            patient.recentVitals.oxygenSaturation,
            <MaterialCommunityIcons name="lungs" size={16} color={Colors.caretakerTheme} />,
            '95-100%',
            true
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Events</Text>
        <Card style={styles.sectionCard}>
          {patient.recentEvents.slice(0, 3).map((event, index) => renderEvent(event, index))}
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => setActiveTab('events')}
          >
            <Text style={styles.viewMoreText}>View All Events</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.caretakerTheme} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Medications</Text>
        {patient.medications.map((medication, index) => renderMedication(medication, index))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <Card style={styles.sectionCard}>
          {patient.upcomingAppointments.map((appointment, index) => (
            <View key={index} style={[styles.appointmentItem, index < patient.upcomingAppointments.length - 1 && styles.borderBottom]}>
              <View style={styles.appointmentIcon}>
                <FontAwesome5 name="calendar-alt" size={16} color={Colors.caretakerTheme} />
              </View>
              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentTitle}>{appointment.doctor}</Text>
                <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                <View style={styles.appointmentMeta}>
                  <Text style={styles.appointmentDate}>{appointment.date}, {appointment.time}</Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </View>
  );

  // Render vitals tab content
  const renderVitalsContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Pressure Trends</Text>
        <Card style={styles.chartCard}>
          {renderChart(bpData, 'Weekly Blood Pressure (mmHg)')}
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Glucose Trends</Text>
        <Card style={styles.chartCard}>
          {renderChart(glucoseData, 'Weekly Blood Glucose (mg/dL)')}
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Metrics</Text>
        <View style={styles.metricsContainer}>
          <Card style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <MaterialCommunityIcons name="walk" size={24} color={Colors.caretakerTheme} />
            </View>
            <Text style={styles.metricLabel}>Activity Level</Text>
            <Text style={styles.metricValue}>{patient.activityLevel}</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <MaterialCommunityIcons name="sleep" size={24} color={Colors.caretakerTheme} />
            </View>
            <Text style={styles.metricLabel}>Sleep</Text>
            <Text style={styles.metricValue}>{patient.sleepQuality}</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <MaterialCommunityIcons name="temperature-celsius" size={24} color={Colors.caretakerTheme} />
            </View>
            <Text style={styles.metricLabel}>Temperature</Text>
            <Text style={styles.metricValue}>{patient.recentVitals.temperature}</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <MaterialCommunityIcons name="weight" size={24} color={Colors.caretakerTheme} />
            </View>
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{patient.recentVitals.weight}</Text>
          </Card>
        </View>
      </View>
      
      <TouchableOpacity style={styles.recordButton}>
        <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.recordButtonText}>Record New Vitals</Text>
      </TouchableOpacity>
    </View>
  );

  // Render events tab content
  const renderEventsContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.eventFilters}>
        <TouchableOpacity style={[styles.eventFilterButton, styles.activeFilterButton]}>
          <Text style={styles.activeFilterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventFilterButton}>
          <Text style={styles.filterText}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventFilterButton}>
          <Text style={styles.filterText}>Vitals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventFilterButton}>
          <Text style={styles.filterText}>Activity</Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.eventsCard}>
        {patient.recentEvents.map((event, index) => renderEvent(event, index))}
      </Card>
      
      <TouchableOpacity style={styles.recordButton}>
        <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.recordButtonText}>Record New Event</Text>
      </TouchableOpacity>
    </View>
  );

  // Render care plan tab content
  const renderCareContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Profile</Text>
        <Card style={styles.profileCard}>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Full Name</Text>
            <Text style={styles.profileValue}>{patient.name}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Date of Birth</Text>
            <Text style={styles.profileValue}>{patient.dateOfBirth} ({patient.age} years)</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Primary Physician</Text>
            <Text style={styles.profileValue}>{patient.primaryPhysician}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Address</Text>
            <Text style={styles.profileValue}>{patient.address}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Emergency Contact</Text>
            <Text style={styles.profileValue}>{patient.emergencyContact}</Text>
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Conditions</Text>
        <Card style={styles.conditionsCard}>
          {patient.medicalConditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <MaterialCommunityIcons name="medical-bag" size={16} color={Colors.caretakerTheme} />
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addConditionButton}>
            <Text style={styles.addButtonText}>Add Condition</Text>
            <MaterialCommunityIcons name="plus" size={16} color={Colors.caretakerTheme} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Care Notes</Text>
        <Card style={styles.notesCard}>
          <Text style={styles.noteText}>
            Patient needs assistance with medication management. Reminder to check blood glucose levels before breakfast and dinner. Encourage daily walking for 15 minutes when possible.
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={16} color={Colors.caretakerTheme} />
            <Text style={styles.editButtonText}>Edit Notes</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );

  // Render the main content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'vitals':
        return renderVitalsContent();
      case 'events':
        return renderEventsContent();
      case 'care':
        return renderCareContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  patientHeader: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    ...Colors.Shadows.small,
  },
  alertButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    ...Colors.Shadows.small,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: 5,
    marginBottom: 15,
    ...Colors.Shadows.small,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.caretakerTheme,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.caretakerTheme,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  vitalsOverview: {
    marginBottom: 20,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  vitalCard: {
    width: '48%',
    padding: 15,
    marginBottom: 10,
  },
  vitalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalTitle: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  vitalValue: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  abnormalValue: {
    color: Colors.danger,
  },
  vitalRange: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textTertiary,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textTertiary,
    marginRight: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.caretakerTheme,
    marginRight: 5,
  },
  medicationCard: {
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 10,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  dosageContainer: {
    backgroundColor: Colors.caretakerTheme + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dosageText: {
    fontSize: 12,
    fontFamily: 'roboto-medium',
    color: Colors.caretakerTheme,
  },
  medicationDetails: {
    marginBottom: 10,
  },
  medicationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medicationInfoText: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  medicationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  medicationAction: {
    paddingVertical: 5,
  },
  medicationActionText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.caretakerTheme,
  },
  appointmentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  appointmentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.caretakerTheme + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  appointmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentDate: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textTertiary,
  },
  appointmentLocation: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textTertiary,
  },
  chartCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  metricCard: {
    width: '48%',
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.caretakerTheme + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.caretakerTheme,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    ...Colors.Shadows.default,
  },
  recordButtonText: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.white,
    marginLeft: 10,
  },
  eventFilters: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  eventFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.gray200,
  },
  activeFilterButton: {
    backgroundColor: Colors.caretakerTheme,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.white,
  },
  eventsCard: {
    marginHorizontal: 20,
    padding: 15,
    marginBottom: 20,
  },
  profileCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  profileItem: {
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    fontFamily: 'roboto-regular',
    color: Colors.textPrimary,
  },
  conditionsCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  conditionText: {
    fontSize: 16,
    fontFamily: 'roboto-regular',
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  addConditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 5,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.caretakerTheme,
    marginRight: 5,
  },
  notesCard: {
    marginHorizontal: 20,
    padding: 15,
  },
  noteText: {
    fontSize: 15,
    fontFamily: 'roboto-regular',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.caretakerTheme,
    marginLeft: 5,
  },
});

export default PatientMonitoring;