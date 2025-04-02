import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Theme from '../../constants/theme';
import { 
  fetchMedicalRecords, 
  uploadMedicalRecord, 
  shareMedicalRecord,
  revokeAccess 
} from '../../store/slices/patientSlice';

const HealthRecords = () => {
  const dispatch = useDispatch();
  const { medicalRecords, loading } = useSelector(state => state.patient);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordType, setRecordType] = useState('Lab Test');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordNotes, setRecordNotes] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    sharedOnly: false
  });
  
  useEffect(() => {
    loadMedicalRecords();
  }, []);
  
  const loadMedicalRecords = () => {
    dispatch(fetchMedicalRecords());
  };
  
  const recordCategories = [
    { id: 'all', name: 'All Records', icon: 'file-medical' },
    { id: 'lab_tests', name: 'Lab Tests', icon: 'flask' },
    { id: 'imaging', name: 'Imaging', icon: 'x-ray' },
    { id: 'prescriptions', name: 'Prescriptions', icon: 'prescription' },
    { id: 'vaccinations', name: 'Vaccinations', icon: 'syringe' },
    { id: 'visits', name: 'Doctor Visits', icon: 'stethoscope' }
  ];
  
  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'Lab Test': return { name: 'flask', component: FontAwesome5 };
      case 'Imaging': return { name: 'x-ray', component: FontAwesome5 };
      case 'Prescription': return { name: 'prescription', component: FontAwesome5 };
      case 'Vaccination': return { name: 'syringe', component: FontAwesome5 };
      case 'Doctor Visit': return { name: 'stethoscope', component: FontAwesome5 };
      default: return { name: 'file-medical', component: FontAwesome5 };
    }
  };
  
  const getFilteredRecords = () => {
    if (!medicalRecords) return [];
    
    let filtered = [...medicalRecords];
    
    // Filter by category
    if (activeCategory !== 'all') {
      const categoryMap = {
        'lab_tests': 'Lab Test',
        'imaging': 'Imaging',
        'prescriptions': 'Prescription',
        'vaccinations': 'Vaccination',
        'visits': 'Doctor Visit'
      };
      
      filtered = filtered.filter(record => record.type === categoryMap[activeCategory]);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(record => 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply advanced filters
    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      filtered = filtered.filter(record => new Date(record.date) >= fromDate);
    }
    
    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      filtered = filtered.filter(record => new Date(record.date) <= toDate);
    }
    
    if (filterOptions.type !== 'all') {
      filtered = filtered.filter(record => record.type === filterOptions.type);
    }
    
    if (filterOptions.sharedOnly) {
      filtered = filtered.filter(record => record.sharedWith && record.sharedWith.length > 0);
    }
    
    return filtered;
  };
  
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        
        // Check file size (limit to 10MB)
        if (fileInfo.size > 10 * 1024 * 1024) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return;
        }
        
        setSelectedFile({
          uri: result.uri,
          name: result.name,
          type: result.mimeType
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };
  
  const handleUploadRecord = () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }
    
    if (!recordType) {
      Alert.alert('Error', 'Please select a record type');
      return;
    }
    
    const recordData = {
      file: selectedFile,
      type: recordType,
      date: recordDate,
      notes: recordNotes
    };
    
    dispatch(uploadMedicalRecord(recordData))
      .then(() => {
        setUploadModalVisible(false);
        setSelectedFile(null);
        setRecordType('Lab Test');
        setRecordDate(new Date().toISOString().split('T')[0]);
        setRecordNotes('');
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to upload record');
      });
  };
  
  const handleShareRecord = () => {
    if (!selectedRecord) {
      return;
    }
    
    if (!shareEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    dispatch(shareMedicalRecord({
      recordId: selectedRecord.id,
      recipientEmail: shareEmail
    }))
      .then(() => {
        setShareModalVisible(false);
        setShareEmail('');
        setSelectedRecord(null);
        Alert.alert('Success', 'Record shared successfully');
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to share record');
      });
  };
  
  const handleRevokeAccess = (recordId, email) => {
    Alert.alert(
      'Confirm Revoke Access',
      `Are you sure you want to revoke access for ${email}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Revoke',
          onPress: () => dispatch(revokeAccess({ recordId, email })),
          style: 'destructive',
        },
      ],
    );
  };
  
  const renderCategoryTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {recordCategories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            activeCategory === category.id && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory(category.id)}
        >
          <FontAwesome5
            name={category.icon}
            size={16}
            color={activeCategory === category.id ? Theme.white : Theme.patientTheme}
            style={styles.categoryIcon}
          />
          <Text style={[
            styles.categoryText,
            activeCategory === category.id && styles.activeCategoryText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Theme.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search records..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Theme.gray500} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Ionicons name="options-outline" size={22} color={Theme.patientTheme} />
      </TouchableOpacity>
    </View>
  );
  
  const renderButtons = () => (
    <View style={styles.buttonsContainer}>
      <Button
        title="Upload Record"
        type="patientTheme"
        icon={{ component: Ionicons, name: "cloud-upload-outline", props: { size: 18 } }}
        style={styles.actionButton}
        onPress={() => setUploadModalVisible(true)}
      />
      <Button
        title="Request Records"
        type="secondary"
        outlined
        icon={{ component: Ionicons, name: "document-text-outline", props: { size: 18 } }}
        style={styles.actionButton}
        onPress={() => Alert.alert('Feature Coming Soon', 'Request records from healthcare providers')}
      />
    </View>
  );
  
  const renderRecordsList = () => {
    const filteredRecords = getFilteredRecords();
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.patientTheme} />
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      );
    }
    
    if (filteredRecords.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="file-medical-alt" size={50} color={Theme.gray400} />
          <Text style={styles.emptyText}>No medical records found</Text>
          <Text style={styles.emptySubtext}>
            Upload your medical records or request them from your healthcare provider
          </Text>
          <Button
            title="Upload Record"
            type="patientTheme"
            size="small"
            onPress={() => setUploadModalVisible(true)}
            style={styles.emptyButton}
          />
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const icon = getRecordTypeIcon(item.type);
          
          return (
            <Card style={styles.recordCard} elevation="small">
              <View style={styles.recordHeader}>
                <View style={[styles.recordTypeIcon, { backgroundColor: getIconBackground(item.type) }]}>
                  <icon.component name={icon.name} size={18} color={Theme.white} />
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{item.title}</Text>
                  <Text style={styles.recordType}>{item.type}</Text>
                </View>
                <Text style={styles.recordDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
              
              {item.doctorName && (
                <View style={styles.recordDetail}>
                  <FontAwesome5 name="user-md" size={14} color={Theme.textSecondary} style={styles.detailIcon} />
                  <Text style={styles.detailText}>Dr. {item.doctorName}</Text>
                </View>
              )}
              
              {item.location && (
                <View style={styles.recordDetail}>
                  <Ionicons name="location-outline" size={14} color={Theme.textSecondary} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{item.location}</Text>
                </View>
              )}
              
              {item.notes && (
                <View style={styles.recordDetail}>
                  <Ionicons name="document-text-outline" size={14} color={Theme.textSecondary} style={styles.detailIcon} />
                  <Text style={styles.detailText} numberOfLines={2}>{item.notes}</Text>
                </View>
              )}
              
              {/* Shared With Section */}
              {item.sharedWith && item.sharedWith.length > 0 && (
                <View style={styles.sharedContainer}>
                  <Text style={styles.sharedTitle}>Shared with:</Text>
                  {item.sharedWith.map((user, index) => (
                    <View key={index} style={styles.sharedUser}>
                      <Text style={styles.sharedEmail}>{user.email}</Text>
                      <TouchableOpacity 
                        style={styles.revokeButton}
                        onPress={() => handleRevokeAccess(item.id, user.email)}
                      >
                        <Ionicons name="close-circle" size={16} color={Theme.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.recordActions}>
                <Button
                  title="View"
                  type="patientTheme"
                  size="small"
                  icon={{ component: Ionicons, name: "eye-outline", props: { size: 14 } }}
                  style={styles.recordButton}
                  onPress={() => Alert.alert('Feature Coming Soon', 'View document feature will be available soon')}
                />
                <Button
                  title="Share"
                  type="secondary"
                  size="small"
                  outlined
                  icon={{ component: Ionicons, name: "share-outline", props: { size: 14 } }}
                  style={styles.recordButton}
                  onPress={() => {
                    setSelectedRecord(item);
                    setShareModalVisible(true);
                  }}
                />
              </View>
            </Card>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  const getIconBackground = (type) => {
    switch (type) {
      case 'Lab Test': return 'rgba(255, 181, 71, 0.9)';
      case 'Imaging': return 'rgba(77, 124, 254, 0.9)';
      case 'Prescription': return 'rgba(68, 194, 146, 0.9)';
      case 'Vaccination': return 'rgba(164, 123, 250, 0.9)';
      case 'Doctor Visit': return 'rgba(255, 94, 91, 0.9)';
      default: return 'rgba(160, 170, 190, 0.9)';
    }
  };
  
  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Records</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={Theme.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputLabel}>From</Text>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="YYYY-MM-DD"
                  value={filterOptions.dateFrom}
                  onChangeText={(text) => setFilterOptions({...filterOptions, dateFrom: text})}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.dateInputLabel}>To</Text>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="YYYY-MM-DD"
                  value={filterOptions.dateTo}
                  onChangeText={(text) => setFilterOptions({...filterOptions, dateTo: text})}
                />
              </View>
            </View>
            
            <Text style={styles.filterLabel}>Record Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'all' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'all'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'all' && styles.activeTypeButtonText
                ]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'Lab Test' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'Lab Test'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'Lab Test' && styles.activeTypeButtonText
                ]}>Lab Tests</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'Imaging' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'Imaging'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'Imaging' && styles.activeTypeButtonText
                ]}>Imaging</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'Prescription' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'Prescription'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'Prescription' && styles.activeTypeButtonText
                ]}>Prescriptions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'Vaccination' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'Vaccination'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'Vaccination' && styles.activeTypeButtonText
                ]}>Vaccinations</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterOptions.type === 'Doctor Visit' && styles.activeTypeButton
                ]}
                onPress={() => setFilterOptions({...filterOptions, type: 'Doctor Visit'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  filterOptions.type === 'Doctor Visit' && styles.activeTypeButtonText
                ]}>Doctor Visits</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Show only shared records</Text>
              <TouchableOpacity 
                style={[
                  styles.toggleSwitch,
                  filterOptions.sharedOnly && styles.toggleSwitchActive
                ]}
                onPress={() => setFilterOptions({
                  ...filterOptions, 
                  sharedOnly: !filterOptions.sharedOnly
                })}
              >
                <View style={[
                  styles.toggleKnob, 
                  filterOptions.sharedOnly && styles.toggleKnobActive
                ]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterActions}>
              <Button
                title="Reset Filters"
                type="secondary"
                outlined
                onPress={() => setFilterOptions({
                  dateFrom: '',
                  dateTo: '',
                  type: 'all',
                  sharedOnly: false
                })}
                style={styles.filterButton}
              />
              <Button
                title="Apply Filters"
                type="patientTheme"
                onPress={() => setFilterModalVisible(false)}
                style={styles.filterButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  const renderShareModal = () => (
    <Modal
      visible={shareModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShareModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Medical Record</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => {
                setShareModalVisible(false);
                setShareEmail('');
                setSelectedRecord(null);
              }}
            >
              <Ionicons name="close" size={24} color={Theme.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            {selectedRecord && (
              <View style={styles.shareRecordInfo}>
                <Text style={styles.shareRecordTitle}>
                  {selectedRecord.title}
                </Text>
                <Text style={styles.shareRecordType}>
                  {selectedRecord.type} - {new Date(selectedRecord.date).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            <Text style={styles.shareLabel}>Enter recipient's email address:</Text>
            <TextInput
              style={styles.shareInput}
              placeholder="doctor@example.com"
              value={shareEmail}
              onChangeText={setShareEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.shareNoteContainer}>
              <Ionicons name="information-circle-outline" size={20} color={Theme.info} style={styles.infoIcon} />
              <Text style={styles.shareNoteText}>
                The recipient will receive an email with a secure link to access this record. 
                You can revoke access at any time.
              </Text>
            </View>
            
            <View style={styles.shareActions}>
              <Button
                title="Cancel"
                type="secondary"
                outlined
                onPress={() => {
                  setShareModalVisible(false);
                  setShareEmail('');
                  setSelectedRecord(null);
                }}
                style={styles.shareButton}
              />
              <Button
                title="Share"
                type="patientTheme"
                onPress={handleShareRecord}
                style={styles.shareButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  const renderUploadModal = () => (
    <Modal
      visible={uploadModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setUploadModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Medical Record</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => {
                setUploadModalVisible(false);
                setSelectedFile(null);
              }}
            >
              <Ionicons name="close" size={24} color={Theme.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <TouchableOpacity 
              style={styles.filePickerButton}
              onPress={handlePickDocument}
            >
              <Ionicons name="cloud-upload-outline" size={40} color={Theme.patientTheme} />
              <Text style={styles.filePickerText}>
                {selectedFile ? 'Change File' : 'Select Document or Image'}
              </Text>
            </TouchableOpacity>
            
            {selectedFile && (
              <View style={styles.selectedFileContainer}>
                <Ionicons 
                  name={selectedFile.type.includes('image') ? 'image-outline' : 'document-outline'} 
                  size={20} 
                  color={Theme.textSecondary} 
                  style={styles.fileIcon}
                />
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {selectedFile.name}
                </Text>
              </View>
            )}
            
            <Text style={styles.uploadLabel}>Record Type</Text>
            <View style={styles.recordTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.recordTypeButton,
                  recordType === 'Lab Test' && styles.activeRecordTypeButton
                ]}
                onPress={() => setRecordType('Lab Test')}
              >
                <FontAwesome5
                  name="flask"
                  size={16}
                  color={recordType === 'Lab Test' ? Theme.white : Theme.textSecondary}
                  style={styles.recordTypeIcon}
                />
                <Text style={[
                  styles.recordTypeButtonText,
                  recordType === 'Lab Test' && styles.activeRecordTypeButtonText
                ]}>Lab Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.recordTypeButton,
                  recordType === 'Imaging' && styles.activeRecordTypeButton
                ]}
                onPress={() => setRecordType('Imaging')}
              >
                <FontAwesome5
                  name="x-ray"
                  size={16}
                  color={recordType === 'Imaging' ? Theme.white : Theme.textSecondary}
                  style={styles.recordTypeIcon}
                />
                <Text style={[
                  styles.recordTypeButtonText,
                  recordType === 'Imaging' && styles.activeRecordTypeButtonText
                ]}>Imaging</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.recordTypeButton,
                  recordType === 'Prescription' && styles.activeRecordTypeButton
                ]}
                onPress={() => setRecordType('Prescription')}
              >
                <FontAwesome5
                  name="prescription"
                  size={16}
                  color={recordType === 'Prescription' ? Theme.white : Theme.textSecondary}
                  style={styles.recordTypeIcon}
                />
                <Text style={[
                  styles.recordTypeButtonText,
                  recordType === 'Prescription' && styles.activeRecordTypeButtonText
                ]}>Prescription</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.recordTypeButton,
                  recordType === 'Vaccination' && styles.activeRecordTypeButton
                ]}
                onPress={() => setRecordType('Vaccination')}
              >
                <FontAwesome5
                  name="syringe"
                  size={16}
                  color={recordType === 'Vaccination' ? Theme.white : Theme.textSecondary}
                  style={styles.recordTypeIcon}
                />
                <Text style={[
                  styles.recordTypeButtonText,
                  recordType === 'Vaccination' && styles.activeRecordTypeButtonText
                ]}>Vaccination</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.recordTypeButton,
                  recordType === 'Doctor Visit' && styles.activeRecordTypeButton
                ]}
                onPress={() => setRecordType('Doctor Visit')}
              >
                <FontAwesome5
                  name="stethoscope"
                  size={16}
                  color={recordType === 'Doctor Visit' ? Theme.white : Theme.textSecondary}
                  style={styles.recordTypeIcon}
                />
                <Text style={[
                  styles.recordTypeButtonText,
                  recordType === 'Doctor Visit' && styles.activeRecordTypeButtonText
                ]}>Doctor Visit</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.uploadLabel}>Record Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={recordDate}
              onChangeText={setRecordDate}
            />
            
            <Text style={styles.uploadLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about this record..."
              value={recordNotes}
              onChangeText={setRecordNotes}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.uploadActions}>
              <Button
                title="Cancel"
                type="secondary"
                outlined
                onPress={() => {
                  setUploadModalVisible(false);
                  setSelectedFile(null);
                }}
                style={styles.uploadButton}
              />
              <Button
                title="Upload"
                type="patientTheme"
                onPress={handleUploadRecord}
                disabled={!selectedFile}
                style={styles.uploadButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Records</Text>
      </View>
      
      {renderSearchBar()}
      {renderCategoryTabs()}
      {renderButtons()}
      {renderRecordsList()}
      {renderFilterModal()}
      {renderShareModal()}
      {renderUploadModal()}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Categories
  categoriesContainer: {
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.medium,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.small,
    marginRight: Theme.Spacing.medium,
    borderRadius: Theme.BorderRadius.default,
    borderWidth: 1,
    borderColor: Theme.patientTheme,
    backgroundColor: Theme.white,
  },
  activeCategoryTab: {
    backgroundColor: Theme.patientTheme,
  },
  categoryIcon: {
    marginRight: Theme.Spacing.small,
  },
  categoryText: {
    fontFamily: 'roboto-medium',
    fontSize: 14,
    color: Theme.patientTheme,
  },
  activeCategoryText: {
    color: Theme.white,
  },
  
  // Action Buttons
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.medium,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
  
  // Records List
  listContent: {
    padding: Theme.Spacing.medium,
    paddingBottom: Theme.Spacing.xxl,
  },
  recordCard: {
    marginBottom: Theme.Spacing.medium,
    padding: Theme.Spacing.medium,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.medium,
  },
  recordTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.Spacing.medium,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    ...Theme.Typography.subtitle,
    marginBottom: 2,
  },
  recordType: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  recordDate: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  recordDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.small,
  },
  detailIcon: {
    marginRight: Theme.Spacing.small,
  },
  detailText: {
    ...Theme.Typography.body,
    color: Theme.textSecondary,
    flex: 1,
  },
  sharedContainer: {
    marginTop: Theme.Spacing.medium,
    padding: Theme.Spacing.medium,
    backgroundColor: 'rgba(77, 124, 254, 0.05)',
    borderRadius: Theme.BorderRadius.default,
  },
  sharedTitle: {
    ...Theme.Typography.bodySmall,
    fontFamily: 'roboto-medium',
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.small,
  },
  sharedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.Spacing.xs,
  },
  sharedEmail: {
    ...Theme.Typography.bodySmall,
    color: Theme.textPrimary,
  },
  revokeButton: {
    padding: 5,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.Spacing.medium,
  },
  recordButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
  
  // Loading
  loadingContainer: {
    padding: Theme.Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Theme.Typography.subtitle,
    color: Theme.textSecondary,
    marginTop: Theme.Spacing.large,
  },
  
  // Empty State
  emptyContainer: {
    padding: Theme.Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Theme.Typography.subtitle,
    color: Theme.textSecondary,
    marginVertical: Theme.Spacing.medium,
  },
  emptySubtext: {
    ...Theme.Typography.body,
    color: Theme.textTertiary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.large,
  },
  emptyButton: {
    minWidth: 150,
  },
  
  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
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
    ...Theme.Typography.h4,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalScroll: {
    padding: Theme.Spacing.medium,
  },
  filterLabel: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.small,
    marginTop: Theme.Spacing.medium,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.small,
    fontFamily: 'roboto-regular',
  },
  dateInputLabel: {
    ...Theme.Typography.caption,
    color: Theme.textSecondary,
    marginBottom: 2,
  },
  dateInputField: {
    ...Theme.Typography.body,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.Spacing.medium,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingVertical: Theme.Spacing.small,
    paddingHorizontal: Theme.Spacing.medium,
    marginRight: Theme.Spacing.small,
    marginBottom: Theme.Spacing.small,
  },
  activeTypeButton: {
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    borderColor: Theme.patientTheme,
  },
  typeButtonText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  activeTypeButtonText: {
    color: Theme.patientTheme,
    fontFamily: 'roboto-medium',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Theme.Spacing.large,
  },
  switchLabel: {
    ...Theme.Typography.body,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Theme.gray300,
    justifyContent: 'center',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: 'rgba(77, 124, 254, 0.2)',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Theme.white,
    ...Theme.Shadows.small,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.patientTheme,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.Spacing.large,
    marginBottom: Theme.Spacing.xl,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
  
  // Share Modal
  shareRecordInfo: {
    backgroundColor: 'rgba(77, 124, 254, 0.05)',
    padding: Theme.Spacing.medium,
    borderRadius: Theme.BorderRadius.default,
    marginBottom: Theme.Spacing.large,
  },
  shareRecordTitle: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.xs,
  },
  shareRecordType: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  shareLabel: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.small,
  },
  shareInput: {
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.small,
    fontFamily: 'roboto-regular',
    marginBottom: Theme.Spacing.medium,
  },
  shareNoteContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 192, 255, 0.1)',
    padding: Theme.Spacing.medium,
    borderRadius: Theme.BorderRadius.default,
    marginBottom: Theme.Spacing.large,
  },
  infoIcon: {
    marginRight: Theme.Spacing.small,
    marginTop: 2,
  },
  shareNoteText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
    flex: 1,
  },
  shareActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.Spacing.medium,
    marginBottom: Theme.Spacing.xl,
  },
  shareButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
  
  // Upload Modal
  filePickerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.Spacing.large,
    borderWidth: 2,
    borderColor: 'rgba(77, 124, 254, 0.2)',
    borderStyle: 'dashed',
    borderRadius: Theme.BorderRadius.default,
    marginBottom: Theme.Spacing.medium,
  },
  filePickerText: {
    ...Theme.Typography.body,
    color: Theme.patientTheme,
    marginTop: Theme.Spacing.medium,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 124, 254, 0.05)',
    padding: Theme.Spacing.medium,
    borderRadius: Theme.BorderRadius.default,
    marginBottom: Theme.Spacing.medium,
  },
  fileIcon: {
    marginRight: Theme.Spacing.medium,
  },
  fileName: {
    ...Theme.Typography.body,
    flex: 1,
  },
  uploadLabel: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.small,
    marginTop: Theme.Spacing.medium,
  },
  recordTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.Spacing.medium,
  },
  recordTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingVertical: Theme.Spacing.small,
    paddingHorizontal: Theme.Spacing.medium,
    marginRight: Theme.Spacing.small,
    marginBottom: Theme.Spacing.small,
  },
  activeRecordTypeButton: {
    backgroundColor: Theme.patientTheme,
    borderColor: Theme.patientTheme,
  },
  recordTypeIcon: {
    marginRight: Theme.Spacing.small,
  },
  recordTypeButtonText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  activeRecordTypeButtonText: {
    color: Theme.white,
    fontFamily: 'roboto-medium',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.small,
    fontFamily: 'roboto-regular',
    marginBottom: Theme.Spacing.large,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  uploadActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.xl,
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
});

export default HealthRecords;
