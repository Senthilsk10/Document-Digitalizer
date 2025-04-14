import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  // Hide the navbar on landing page
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <nav className="bg-blue-800 text-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="https://www.tn.gov.in/sites/default/Tamil_Nadu_emb.png" alt="Government Emblem" className="h-10" />
          <Link to="/" className="font-bold text-xl">Digital Document Portal</Link>
        </div>
        <div className="flex space-x-6">
          <Link to="/app" className={`hover:text-blue-200 ${location.pathname === '/app' ? 'text-white font-semibold border-b-2 border-white' : 'text-blue-100'}`}>
            Upload Document
          </Link>
          <Link to="/your-documents" className={`hover:text-blue-200 ${location.pathname === '/your-documents' ? 'text-white font-semibold border-b-2 border-white' : 'text-blue-100'}`}>
            Your Documents
          </Link>
          <Link to="/" className="bg-white text-blue-800 px-4 py-1 rounded hover:bg-blue-100 transition">
            Home
          </Link>
          {/* <button className="bg-white text-blue-800 px-4 py-1 rounded hover:bg-blue-100 transition">
            Home
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;