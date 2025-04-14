import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentDigitizationLandingPage from './pages/LandingPage';
import DocumentScannerWrapper from './components/wrapper';
import YourDocuments from './components/YourDocuments';
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar /> {/* This will be present on all pages */}
      <Routes>
        <Route path="/" element={<DocumentDigitizationLandingPage />} />
        <Route path="/app" element={<DocumentScannerWrapper />} />
        <Route path="/your-documents" element={<YourDocuments />} />
      </Routes>
    </Router>
  );
}

export default App;

