import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure Algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);

// Function to update the index settings
async function updateIndexSettings(indexName: string) {
  if (!indexName) {
    console.error('Please specify the index name as a command line argument.');
    process.exit(1);
  }

  const index = algoliaClient.initIndex(indexName);

  try {
    await index.setSettings({
      searchableAttributes: ['text', 'title'],
      customRanking: ['asc(sortId)'],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
      // Add other settings as needed...
    });
    console.log(`Settings for index ${indexName} have been updated.`);
  } catch (error) {
    console.error(`Error updating settings for index ${indexName}:`, error);
  }
}

// Get the index name from the command line arguments
const args = process.argv.slice(2);
const indexNameArg = args[0];

// Check if the index name was provided
if (!indexNameArg) {
  console.error('Please specify the index name as a command line argument.');
  process.exit(1);
}

// Run the update settings function
updateIndexSettings(indexNameArg);
