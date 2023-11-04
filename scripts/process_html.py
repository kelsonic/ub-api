import os
import sys
import json
from bs4 import BeautifulSoup


def extract_data_from_html(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            soup = BeautifulSoup(file.read(), "lxml")
    except Exception as e:
        print(f"Processing file: {file_path}")
        print(f"Error reading or parsing the HTML file: {e}")
        return None

    def process_paragraph(p_tag):
        try:
            ref_tag = p_tag.find("small")
            ref = ref_tag.text if ref_tag else ""
            text = p_tag.get_text().replace(ref, "").strip()
            p_id = p_tag.get("id", None)
            if p_id is None:
                raise ValueError(
                    f"The paragraph with text '{p_tag.text}' does not have an 'id' attribute."
                )

            paragraph_data = {"id": p_id, "reference": ref, "text": text}

            # DEBUGGING CODE:
            # =====
            # Get all tags in the paragraph
            tags_in_paragraph = {child.name for child in p_tag.children if child.name}

            # Check for tags other than 'em', 'small', 'span', and 'sup'
            other_tags = tags_in_paragraph - {"em", "small", "span", "sup"}
            if other_tags:
                print(f"Found additional tags {other_tags} in paragraph '{p_id}'.")
            # =====

            # Check if p_tag has any child that is a valid HTML tag (i.e., not NavigableString)
            if any(not isinstance(child, str) for child in p_tag.contents):
                # Extract inner HTML of the paragraph
                inner_html_content = "".join(
                    [str(content) for content in p_tag.contents]
                )
                # Remove the reference from the inner HTML content
                inner_html_content = inner_html_content.replace(
                    str(ref_tag), ""
                ).strip()
                paragraph_data["htmlText"] = inner_html_content

            return paragraph_data
        except Exception as e:
            print(f"Processing file: {file_path}")
            print(f"Error processing paragraph: {e}")
            return None

    try:
        # Extract the paper title
        h1_tag = soup.find("h1")
        main_id = h1_tag.get("id", None) if h1_tag else None
        paper_tag = soup.find("p", class_="paper")
        paper_title = paper_tag.text if paper_tag else None
        main_title = h1_tag.text if h1_tag else None

        data = {
            "paper": paper_title,
            "title": main_title,
            "id": main_id,
            "sections": [],
        }

        # Extract the initial section directly under <h1>
        initial_paragraphs = []
        if h1_tag:
            for sibling in h1_tag.find_next_siblings():
                if sibling.name == "h2":  # Stop when you find the first h2
                    break
                if (
                    sibling.name == "p"
                    and sibling.has_attr("id")
                    and sibling["id"].startswith("U")
                ):
                    initial_paragraphs.append(process_paragraph(sibling))

        # Add initial section to the data if it contains paragraphs
        if initial_paragraphs:
            initial_section_id = f"{main_id}_intro" if main_id != None else "N/A_intro"
            data["sections"].append(
                {
                    "title": None,
                    "id": initial_section_id,
                    "paragraphs": initial_paragraphs,
                }
            )

        sections = soup.find_all(["h1", "h2"])
        current_section_paragraphs = []
        current_section_title = None
        current_section_id = None

        for section in sections[1:]:  # skipping the first h1 tag
            for sibling in section.find_previous_siblings():
                if sibling.name and sibling.name.startswith("h"):
                    break
                if (
                    sibling.name == "p"
                    and sibling.has_attr("id")
                    and sibling["id"].startswith("U")
                ):
                    current_section_paragraphs.insert(0, process_paragraph(sibling))

            if current_section_title is not None:
                data["sections"].append(
                    {
                        "title": current_section_title,
                        "id": current_section_id,
                        "paragraphs": current_section_paragraphs,
                    }
                )

            current_section_title = section.text
            current_section_id = section["id"]
            current_section_paragraphs = []

        # Append the last section if there's data
        if current_section_title and current_section_paragraphs:
            data["sections"].append(
                {
                    "title": current_section_title,
                    "id": current_section_id,
                    "paragraphs": current_section_paragraphs,
                }
            )

        return data

    except Exception as e:
        print(f"Processing file: {file_path}")
        print(f"Error during data extraction: {e}")
        return None


# Check command-line arguments
if len(sys.argv) < 3:
    print("Usage: python script_name.py input.html output.json")
    sys.exit(1)

input_file = sys.argv[1]
output_file = sys.argv[2]

# Front Matter, Parts, Title, Content, Part1, Part2, Part3, and Part4 are not included.
unwanted_prefixes = ["00-", "01-", "02-", "03-", "05-", "07-", "09-", "11-"]

if any(prefix in input_file for prefix in unwanted_prefixes):
    # print(f"Skipping: The file '{input_file}' contains an unwanted prefix.")
    sys.exit(1)

if not os.path.exists(input_file):
    print(f"Error: File '{input_file}' not found.")
    sys.exit(1)

json_data = extract_data_from_html(input_file)

if json_data:
    # Save as JSON
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=2)
