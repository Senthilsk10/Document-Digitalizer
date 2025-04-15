from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Api, Resource
from flask_cors import CORS
import os
import json
import uuid
from werkzeug.utils import secure_filename
import logging
from datetime import datetime
# from tasks import make_celery
from pymongo import MongoClient
from bson.objectid import ObjectId
from gemini import generate,gemini_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
CORS(app)  
api = Api(app)
# from celery import Celery
# # from main import app
# def make_celery(app):
#     celery = Celery(
#         app.import_name,
#         backend='redis://localhost:6379/0',  # Result backend
#         broker='redis://localhost:6379/0'   # Broker URL
#     )
#     celery.conf.update(app.config)
#     return celery
# celery = make_celery(app)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'heic', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# MongoDB configuration
client = MongoClient('mongodb://senthil3226w:senthil3226w@ac-mzevuqh-shard-00-00.xfxlssz.mongodb.net:27017,ac-mzevuqh-shard-00-01.xfxlssz.mongodb.net:27017,ac-mzevuqh-shard-00-02.xfxlssz.mongodb.net:27017/?replicaSet=atlas-ca7sk5-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
db = client['Document-Info']
documents_collection = db['Meta']

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Create a documents directory to store document files
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
            aadhar = request.form.get('aadhar')
            if not aadhar:
                return {'error':"no aadhar details sent"}, 500
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
            
            # Initialize document metadata
            document_metadata = {
                'document_id': document_id,
                'name': document_name,
                'aadhar':aadhar,
                'pageCount': page_count,
                'isMultiPage': is_multi_page,
                'uploadDate': datetime.now(),
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
                    
                    # Create relative path for storing in MongoDB
                    relative_path = f"/static/uploads/documents/{document_id}/{new_filename}"
                    
                    # Add page info to document metadata
                    document_metadata['pages'].append({
                        'id': page_id,
                        'pageNumber': page_number,
                        'filename': new_filename,
                        'originalFilename': original_filename,
                        'filePath': relative_path,
                        'timestamp': page_metadata.get('timestamp', datetime.now().isoformat()),
                        'source': page_metadata.get('source', 'unknown')
                    })
                    
                    logger.info(f"Saved page {page_number} to {file_path}")
            
            # Store document metadata in MongoDB
            result = documents_collection.insert_one(document_metadata)
            
            # Queue the Gemini processing task
            call_gemini(document_id)
            
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
            documents = []
            
            # Retrieve documents from MongoDB
            cursor = documents_collection.find({}, {
                'document_id': 1, 
                'name': 1, 
                'pageCount': 1, 
                'isMultiPage': 1, 
                'uploadDate': 1
            })
            
            for doc in cursor:
                doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
                doc['id'] = doc.pop('document_id')  # Rename document_id to id for consistency
                doc['uploadDate']= doc['uploadDate'].strftime("%d-%m-%Y")
                documents.append(doc)
            
            return {'documents': documents}, 200
        except Exception as e:
            logger.error(f"Error retrieving document list: {str(e)}")
            return {'error': str(e)}, 500

class DocumentDetail(Resource):
    def get(self, document_id):
        try:
            # Find document in MongoDB
            document = documents_collection.find_one({'document_id': document_id})
            
            if not document:
                return {'error': 'Document not found'}, 404
                
            # Convert ObjectId to string for JSON serialization
            document['_id'] = str(document['_id'])
            # print(type(document['uploadDate']))
            document['uploadDate']= document['uploadDate'].strftime("%d-%m-%Y")
            return document, 200
        except Exception as e:
            logger.error(f"Error retrieving document details: {str(e)}")
            return {'error': str(e)}, 500
    
    def delete(self, document_id):
        try:
            # Find and delete document from MongoDB
            result = documents_collection.delete_one({'document_id': document_id})
            
            if result.deleted_count == 0:
                return {'error': 'Document not found'}, 404
            
            # Delete document files
            document_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'documents', document_id)
            
            if os.path.exists(document_dir):
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

# Route to serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/documents', methods=['GET'])
def get_documents_by_aadhar():
    aadhar = request.args.get('aadhar')
    if not aadhar:
        return jsonify({"error": "Aadhar query parameter is required"}), 400

    documents = documents_collection.find({"aadhar": aadhar}).sort("uploadDate", -1)
    result = []

    for idx, doc in enumerate(documents, start=1):
        page = doc.get("pages", [{}])[0]
        extracted = page.get("extracted", {})

        # If extracted is a list (some entries are), take the first element
        if isinstance(extracted, list) and len(extracted) > 0:
            extracted = extracted[0]

        result.append({
            "id": idx,
            "name": doc.get("name", "Untitled Document"),
            "date": doc.get("uploadDate", datetime.utcnow()).strftime("%Y-%m-%d"),
            "type": extracted.get("certificate", "Unknown"),
            "status": "Completed" if page.get("processed", False) else "Processing",
            "extracted": extracted
        })

    return jsonify(result), 200


# @celery.task(name="tasks.call_gemini") 
def call_gemini(document_id):
    try:
        logger.info(f"Processing document with Gemini: {document_id}")
        # Find document in MongoDB
        document = documents_collection.find_one({'document_id': document_id})
        
        if not document:
            logger.error(f"Document not found: {document_id}")
            return
        update_list = []
        pages = document['pages']
        if not document['isMultiPage']:
            for page in pages:
                path = os.path.abspath(page['filePath'])
                result = (generate(gemini_client,path[1::]))
                current_timestamp = datetime.now().isoformat()
                update_list.append({**page,"processed":True,"processedAt":current_timestamp,"extracted":result})
                documents_collection.update_one(
                    {'document_id': document_id},
                    {'$set': {'pages':update_list}}
                )
        else:
            paths = []
            for page in pages:
                paths.append(page['filePath'][1::])
            result = (generate(gemini_client,paths))
            update_list.append({"processed":True,"processedAt":datetime.now().isoformat(),"extracted":result})
            documents_collection.update_one(
                {'document_id': document_id},
                {'$set': {'extracted':update_list}}
            )
        
        
        logger.info(f"Successfully processed document: {document_id}")
    except Exception as e:
        logger.error(f"Error in Gemini processing task: {str(e)}")

# Add resources to API
api.add_resource(DocumentUpload, '/api/upload-document')
api.add_resource(DocumentList, '/api/documents')
api.add_resource(DocumentDetail, '/api/documents/<string:document_id>')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    # call_gemini("a718a5e2-438c-4ea0-a46b-c665c8ee3c3d")