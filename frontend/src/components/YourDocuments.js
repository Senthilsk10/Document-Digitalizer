// components/YourDocuments.js
import { useState, useEffect, useContext } from 'react';
import { Download, Globe, Search, FileText } from 'lucide-react';
import AadharContext from '../AadharContext';

function YourDocuments() {
  const { aadhar } = useContext(AadharContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!aadhar) return;

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`https://ubiquitous-spork-9pwjjqv9jjj3x67x-5000.app.github.dev/documents?aadhar=${aadhar}`);
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [aadhar]);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Documents</h1>

        {!aadhar ? (
          <div className="text-center text-gray-500 mt-8">Aadhar not set. Please go back and enter Aadhar.</div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="pl-4">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  className="w-full p-3 focus:outline-none"
                  placeholder="Search your documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-gray-500">Loading documents...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Document Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map(doc => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FileText className="text-gray-500 mr-3" size={18} />
                                <span className="text-gray-800">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{doc.type}</td>
                            <td className="py-3 px-4 text-gray-700">{new Date(doc.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                doc.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-3">
                                <button className="text-blue-600 hover:text-blue-800" title="Download">
                                  <Download size={18} />
                                </button>
                                <button className="text-blue-600 hover:text-blue-800" title="Translate">
                                  <Globe size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">
                            No documents found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {filteredDocuments.length === 0 && searchTerm === '' && (
                    <div className="py-16 text-center">
                      <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Documents Yet</h3>
                      <p className="text-gray-500 mb-6">Upload your first document to get started</p>
                      <a href="/app" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                        Upload Document
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default YourDocuments;
