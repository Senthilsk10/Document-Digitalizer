from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import os
import json
import uuid
from werkzeug.utils import secure_filename
import logging
from datetime import datetime
from tasks import make_celery
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  
api = Api(app)
celery = make_celery(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'heic', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Create a documents directory to store document metadata
os.makedirs(os.path.join(UPLOAD_FOLDER, 'documents'), exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class DocumentUpload(Resource):
    def post(self):
        try:
            # Check if the post request has the file part
            if 'pages' not in request.files:
                return {'error': 'No pages found in the request'}, 400
            
            # Get document metadata
            document_id = request.form.get('documentId')
            document_name = request.form.get('documentName', f'Document-{datetime.now().isoformat()}')
            page_count = int(request.form.get('pageCount', 0))
            is_multi_page = request.form.get('isMultiPage', 'false').lower() == 'true'
            
            if not document_id:
                document_id = str(uuid.uuid4())
            
            logger.info(f"Processing document upload: {document_id} - {document_name}")
            
            # Create document directory
            document_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', document_id)
            os.makedirs(document_dir, exist_ok=True)
            
            # Save document metadata
            document_metadata = {
                'id': document_id,
                'name': document_name,
                'pageCount': page_count,
                'isMultiPage': is_multi_page,
                'uploadDate': datetime.now().isoformat(),
                'pages': []
            }
            
            # Process page files
            page_files = request.files.getlist('pages')
            page_metadata_list = request.form.getlist('pageMetadata')
            
            for i, page_file in enumerate(page_files):
                if page_file and allowed_file(page_file.filename):
                    # Get page metadata
                    page_metadata = {}
                    if i < len(page_metadata_list):
                        try:
                            page_metadata = json.loads(page_metadata_list[i])
                        except json.JSONDecodeError:
                            logger.error(f"Invalid page metadata format: {page_metadata_list[i]}")
                    
                    # Get page ID from metadata or generate new one
                    page_id = page_metadata.get('pageId', str(uuid.uuid4()))
                    page_number = page_metadata.get('pageNumber', i + 1)
                    
                    # Create safe filename
                    original_filename = secure_filename(page_file.filename)
                    extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
                    new_filename = f"page_{page_number}_{page_id}.{extension}"
                    
                    # Save the file
                    file_path = os.path.join(document_dir, new_filename)
                    page_file.save(file_path)
                    
                    # Add page info to document metadata
                    document_metadata['pages'].append({
                        'id': page_id,
                        'pageNumber': page_number,
                        'filename': new_filename,
                        'originalFilename': original_filename,
                        'timestamp': page_metadata.get('timestamp', datetime.now().isoformat()),
                        'source': page_metadata.get('source', 'unknown')
                    })
                    
                    logger.info(f"Saved page {page_number} to {file_path}")
            
            #call call_gemini() here and start process processing documents
            
            # Save document metadata
            with open(os.path.join(document_dir, 'metadata.json'), 'w') as f:
                json.dump(document_metadata, f, indent=2)
            
            response = {
                'success': True,
                'documentId': document_id,
                'documentName': document_name,
                'pageCount': len(document_metadata['pages']),
                'pages': document_metadata['pages']
            }
            
            return response, 201
            
        except Exception as e:
            logger.error(f"Error processing document upload: {str(e)}")
            return {'error': str(e)}, 500

class DocumentList(Resource):
    def get(self):
        try:
            documents_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'documents')
            documents = []
            
            for document_id in os.listdir(documents_dir):
                metadata_path = os.path.join(documents_dir, document_id, 'metadata.json')
                if os.path.exists(metadata_path):
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        documents.append({
                            'id': metadata['id'],
                            'name': metadata['name'],
                            'pageCount': metadata['pageCount'],
                            'isMultiPage': metadata['isMultiPage'],
                            'uploadDate': metadata['uploadDate']
                        })
            
            return {'documents': documents}, 200
        except Exception as e:
            logger.error(f"Error retrieving document list: {str(e)}")
            return {'error': str(e)}, 500

class DocumentDetail(Resource):
    def get(self, document_id):
        try:
            document_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', document_id)
            metadata_path = os.path.join(document_dir, 'metadata.json')
            
            if not os.path.exists(metadata_path):
                return {'error': 'Document not found'}, 404
                
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
                
            return metadata, 200
        except Exception as e:
            logger.error(f"Error retrieving document details: {str(e)}")
            return {'error': str(e)}, 500
    
    def delete(self, document_id):
        try:
            document_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', document_id)
            
            if not os.path.exists(document_dir):
                return {'error': 'Document not found'}, 404
                
            # Delete all files in the document directory
            for file in os.listdir(document_dir):
                file_path = os.path.join(document_dir, file)
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            
            # Remove the directory
            os.rmdir(document_dir)
            
            return {'success': True, 'message': f'Document {document_id} deleted'}, 200
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return {'error': str(e)}, 500


@celery.task
def call_gemini():
    # to be implemented


# Add resources to API
api.add_resource(DocumentUpload, '/api/upload-document')
api.add_resource(DocumentList, '/api/documents')
api.add_resource(DocumentDetail, '/api/documents/<string:document_id>')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)