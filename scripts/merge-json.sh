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
JSON_DIR="$ROOT_DIR/data/json"

echo "Starting the merging process..."

# Convert the comma-separated string to an array
IFS=',' read -ra LANG_ARRAY <<< "$LANGUAGES"

merge_json_logic() {
    # Define a function to merge the JSON files
    merge_json_files() {
        lang_dir=$1
        combined_file="$JSON_DIR/$lang_dir/index.json"

        echo "🔨 Merging JSON files in $lang_dir directory..."

        # Delete existing index.json in the current lang_dir if it exists
        [ -f "$combined_file" ] && rm -f "$combined_file"

        # Start with an empty array in the combined_file
        echo "[]" > $combined_file

        # Get the number of JSON files in the directory excluding the index.json
        total_json_files=$(ls "$JSON_DIR/$lang_dir" | grep -v "^index.json$" | wc -l)
        merged_files=0

        # Sort and merge the JSON files excluding index.json
        for json_file in $(ls "$JSON_DIR/$lang_dir" | grep -v "^index.json$" | sort); do
            # Merge the content of json_file into the combined_file's array
            python3 - <<EOF
import json

combined_file = '$combined_file'
json_file = '$JSON_DIR/$lang_dir/$json_file'

with open(combined_file, 'r') as f1:
    data1 = json.load(f1)

with open(json_file, 'r') as f2:
    data2 = json.load(f2)

data1.append(data2)

with open(combined_file, 'w') as f1:
    json.dump(data1, f1)
EOF

            # Increment the merged file counter for the loader
            merged_files=$((merged_files+1))

            # Calculate percentage for the loader
            percent=$((100*merged_files/total_json_files))

            # Print the loader
            printf "\rMerging: [%-50s] %d%%" $(printf "%${percent}s" | tr ' ' '#') $percent
        done

        echo  # Move to the next line after loader completion

        # Remove the temp.json file
        rm -f "temp.json"

        echo "✅ Finished merging JSON files in $lang_dir directory!"
    }

    # Process directories based on specified languages
    if [ "$LANGUAGES" != "all" ]; then
        for lang in "${LANG_ARRAY[@]}"; do
            if [ -d "$JSON_DIR/$lang/" ]; then
                merge_json_files "$lang"
            else
                echo "Directory for language $lang not found in $JSON_DIR!"
            fi
        done
    else
        # Merge JSON files for all directories if no specific languages are provided
        for dir in $(find "$JSON_DIR" -maxdepth 1 -type d); do
            if [ "$dir" != "$JSON_DIR" ]; then
                merge_json_files "$(basename $dir)"
            fi
        done
    fi

    echo "✅ Finished the merging process! 🎉"
}
