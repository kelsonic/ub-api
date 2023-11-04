#!/bin/bash

JSON_DIR="/Users/kelsonic/Desktop/business/urantia/ub-api/data/json"

zip_files_logic() {
    zip_files() {
        cd "$JSON_DIR"
        zip -r "urantia-book-json.zip" */index.json
        cd -
    }

    zip_files
}
