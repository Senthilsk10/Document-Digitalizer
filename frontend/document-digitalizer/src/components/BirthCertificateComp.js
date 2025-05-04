import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
const DigitalSignature = () => {
  const textCanvasRef = useRef(null);
  const tickCanvasRef = useRef(null);

  // Format date similar to digital signature format
  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Get timezone offset in hours and format as +/-HH:00
    const tzOffset = -now.getTimezoneOffset() / 60;
    const tzSign = tzOffset >= 0 ? "+" : "-";
    const tzHours = String(Math.abs(Math.floor(tzOffset))).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}${tzSign}${tzHours}:00`;
  };

  // Render the signature text
  const renderText = (canvas) => {
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font for text
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Signature valid", 20, 30);

    ctx.font = "16px Arial";
    ctx.fillText("Digitally signed by Gov.", 20, 60);
    ctx.fillText(`Date: ${formatDate()}`, 20, 90);
    ctx.fillText("Reason: Digital services and Archieval", 20, 120);
    ctx.fillText("Location: India", 20, 150);
  };

  // Render the tick mark overlapping the text
  const renderTick = (canvas) => {
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set alpha for transparency
    ctx.globalAlpha = 0.6;

    // Calculate tick dimensions to span from 60% of width to end, full height
    const tickStartX = canvas.width * 0.3; // Start earlier for overlap
    const tickWidth = canvas.width * 0.7; // Larger width for overlap
    const tickHeight = canvas.height;

    // Save context state
    ctx.save();

    // Move to tick position and scale to fit
    ctx.translate(tickStartX + tickWidth / 2, tickHeight / 2);

    // Scale to fit desired dimensions
    const scale = Math.min(tickWidth, tickHeight) * 0.8;
    ctx.scale(scale / 100, scale / 100);

    // Draw tick
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(-10, 20);
    ctx.lineTo(30, -20);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#00b050"; // Green color
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Restore context state
    ctx.restore();
  };

  useEffect(() => {
    if (textCanvasRef.current && tickCanvasRef.current) {
      renderText(textCanvasRef.current);
      renderTick(tickCanvasRef.current);
    }
  }, []);

  return (
    <div className="relative w-full h-44 border border-black bg-white overflow-hidden">
      <canvas
        ref={textCanvasRef}
        width={400}
        height={180}
        className="absolute top-0 left-0"
      />
      <canvas
        ref={tickCanvasRef}
        width={400}
        height={180}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

const BirthCertificate = ({
  data,
  dataId,
  labels,
  language = "tamil", // Default language
  onTranslate = null, // Optional callback for translation
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
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
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
  }, [language]); //[language, labels, data, onTranslate] dont use so much dependencies 

  // Generate QR code URL
  const qrCodeUrl = `${window.location.origin}/storage/${
    dataId    || "unknown"
  }`;

  // Function to render text in both languages
  const renderBilingual = (english, regional) => (
    <>
      {english}
      <br />
      {regional}
    </>
  );

  return (
    <div className="bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 border-2 border-black">
        {/* Header */}
        <div className="flex justify-between items-center">
          <img src={"/tn-emblem.jpeg"} alt="Government Logo" className="h-20" />
          <img src={"/tn-gov.jpeg"} alt="State Logo" className="h-20" />
          <img src={"/tn-emblem.jpeg"} alt="Municipal Logo" className="h-20" />
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
              translatedLabels.deptTitle?.english ||
                "Department of Municipal Administration",
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
            {translatedLabels.legalText1?.regional ||
              "(பிறப்பு மற்றும் இறப்பு பதிவு சட்டம் கீழ் வழங்கப்படுகிறது)"}
          </p>
          <p className="mb-2">
            {translatedLabels.legalText1?.english ||
              "(ISSUED UNDER THE REGISTRATION OF BIRTHS & DEATHS ACT)"}
          </p>
        </div>

        {/* Data Section */}
        <div className="flex mt-6 text-sm uppercase">
          {/* Left Column */}
          <div className="w-1/2 pr-4">
            <p className="mb-4">
              {translatedLabels.name?.english || "Name"} /{" "}
              {translatedLabels.name?.regional || "பெயர்"}:{" "}
              {translatedData.name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.dateOfBirth?.english || "Date of Birth"} /{" "}
              {translatedLabels.dateOfBirth?.regional || "பிறந்த தேதி"}:{" "}
              {translatedData.date_of_birth || ""}
              <br />
              {formatDateInWords(translatedData.date_of_birth)}
            </p>
            <p className="mb-4">
              {translatedLabels.motherName?.english || "Name of Mother"} /{" "}
              {translatedLabels.motherName?.regional || "தாயின் பெயர்"}:{" "}
              {translatedData.mother_name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.birthAddress?.english ||
                "Address at Time of Birth"}{" "}
              /<br />
              {translatedLabels.birthAddress?.regional ||
                "பிறப்பின் போது முகவரி"}
              : <br />
              {translatedData.address || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.regNumber?.english || "Registration Number"} /{" "}
              {translatedLabels.regNumber?.regional || "பதிவு எண்"}:{" "}
              {translatedData.registration_number || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.issueDate?.english || "Date of Issue"} /{" "}
              {translatedLabels.issueDate?.regional || "வழங்கிய நாள்"}:{" "}
              {translatedData.date_of_issue || ""}
            </p>
          </div>

          {/* Right Column */}
          <div className="w-1/2 pl-4">
            <p className="mb-4">
              {translatedLabels.sex?.english || "Sex"} /{" "}
              {translatedLabels.sex?.regional || "பாலினம்"}:{" "}
              {translatedData.sex === "Male"
                ? `${translatedLabels.male?.english || "MALE"} / ${
                    translatedLabels.male?.regional || "ஆண்"
                  }`
                : translatedData.sex === "Female"
                ? `${translatedLabels.female?.english || "FEMALE"} / ${
                    translatedLabels.female?.regional || "பெண்"
                  }`
                : translatedData.sex || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.birthPlace?.english || "Place of Birth"} /{" "}
              {translatedLabels.birthPlace?.regional || "பிறந்த இடம்"}:{" "}
              {translatedData.place_of_birth || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.fatherName?.english || "Name of Father"} /{" "}
              {translatedLabels.fatherName?.regional || "தந்தையின் பெயர்"}:{" "}
              {translatedData.father_name || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.permAddress?.english || "Permanent Address"} /{" "}
              {translatedLabels.permAddress?.regional || "நிரந்தர முகவரி"}:
              <br />
              {translatedData.permanent_address || translatedData.address || ""}
            </p>
            <p className="mb-4">
              {translatedLabels.regDate?.english || "Date of Registration"} /{" "}
              {translatedLabels.regDate?.regional || "பதிவு செய்த தேதி"}:{" "}
              {translatedData.date_of_registration || ""}
            </p>

            {/* Digital Signature Box */}
            <div className="mb-4">
              <p className="font-bold mb-2">
                {translatedLabels.digitallySigned?.english ||
                  "Digitally Signed By"}
                :
              </p>
              <DigitalSignature />
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-6 flex items-center">
          <div className="w-24 h-24">
            <QRCodeSVG
              value={qrCodeUrl}
              size={96}
              level="H" // High error correction capability
              includeMargin={true}
            />
          </div>
          <span className="ml-4 text-sm text-gray-600">
            {translatedLabels.scanQR?.english || "Scan to verify certificate"}:{" "}
            {qrCodeUrl}
          </span>
        </div>

        {/* Validity and Footer */}
        <div className="text-right mt-6">
          <p className="text-2xl font-bold">
            {translatedLabels.validity?.english || "Validity"}:{" "}
            {translatedData.validity || "LIFETIME"}
          </p>
          <p className="mt-6 font-bold">
            {translatedLabels.issuingAuthority?.english || "Issuing Authority"}:{" "}
            {translatedLabels.registrar?.english || "Registrar (Birth & Death)"}
          </p>

          {/* {translatedData.office_seal_present && (
            <div className="mt-2 border-2 border-dashed border-gray-400 rounded-full w-24 h-24 flex items-center justify-center ml-auto">
              <span className="text-sm text-gray-500">Office Seal</span>
            </div>
          )} */}
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


export default BirthCertificate;