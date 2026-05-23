/**
 * Example usage of Envfy library
 * 
 * This file demonstrates various ways to use the Envfy environment
 * configuration manager.
 */

import Envfy from './index';

// Example 1: Basic usage
console.log('=== Example 1: Basic Usage ===');
const env = new Envfy();

// Get environment variables
const apiKey = env.get('API_KEY', 'default-key');
const port = env.get('PORT', '3000');
console.log(`API Key: ${apiKey}`);
console.log(`Port: ${port}`);

// Example 2: Setting and saving
console.log('\n=== Example 2: Setting and Saving ===');
env.set('DATABASE_URL', 'postgresql://localhost:5432/mydb');
env.set('JWT_SECRET', 'my-secret-key');
// env.save(); // Uncomment to save to file

// Example 3: Working with multiple values
console.log('\n=== Example 3: Multiple Values ===');
const config = {
  API_KEY: 'key123',
  API_URL: 'https://api.example.com',
  DEBUG: 'true'
};

for (const [key, value] of Object.entries(config)) {
  env.set(key, value);
}

console.log('All environment variables:', env.getAll());

// Example 4: Checking and removing
console.log('\n=== Example 4: Checking and Removing ===');
console.log('Has API_KEY:', env.has('API_KEY'));
console.log('Has OLD_VAR:', env.has('OLD_VAR'));

// Example 5: Loading to process.env
console.log('\n=== Example 5: Loading to process.env ===');
// This loads all variables into process.env
// env.toProcessEnv();
// Now you can access via process.env.API_KEY

// Example 6: Custom file path and encoding
console.log('\n=== Example 6: Custom Configuration ===');
const customEnv = new Envfy({
  path: '/custom/path/.env',
  encoding: 'utf-8'
});

console.log('Config file path:', customEnv.getFilePath());

// Example 7: Error handling
console.log('\n=== Example 7: Error Handling ===');
try {
  const testEnv = new Envfy({ path: './.env' });
  // Your operations here
  console.log('Successfully loaded configuration');
} catch (error) {
  console.error('Error loading configuration:', error);
}

console.log('\n=== Examples Complete ===');
