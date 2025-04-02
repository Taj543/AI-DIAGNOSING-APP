import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image,
  RefreshControl
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';

const PatientList = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample patient data - in a real app, this would come from Redux/API
  const [patients, setPatients] = useState([
    { 
      id: '1', 
      name: 'John Doe', 
      age: 45, 
      gender: 'Male',
      condition: 'Hypertension',
      lastVisit: '2 days ago',
      status: 'stable',
      recentActivity: true,
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      recentMetrics: {
        bloodPressure: '128/85',
        heartRate: '72 bpm',
        temperature: '98.6°F'
      }
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      age: 38, 
      gender: 'Female',
      condition: 'Diabetes Type 2',
      lastVisit: '1 week ago',
      status: 'monitoring',
      recentActivity: true,
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      recentMetrics: {
        bloodPressure: '118/75',
        heartRate: '68 bpm',
        temperature: '98.2°F',
        glucoseLevel: '142 mg/dL'
      }
    },
    { 
      id: '3', 
      name: 'Robert Johnson', 
      age: 62, 
      gender: 'Male',
      condition: 'Coronary Artery Disease',
      lastVisit: '3 days ago',
      status: 'critical',
      recentActivity: false,
      profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
      recentMetrics: {
        bloodPressure: '145/95',
        heartRate: '88 bpm',
        temperature: '99.1°F'
      }
    },
    { 
      id: '4', 
      name: 'Emily Wilson', 
      age: 29, 
      gender: 'Female',
      condition: 'Asthma',
      lastVisit: '2 weeks ago',
      status: 'stable',
      recentActivity: false,
      profileImage: 'https://randomuser.me/api/portraits/women/17.jpg',
      recentMetrics: {
        bloodPressure: '110/70',
        heartRate: '76 bpm',
        temperature: '98.4°F',
        oxygenSaturation: '97%'
      }
    },
    { 
      id: '5', 
      name: 'Michael Brown', 
      age: 51, 
      gender: 'Male',
      condition: 'Rheumatoid Arthritis',
      lastVisit: '5 days ago',
      status: 'improving',
      recentActivity: true,
      profileImage: 'https://randomuser.me/api/portraits/men/55.jpg',
      recentMetrics: {
        bloodPressure: '122/78',
        heartRate: '70 bpm',
        temperature: '98.5°F'
      }
    },
  ]);

  // Apply filters
  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(patient => patient.status === activeFilter);
    }
    
    setFilteredPatients(result);
  }, [searchQuery, patients, activeFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch updated patient data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let badgeColor;
    let statusText;
    
    switch(status) {
      case 'critical':
        badgeColor = Colors.critical;
        statusText = 'Critical';
        break;
      case 'monitoring':
        badgeColor = Colors.warning;
        statusText = 'Monitoring';
        break;
      case 'stable':
        badgeColor = Colors.stable;
        statusText = 'Stable';
        break;
      case 'improving':
        badgeColor = Colors.good;
        statusText = 'Improving';
        break;
      default:
        badgeColor = Colors.gray500;
        statusText = status;
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };

  // Filter tabs
  const renderFilterTabs = () => {
    const filters = [
      { id: 'all', label: 'All' },
      { id: 'critical', label: 'Critical' },
      { id: 'monitoring', label: 'Monitoring' },
      { id: 'stable', label: 'Stable' },
      { id: 'improving', label: 'Improving' }
    ];
    
    return (
      <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === item.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.id && styles.activeFilterText
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>
    );
  };

  // Render metrics based on what's available
  const renderMetrics = (metrics) => {
    return (
      <View style={styles.metricsContainer}>
        {metrics.bloodPressure && (
          <View style={styles.metricItem}>
            <FontAwesome5 name="heartbeat" size={12} color={Colors.textSecondary} />
            <Text style={styles.metricText}>{metrics.bloodPressure}</Text>
          </View>
        )}
        {metrics.heartRate && (
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="heart-pulse" size={12} color={Colors.textSecondary} />
            <Text style={styles.metricText}>{metrics.heartRate}</Text>
          </View>
        )}
        {metrics.glucoseLevel && (
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="water-percent" size={12} color={Colors.textSecondary} />
            <Text style={styles.metricText}>{metrics.glucoseLevel}</Text>
          </View>
        )}
        {metrics.oxygenSaturation && (
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="lungs" size={12} color={Colors.textSecondary} />
            <Text style={styles.metricText}>{metrics.oxygenSaturation}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render individual patient card
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
    >
      <Card style={styles.patientCard}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <Image 
              source={{ uri: item.profileImage }} 
              style={styles.patientImage} 
            />
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{item.name}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.patientMetadata}>{item.age} • {item.gender}</Text>
                {item.recentActivity && (
                  <View style={styles.activityIndicator}>
                    <Text style={styles.activityText}>New Activity</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          {renderStatusBadge(item.status)}
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.conditionContainer}>
            <Text style={styles.conditionLabel}>Primary Condition:</Text>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>
          
          <View style={styles.visitContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color={Colors.textSecondary} />
            <Text style={styles.visitText}>Last visit: {item.lastVisit}</Text>
          </View>
          
          {renderMetrics(item.recentMetrics)}
        </View>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="notes-medical" size={14} color={Colors.doctorTheme} />
            <Text style={styles.actionText}>Health Records</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="video" size={14} color={Colors.doctorTheme} />
            <Text style={styles.actionText}>Video Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-ellipses" size={14} color={Colors.doctorTheme} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Patients</Text>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome5 name="plus" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.gray600} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients or conditions..."
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
      
      {renderFilterTabs()}
      
      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderPatientItem}
        contentContainerStyle={styles.patientList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.doctorTheme]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search" size={60} color={Colors.gray400} />
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.doctorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.Shadows.default,
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
  filterContainer: {
    marginBottom: 15,
  },
  filterList: {
    paddingHorizontal: 15,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  activeFilterTab: {
    backgroundColor: Colors.doctorTheme,
    borderColor: Colors.doctorTheme,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.white,
  },
  patientList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  patientCard: {
    marginBottom: 15,
    padding: 15,
  },
  cardHeader: {
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientMetadata: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  activityIndicator: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.secondary + '30',
    borderRadius: 10,
  },
  activityText: {
    fontSize: 10,
    color: Colors.info,
    fontFamily: 'roboto-medium',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'roboto-bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    marginRight: 5,
  },
  conditionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'roboto-medium',
  },
  visitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    marginLeft: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  metricText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'roboto-medium',
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: Colors.doctorTheme,
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
  },
});

export default PatientList;