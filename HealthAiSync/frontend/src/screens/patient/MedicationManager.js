import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Switch,
  Image,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Theme from '../../constants/theme';
import { 
  fetchMedications, 
  addMedication,
  updateMedication,
  deleteMedication,
  markMedicationTaken
} from '../../store/slices/patientSlice';

const MedicationManager = () => {
  const dispatch = useDispatch();
  const { medications, loading } = useSelector(state => state.patient);
  
  const [activeTab, setActiveTab] = useState('today');
  const [modalVisible, setModalVisible] = useState(false);
  const [medicationSearch, setMedicationSearch] = useState('');
  const [editingMedication, setEditingMedication] = useState(null);
  
  // Form fields for add/edit medication
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medFrequency, setMedFrequency] = useState('daily');
  const [medTimes, setMedTimes] = useState(['08:00']);
  const [medStartDate, setMedStartDate] = useState(new Date());
  const [medEndDate, setMedEndDate] = useState(null);
  const [medRefillReminder, setMedRefillReminder] = useState(false);
  const [medRefillDate, setMedRefillDate] = useState(new Date());
  const [medNotes, setMedNotes] = useState('');
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showRefillDatePicker, setShowRefillDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  
  // Animation for taken medication
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const takenMedicationRef = useRef(null);
  
  useEffect(() => {
    dispatch(fetchMedications());
  }, []);
  
  // Filter medications based on tab and search
  const getFilteredMedications = () => {
    if (!medications) return [];
    
    let filtered = [...medications];
    
    // Filter by search term
    if (medicationSearch) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(medicationSearch.toLowerCase())
      );
    }
    
    // Filter by tab
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTab) {
      case 'today':
        // Show medications scheduled for today
        filtered = filtered.filter(med => {
          const startDate = new Date(med.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = med.endDate ? new Date(med.endDate) : null;
          if (endDate) endDate.setHours(0, 0, 0, 0);
          
          return startDate <= today && (!endDate || endDate >= today);
        });
        break;
      case 'all':
        // Show all medications
        break;
      case 'active':
        // Show only active medications (not completed)
        filtered = filtered.filter(med => {
          const endDate = med.endDate ? new Date(med.endDate) : null;
          if (endDate) endDate.setHours(0, 0, 0, 0);
          
          return !endDate || endDate >= today;
        });
        break;
      case 'upcoming':
        // Show medications that will start in the future
        filtered = filtered.filter(med => {
          const startDate = new Date(med.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          return startDate > today;
        });
        break;
    }
    
    return filtered;
  };
  
  const handleAddMedication = () => {
    resetForm();
    setEditingMedication(null);
    setModalVisible(true);
  };
  
  const handleEditMedication = (medication) => {
    setEditingMedication(medication);
    
    // Populate form with medication data
    setMedName(medication.name);
    setMedDosage(medication.dosage);
    setMedInstructions(medication.instructions || '');
    setMedFrequency(medication.frequency || 'daily');
    setMedTimes(medication.times || ['08:00']);
    setMedStartDate(new Date(medication.startDate));
    setMedEndDate(medication.endDate ? new Date(medication.endDate) : null);
    setMedRefillReminder(medication.refillReminder || false);
    setMedRefillDate(medication.refillDate ? new Date(medication.refillDate) : new Date());
    setMedNotes(medication.notes || '');
    
    setModalVisible(true);
  };
  
  const resetForm = () => {
    setMedName('');
    setMedDosage('');
    setMedInstructions('');
    setMedFrequency('daily');
    setMedTimes(['08:00']);
    setMedStartDate(new Date());
    setMedEndDate(null);
    setMedRefillReminder(false);
    setMedRefillDate(new Date());
    setMedNotes('');
  };
  
  const handleSubmitMedication = () => {
    // Validate form
    if (!medName.trim()) {
      Alert.alert('Error', 'Please enter a medication name');
      return;
    }
    
    if (!medDosage.trim()) {
      Alert.alert('Error', 'Please enter a dosage');
      return;
    }
    
    const medicationData = {
      name: medName,
      dosage: medDosage,
      instructions: medInstructions,
      frequency: medFrequency,
      times: medTimes,
      startDate: medStartDate,
      endDate: medEndDate,
      refillReminder: medRefillReminder,
      refillDate: medRefillReminder ? medRefillDate : null,
      notes: medNotes
    };
    
    if (editingMedication) {
      dispatch(updateMedication({
        id: editingMedication.id,
        ...medicationData
      }));
    } else {
      dispatch(addMedication(medicationData));
    }
    
    setModalVisible(false);
    resetForm();
  };
  
  const handleDeleteMedication = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this medication?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteMedication(id)),
          style: 'destructive',
        },
      ],
    );
  };
  
  const handleMedicationTaken = (medication, doseIndex) => {
    const today = new Date().toISOString().split('T')[0];
    takenMedicationRef.current = { medicationId: medication.id, doseIndex };
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      dispatch(markMedicationTaken({
        medicationId: medication.id,
        date: today,
        doseIndex
      }));
      takenMedicationRef.current = null;
    });
  };
  
  const addTimeSlot = () => {
    setMedTimes([...medTimes, '12:00']);
  };
  
  const removeTimeSlot = (index) => {
    const updatedTimes = [...medTimes];
    updatedTimes.splice(index, 1);
    setMedTimes(updatedTimes);
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedTimes = [...medTimes];
      updatedTimes[currentTimeIndex] = timeString;
      setMedTimes(updatedTimes);
    }
  };
  
  const showTimePickerForIndex = (index) => {
    setCurrentTimeIndex(index);
    setShowTimePicker(true);
  };
  
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'today' && styles.activeTab]}
        onPress={() => setActiveTab('today')}
      >
        <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => setActiveTab('all')}
      >
        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'active' && styles.activeTab]}
        onPress={() => setActiveTab('active')}
      >
        <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
        onPress={() => setActiveTab('upcoming')}
      >
        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Theme.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medications..."
          value={medicationSearch}
          onChangeText={setMedicationSearch}
        />
        {medicationSearch ? (
          <TouchableOpacity onPress={() => setMedicationSearch('')}>
            <Ionicons name="close-circle" size={20} color={Theme.gray500} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
        <Ionicons name="add" size={24} color={Theme.white} />
      </TouchableOpacity>
    </View>
  );
  
  const renderMedicationList = () => {
    const filteredMedications = getFilteredMedications();
    
    if (filteredMedications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="pills" size={50} color={Theme.gray400} />
          <Text style={styles.emptyText}>No medications found</Text>
          <Button
            title="Add Medication"
            type="patientTheme"
            size="small"
            onPress={handleAddMedication}
            style={styles.emptyButton}
          />
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredMedications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          const isAnimating = takenMedicationRef.current && takenMedicationRef.current.medicationId === item.id;
          
          return (
            <Animated.View
              style={[
                isAnimating && {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Card
                style={styles.medicationCard}
                elevation="small"
                type={item.isOverdue ? 'danger' : 'outline'}
              >
                <View style={styles.medicationHeader}>
                  <View style={styles.medicationTitleContainer}>
                    <Text style={styles.medicationName}>{item.name}</Text>
                    <Text style={styles.medicationDosage}>{item.dosage}</Text>
                  </View>
                  
                  <View style={styles.medicationActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditMedication(item)}
                    >
                      <Ionicons name="pencil" size={18} color={Theme.patientTheme} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMedication(item.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color={Theme.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {item.instructions ? (
                  <Text style={styles.medicationInstructions}>{item.instructions}</Text>
                ) : null}
                
                <View style={styles.timesContainer}>
                  {item.times && item.times.map((time, timeIndex) => {
                    const today = new Date().toISOString().split('T')[0];
                    const isTaken = item.takenDoses && 
                                   item.takenDoses[today] && 
                                   item.takenDoses[today].includes(timeIndex);
                    
                    return (
                      <View key={timeIndex} style={styles.timeSlot}>
                        <View style={styles.timeContainer}>
                          <Ionicons 
                            name="time-outline" 
                            size={16} 
                            color={Theme.textSecondary} 
                            style={styles.timeIcon}
                          />
                          <Text style={styles.timeText}>{time}</Text>
                        </View>
                        
                        <TouchableOpacity
                          style={[
                            styles.takeButton,
                            isTaken && styles.takenButton
                          ]}
                          onPress={() => handleMedicationTaken(item, timeIndex)}
                          disabled={isTaken}
                        >
                          <Text style={[
                            styles.takeButtonText,
                            isTaken && styles.takenButtonText
                          ]}>
                            {isTaken ? 'Taken' : 'Take Now'}
                          </Text>
                          {isTaken && (
                            <Ionicons name="checkmark-circle" size={14} color={Theme.white} style={styles.takenIcon} />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                
                <View style={styles.dateContainer}>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Started</Text>
                    <Text style={styles.dateValue}>
                      {new Date(item.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {item.endDate && (
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Until</Text>
                      <Text style={styles.dateValue}>
                        {new Date(item.endDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  
                  {item.refillReminder && item.refillDate && (
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Refill</Text>
                      <Text style={[
                        styles.dateValue,
                        isRefillSoon(item.refillDate) && styles.refillSoon
                      ]}>
                        {new Date(item.refillDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
                
                {item.frequency !== 'daily' && (
                  <View style={styles.frequencyContainer}>
                    <Text style={styles.frequencyText}>
                      Frequency: {formatFrequency(item.frequency)}
                    </Text>
                  </View>
                )}
              </Card>
            </Animated.View>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  const formatFrequency = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'every_other_day': return 'Every Other Day';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'as_needed': return 'As Needed';
      default: return frequency;
    }
  };
  
  const isRefillSoon = (refillDate) => {
    const today = new Date();
    const refill = new Date(refillDate);
    const diffTime = refill - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  
  const renderAddEditModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMedication ? 'Edit Medication' : 'Add Medication'}
            </Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={Theme.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <Input
              label="Medication Name"
              value={medName}
              onChangeText={setMedName}
              placeholder="Enter medication name"
              required
            />
            
            <Input
              label="Dosage"
              value={medDosage}
              onChangeText={setMedDosage}
              placeholder="e.g., 10mg, 1 tablet"
              required
            />
            
            <Input
              label="Instructions"
              value={medInstructions}
              onChangeText={setMedInstructions}
              placeholder="e.g., Take with food"
              multiline
              numberOfLines={2}
            />
            
            <Text style={styles.formLabel}>Frequency</Text>
            <View style={styles.frequencyButtons}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  medFrequency === 'daily' && styles.activeFrequencyButton
                ]}
                onPress={() => setMedFrequency('daily')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  medFrequency === 'daily' && styles.activeFrequencyButtonText
                ]}>Daily</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  medFrequency === 'every_other_day' && styles.activeFrequencyButton
                ]}
                onPress={() => setMedFrequency('every_other_day')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  medFrequency === 'every_other_day' && styles.activeFrequencyButtonText
                ]}>Every Other Day</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  medFrequency === 'weekly' && styles.activeFrequencyButton
                ]}
                onPress={() => setMedFrequency('weekly')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  medFrequency === 'weekly' && styles.activeFrequencyButtonText
                ]}>Weekly</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  medFrequency === 'monthly' && styles.activeFrequencyButton
                ]}
                onPress={() => setMedFrequency('monthly')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  medFrequency === 'monthly' && styles.activeFrequencyButtonText
                ]}>Monthly</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  medFrequency === 'as_needed' && styles.activeFrequencyButton
                ]}
                onPress={() => setMedFrequency('as_needed')}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  medFrequency === 'as_needed' && styles.activeFrequencyButtonText
                ]}>As Needed</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.formLabel}>Time(s) of Day</Text>
            {medTimes.map((time, index) => (
              <View key={index} style={styles.timeInputRow}>
                <TouchableOpacity 
                  style={styles.timeInput}
                  onPress={() => showTimePickerForIndex(index)}
                >
                  <Ionicons name="time-outline" size={18} color={Theme.textSecondary} style={styles.timeInputIcon} />
                  <Text style={styles.timeInputText}>{time}</Text>
                </TouchableOpacity>
                
                {medTimes.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeTimeButton}
                    onPress={() => removeTimeSlot(index)}
                  >
                    <Ionicons name="remove-circle" size={22} color={Theme.danger} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <Button
              title="Add Another Time"
              type="secondary"
              outlined
              size="small"
              icon="add"
              onPress={addTimeSlot}
              style={styles.addTimeButton}
            />
            
            <View style={styles.datePickerContainer}>
              <Text style={styles.formLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Ionicons name="calendar" size={18} color={Theme.textSecondary} style={styles.datePickerIcon} />
                <Text style={styles.datePickerText}>
                  {medStartDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set End Date</Text>
              <Switch
                value={!!medEndDate}
                onValueChange={(value) => setMedEndDate(value ? new Date() : null)}
                trackColor={{ false: Theme.gray300, true: 'rgba(77, 124, 254, 0.2)' }}
                thumbColor={!!medEndDate ? Theme.patientTheme : Theme.gray400}
              />
            </View>
            
            {!!medEndDate && (
              <View style={styles.datePickerContainer}>
                <Text style={styles.formLabel}>End Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Ionicons name="calendar" size={18} color={Theme.textSecondary} style={styles.datePickerIcon} />
                  <Text style={styles.datePickerText}>
                    {medEndDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Refill Reminder</Text>
              <Switch
                value={medRefillReminder}
                onValueChange={setMedRefillReminder}
                trackColor={{ false: Theme.gray300, true: 'rgba(77, 124, 254, 0.2)' }}
                thumbColor={medRefillReminder ? Theme.patientTheme : Theme.gray400}
              />
            </View>
            
            {medRefillReminder && (
              <View style={styles.datePickerContainer}>
                <Text style={styles.formLabel}>Refill Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowRefillDatePicker(true)}
                >
                  <Ionicons name="calendar" size={18} color={Theme.textSecondary} style={styles.datePickerIcon} />
                  <Text style={styles.datePickerText}>
                    {medRefillDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Input
              label="Notes"
              value={medNotes}
              onChangeText={setMedNotes}
              placeholder="Additional notes..."
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                type="secondary"
                outlined
                size="medium"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title={editingMedication ? 'Update' : 'Save'}
                type="patientTheme"
                size="medium"
                onPress={handleSubmitMedication}
                style={styles.modalButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      
      {/* Date & Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={medStartDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setMedStartDate(selectedDate);
            }
          }}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={medEndDate || new Date()}
          mode="date"
          display="default"
          minimumDate={medStartDate}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setMedEndDate(selectedDate);
            }
          }}
        />
      )}
      
      {showRefillDatePicker && (
        <DateTimePicker
          value={medRefillDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowRefillDatePicker(false);
            if (selectedDate) {
              setMedRefillDate(selectedDate);
            }
          }}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={(() => {
            const [hours, minutes] = medTimes[currentTimeIndex].split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date;
          })()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medications</Text>
      </View>
      
      {renderSearchBar()}
      {renderTabs()}
      {renderMedicationList()}
      {renderAddEditModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    paddingHorizontal: Theme.Spacing.large,
    paddingVertical: Theme.Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
    backgroundColor: Theme.white,
  },
  headerTitle: {
    ...Theme.Typography.h3,
    color: Theme.patientTheme,
  },
  
  // Search bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.medium,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.gray100,
    borderRadius: Theme.BorderRadius.default,
    paddingHorizontal: Theme.Spacing.medium,
    marginRight: Theme.Spacing.medium,
  },
  searchIcon: {
    marginRight: Theme.Spacing.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'roboto-regular',
    fontSize: 16,
    color: Theme.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.patientTheme,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.Spacing.medium,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Theme.patientTheme,
  },
  tabText: {
    fontFamily: 'roboto-medium',
    fontSize: 14,
    color: Theme.textSecondary,
  },
  activeTabText: {
    color: Theme.patientTheme,
  },
  
  // Medication list
  listContent: {
    padding: Theme.Spacing.medium,
    paddingBottom: Theme.Spacing.xl,
  },
  medicationCard: {
    marginBottom: Theme.Spacing.medium,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.small,
  },
  medicationTitleContainer: {
    flex: 1,
  },
  medicationName: {
    ...Theme.Typography.h4,
    marginBottom: 2,
  },
  medicationDosage: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  medicationActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 5,
  },
  medicationInstructions: {
    ...Theme.Typography.body,
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.medium,
  },
  timesContainer: {
    marginBottom: Theme.Spacing.medium,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: Theme.Spacing.small,
  },
  timeText: {
    ...Theme.Typography.body,
  },
  takeButton: {
    backgroundColor: Theme.patientTheme,
    paddingVertical: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.medium,
    borderRadius: Theme.BorderRadius.default,
  },
  takenButton: {
    backgroundColor: Theme.success,
    flexDirection: 'row',
    alignItems: 'center',
  },
  takeButtonText: {
    color: Theme.white,
    fontFamily: 'roboto-medium',
    fontSize: 14,
  },
  takenButtonText: {
    color: Theme.white,
  },
  takenIcon: {
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.small,
  },
  dateItem: {
    marginRight: Theme.Spacing.large,
  },
  dateLabel: {
    ...Theme.Typography.caption,
    color: Theme.textTertiary,
  },
  dateValue: {
    ...Theme.Typography.bodySmall,
  },
  refillSoon: {
    color: Theme.warning,
    fontFamily: 'roboto-medium',
  },
  frequencyContainer: {
    marginTop: Theme.Spacing.small,
  },
  frequencyText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  
  // Empty state
  emptyContainer: {
    padding: Theme.Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Theme.Typography.subtitle,
    color: Theme.textSecondary,
    marginVertical: Theme.Spacing.large,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 150,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: Theme.white,
    borderRadius: Theme.BorderRadius.large,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  modalTitle: {
    ...Theme.Typography.h3,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalScroll: {
    padding: Theme.Spacing.medium,
  },
  formLabel: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.small,
    marginTop: Theme.Spacing.medium,
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingVertical: Theme.Spacing.small,
    paddingHorizontal: Theme.Spacing.medium,
    marginRight: Theme.Spacing.small,
    marginBottom: Theme.Spacing.small,
  },
  activeFrequencyButton: {
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    borderColor: Theme.patientTheme,
  },
  frequencyButtonText: {
    color: Theme.textSecondary,
    fontSize: 14,
  },
  activeFrequencyButtonText: {
    color: Theme.patientTheme,
    fontFamily: 'roboto-medium',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.small,
  },
  timeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingVertical: Theme.Spacing.small,
    paddingHorizontal: Theme.Spacing.medium,
  },
  timeInputIcon: {
    marginRight: Theme.Spacing.small,
  },
  timeInputText: {
    ...Theme.Typography.body,
  },
  removeTimeButton: {
    padding: 10,
    marginLeft: Theme.Spacing.small,
  },
  addTimeButton: {
    alignSelf: 'flex-start',
    marginVertical: Theme.Spacing.medium,
  },
  datePickerContainer: {
    marginBottom: Theme.Spacing.medium,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingVertical: Theme.Spacing.small,
    paddingHorizontal: Theme.Spacing.medium,
  },
  datePickerIcon: {
    marginRight: Theme.Spacing.small,
  },
  datePickerText: {
    ...Theme.Typography.body,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Theme.Spacing.medium,
  },
  switchLabel: {
    ...Theme.Typography.subtitle,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.Spacing.large,
    marginBottom: Theme.Spacing.xl,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
});

export default MedicationManager;
