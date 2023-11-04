# Urantia Book API 📘

![API version](https://img.shields.io/badge/API%20version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

The Urantia Book API provides a way to programmatically search and access content from the Urantia Book in JSON format. Whether you're building a new frontend for the book or integrating its knowledge into another application, this API is here to help.

## Features

- 🚀 Fast & efficient search.
- 📖 Access to the entire Urantia Book.
- 🛠️ Developer-friendly JSON format.
- 🔒 Rate limit set to ensure fair usage.

## Endpoints

- **Search:** `GET /urantia-book/search?query=<SEARCH_TERM>`
- **Retrieve Paper:** `GET /urantia-book/papers/:paperId`
- **Health Check:** `GET /health`

## Download Raw JSON Data

For those who wish to work directly with the raw JSON data in English of the Urantia Book, you can download it [here](./data/json/index.json)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/kelsonic/urantia-book-api.git
   ```

2. Install the dependencies:

   ```bash
   yarn install
   ```

3. Start the server:
   ```bash
   yarn start
   ```

Your API should be up and running on `http://localhost:3000`.

## Rate Limits

To ensure fair usage and maintain a high level of service, the API has a rate limit of 10 requests per minute.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Acknowledgments

- All the contributors and supporters of this project.
