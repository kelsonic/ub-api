// Node modules.
import { Request, Response } from 'express';
import { SearchClient, SearchIndex } from 'algoliasearch';
// Relative modules.
import logger from '@utils/logger';
import { enforceString, enforceStringNumber } from '@utils/typeUtils';
import { standardApiResponse } from '@utils/apiResponse';

export class UrantiaBookController {
  private algoliaClient: SearchClient;
  private ubNodeIndexName: string;

  constructor(algoliaClient: SearchClient, ubNodeIndexName: string) {
    this.algoliaClient = algoliaClient;
    this.ubNodeIndexName = ubNodeIndexName;
  }

  public getPaper = async (req: Request, res: Response) => {
    try {
      const searchIndex = await this.prepareSearchIndex();

      const { paperId } = req.params;

      // Required parameters
      enforceString(paperId);

      // Perform the search operation using Algolia search client
      const searchResult = await searchIndex.search('', {
        // Optional parameters
        facetFilters: [`paperId:${paperId}`],
      });

      // Log the search operation
      logger.info(`Search performed with paperId: ${paperId}`);

      // Send back the results
      standardApiResponse(res, 200, {
        data: searchResult,
      });
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      standardApiResponse(res, 500, {
        error: 'Search failed, please try again.',
      });
    }
  };

  public getPaperSection = async (req: Request, res: Response) => {
    try {
      const searchIndex = await this.prepareSearchIndex();

      const { sectionId } = req.params;

      // Required parameters
      enforceString(sectionId);

      // Perform the search operation using Algolia search client
      const searchResult = await searchIndex.search('', {
        // Optional parameters
        facetFilters: [`sectionId:${sectionId}`],
      });

      // Log the search operation
      logger.info(`Search performed with sectionId: ${sectionId}`);

      // Send back the results
      standardApiResponse(res, 200, {
        data: searchResult,
      });
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      standardApiResponse(res, 500, {
        error: 'Search failed, please try again.',
      });
    }
  };

  public getParagraph = async (req: Request, res: Response) => {
    try {
      const searchIndex = await this.prepareSearchIndex();

      const { paragraphId } = req.params;

      // Required parameters
      enforceString(paragraphId);

      // Perform the search operation using Algolia search client
      const searchResult = await searchIndex.search('', {
        // Optional parameters
        facetFilters: [`paragraphId:${paragraphId}`],
      });

      // Log the search operation
      logger.info(`Search performed with paragraphId: ${paragraphId}`);

      // Send back the results
      standardApiResponse(res, 200, {
        data: searchResult,
      });
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      standardApiResponse(res, 500, {
        error: 'Search failed, please try again.',
      });
    }
  };

  getNode = async (req: Request, res: Response) => {
    try {
      const searchIndex = await this.prepareSearchIndex();

      const { globalId } = req.params;

      // Required parameters
      enforceString(globalId);

      // Perform the search operation using Algolia search client
      const searchResult = await searchIndex.search('', {
        // Optional parameters
        facetFilters: [`globalId:${globalId}`],
      });

      // Log the search operation
      logger.info(`Search performed with globalId: ${globalId}`);

      // Send back the results
      standardApiResponse(res, 200, {
        data: searchResult,
      });
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      standardApiResponse(res, 500, {
        error: 'Search failed, please try again.',
      });
    }
  };

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
      standardApiResponse(res, 200, {
        data: searchResult,
      });
    } catch (error) {
      // Log and handle errors
      logger.error(`Search failed: ${error}`);
      standardApiResponse(res, 500, {
        error: 'Search failed, please try again.',
      });
    }
  };

  private prepareSearchIndex = async (): Promise<SearchIndex> => {
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
