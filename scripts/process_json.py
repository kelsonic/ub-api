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

    # Helper function to create a friendly reference based on the paperId
    def create_friendly_paper_reference(paper_id):
        if paper_id == "0":
            return "Foreword"
        else:
            return "Paper " + paper_id

    def create_friendly_section_reference(section_id):
        if section_id == "0":
            return "Intro"
        else:
            return "Section " + section_id

    def create_friendly_paragraph_reference(paragraph_id):
        if paragraph_id == "0":
            return "First Paragraph"
        else:
            return "Paragraph " + paragraph_id

    def zero_pad(number, length):
        """Pad the number with zeros up to the specified length."""
        return str(number).zfill(length)

    def create_sort_key(paper_id, section_id=None, paragraph_id=None):
        """Create a sort key with padded paper, section, and paragraph ids."""
        # Assuming max lengths for paperId, sectionId, and paragraphId are 3 digits.
        paper_key = zero_pad(paper_id, 4)
        section_key = zero_pad(section_id if section_id is not None else 0, 3)
        paragraph_key = zero_pad(paragraph_id if paragraph_id is not None else 0, 3)
        return f"{paper_key}.{section_key}.{paragraph_key}"

    # Extract the paper node
    paper_id = extract_numbers_from_id(data["id"], 1)
    paper_node = {
        "friendlyReference": create_friendly_paper_reference(paper_id),
        "friendlyReferenceShort": f"{paper_id}:0.0",
        "globalId": f"{paper_id}:-.-",
        "htmlText": None,
        "language": "eng",
        "objectId": f"U{paper_id}:-.-",
        "paperId": paper_id,
        "paperSectionId": None,
        "paperSectionParagraphId": None,
        "paragraphId": None,
        "sectionId": None,
        "sortId": create_sort_key(paper_id),
        "text": None,
        "title": data["title"],
        "type": "paper",
    }
    flattened.append(paper_node)

    # Loop through each section
    for section in data["sections"]:
        # Extract the section node
        paper_section_id = extract_numbers_from_id(section["id"], 2)
        section_id = paper_section_id.split(".", 1)[1]
        section_node = {
            "friendlyReference": f"{create_friendly_paper_reference(paper_id)}, {create_friendly_section_reference(section_id)}",
            "friendlyReferenceShort": f"{paper_id}:{section_id}.0",
            "globalId": f"{paper_id}:{section_id}.-",
            "htmlText": None,
            "language": "eng",
            "objectId": f"U{paper_id}:{section_id}.-",
            "paperId": paper_node["paperId"],
            "paperSectionId": paper_section_id,
            "paperSectionParagraphId": None,
            "paragraphId": None,
            "sectionId": section_id,
            "sortId": create_sort_key(paper_id, section_id),
            "text": None,
            "title": section.get("title", None),
            "type": "section",
        }
        flattened.append(section_node)

        # Loop through each paragraph in the section
        for paragraph in section["paragraphs"]:
            # Extract the paragraph node
            paper_section_paragraph_id = extract_numbers_from_id(paragraph["id"], 3)
            paragraph_id = paper_section_paragraph_id.split(".", 2)[2]
            paragraph_node = {
                "friendlyReference": f"{create_friendly_paper_reference(paper_id)}, {create_friendly_section_reference(section_id)}, {create_friendly_paragraph_reference(paragraph_id)}",
                "friendlyReferenceShort": f"{paper_id}:{section_id}.{paragraph_id}",
                "globalId": f"{paper_id}:{section_id}.{paragraph_id}",
                "htmlText": paragraph.get("htmlText", None),
                "language": "eng",
                "objectId": f"U{paper_id}:{section_id}.{paragraph_id}",
                "paperId": paper_node["paperId"],
                "paperSectionId": section_node["paperSectionId"],
                "paperSectionParagraphId": paper_section_paragraph_id,
                "paragraphId": paragraph_id,
                "sectionId": section_id,
                "sortId": create_sort_key(paper_id, section_id, paragraph_id),
                "text": paragraph.get("text", None),
                "title": None,
                "type": "paragraph",
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
