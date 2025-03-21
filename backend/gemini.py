import requests
import os
import json

def extract_certificate_info(api_key, image_path):
    """
    Upload an image to Google Gemini API and extract certificate information.
    
    Args:
        api_key (str): Your Gemini API key
        image_path (str): Path to the image file (PNG, JPEG, etc.)
    
    Returns:
        dict: Extracted certificate information in JSON format
    """
    # Get file information
    file_size = os.path.getsize(image_path)
    file_name = os.path.basename(image_path)
    
    # Determine MIME type based on file extension
    mime_type = "image/png"  # Default
    if file_name.lower().endswith(('.jpg', '.jpeg')):
        mime_type = "image/jpeg"
    elif file_name.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    
    # Read file content
    with open(image_path, 'rb') as file:
        file_content = file.read()
    
    # Upload file
    upload_url = f"https://generativelanguage.googleapis.com/upload/v1beta/files?key={api_key}"
    
    # Prepare headers for upload
    upload_headers = {
        "X-Goog-Upload-Command": "start, upload, finalize",
        "X-Goog-Upload-Header-Content-Length": str(file_size),
        "X-Goog-Upload-Header-Content-Type": mime_type
    }
    
    # Make the upload request with binary data
    upload_response = requests.post(
        upload_url,
        headers=upload_headers,
        data=file_content
    )
    
    # Extract file URI from response
    if upload_response.status_code != 200:
        raise Exception(f"File upload failed: {upload_response.text}")
    
    try:
        file_uri = upload_response.json().get("file").get("uri")
        if not file_uri:
            raise ValueError("URI not found in response")
    except (json.JSONDecodeError, ValueError) as e:
        # Print the full response for debugging
        print(f"Response content: {upload_response.text}")
        raise Exception(f"Failed to parse file URI: {str(e)}")
    
    # Prepare the generation request
    generation_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    system_instruction = """
    You need to extract Information from the Uploaded Document as follows

    {
      "certificate":"Birth or Death Certificate",
      "name": "Extracted Name",
      "sex": "Male/Female/Other",
      "date_of_birth": "DD/MM/YYYY",
      "place_of_birth": "Extracted Place",
      "address":"Address data available if any",
      "father_name": "Extracted Father's Name",
      "mother_name": "Extracted Mother's Name",
      "registration_number": "Extracted Registration Number",
      "date_of_registration": "DD/MM/YYYY",
      "office_seal_present": true,
      "date_of_issue": "DD/MM/YYYY",
      "date_of_death": "DD/MM/YYYY"
    }
    """
    
    generation_payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "fileData": {
                            "fileUri": file_uri,
                            "mimeType": mime_type
                        }
                    }
                ]
            },
            {
                "role": "user",
                "parts": [
                    {
                        "text": "Extract information from this certificate"
                    }
                ]
            }
        ],
        "systemInstruction": {
            "role": "user",
            "parts": [
                {
                    "text": system_instruction
                }
            ]
        },
        "generationConfig": {
            "temperature": 1,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json"
        }
    }
    
    generation_headers = {
        "Content-Type": "application/json"
    }
    
    # Make the generation request
    generation_response = requests.post(
        generation_url,
        headers=generation_headers,
        json=generation_payload
    )
    
    # Process and return the response
    if generation_response.status_code != 200:
        raise Exception(f"Generation failed: {generation_response.text}")
    
    return generation_response.json()

# Example usage
if __name__ == "__main__":
    api_key = "AIzaSyDXy3tst9-"
    image_path = "/workspaces/Document-Digitalizer/image.jpg"
    try:
        result = extract_certificate_info(api_key, image_path)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")