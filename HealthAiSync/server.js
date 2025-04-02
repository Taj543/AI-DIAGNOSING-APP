const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import BioGPT service
const bioGptService = require('./services/bioGptService');

// Import OpenAI for image analysis (legacy feature)
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Import database models
const db = require('./db/models');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the frontend directory
app.use('/assets', express.static(path.join(__dirname, 'frontend/assets')));

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Check if BioGPT API is accessible
app.get('/api/biogpt/status', async (req, res) => {
  try {
    // Test BioGPT connectivity
    await bioGptService.checkStatus();
    
    res.json({ 
      status: 'operational',
      message: 'BioGPT API is accessible and functioning correctly',
    });
  } catch (error) {
    console.error('BioGPT API connectivity test failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Unable to connect to BioGPT service',
      error: error.message
    });
  }
});

// BioGPT medical query analysis endpoint
app.post('/api/biogpt/medical-query', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      status: 'error',
      message: 'No text provided for analysis' 
    });
  }
  
  try {
    const response = await bioGptService.analyzeMedicalQuery(text);
    
    res.json({ 
      status: 'success',
      response: response
    });
  } catch (error) {
    console.error('BioGPT API error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to process your request with BioGPT',
      error: error.message
    });
  }
});

// BioGPT emotional support endpoint
app.post('/api/biogpt/emotional-support', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      status: 'error',
      message: 'No text provided' 
    });
  }
  
  try {
    const response = await bioGptService.provideEmotionalSupport(text);
    
    res.json({ 
      status: 'success',
      response: response
    });
  } catch (error) {
    console.error('BioGPT API error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to process your request with BioGPT',
      error: error.message
    });
  }
});

// OpenAI image analysis endpoint
app.post('/api/openai/analyze-image', async (req, res) => {
  const { base64Image, prompt } = req.body;
  
  if (!base64Image) {
    return res.status(400).json({ 
      status: 'error',
      message: 'No image provided for analysis' 
    });
  }
  
  try {
    const analysisPrompt = prompt || "Analyze this medical image and describe what you observe.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", // Using vision model for image analysis
      messages: [
        {
          role: "system",
          content: `You are an AI medical assistant that analyzes medical images.
                    Describe what you see in the image with medical accuracy but in terms
                    a patient can understand. Always add a disclaimer at the end that this
                    is not a formal medical diagnosis and should not replace professional
                    medical evaluation.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: analysisPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 600,
      temperature: 0.3,
    });
    
    res.json({ 
      status: 'success',
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to process your image with OpenAI',
      error: error.message
    });
  }
});

// BioGPT symptoms analysis endpoint
app.post('/api/biogpt/check-symptoms', async (req, res) => {
  const { symptoms } = req.body;
  
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ 
      status: 'error',
      message: 'No symptoms provided for analysis or invalid format' 
    });
  }
  
  try {
    const analysisResult = await bioGptService.analyzeSymptoms(symptoms);
    
    res.json({ 
      status: 'success',
      analysis: analysisResult
    });
  } catch (error) {
    console.error('BioGPT API error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to analyze symptoms with BioGPT',
      error: error.message
    });
  }
});

// BioGPT medication information endpoint
app.post('/api/biogpt/medication-info', async (req, res) => {
  const { medicationName } = req.body;
  
  if (!medicationName) {
    return res.status(400).json({ 
      status: 'error',
      message: 'No medication name provided' 
    });
  }
  
  try {
    const medicationInfo = await bioGptService.getMedicationInfo(medicationName);
    
    res.json({ 
      status: 'success',
      information: medicationInfo
    });
  } catch (error) {
    console.error('BioGPT API error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get medication information with BioGPT',
      error: error.message
    });
  }
});

// Serve static files from web-build directory if it exists
app.use(express.static(path.join(__dirname, 'frontend/web-build')));

// Root path handler for the application
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'HealthAI API Server is running',
    version: '1.0.0',
    endpoints: {
      system: [
        '/api/health',
        '/api/database/status',
        '/api/biogpt/status'
      ],
      biogpt: [
        '/api/biogpt/medical-query',
        '/api/biogpt/emotional-support',
        '/api/biogpt/check-symptoms',
        '/api/biogpt/medication-info'
      ],
      legacy_openai: [
        '/api/openai/analyze-image'
      ],
      auth: [
        '/api/auth/register',
        '/api/auth/login'
      ],
      patients: [
        '/api/patients/:patientId/health-records',
        '/api/patients/:patientId/medications'
      ],
      appointments: [
        '/api/appointments'
      ]
    }
  });
});

// OpenAI status check endpoint
app.get('/api/openai/status', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        status: 'unavailable',
        message: 'OpenAI API key is not configured'
      });
    }
    
    // Test OpenAI connectivity with a minimal request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "This is a test request. Respond with OK." }
      ],
      max_tokens: 5
    });
    
    res.json({ 
      status: 'operational',
      message: 'OpenAI API is accessible and functioning correctly'
    });
  } catch (error) {
    console.error('OpenAI API connectivity test failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Unable to connect to OpenAI service',
      error: error.message
    });
  }
});

// Catch-all handler for client-side routing (only for paths that don't match API routes)
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/web-build/index.html'));
});

// Special handler for any route under /app/ path
app.get('/app/:path', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/web-build/index.html'));
});

// Database status endpoint
app.get('/api/database/status', async (req, res) => {
  try {
    const connected = await db.sequelize.authenticate();
    res.json({
      status: 'connected',
      message: 'Database connection is established'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Unable to connect to the database',
      error: error.message
    });
  }
});

// User API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType, ...otherFields } = req.body;
    
    // Basic validation
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await db.User.create({
      email,
      password, // In a production app, this should be hashed
      firstName,
      lastName,
      userType,
      ...otherFields
    });
    
    // Create role-specific profile
    let profileData = { userId: user.id, ...otherFields };
    let profile;
    
    if (userType === 'patient') {
      profile = await db.Patient.create(profileData);
    } else if (userType === 'doctor') {
      profile = await db.Doctor.create(profileData);
    } else if (userType === 'caretaker') {
      profile = await db.Caretaker.create(profileData);
    }
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to register user',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Verify password (in a real app, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Get user profile based on type
    let profile;
    if (user.userType === 'patient') {
      profile = await db.Patient.findOne({ where: { userId: user.id } });
    } else if (user.userType === 'doctor') {
      profile = await db.Doctor.findOne({ where: { userId: user.id } });
    } else if (user.userType === 'caretaker') {
      profile = await db.Caretaker.findOne({ where: { userId: user.id } });
    }
    
    res.json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      },
      profile: profile ? profile.toJSON() : null,
      token: 'mock-jwt-token-' + user.id // In a real app, generate a JWT token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      error: error.message
    });
  }
});

// Health records API routes
app.get('/api/patients/:patientId/health-records', async (req, res) => {
  try {
    const { patientId } = req.params;
    const healthRecords = await db.HealthRecord.findAll({
      where: { patientId },
      include: [
        { model: db.Doctor, as: 'doctor', attributes: ['id'] }
      ],
      order: [['dateRecorded', 'DESC']]
    });
    
    res.json({
      status: 'success',
      data: healthRecords
    });
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch health records',
      error: error.message
    });
  }
});

app.post('/api/patients/:patientId/health-records', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { title, recordType, description, data, doctorId } = req.body;
    
    // Basic validation
    if (!title || !recordType || !data) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    const healthRecord = await db.HealthRecord.create({
      patientId,
      doctorId,
      title,
      recordType,
      description,
      data,
      dateRecorded: new Date()
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Health record created successfully',
      data: healthRecord
    });
  } catch (error) {
    console.error('Error creating health record:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create health record',
      error: error.message
    });
  }
});

// Medication API routes
app.get('/api/patients/:patientId/medications', async (req, res) => {
  try {
    const { patientId } = req.params;
    const medications = await db.Medication.findAll({
      where: { patientId },
      include: [
        { model: db.Doctor, as: 'prescriber', attributes: ['id'] }
      ],
      order: [['startDate', 'DESC']]
    });
    
    res.json({
      status: 'success',
      data: medications
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch medications',
      error: error.message
    });
  }
});

app.post('/api/patients/:patientId/medications', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, dosage, frequency, startDate, endDate, instructions, prescribedBy } = req.body;
    
    // Basic validation
    if (!name || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    const medication = await db.Medication.create({
      patientId,
      prescribedBy,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Medication added successfully',
      data: medication
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add medication',
      error: error.message
    });
  }
});

// Appointment API routes
app.get('/api/appointments', async (req, res) => {
  try {
    const { userId, userType } = req.query;
    
    let where = {};
    if (userType === 'patient') {
      const patient = await db.Patient.findOne({ where: { userId } });
      if (patient) {
        where.patientId = patient.id;
      }
    } else if (userType === 'doctor') {
      const doctor = await db.Doctor.findOne({ where: { userId } });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }
    
    const appointments = await db.Appointment.findAll({
      where,
      include: [
        { model: db.Patient, attributes: ['id'] },
        { model: db.Doctor, attributes: ['id'] }
      ],
      order: [['startTime', 'ASC']]
    });
    
    res.json({
      status: 'success',
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { patientId, doctorId, title, startTime, endTime, appointmentType, reasonForVisit } = req.body;
    
    // Basic validation
    if (!patientId || !doctorId || !title || !startTime || !endTime || !appointmentType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    const appointment = await db.Appointment.create({
      patientId,
      doctorId,
      title,
      startTime,
      endTime,
      appointmentType,
      reasonForVisit,
      status: 'scheduled'
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Appointment scheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to schedule appointment',
      error: error.message
    });
  }
});

// Initialize database and start the server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models with database
    await db.syncDatabase();
    
    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`HealthAI server running on http://0.0.0.0:${port}`);
      console.log('Database:', 'Connected');
      
      // Show BioGPT service status
      if (process.env.HUGGINGFACE_API_KEY) {
        console.log('BioGPT Service: Fully Configured');
      } else {
        console.log('BioGPT Service: LIMITED MODE - No API key found');
        console.log('Run Setup-HuggingFace workflow to configure your API key');
      }
      
      // Show OpenAI service status
      if (process.env.OPENAI_API_KEY) {
        console.log('OpenAI API: Configured (for image analysis)');
      } else {
        console.log('OpenAI API: NOT CONFIGURED - Image analysis will not work');
        console.log('Set OPENAI_API_KEY in .env for image analysis functionality');
      }
      
      console.log('Press Ctrl+C to quit.');
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
  }
};

startServer();