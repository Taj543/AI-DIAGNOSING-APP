import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import components and utilities
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
// Import BioGPT service for text analysis and OpenAI service for image analysis
import { analyzeMedicalQuery, provideEmotionalSupport } from '../../services/bioGptService';
import { analyzeMedicalImage } from '../../services/openaiService';

// Chat bubble component
const ChatBubble = ({ message, isUser }) => (
  <View
    style={[
      styles.chatBubble,
      isUser ? styles.userBubble : styles.aiBubble,
    ]}
  >
    {!isUser && (
      <View style={styles.aiAvatarContainer}>
        <Text style={styles.aiAvatarText}>AI</Text>
      </View>
    )}
    
    <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.aiMessageContainer]}>
      {message.type === 'text' ? (
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
          {message.content}
        </Text>
      ) : message.type === 'image' ? (
        <View style={styles.imageMessageContainer}>
          <Image
            source={{ uri: message.imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
          {message.content && (
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText, styles.imageCaption]}>
              {message.content}
            </Text>
          )}
        </View>
      ) : null}
      
      <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.aiTimeText]}>
        {message.timestamp}
      </Text>
    </View>
    
    {isUser && (
      <View style={styles.userAvatarContainer}>
        <Text style={styles.userAvatarText}>
          {useSelector(state => state.auth.user?.name?.charAt(0) || 'U')}
        </Text>
      </View>
    )}
  </View>
);

const AIChat = () => {
  // State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatMode, setChatMode] = useState('medical'); // 'medical' or 'emotional'
  
  // Refs
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  // User info
  const user = useSelector(state => state.auth.user);
  
  // Initial welcome message
  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([
      {
        id: '1',
        type: 'text',
        content: `Hello ${user?.name || 'there'}! I'm your HealthAI assistant. How can I help you today? You can ask me medical questions or upload images for analysis.`,
        isUser: false,
        timestamp: timeString,
      },
    ]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Take a photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Cancel image selection
  const cancelImageSelection = () => {
    setSelectedImage(null);
  };

  // Get formatted timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Send text message
  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    
    setIsLoading(true);
    const timeString = getTimestamp();
    const newMessageId = Date.now().toString();
    
    try {
      // If there's an image, process it as an image message
      if (selectedImage) {
        // Add the user's image message
        const userImageMessage = {
          id: newMessageId,
          type: 'image',
          imageUri: selectedImage.uri,
          content: inputText.trim(), // Optional caption
          isUser: true,
          timestamp: timeString,
        };
        
        setMessages(prevMessages => [...prevMessages, userImageMessage]);
        setInputText('');
        setSelectedImage(null);
        
        // Get base64 string from the selected image
        const base64Image = selectedImage.base64;
        
        if (!base64Image) {
          throw new Error('Image data is missing');
        }
        
        // Process the image with AI
        const analysisResponse = await analyzeMedicalImage(base64Image, inputText.trim() || 'Please analyze this medical image.');
        
        // Add AI response
        const aiResponseMessage = {
          id: (parseInt(newMessageId) + 1).toString(),
          type: 'text',
          content: analysisResponse,
          isUser: false,
          timestamp: getTimestamp(),
        };
        
        setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
      } else {
        // Process text-only message
        // Add user message to chat
        const userTextMessage = {
          id: newMessageId,
          type: 'text',
          content: inputText.trim(),
          isUser: true,
          timestamp: timeString,
        };
        
        setMessages(prevMessages => [...prevMessages, userTextMessage]);
        setInputText('');
        
        // Get AI response based on chat mode
        let aiResponse;
        if (chatMode === 'emotional') {
          aiResponse = await provideEmotionalSupport(inputText.trim());
        } else {
          aiResponse = await analyzeMedicalQuery(inputText.trim());
        }
        
        // Add AI response to chat
        const aiResponseMessage = {
          id: (parseInt(newMessageId) + 1).toString(),
          type: 'text',
          content: aiResponse,
          isUser: false,
          timestamp: getTimestamp(),
        };
        
        setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage = {
        id: (parseInt(newMessageId) + 1).toString(),
        type: 'text',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        isUser: false,
        timestamp: getTimestamp(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat mode
  const toggleChatMode = () => {
    const newMode = chatMode === 'medical' ? 'emotional' : 'medical';
    setChatMode(newMode);
    
    // Add system message about mode change
    const modeChangeMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: newMode === 'medical' 
        ? 'Switched to Medical Advice mode. Ask me health-related questions.'
        : 'Switched to Emotional Support mode. Share how you feel, and I\'ll provide support.',
      isUser: false,
      timestamp: getTimestamp(),
    };
    
    setMessages(prevMessages => [...prevMessages, modeChangeMessage]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HealthAI Assistant</Text>
          <TouchableOpacity
            style={[
              styles.modeToggle,
              { backgroundColor: chatMode === 'medical' ? COLORS.primary : COLORS.accent2 }
            ]}
            onPress={toggleChatMode}
          >
            <Text style={styles.modeToggleText}>
              {chatMode === 'medical' ? 'Medical Mode' : 'Support Mode'}
            </Text>
            <Ionicons
              name={chatMode === 'medical' ? 'medkit' : 'heart'}
              size={16}
              color={COLORS.white}
              style={styles.modeIcon}
            />
          </TouchableOpacity>
        </View>
        
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isUser={item.isUser}
            />
          )}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>HealthAI is thinking...</Text>
          </View>
        )}
        
        {/* Selected image preview */}
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.cancelImageButton}
              onPress={cancelImageSelection}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Input area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            {/* Media buttons */}
            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={pickImage}
              >
                <Ionicons name="image" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Text input */}
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder={selectedImage ? "Add a caption (optional)..." : "Type your message..."}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            
            {/* Send button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() && !selectedImage) || isLoading
                  ? styles.sendButtonDisabled
                  : {}
              ]}
              onPress={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
            >
              <MaterialIcons name="send" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h3,
    color: COLORS.textDark,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
  },
  modeToggleText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
    color: COLORS.white,
  },
  modeIcon: {
    marginLeft: 4,
  },
  messagesContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.md,
  },
  chatBubble: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
    maxWidth: '100%',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    maxWidth: '75%',
  },
  userMessageContainer: {
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.sm,
    ...SHADOWS.small,
  },
  aiMessageContainer: {
    backgroundColor: COLORS.white,
    marginRight: SIZES.sm,
    ...SHADOWS.small,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  aiMessageText: {
    color: COLORS.text,
  },
  imageMessageContainer: {
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: SIZES.radiusSm,
  },
  imageCaption: {
    marginTop: SIZES.xs,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.small,
    marginTop: 4,
  },
  userTimeText: {
    color: COLORS.white,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  aiTimeText: {
    color: COLORS.textLight,
    alignSelf: 'flex-start',
  },
  userAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.xs,
  },
  userAvatarText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.body3,
    color: COLORS.white,
  },
  aiAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xs,
  },
  aiAvatarText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.body3,
    color: COLORS.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xs,
    backgroundColor: COLORS.backgroundLight,
  },
  loadingText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginLeft: SIZES.xs,
  },
  selectedImageContainer: {
    position: 'relative',
    margin: SIZES.sm,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    ...SHADOWS.medium,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
  },
  cancelImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    marginRight: SIZES.xs,
  },
  mediaButton: {
    padding: SIZES.xs,
    marginRight: SIZES.xs,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: SIZES.sm,
    paddingVertical: Platform.OS === 'ios' ? SIZES.xs : 0,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.xs,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
});

export default AIChat;