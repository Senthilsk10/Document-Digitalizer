import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentDigitizationLandingPage from './pages/LandingPage';
import DocumentScannerWrapper from './components/wrapper';
import YourDocuments from './components/YourDocuments';
import BirthCertificate from './components/BirthCertificate';
import Navbar from "./components/NavBar";
import { useState } from 'react';
import AadharContext from './AadharContext';

function App() {
  const [aadhar, setAadhar] = useState(null);

  return (
    <AadharContext.Provider value={{ aadhar, setAadhar }}>
      <Router>
        <Navbar /> {/* This will be present on all pages */}
        <Routes>
          <Route path="/" element={<DocumentDigitizationLandingPage />} />
          <Route path="/app" element={<DocumentScannerWrapper />} />
          <Route path="/your-documents" element={<YourDocuments />} />
          <Route path="/sample" element={<BirthCertificate />} />
        </Routes>
      </Router>
    </AadharContext.Provider>
  );
}

export default App;
