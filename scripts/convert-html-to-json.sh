#!/bin/bash

# Default settings
LANGUAGES="all"

# Parse command line arguments for languages
while [ "$1" != "" ]; do
    case $1 in
        --languages ) shift
                     LANGUAGES=$1
                     ;;
    esac
    shift
done

# Set the root directory
ROOT_DIR="/Users/kelsonic/Desktop/business/urantia/ub-api"
HTML_DIR="$ROOT_DIR/data/html"
JSON_DIR="$ROOT_DIR/data/json"

# Include the other scripts
source "$ROOT_DIR/scripts/merge-json.sh"
# source "$ROOT_DIR/scripts/zip-json-files.sh"

echo "Starting the conversion process..."

# Convert the comma-separated string to an array
IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGES"

# Delete the json directory or specific language's folder based on LANGUAGES without asking
if [ "$LANGUAGES" != "all" ]; then
    for lang in "${LANG_ARRAY[@]}"; do
        echo "Deleting $JSON_DIR/$lang directory..."
        rm -rf "$JSON_DIR/$lang"
    done
else
    echo "Deleting entire $JSON_DIR directory..."
    rm -rf "$JSON_DIR"
fi

echo "Creating $JSON_DIR directory..."
# Create the json directory if it doesn't exist
mkdir -p "$JSON_DIR"

# Define a function to process a directory
process_directory() {
    dir=$1
    # Create a corresponding directory in the json directory
    mkdir -p "$JSON_DIR/$dir"

    echo "🔨 Processing $dir directory..."

    # Determine the total number of .html files in the directory
    total_files=$(find "$dir" -name "*.html" | wc -l)
    processed_files=0

    # Convert each .html file using the Python script
    for file in "$dir"*.html; do
      # Extract the filename without the extension
      filename="${file%.*}"

      # Call the Python script to process the HTML and save it as JSON
      python3 "$ROOT_DIR/scripts/process_html.py" "$file" "$JSON_DIR/$filename.json"

      # Process the JSON file to format it properly
      python3 "$ROOT_DIR/scripts/process_json.py" "$JSON_DIR/$filename.json" "$JSON_DIR/$dir"

      # Increment the processed file counter
      processed_files=$((processed_files+1))

      # Calculate percentage
      percent=$((100*processed_files/total_files))

      # Print the progress bar
      printf "\rProgress: [%-50s] %d%%" $(printf "%${percent}s" | tr ' ' '#') $percent

    done
    printf "\n"  # Move to the next line after progress bar completion

    echo "✅ Finished processing $dir directory!"
    echo "Clearing memory..."
    sync
}

# Navigate to the HTML directory
cd "$HTML_DIR"
echo "Navigated to $HTML_DIR..."

# Convert the comma-separated string to an array
IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGES"

# Process directories based on specified languages
if [ "$LANGUAGES" != "all" ]; then
    for lang in "${LANG_ARRAY[@]}"; do
        if [ -d "$lang/" ]; then
            process_directory "$lang/"
            merge_json_logic "$lang"
        else
            echo "Directory for language $lang not found!"
        fi
    done
else
    # Process all directories if no specific languages are provided
    for dir in */ ; do
        process_directory "$dir"
        merge_json_logic "${dir%/}"  # Remove trailing slash from dir name
    done
fi

# # For the "all" case, zip the files only once at the end
# if [ "$LANGUAGES" == "all" ]; then
#     zip_files_logic
# fi

echo "🎉 Finished!"
