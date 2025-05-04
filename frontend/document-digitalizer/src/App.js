import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentDigitizationLandingPage from './pages/LandingPage';
import DocumentScannerWrapper from './components/wrapper';
import YourDocuments from './components/YourDocuments';
import BirthCertificate from './components/BirthCertificate';
import Navbar from "./components/NavBar";
import { useState } from 'react';
import AadharContext from './AadharContext';
import BirthCertificatePublic from './components/QrScanner';
function App() {
  const [aadhar, setAadhar] = useState(null);

  return (
    <AadharContext.Provider value={{ aadhar, setAadhar }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DocumentDigitizationLandingPage />} />
          <Route path="/app" element={<DocumentScannerWrapper />} />
          <Route path="/your-documents" element={<YourDocuments />} />
          <Route path="/certificate" element={<BirthCertificate />} />
          <Route path="/storage/:pageId" element={<BirthCertificatePublic />} />
        </Routes>
      </Router>
    </AadharContext.Provider>
  );
}

export default App;
