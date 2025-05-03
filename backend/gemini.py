import base64
import os
import json
from google import genai
from google.genai import types
def generate(client, img_path,multi_page=False):
    txt = """You need to extract Information from the Uploaded Document in English and the fields you have to extract is as follows:
        {
        \"certificate\": \"Birth or Death Certificate\",
        \"name\": \"Extracted Name\",
        \"sex\": \"Male/Female/Other\",
        \"date_of_birth\": \"DD/MM/YYYY\",
        \"place_of_birth\": \"Extracted Place\",
        \"address\": \"Address data\",
        \"father_name\": \"Extracted Father’s Name\",
        \"mother_name\": \"Extracted Mother’s Name\",
        \"registration_number\": \"Extracted Registration Number\",
        \"date_of_registration\": \"DD/MM/YYYY\",
        \"office_seal_present\": true,
        \"date_of_issue\": \"DD/MM/YYYY\",
        \"date_of_death\": \"DD/MM/YYYY\" // If death certificate
        }

        note:The Language of the extraction should be only english don't return in tamil.
        note:If language other than english found translate it into english.
    """
    if multi_page == True:
        txt = txt.replace('from the Uploaded Document'," and return single json response for all uploaded documents and consider it as single document.")
    # Ensure img_path is always a list for uniform processing
    print(txt)
    if not isinstance(img_path, list):
        img_path = [img_path]
    # Upload all files
    files = [client.files.upload(file=path) for path in img_path]
    # Create content parts for all files
    file_parts = [
        types.Part.from_uri(
            file_uri=file.uri,
            mime_type=file.mime_type,
        )
        for file in files
    ]
    # Add the text part
    file_parts.append(types.Part.from_text(text=" "))
    contents = [
        types.Content(
            role="user",
            parts=file_parts,
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="application/json",
        system_instruction=[
            types.Part.from_text(text=txt),
        ],
    )
    # Ensure the request is independent for each call
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
        config=generate_content_config,
    )
    return json.loads(resp.candidates[0].content.parts[0].text)
# Example usage:
gemini_client = genai.Client(api_key="AIzaSyDXy3tst9-99XNuQ7b9F6pQj1OLzY0i0kA")
# response1 = generate(client, "/workspaces/Document-Digitalizer/backend/static/uploads/documents/8969567c-1381-42c8-9398-7b159692c2c5/page_1_352b932c-edd7-44c6-a146-586d3c88d205.jpg")
# response2 = generate(client, "/workspaces/Document-Digitalizer/backend/static/uploads/documents/c872d19e-fab8-4e5e-b76a-ee6df1fb1c22/page_1_6fb29cb9-7dca-4b13-95c6-61d51674ffb6.jpg")
# print("Response 1:", response1)
# print("Response 2:", response2)



def translate(client,data,lang):
    model = "gemini-2.0-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""{data}, language to translate : {lang}"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        system_instruction=[
            types.Part.from_text(text="""translate the given json data into appropriate language asked for without changing the field name."""),
        ],
    )    
    
    resp = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=contents,
        config=generate_content_config,
    )
    

    return json.loads(resp.candidates[0].content.parts[0].text)