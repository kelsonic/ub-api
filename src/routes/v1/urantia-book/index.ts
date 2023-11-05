// Node modules.
import algoliasearch from 'algoliasearch';
import express from 'express';
// Relative modules.
import UrantiaBookController from '@controllers/urantiaBook';

// Initialize router
const router = express.Router();

// Initialize Algolia search client
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string,
);
const ubNodeIndexName = process.env.ALGOLIA_UB_NODE_INDEX_NAME as string;

// Initialize controller
const controller = new UrantiaBookController(algoliaClient, ubNodeIndexName);

// Routes.
router.get('/search', controller.search);

export default router;
