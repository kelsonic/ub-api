import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Read the environment from the command line argument or default to 'prod'
const args = process.argv.slice(2); // Skipping the first two args which are node binary and script path
const indexName = args[0]; // Expecting the first argument to be the index name

if (!indexName) {
  console.error('Please specify the index name as a command line argument.');
  process.exit(1);
}

// Configure Algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
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
    const results = await index.saveObjects(objects, {
      autoGenerateObjectIDIfNotExist: true,
    });
    console.log(
      `Index ${indexName} has been created and populated with ${results.objectIDs.length} objects.`,
    );
  } catch (error) {
    console.error('Error adding objects to the index:', error);
  }
}

async function run() {
  // The path to the JSON file
  const jsonFilePath = path.resolve(__dirname, '../data/json/eng/index.json');

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`File ${jsonFilePath} does not exist.`);
    return;
  }

  try {
    // Read the contents of the JSON file
    const objects = await readJsonFile(jsonFilePath);

    // Clear the current index (optional, if you want to start fresh)
    await clearIndex();

    // Add the new objects to the index
    await addToIndex(objects);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

run();
