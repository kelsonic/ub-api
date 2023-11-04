## HTML to JSON Converter and Management Utility

This collection of utility scripts aids in efficiently converting, merging, and zipping `.html` files from multiple directories housed within the `html` folder into structured `.json` files. Once converted, these `.json` files are organized into a similar directory structure inside the `json` folder.

### Prerequisites

Ensure you have the following software and libraries:

- **Python**: Required for HTML processing and conversion to JSON.
- **BeautifulSoup**: A Python library for extracting data from HTML and XML files.
- **lxml**: A dependable Python library for HTML and XML processing.
- **pandoc**: Used for general HTML-to-JSON conversion.
- **jq**: A flexible command-line JSON processor for refining the JSON output.
- Update the `ROOT_DIR` variable in the scripts to mirror the absolute file path of your `urantia` repository directory.

### Installation

Prior to running the scripts, ensure the installation of `pandoc`, `jq`, `BeautifulSoup`, and `lxml`.

**For macOS**:

```bash
brew install pandoc jq
pip install beautifulsoup4 lxml
```

**For Linux (with `apt`)**:

```bash
sudo apt-get install pandoc jq
pip install beautifulsoup4 lxml
```

### Scripts Overview

#### 1. `convert-html-to-json.sh`

This script:

- Sets the root directory to the `html` folder.
- Defines paths for both the source `html` and destination `json` directories.
- Creates the `json` directory if it doesn't exist.
- For every directory in the `html` folder:
  - Ensures a corresponding directory in the `json` folder.
  - Calls `process_html.py` for each `.html` file to save the JSON data.
  - Outputs refined JSON to the `json` directory, retaining the original structure.

#### 2. `merge-json.sh`

This script:

- Iterates over all `.json` files within the `json` directory.
- Combines these individual `.json` files into a single, consolidated JSON file for easier data management and access.

#### 3. `zip-json-files.sh`

This script:

- Compresses all `.json` files within the `json` directory into a single `.zip` file. This aids in easy sharing, storage, or deployment of the converted data.

### Executing the Scripts

For each script, ensure they're executable and then run them:

```bash
chmod +x SCRIPT_NAME.sh
./SCRIPT_NAME.sh
```

Replace `SCRIPT_NAME` with the respective script's name.

Upon successful execution, depending on the script used, you should either find the `json` directory with structured `.json` files, a merged JSON file, or a zipped file containing all the JSON data.
