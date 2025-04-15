import { useState, useEffect } from "react";

const BirthCertificate = ({ 
  data,
  labels,
  language = "tamil", // Default language
  onTranslate = null // Optional callback for translation
}) => {
  const [translatedLabels, setTranslatedLabels] = useState(labels);
  const [translatedData, setTranslatedData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  // Format date in words (for date of birth)
  const formatDateInWords = (dateString) => {
    if (!dateString) return "";

    try {
      const [day, month, year] = dateString.split("/");
      const date = new Date(`${month}/${day}/${year}`);

      const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];

      return `${day}-${months[date.getMonth()]}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Handle translation when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (!onTranslate) return;

      setIsLoading(true);
      try {
        // Send both labels and data to be translated
        const result = await onTranslate({ labels, data, language });
        
        // Update with translated content
        if (result.translatedLabels) {
          setTranslatedLabels(result.translatedLabels);
        }
        
        if (result.translatedData) {
          setTranslatedData(result.translatedData);
        }
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [language, labels, data, onTranslate]);

  // Generate QR code URL
  const qrCodeUrl = `https://host/docs/${data.registration_number || "unknown"}`;

  // Function to render text in both languages
  const renderBilingual = (english, regional) => (
    <>
      {english}<br/>{regional}
    </>
  );

  return (
    <div className="bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 border-2 border-black">
        {/* Header */}
        <div className="flex justify-between items-center">
          <img src={'/tn-emblem.jpeg'} alt="Government Logo" className="h-20" />
          <img src={'/tn-gov.jpeg'} alt="State Logo" className="h-20" />
          <img src={'/tn-emblem.jpeg'} alt="Municipal Logo" className="h-20" />
        </div>

        {/* Titles */}
        <div className="mt-4 text-center text-blue-600">
          <div className="text-xl font-bold uppercase">
            {renderBilingual(
              translatedLabels.govtTitle?.english || "Government of Tamil Nadu",
              translatedLabels.govtTitle?.regional || "தமிழ்நாடு அரசு"
            )}
          </div>
          <div className="text-xl font-bold">
            {renderBilingual(
              translatedLabels.deptTitle?.english || "Department of Municipal Administration",
              translatedLabels.deptTitle?.regional || "நகராட்சி நிர்வாகம்"
            )}
          </div>
          <div className="text-xl font-bold uppercase">
            {renderBilingual(
              translatedLabels.certificateTitle?.english || "Birth Certificate",
              translatedLabels.certificateTitle?.regional || "பிறப்பு சான்றிதழ்"
            )}
          </div>
        </div>

        {/* Legal Text */}
        <div className="mt-4 text-sm font-bold text-justify text-center">
          <p className="mb-2">
            {translatedLabels.legalText1?.regional || "(பிறப்பு மற்றும் இறப்பு பதிவு சட்டம் கீழ் வழங்கப்படுகிறது)"}
          </p>
          <p className="mb-2">
            {translatedLabels.legalText1?.english || "(ISSUED UNDER THE REGISTRATION OF BIRTHS & DEATHS ACT)"}
          </p>
        </div>

        {/* Data Section */}
        <div className="flex mt-6 text-sm uppercase">
          {/* Left Column */}
          <div className="w-1/2 pr-4">
            <p className="mb-4">
              {translatedLabels.name?.english || "Name"} / {translatedLabels.name?.regional || "பெயர்"}: {translatedData.name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.dateOfBirth?.english || "Date of Birth"} / {translatedLabels.dateOfBirth?.regional || "பிறந்த தேதி"}: {translatedData.date_of_birth || ""}<br />
              {formatDateInWords(translatedData.date_of_birth)}
            </p>
            <p className="mb-4">
              {translatedLabels.motherName?.english || "Name of Mother"} / {translatedLabels.motherName?.regional || "தாயின் பெயர்"}: {translatedData.mother_name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.birthAddress?.english || "Address at Time of Birth"} /<br />
              {translatedLabels.birthAddress?.regional || "பிறப்பின் போது முகவரி"}: <br />
              {translatedData.address || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.regNumber?.english || "Registration Number"} / {translatedLabels.regNumber?.regional || "பதிவு எண்"}: {translatedData.registration_number || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.issueDate?.english || "Date of Issue"} / {translatedLabels.issueDate?.regional || "வழங்கிய நாள்"}: {translatedData.date_of_issue || ""}
            </p>
          </div>

          {/* Right Column */}
          <div className="w-1/2 pl-4">
            <p className="mb-4">
              {translatedLabels.sex?.english || "Sex"} / {translatedLabels.sex?.regional || "பாலினம்"}: {
                translatedData.sex === "Male" ? `${translatedLabels.male?.english || "MALE"} / ${translatedLabels.male?.regional || "ஆண்"}` :
                translatedData.sex === "Female" ? `${translatedLabels.female?.english || "FEMALE"} / ${translatedLabels.female?.regional || "பெண்"}` :
                translatedData.sex || ""
              }
            </p>
            <p className="mb-4">
              {translatedLabels.birthPlace?.english || "Place of Birth"} / {translatedLabels.birthPlace?.regional || "பிறந்த இடம்"}: {translatedData.place_of_birth || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.fatherName?.english || "Name of Father"} / {translatedLabels.fatherName?.regional || "தந்தையின் பெயர்"}: {translatedData.father_name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.permAddress?.english || "Permanent Address"} / {translatedLabels.permAddress?.regional || "நிரந்தர முகவரி"}:<br />
              {translatedData.permanent_address || translatedData.address || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.regDate?.english || "Date of Registration"} / {translatedLabels.regDate?.regional || "பதிவு செய்த தேதி"}: {translatedData.date_of_registration || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.digitallySigned?.english || "Digitally Signed By"}: ________<br />
              {translatedLabels.date?.english || "Date"}: ________
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-6 flex items-center">
          <div className="w-20 h-20 bg-gray-300 flex items-center justify-center text-xs text-gray-700">
            QR Code
          </div>
          <span className="ml-4 text-sm text-gray-600">
            {translatedLabels.scanQR?.english || "Scan to verify certificate"}: {qrCodeUrl}
          </span>
        </div>

        {/* Validity and Footer */}
        <div className="text-right mt-6">
          <p className="text-2xl font-bold">
            {translatedLabels.validity?.english || "Validity"}: {translatedData.validity || "LIFETIME"}
          </p>
          <p className="mt-6 font-bold">
            {translatedLabels.issuingAuthority?.english || "Issuing Authority"}: {translatedLabels.registrar?.english || "Registrar (Birth & Death)"}
          </p>
          
          {translatedData.office_seal_present && (
            <div></div>
          )}
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <p className="text-lg font-bold">Translating...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage with actual extracted data
const BirthCertificateApp = () => {
  const [language, setLanguage] = useState("tamil");
  
  // Example labels structure with English and regional language pairs
  const defaultLabels = {
    govtTitle: { english: "Government of Tamil Nadu", regional: "தமிழ்நாடு அரசு" },
    deptTitle: { 
      english: "Department of Municipal Administration", 
      regional: "நகராட்சி நிர்வாகம்" 
    },
    certificateTitle: { english: "Birth Certificate", regional: "பிறப்பு சான்றிதழ்" },
    legalText1: {
      english: "(ISSUED UNDER THE REGISTRATION OF BIRTHS & DEATHS ACT)",
      regional: "(பிறப்பு மற்றும் இறப்பு பதிவு சட்டம் கீழ் வழங்கப்படுகிறது)"
    },
    name: { english: "Name", regional: "பெயர்" },
    dateOfBirth: { english: "Date of Birth", regional: "பிறந்த தேதி" },
    motherName: { english: "Name of Mother", regional: "தாயின் பெயர்" },
    birthAddress: { english: "Address at Time of Birth", regional: "பிறப்பின் போது முகவரி" },
    regNumber: { english: "Registration Number", regional: "பதிவு எண்" },
    issueDate: { english: "Date of Issue", regional: "வழங்கிய நாள்" },
    sex: { english: "Sex", regional: "பாலினம்" },
    male: { english: "MALE", regional: "ஆண்" },
    female: { english: "FEMALE", regional: "பெண்" },
    birthPlace: { english: "Place of Birth", regional: "பிறந்த இடம்" },
    fatherName: { english: "Name of Father", regional: "தந்தையின் பெயர்" },
    permAddress: { english: "Permanent Address", regional: "நிரந்தர முகவரி" },
    regDate: { english: "Date of Registration", regional: "பதிவு செய்த தேதி" },
    digitallySigned: { english: "Digitally Signed By", regional: "டிஜிட்டல் கையொப்பமிட்டவர்" },
    date: { english: "Date", regional: "தேதி" },
    scanQR: { english: "Scan to verify certificate", regional: "சான்றிதழை சரிபார்க்க ஸ்கேன் செய்யவும்" },
    validity: { english: "Validity", regional: "செல்லுபடியாகும் காலம்" },
    issuingAuthority: { english: "Issuing Authority", regional: "வழங்கும் அதிகாரி" },
    registrar: { english: "Registrar (Birth & Death)", regional: "பதிவாளர் (பிறப்பு & இறப்பு)" }
  };
  
  // Actual extracted data from your JSON
  const extractedData = {
    address: null,
    certificate: "Birth Certificate",
    date_of_birth: "23/05/2005",
    date_of_death: null,
    date_of_issue: "02/10",
    date_of_registration: "31/05/2005",
    father_name: "க.கோ. மனோ கரன்",
    mother_name: "ம.பேபி",
    name: "G.M. தினேஷ் கார்த்திகேயன்",
    office_seal_present: true,
    place_of_birth: "ஸ்ரீ மருத்துவமனை",
    registration_number: "511/2005",
    sex: "Male"
  };
  
  // Function to translate content via backend (simplified for demo)
  const handleTranslate = async ({ labels, data, language }) => {
    console.log(`Translating to ${language}...`);
    
    // Simulate API call with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would call your backend API
        // For demo, we're just returning the same content
        resolve({
          translatedLabels: labels,
          translatedData: data
        });
      }, 1000);
    });
  };
  
  // Languages supported
  const languages = [
    { code: "tamil", name: "Tamil" },
    { code: "hindi", name: "Hindi" },
    { code: "telugu", name: "Telugu" },
    { code: "kannada", name: "Kannada" },
    { code: "malayalam", name: "Malayalam" },
    { code: "bengali", name: "Bengali" },
    { code: "marathi", name: "Marathi" },
    { code: "gujarati", name: "Gujarati" },
    { code: "punjabi", name: "Punjabi" }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Language:
        </label>
        <select 
          className="border border-gray-300 rounded-md px-3 py-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <BirthCertificate 
        data={extractedData} 
        labels={defaultLabels}
        language={language}
        onTranslate={handleTranslate}
      />
    </div>
  );
};

export default BirthCertificateApp;