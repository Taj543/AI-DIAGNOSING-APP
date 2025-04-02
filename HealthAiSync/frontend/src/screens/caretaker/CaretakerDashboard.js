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

const CaretakerDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: '1',
      name: 'John Doe',
      age: 78,
      relationship: 'Father',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      nextMedication: '10:30 AM - Lisinopril 10mg',
      alerts: [
        { type: 'medication', message: 'Missed morning medication', time: '10 mins ago', severity: 'high' }
      ],
      status: 'attention',
      vitalSigns: {
        heartRate: '78 bpm',
        bloodPressure: '138/85',
        temperature: '98.6°F',
        glucoseLevel: '110 mg/dL'
      }
    },
    {
      id: '2',
      name: 'Martha Smith',
      age: 72,
      relationship: 'Mother',
      image: 'https://randomuser.me/api/portraits/women/74.jpg',
      nextMedication: '12:00 PM - Metformin 500mg',
      alerts: [],
      status: 'stable',
      vitalSigns: {
        heartRate: '72 bpm',
        bloodPressure: '122/78',
        temperature: '98.2°F',
        glucoseLevel: '128 mg/dL'
      }
    },
    {
      id: '3',
      name: 'Robert Wilson',
      age: 82,
      relationship: 'Grandfather',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      nextMedication: '2:00 PM - Warfarin 2mg',
      alerts: [
        { type: 'activity', message: 'Low activity level today', time: '1 hr ago', severity: 'medium' }
      ],
      status: 'caution',
      vitalSigns: {
        heartRate: '65 bpm',
        bloodPressure: '145/88',
        temperature: '97.9°F',
        oxygenLevel: '94%'
      }
    }
  ]);
  
  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: '1', patientName: 'John Doe', type: 'medication', time: '10:30 AM', description: 'Administer Lisinopril 10mg', isCompleted: false },
    { id: '2', patientName: 'Martha Smith', type: 'medication', time: '12:00 PM', description: 'Administer Metformin 500mg', isCompleted: false },
    { id: '3', patientName: 'Robert Wilson', type: 'medication', time: '2:00 PM', description: 'Administer Warfarin 2mg', isCompleted: false },
    { id: '4', patientName: 'John Doe', type: 'appointment', time: '3:30 PM', description: 'Virtual checkup with Dr. Sarah Connor', isCompleted: false },
    { id: '5', patientName: 'Martha Smith', type: 'exercise', time: '4:00 PM', description: 'Assist with daily walking routine', isCompleted: false }
  ]);

  // Simulated refresh function
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Status badge by patient status
  const getStatusBadge = (status) => {
    let statusColor;
    let statusText;
    
    switch(status) {
      case 'attention':
        statusColor = Colors.danger;
        statusText = 'Needs Attention';
        break;
      case 'caution':
        statusColor = Colors.warning;
        statusText = 'Caution';
        break;
      case 'stable':
        statusColor = Colors.success;
        statusText = 'Stable';
        break;
      default:
        statusColor = Colors.gray500;
        statusText = 'Unknown';
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };

  // Mark task as completed
  const completeTask = (taskId) => {
    setUpcomingTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // Render patient card
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('PatientMonitoring', { patientId: item.id })}
    >
      <Card style={styles.patientCard}>
        <View style={styles.patientHeader}>
          <Image source={{ uri: item.image }} style={styles.patientImage} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientDetails}>{item.age} years • {item.relationship}</Text>
          </View>
          {getStatusBadge(item.status)}
        </View>
        
        <View style={styles.patientBody}>
          {item.alerts.length > 0 && (
            <View style={styles.alertsContainer}>
              {item.alerts.map((alert, index) => (
                <View key={index} style={[styles.alertItem, alert.severity === 'high' ? styles.highAlert : styles.mediumAlert]}>
                  {alert.type === 'medication' ? (
                    <FontAwesome5 name="pills" size={14} color={alert.severity === 'high' ? Colors.white : Colors.textPrimary} />
                  ) : (
                    <MaterialCommunityIcons name="run" size={14} color={alert.severity === 'high' ? Colors.white : Colors.textPrimary} />
                  )}
                  <Text style={[styles.alertText, alert.severity === 'high' ? { color: Colors.white } : {}]}>
                    {alert.message}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.medicationReminder}>
            <MaterialCommunityIcons name="clock-time-four" size={16} color={Colors.caretakerTheme} />
            <Text style={styles.reminderText}>Next: {item.nextMedication}</Text>
          </View>
          
          <View style={styles.vitalsContainer}>
            {item.vitalSigns.heartRate && (
              <View style={styles.vitalItem}>
                <FontAwesome5 name="heartbeat" size={12} color={Colors.textSecondary} />
                <Text style={styles.vitalText}>{item.vitalSigns.heartRate}</Text>
              </View>
            )}
            {item.vitalSigns.bloodPressure && (
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="blood-bag" size={12} color={Colors.textSecondary} />
                <Text style={styles.vitalText}>{item.vitalSigns.bloodPressure}</Text>
              </View>
            )}
            {item.vitalSigns.glucoseLevel && (
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="water-percent" size={12} color={Colors.textSecondary} />
                <Text style={styles.vitalText}>{item.vitalSigns.glucoseLevel}</Text>
              </View>
            )}
            {item.vitalSigns.oxygenLevel && (
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="lungs" size={12} color={Colors.textSecondary} />
                <Text style={styles.vitalText}>{item.vitalSigns.oxygenLevel}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.patientActions}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="phone-alt" size={14} color={Colors.caretakerTheme} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('MedicationSchedule', { patientId: item.id })}
          >
            <FontAwesome5 name="pills" size={14} color={Colors.caretakerTheme} />
            <Text style={styles.actionText}>Medications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="notes-medical" size={14} color={Colors.caretakerTheme} />
            <Text style={styles.actionText}>Health Records</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Render task card
  const renderTaskItem = ({ item }) => {
    // Set icon based on task type
    let taskIcon;
    switch(item.type) {
      case 'medication':
        taskIcon = <FontAwesome5 name="pills" size={16} color={Colors.caretakerTheme} />;
        break;
      case 'appointment':
        taskIcon = <FontAwesome5 name="calendar-check" size={16} color={Colors.caretakerTheme} />;
        break;
      case 'exercise':
        taskIcon = <MaterialCommunityIcons name="walk" size={16} color={Colors.caretakerTheme} />;
        break;
      default:
        taskIcon = <FontAwesome5 name="tasks" size={16} color={Colors.caretakerTheme} />;
    }
    
    return (
      <Card style={[styles.taskCard, item.isCompleted && styles.completedTaskCard]}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => completeTask(item.id)}
        >
          <View style={[styles.checkbox, item.isCompleted && styles.checkedBox]}>
            {item.isCompleted && <FontAwesome5 name="check" size={10} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTypeContainer}>
              {taskIcon}
              <Text style={styles.taskTime}>{item.time}</Text>
            </View>
            <Text 
              style={[styles.taskPatientName, item.isCompleted && styles.completedTaskText]}
            >
              {item.patientName}
            </Text>
          </View>
          
          <Text 
            style={[styles.taskDescription, item.isCompleted && styles.completedTaskText]}
          >
            {item.description}
          </Text>
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
          colors={[Colors.caretakerTheme]}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Jessica Palmer</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/28.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: Colors.caretakerTheme }]}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Today's Tasks</Text>
              <Text style={styles.summaryValue}>5 remaining</Text>
            </View>
            <View style={styles.summaryIconContainer}>
              <FontAwesome5 name="clipboard-list" size={24} color="#FFFFFF" />
            </View>
          </View>
        </Card>
        
        <Card style={[styles.summaryCard, { backgroundColor: Colors.warning }]}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Alerts</Text>
              <Text style={styles.summaryValue}>2 new</Text>
            </View>
            <View style={styles.summaryIconContainer}>
              <FontAwesome5 name="exclamation-circle" size={24} color="#FFFFFF" />
            </View>
          </View>
        </Card>
        
        <Card style={[styles.summaryCard, { backgroundColor: Colors.info }]}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Upcoming</Text>
              <Text style={styles.summaryValue}>2 appointments</Text>
            </View>
            <View style={styles.summaryIconContainer}>
              <FontAwesome5 name="calendar" size={24} color="#FFFFFF" />
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Patients</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.patientsList}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={upcomingTasks.filter(task => !task.isCompleted).slice(0, 3)}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.tasksList}
        />
        
        {upcomingTasks.filter(task => !task.isCompleted).length > 3 && (
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View more tasks</Text>
            <FontAwesome5 name="chevron-right" size={12} color={Colors.caretakerTheme} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
        </View>
        
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <MaterialCommunityIcons name="brain" size={24} color={Colors.caretakerTheme} />
            <Text style={styles.insightTitle}>Patient Patterns</Text>
          </View>
          
          <Text style={styles.insightText}>
            John's blood pressure readings show a pattern of elevation in the evenings. Consider adjusting medication schedule or checking salt intake during dinner.
          </Text>
          
          <TouchableOpacity style={styles.insightButton}>
            <Text style={styles.insightButtonText}>View Recommendations</Text>
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
  userName: {
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
    borderColor: Colors.caretakerTheme,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    width: '30%',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'roboto-regular',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'roboto-bold',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.caretakerTheme,
    fontFamily: 'roboto-regular',
  },
  patientsList: {
    paddingLeft: 10,
    paddingRight: 20,
  },
  patientCard: {
    width: 300,
    margin: 10,
    padding: 15,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
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
  patientBody: {
    marginBottom: 15,
  },
  alertsContainer: {
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  highAlert: {
    backgroundColor: Colors.danger,
  },
  mediumAlert: {
    backgroundColor: Colors.warning + '30',
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'roboto-medium',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  medicationReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'roboto-medium',
  },
  vitalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  vitalText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'roboto-medium',
    marginLeft: 6,
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.caretakerTheme,
    fontFamily: 'roboto-medium',
  },
  tasksList: {
    paddingHorizontal: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
  },
  completedTaskCard: {
    backgroundColor: Colors.gray100,
  },
  checkboxContainer: {
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.caretakerTheme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.caretakerTheme,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.caretakerTheme,
    fontFamily: 'roboto-medium',
  },
  taskPatientName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'roboto-medium',
  },
  taskDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'roboto-regular',
  },
  completedTaskText: {
    color: Colors.gray500,
    textDecorationLine: 'line-through',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.caretakerTheme,
    fontFamily: 'roboto-medium',
    marginRight: 8,
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
    color: Colors.caretakerTheme,
    fontFamily: 'roboto-medium',
  },
  footer: {
    height: 20,
  },
});

export default CaretakerDashboard;