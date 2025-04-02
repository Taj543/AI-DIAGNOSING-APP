const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n===== Hugging Face API Key Setup =====\n');
console.log('This script will help you set up your Hugging Face API key for the BioGPT service.');
console.log('You need to get a free API key from Hugging Face to use BioGPT features.\n');
console.log('To get an API key:');
console.log('1. Go to https://huggingface.co/ and sign up for a free account');
console.log('2. After logging in, visit https://huggingface.co/settings/tokens');
console.log('3. Create a new token and copy it\n');
console.log('NOTE: See .env.example file for all available environment variables\n');

rl.question('Please enter your Hugging Face API key: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('\nNo API key provided. BioGPT service will run in limited mode.\n');
    rl.close();
    return;
  }

  // Create or update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if HUGGINGFACE_API_KEY already exists in the file
    if (envContent.includes('HUGGINGFACE_API_KEY=')) {
      // Replace existing key
      envContent = envContent.replace(/HUGGINGFACE_API_KEY=.*/g, `HUGGINGFACE_API_KEY=${apiKey}`);
    } else {
      // Add new key to existing file
      envContent += `\nHUGGINGFACE_API_KEY=${apiKey}`;
    }
  } else {
    // Create new .env file
    envContent = `HUGGINGFACE_API_KEY=${apiKey}`;
  }

  // Write to .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\nHugging Face API key has been saved to .env file.');
  console.log('Please restart the server for changes to take effect.\n');
  
  rl.close();
});

rl.on('close', () => {
  process.exit(0);
});