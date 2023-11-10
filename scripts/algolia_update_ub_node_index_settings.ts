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
      attributesToHighlight: ['text', 'title', 'htmlText'],
      customRanking: ['asc(sortId)'],
      ranking: [
        'typo', // This makes it so that exact matches are ranked higher than partial matches
        'geo', // This makes it so that results closer to the search location are ranked higher
        'words', // This makes it so that results with more words are ranked higher
        'filters', // This makes it so that results matching more filters are ranked higher
        'proximity', // This makes it so that results closer to each other are ranked higher
        'attribute', // This makes it so that results matching the query in the same attribute are ranked higher
        'exact', // This makes it so that results matching the query exactly are ranked higher
        'custom', // This makes it so that results matching the custom ranking are ranked higher
      ],
      highlightPreTag: '<em class="ub-api-highlighted-term">',
      highlightPostTag: '</em>',
      attributesForFaceting: [
        'globalId',
        'language',
        'paperId',
        'paperSectionId',
        'paperSectionParagraphId',
        'paragraphId',
        'sectionId',
        'type',
      ],
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
