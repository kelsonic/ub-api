import json
import os
import re
import sys


# Extract the paper number from the input file name
def extract_paper_number(filename):
    # Extract the digits that appear right before the .json extension
    match = re.search(r"([0-9]+)\.json$", filename)
    if match:
        return match.group(1)
    else:
        raise ValueError(f"Cannot extract paper number from filename: {filename}")


def flatten_json(data):
    # Initialize an empty list to store the nodes
    flattened = []

    # Helper function to extract the numbers from an ID and strip the 'U'
    def extract_numbers_from_id(_id, count=3):
        return ".".join(_id[1:].split("_", count)[:count])  # _id[1:] strips the 'U'

    # Helper function to extract content within parentheses
    def extract_content_within_parentheses(text):
        match = re.search(r"\(([^)]+)\)", text)
        return match.group(1) if match else text

    # Extract the paper node
    paper_node = {
        "paperId": extract_numbers_from_id(data["id"], 1),
        "type": "paper",
        "title": data["title"],
    }
    flattened.append(paper_node)

    # Loop through each section
    for section in data["sections"]:
        # Extract the section node
        section_id = extract_numbers_from_id(section["id"], 2)
        section_node = {
            "paperId": paper_node["paperId"],
            "paperSectionId": section_id,
            "type": "section",
            "title": section.get("title", None),
        }
        flattened.append(section_node)

        # Loop through each paragraph in the section
        for paragraph in section["paragraphs"]:
            # Extract the paragraph node
            paragraph_node = {
                "paperId": paper_node["paperId"],
                "paperSectionId": section_node["paperSectionId"],
                "paragraphId": extract_numbers_from_id(paragraph["id"], 3),
                "globalParagraphId": extract_content_within_parentheses(
                    paragraph["reference"]
                ),
                "type": "paragraph",
                "text": paragraph.get("text", None),
                "htmlText": paragraph.get("htmlText", None),
            }
            flattened.append(paragraph_node)

    return flattened


input_file = sys.argv[1]
output_prefix = sys.argv[2]

# Front Matter, Parts, Title, Content, Part1, Part2, Part3, and Part4 are not included.
unwanted_prefixes = ["00-", "01-", "02-", "03-", "05-", "07-", "09-", "11-"]

if any(prefix in input_file for prefix in unwanted_prefixes):
    # print(f"Skipping: The file '{input_file}' contains an unwanted prefix.")
    sys.exit(1)

if not os.path.exists(input_file):
    print(f"Error: File '{input_file}' not found.")
    sys.exit(1)

# Load the JSON data
with open(input_file, "r") as file:
    data = json.load(file)

# Flatten the JSON data
flattened_data = flatten_json(data)

# Extract the paper number from the input file name
paper_number = extract_paper_number(input_file)
output_file = f"{output_prefix}{paper_number}.json"

# Save the flattened data
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(flattened_data, file, ensure_ascii=False, indent=2)

# Delete the input file
os.remove(input_file)
