import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Read the environment from the command line argument or default to 'prod'
const args = process.argv.slice(2); // Skipping the first two args which are node binary and script path
const envArg = args[0]; // Expecting the first argument to be the environment (dev or prod)
const env = envArg === 'dev' ? 'dev' : 'prod';
const indexName = `${env}_UB_NODE`;

// Configure Algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_API_KEY!,
);
const index = algoliaClient.initIndex(indexName);

// Function to read and parse the JSON file
async function readJsonFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

// Function to clear the index
async function clearIndex() {
  try {
    await index.clearObjects();
    console.log(`Index ${indexName} cleared.`);
  } catch (error) {
    console.error('Error clearing the index:', error);
  }
}

// Function to add objects to the index
async function addToIndex(objects: any[]) {
  try {
    // Add the new objects to the index
    await index.saveObjects(objects, { autoGenerateObjectIDIfNotExist: true });
    console.log(`Index ${indexName} has been created and populated.`);
  } catch (error) {
    console.error('Error adding objects to the index:', error);
  }
}

// Function to configure the index settings
async function configureIndex() {
  try {
    await index.setSettings({
      // Add any additional settings you need here
      ranking: ['asc(sortId)'], // This will sort the search results based on sortId in ascending order
    });
    console.log(`Index ${indexName} settings configured.`);
  } catch (error) {
    console.error('Error configuring index settings:', error);
  }
}

async function run() {
  // The path to the JSON file
  const jsonFilePath = path.resolve(__dirname, '../data/json/eng/index.json');

  try {
    // Read the contents of the JSON file
    const objects = await readJsonFile(jsonFilePath);

    // Clear the current index (optional, if you want to start fresh)
    await clearIndex();

    // Configure index settings before adding data
    await configureIndex();

    // Add the new objects to the index
    await addToIndex(objects);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
