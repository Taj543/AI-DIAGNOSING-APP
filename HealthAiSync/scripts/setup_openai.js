const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n===== OpenAI API Key Setup =====\n');
console.log('This script will help you set up your OpenAI API key for image analysis functionality.');
console.log('You need an OpenAI API key to use the medical image analysis feature.\n');
console.log('To get an API key:');
console.log('1. Go to https://platform.openai.com/ and sign up for an account');
console.log('2. After logging in, visit https://platform.openai.com/api-keys');
console.log('3. Create a new API key and copy it\n');
console.log('NOTE: OpenAI requires billing information to use their API.');
console.log('      New accounts typically receive free credits to start.\n');
console.log('NOTE: See .env.example file for all available environment variables\n');

rl.question('Please enter your OpenAI API key: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('\nNo API key provided. The medical image analysis feature will be disabled.\n');
    rl.close();
    return;
  }

  // Create or update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if OPENAI_API_KEY already exists in the file
    if (envContent.includes('OPENAI_API_KEY=')) {
      // Replace existing key
      envContent = envContent.replace(/OPENAI_API_KEY=.*/g, `OPENAI_API_KEY=${apiKey}`);
    } else {
      // Add new key to existing file
      envContent += `\nOPENAI_API_KEY=${apiKey}`;
    }
  } else {
    // Create new .env file
    envContent = `OPENAI_API_KEY=${apiKey}`;
  }

  // Write to .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\nOpenAI API key has been saved to .env file.');
  console.log('Please restart the server for changes to take effect.\n');
  
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});