// Node modules.
import { Request, Response } from 'express';
import { SearchClient, SearchIndex } from 'algoliasearch';
// Relative modules.
import logger from '@utils/logger';
import { enforceString, enforceStringNumber } from '@utils/typeUtils';

export class UrantiaBookController {
  private algoliaClient: SearchClient;
  private ubNodeIndexName: string;

  constructor(algoliaClient: SearchClient, ubNodeIndexName: string) {
    this.algoliaClient = algoliaClient;
    this.ubNodeIndexName = ubNodeIndexName;
  }

  public search = async (req: Request, res: Response) => {
    try {
      const searchIndex = await this.prepareSearchIndex();

      const { q, page, hitsPerPage } = req.query;

      // Required parameters
      enforceString(q);

      // Optional parameters
      if (page) {
        enforceStringNumber(page);
      }
      if (hitsPerPage) {
        enforceStringNumber(hitsPerPage);
      }

      // Perform the search operation using Algolia search client
      const searchResult = await searchIndex.search(q as string, {
        // Optional parameters
        page: Number(page) || 0,
        hitsPerPage: Number(hitsPerPage) || 20,
      });

      // Log the search operation
      logger.info(
        `Search performed with query, page, hitsPerPage: ${q}, ${page}, ${hitsPerPage}`,
      );

      // Send back the results
      res.json(searchResult);
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      res.status(500).send({
        error: 'Search failed, please try again.',
      });
    }
  };

  private prepareSearchIndex = async () => {
    // Check if the index exists
    const indexExists = await this.algoliaClient
      .listIndices()
      .then(({ items }) =>
        items.some(({ name }) => name === this.ubNodeIndexName),
      );

    // If the index doesn't exist, create it
    if (!indexExists) {
      throw new Error(`Index ${this.ubNodeIndexName} does not exist.`);
    }

    // Return the search index
    return this.algoliaClient.initIndex(this.ubNodeIndexName);
  };
}

export default UrantiaBookController;
