import { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import BirthCertificate from "./BirthCertificateComp";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BirthCertificatePublic = ({dataId}) => {
    const {pageId} = useParams();
    console.log("pageId: ",pageId)
  const [passedData,setPassedData] = useState(null); // document passed from navigate
  const birthCertificateRef = useRef(null);
  useEffect(()=>{
    fetch(`http://127.0.0.1:5000/storage/${pageId}`)
    .then(response => response.text())
    .then(result => {setPassedData(JSON.parse(result).extracted);console.log(result);})
    .catch(error => console.log('error', error));
  },[])
  const defaultLabels={
    govtTitle: {
      english: "Government of Tamil Nadu",
      regional: "தமிழ்நாடு அரசு",
    },
    deptTitle: {
      english: "Department of Municipal Administration",
      regional: "நகராட்சி நிர்வாகம்",
    },
    certificateTitle: {
      english: "Birth Certificate",
      regional: "பிறப்பு சான்றிதழ்",
    },
    legalText1: {
      english: "(ISSUED UNDER THE REGISTRATION OF BIRTHS & DEATHS ACT)",
      regional: "(பிறப்பு மற்றும் இறப்பு பதிவு சட்டம் கீழ் வழங்கப்படுகிறது)",
    },
    name: { english: "Name", regional: "பெயர்" },
    dateOfBirth: { english: "Date of Birth", regional: "பிறந்த தேதி" },
    motherName: { english: "Name of Mother", regional: "தாயின் பெயர்" },
    birthAddress: {
      english: "Address at Time of Birth",
      regional: "பிறப்பின் போது முகவரி",
    },
    regNumber: { english: "Registration Number", regional: "பதிவு எண்" },
    issueDate: { english: "Date of Issue", regional: "வழங்கிய நாள்" },
    sex: { english: "Sex", regional: "பாலினம்" },
    male: { english: "MALE", regional: "ஆண்" },
    female: { english: "FEMALE", regional: "பெண்" },
    birthPlace: { english: "Place of Birth", regional: "பிறந்த இடம்" },
    fatherName: { english: "Name of Father", regional: "தந்தையின் பெயர்" },
    permAddress: { english: "Permanent Address", regional: "நிரந்தர முகவரி" },
    regDate: { english: "Date of Registration", regional: "பதிவு செய்த தேதி" },
    digitallySigned: {
      english: "Digitally Signed By",
      regional: "டிஜிட்டல் கையொப்பமிட்டவர்",
    },
    date: { english: "Date", regional: "தேதி" },
    scanQR: {
      english: "Scan to verify certificate",
      regional: "சான்றிதழை சரிபார்க்க ஸ்கேன் செய்யவும்",
    },
    validity: { english: "Validity", regional: "செல்லுபடியாகும் காலம்" },
    issuingAuthority: {
      english: "Issuing Authority",
      regional: "வழங்கும் அதிகாரி",
    },
    registrar: {
      english: "Registrar (Birth & Death)",
      regional: "பதிவாளர் (பிறப்பு & இறப்பு)",
    },
  };
  // console.log(location.state?.data_id);
  const [language, setLanguage] = useState("tamil");

  const handleDownloadPDF = async () => {
    const element = birthCertificateRef.current;
    
    const canvas = await html2canvas(element, {
      width: element.scrollWidth,
      height: element.scrollHeight,
      scale: 2 // optional: higher scale for better quality
    });
  
    const data = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [element.scrollWidth, element.scrollHeight]
    });
  
    pdf.addImage(data, "PNG", 0, 0, element.scrollWidth, element.scrollHeight);
    pdf.save("download.pdf");
  };
  
  function applyTranslation(languageCode) {
    const translations = {
      tamil: {
        govtTitle: "தமிழ்நாடு அரசு",
        deptTitle: "நகராட்சி நிர்வாகத்துறை",
        certificateTitle: "பிறப்பு சான்றிதழ்",
        legalText1:
          "(பிறப்பு மற்றும் மரண பதிவு சட்டத்தின் கீழ் வெளியிடப்பட்டது)",
        name: "பெயர்",
        dateOfBirth: "பிறந்த தேதி",
        motherName: "தாயின் பெயர்",
        birthAddress: "பிறந்த நேர முகவரி",
        regNumber: "பதிவு எண்",
        issueDate: "வெளியிடப்பட்ட தேதி",
        sex: "இனம்",
        male: "ஆண்",
        female: "பெண்",
        birthPlace: "பிறந்த இடம்",
        fatherName: "தந்தையின் பெயர்",
        permAddress: "நிலையான முகவரி",
        regDate: "பதிவு செய்யப்பட்ட தேதி",
        digitallySigned: "மின்னணு கையொப்பமிட்டவர்",
        date: "தேதி",
        scanQR: "சான்றிதழை சரிபார்க்க ஸ்கேன் செய்யவும்",
        validity: "செல்லுத்தன்மை",
        issuingAuthority: "வெளியிடும் அதிகாரி",
        registrar: "பதிவாளர் (பிறப்பு மற்றும் மரணம்)",
      },
      hindi: {
        govtTitle: "तमिलनाडु सरकार",
        deptTitle: "नगर प्रशासन विभाग",
        certificateTitle: "जन्म प्रमाणपत्र",
        legalText1: "(जन्म और मृत्यु पंजीकरण अधिनियम के तहत जारी)",
        name: "नाम",
        dateOfBirth: "जन्म तिथि",
        motherName: "माँ का नाम",
        birthAddress: "जन्म के समय पता",
        regNumber: "पंजीकरण संख्या",
        issueDate: "जारी करने की तिथि",
        sex: "लिंग",
        male: "पुरुष",
        female: "महिला",
        birthPlace: "जन्म स्थान",
        fatherName: "पिता का नाम",
        permAddress: "स्थायी पता",
        regDate: "पंजीकरण की तिथि",
        digitallySigned: "डिजिटल हस्ताक्षरकर्ता",
        date: "तिथि",
        scanQR: "प्रमाणपत्र सत्यापित करने के लिए स्कैन करें",
        validity: "वैधता",
        issuingAuthority: "जारी करने वाला प्राधिकारी",
        registrar: "पंजीयक (जन्म और मृत्यु)",
      },
      telugu: {
        govtTitle: "తమిళనాడు ప్రభుత్వం",
        deptTitle: "నగర పరిపాలనా శాఖ",
        certificateTitle: "పుట్టిన ధృవీకరణ పత్రం",
        legalText1: "(పుట్టిన మరియు మరణాల నమోదుకు కింద జారీ చేయబడింది)",
        name: "పేరు",
        dateOfBirth: "పుట్టిన తేదీ",
        motherName: "తల్లికి పేరు",
        birthAddress: "పుట్టినప్పుడు చిరునామా",
        regNumber: "నమోదు సంఖ్య",
        issueDate: "జారీ చేసిన తేదీ",
        sex: "లింగం",
        male: "పురుషుడు",
        female: "స్త్రీ",
        birthPlace: "పుట్టిన స్థలం",
        fatherName: "తండ్రి పేరు",
        permAddress: "శాశ్వత చిరునామా",
        regDate: "నమోదు తేదీ",
        digitallySigned: "డిజిటల్ సంతకం చేసినవాడు",
        date: "తేదీ",
        scanQR: "సర్టిఫికేట్ ధృవీకరించడానికి స్కాన్ చేయండి",
        validity: "వెధ్యత",
        issuingAuthority: "జారీ చేసే అధికారి",
        registrar: "నమోదుదారు (పుట్టిన & మరణం)",
      },
      kannada: {
        govtTitle: "ತಮಿಳುನಾಡು ಸರ್ಕಾರ",
        deptTitle: "ನಗರ ಆಡಳಿತ ಇಲಾಖೆ",
        certificateTitle: "ಹುಟ್ಟಿದ ಪ್ರಮಾಣಪತ್ರ",
        legalText1: "(ಹುಟ್ಟು ಮತ್ತು ಮರಣ ದಾಖಲಾತಿ ಕಾಯ್ದೆಯಡಿ ನೀಡಲಾಗಿದೆ)",
        name: "ಹೆಸರು",
        dateOfBirth: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
        motherName: "ತಾಯಿಯ ಹೆಸರು",
        birthAddress: "ಹುಟ್ಟಿದ ಸಮಯದ ವಿಳಾಸ",
        regNumber: "ನೋಂದಣಿ ಸಂಖ್ಯೆ",
        issueDate: "ಜಾರಿಯಾದ ದಿನಾಂಕ",
        sex: "ಲಿಂಗ",
        male: "ಪುರುಷ",
        female: "ಸ್ತ್ರೀ",
        birthPlace: "ಹುಟ್ಟಿದ ಸ್ಥಳ",
        fatherName: "ತಂದೆಯ ಹೆಸರು",
        permAddress: "ಶಾಶ್ವತ ವಿಳಾಸ",
        regDate: "ನೋಂದಣಿಯ ದಿನಾಂಕ",
        digitallySigned: "ಡಿಜಿಟಲ್ ಸಹಿ ಮಾಡಿದವರು",
        date: "ದಿನಾಂಕ",
        scanQR: "ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪರಿಶೀಲಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
        validity: "ಮಾನ್ಯತೆ",
        issuingAuthority: "ಜಾರಿಗೆ ತಂದ ಅಧಿಕಾರಿ",
        registrar: "ನೋಂದಣಾಧಿಕಾರಿ (ಹುಟ್ಟು ಮತ್ತು ಮರಣ)",
      },
      malayalam: {
        govtTitle: "തമിഴ്‌നാട് സർക്കാർ",
        deptTitle: "നഗര ഭരണ വകുപ്പ്",
        certificateTitle: "ജനന സർട്ടിഫിക്കറ്റ്",
        legalText1:
          "(ജനനവും മരണവും രജിസ്റ്റർ ചെയ്യുന്നതിനുള്ള നിയമം പ്രകാരം പുറപ്പെടുവിച്ചത്)",
        name: "പേര്",
        dateOfBirth: "ജനനത്തീയതി",
        motherName: "അമ്മയുടെ പേര്",
        birthAddress: "ജനിച്ച സമയത്തെ വിലാസം",
        regNumber: "രജിസ്ട്രേഷൻ നമ്പർ",
        issueDate: "ഇഷ്യൂ ചെയ്ത തീയതി",
        sex: "ലിംഗം",
        male: "ആൺ",
        female: "പെൺ",
        birthPlace: "ജനിച്ച സ്ഥലം",
        fatherName: "അച്ഛന്റെ പേര്",
        permAddress: "സ്ഥിരവിലാസം",
        regDate: "രജിസ്ട്രേഷൻ തീയതി",
        digitallySigned: "ഡിജിറ്റലായി ഒപ്പിട്ടത്",
        date: "തീയതി",
        scanQR: "സർട്ടിഫിക്കറ്റ് പരിശോധിക്കാൻ സ്കാൻ ചെയ്യുക",
        validity: "ഗുണനിലവാരം",
        issuingAuthority: "ഇഷ്യൂ ചെയ്യുന്ന അതോറിറ്റി",
        registrar: "രജിസ്റ്റാറി (ജനനവും മരണവും)",
      },
      bengali: {
        govtTitle: "তামিলনাড়ু সরকার",
        deptTitle: "নগর প্রশাসন বিভাগ",
        certificateTitle: "জন্ম শংসাপত্র",
        legalText1: "(জন্ম ও মৃত্যু নিবন্ধন আইনের অধীনে জারি করা হয়েছে)",
        name: "নাম",
        dateOfBirth: "জন্ম তারিখ",
        motherName: "মায়ের নাম",
        birthAddress: "জন্ম সময়ের ঠিকানা",
        regNumber: "নিবন্ধন নম্বর",
        issueDate: "জারির তারিখ",
        sex: "লিঙ্গ",
        male: "পুরুষ",
        female: "মহিলা",
        birthPlace: "জন্মস্থান",
        fatherName: "বাবার নাম",
        permAddress: "স্থায়ী ঠিকানা",
        regDate: "নিবন্ধনের তারিখ",
        digitallySigned: "ডিজিটালি স্বাক্ষরকারী",
        date: "তারিখ",
        scanQR: "শংসাপত্র যাচাই করতে স্ক্যান করুন",
        validity: "বৈধতা",
        issuingAuthority: "জারি কর্তৃপক্ষ",
        registrar: "রেজিস্ট্রার (জন্ম ও মৃত্যু)",
      },
      marathi: {
        govtTitle: "तामिळनाडू सरकार",
        deptTitle: "नगर प्रशासन विभाग",
        certificateTitle: "जन्म प्रमाणपत्र",
        legalText1: "(जन्म व मृत्यू नोंदणी अधिनियमाअंतर्गत जारी केलेले)",
        name: "नाव",
        dateOfBirth: "जन्म तारीख",
        motherName: "आईचे नाव",
        birthAddress: "जन्माच्या वेळीचा पत्ता",
        regNumber: "नोंदणी क्रमांक",
        issueDate: "जारी करण्याची तारीख",
        sex: "लिंग",
        male: "पुरुष",
        female: "स्त्री",
        birthPlace: "जन्मस्थान",
        fatherName: "वडिलांचे नाव",
        permAddress: "स्थायी पत्ता",
        regDate: "नोंदणी तारीख",
        digitallySigned: "डिजिटल स्वाक्षरी केलेले",
        date: "तारीख",
        scanQR: "प्रमाणपत्र सत्यापित करण्यासाठी स्कॅन करा",
        validity: "वैधता",
        issuingAuthority: "प्रमाणपत्र देणारा अधिकारी",
        registrar: "नोंदणी अधिकारी (जन्म व मृत्यू)",
      },
      gujarati: {
        govtTitle: "તમિલનાડુ સરકાર",
        deptTitle: "નગર વ્યવસ્થાપન વિભાગ",
        certificateTitle: "જન્મ પ્રમાણપત્ર",
        legalText1: "(જન્મ અને મૃત્યુ નોંધણી અધિનિયમ હેઠળ જારી કરેલું)",
        name: "નામ",
        dateOfBirth: "જન્મ તારીખ",
        motherName: "માતાનું નામ",
        birthAddress: "જન્મ સમયેનો સરનામો",
        regNumber: "નોંધણી નંબર",
        issueDate: "જારી કરવાની તારીખ",
        sex: "લિંગ",
        male: "પુરુષ",
        female: "સ્ત્રી",
        birthPlace: "જન્મ સ્થાન",
        fatherName: "પિતાનું નામ",
        permAddress: "કાયમી સરનામું",
        regDate: "નોંધણી તારીખ",
        digitallySigned: "ડિજિટલી સહી કરનાર",
        date: "તારીખ",
        scanQR: "પ્રમાણપત્ર ચકાસવા માટે સ્કેન કરો",
        validity: "માન્યતા",
        issuingAuthority: "જારી કરનાર અધિકારી",
        registrar: "નોંધણી અધિકારી (જન્મ અને મૃત્યુ)",
      },
      punjabi: {
        govtTitle: "ਤਮਿਲਨਾਡੂ ਸਰਕਾਰ",
        deptTitle: "ਨਗਰ ਪ੍ਰਸ਼ਾਸਨ ਵਿਭਾਗ",
        certificateTitle: "ਜਨਮ ਸਰਟੀਫਿਕੇਟ",
        legalText1: "(ਜਨਮ ਅਤੇ ਮੌਤ ਰਜਿਸਟਰੇਸ਼ਨ ਕਾਨੂੰਨ ਤਹਿਤ ਜਾਰੀ ਕੀਤਾ ਗਿਆ)",
        name: "ਨਾਂ",
        dateOfBirth: "ਜਨਮ ਮਿਤੀ",
        motherName: "ਮਾਤਾ ਦਾ ਨਾਂ",
        birthAddress: "ਜਨਮ ਵੇਲੇ ਦਾ ਪਤਾ",
        regNumber: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ",
        issueDate: "ਜਾਰੀ ਕਰਨ ਦੀ ਮਿਤੀ",
        sex: "ਲਿੰਗ",
        male: "ਪੁਰਸ਼",
        female: "ਇਸਤਰੀ",
        birthPlace: "ਜਨਮ ਸਥਾਨ",
        fatherName: "ਪਿਤਾ ਦਾ ਨਾਂ",
        permAddress: "ਸਥਾਈ ਪਤਾ",
        regDate: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੀ ਮਿਤੀ",
        digitallySigned: "ਡਿਜ਼ੀਟਲ ਦਸਤਖਤ ਕਰਨ ਵਾਲਾ",
        date: "ਮਿਤੀ",
        scanQR: "ਸਰਟੀਫਿਕੇਟ ਦੀ ਜਾਂਚ ਲਈ ਸਕੈਨ ਕਰੋ",
        validity: "ਮਿਆਦ",
        issuingAuthority: "ਜਾਰੀ ਕਰਨ ਵਾਲਾ ਅਧਿਕਾਰੀ",
        registrar: "ਰਜਿਸਟ੍ਰਾਰ (ਜਨਮ ਅਤੇ ਮੌਤ)",
      },
    };
    const translation = translations[languageCode];
    if (!translation) {
      console.warn(`No translation available for ${languageCode}`);
      return defaultLabels; // fallback
    }

    const updatedLabels = {};
    for (const key in defaultLabels) {
      updatedLabels[key] = {
        ...defaultLabels[key],
        regional: translation[key] || defaultLabels[key].regional,
      };
    }

    return updatedLabels;
  }

  // You can map passedData to match your extractedData fields
  const extractedData = {
    address: passedData?.address || null,
    certificate: passedData?.certificate || "Birth Certificate",
    date_of_birth: passedData?.date_of_birth || "",
    date_of_death: passedData?.date_of_death || null,
    date_of_issue: passedData?.date_of_issue || "",
    date_of_registration: passedData?.date_of_registration || "",
    father_name: passedData?.father_name || "",
    mother_name: passedData?.mother_name || "",
    name: passedData?.name || "",
    office_seal_present: passedData?.office_seal_present || false,
    place_of_birth: passedData?.place_of_birth || "",
    registration_number: passedData?.registration_number || "",
    sex: passedData?.sex || "",
  };
//   console.log("extractedData:",extractedData);

  const handleTranslate = async ({ labels, data, language }) => {
    console.log("labels", labels);
    console.log("data", data);
    console.log(`Translating to ${language}...`);
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      const raw = JSON.stringify({
        data: data,
        lang: language,
      });
      
      const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders,
      };
      
      const response = await fetch("http://127.0.0.1:5000/api/translate", requestOptions);
      const result = await response.text();
      const translatedData = JSON.parse(result).data;
      
      // Get translated labels
      const translatedLabels = applyTranslation(language);
      console.log(translatedLabels,translatedData);
      // Return the translated content to be used by the useEffect
      return {
        translatedLabels: translatedLabels,
        translatedData: translatedData
      };
    } catch (error) {
      console.log("error", error);
      throw error; // Re-throw to be caught by the caller
    }
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
    { code: "punjabi", name: "Punjabi" },
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
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        {passedData && Object.keys(passedData).length > 0 && (
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Download as PDF
                    </button>
                )}
      </div>

      <div ref={birthCertificateRef}>
                {passedData && (
                    <BirthCertificate
                    data={extractedData}
                    dataId={pageId}
                    labels={defaultLabels}
                    language={language}
                    onTranslate={handleTranslate}
                    
                    />
                )}
            </div>
    </div>
  );
};

export default BirthCertificatePublic;
