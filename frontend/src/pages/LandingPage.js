import { FileText, Download, Globe, ArrowRight, Check } from 'lucide-react';

export default function DocumentDigitizationLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="https://www.tn.gov.in/sites/default/Tamil_Nadu_emb.png" alt="Government Emblem" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold">Digital Document Portal</h1>
                <p className="text-blue-200">Government of India</p>
              </div>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#features" className="hover:text-blue-200">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-200">How It Works</a></li>
                <li><a href="#faq" className="hover:text-blue-200">FAQ</a></li>
                <li><a href="#contact" className="hover:text-blue-200">Contact</a></li>
              </ul>
            </nav>
            <a href="/app" className="bg-white text-blue-800 px-4 py-2 rounded font-medium hover:bg-blue-100 transition">Upload</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 md:flex items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">Transform Your Paper Documents Into Digital Format</h2>
            <p className="text-xl mb-6">Get your birth certificates and other important documents digitized, translated, and made accessible in just a few clicks.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/app" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#how-it-works" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">Learn More</a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="https://tamilnaduarchives.tn.gov.in/ASSETS/IMAGES/logo_en.jpg" alt="Document Digitization Illustration" className="max-w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Service Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="mb-4">
                <FileText size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Digitization</h3>
              <p className="text-gray-600">Convert your physical documents into high-quality digital formats that maintain all original information with accurate text recognition.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="mb-4">
                <Download size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">PDF Generation</h3>
              <p className="text-gray-600">Download your digitized documents as searchable PDF files that can be easily shared, stored, and used for official purposes.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="mb-4">
                <Globe size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Language Translation</h3>
              <p className="text-gray-600">Translate your documents into any regional language to improve accessibility and understanding across diverse populations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">Prepare Document</h3>
                <p className="text-gray-600 text-sm">With your details and verify your Data</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">Upload Document</h3>
                <p className="text-gray-600 text-sm">Upload a clear image or scan of your document</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Review & Translate</h3>
                <p className="text-gray-600 text-sm">Review the digitized version and select translation if needed</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">4</div>
                <h3 className="font-semibold mb-2">Download & Share</h3>
                <p className="text-gray-600 text-sm">Download your digital document in PDF format</p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <a href="/app" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Supported Documents</h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Birth Certificate', 'Marriage Certificate', 'Property Documents', 'Educational Certificates', 'Identity Cards', 'Address Proof'].map((doc) => (
              <div key={doc} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-800">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                q: "Is this service free to use?",
                a: "Yes, this is a free service provided by the government to all citizens."
              },
              {
                q: "How long does the digitization process take?",
                a: "Most documents are digitized within minutes. Complex documents may take up to 24 hours."
              },
              {
                q: "Are my documents secure?",
                a: "Yes, we use end-to-end encryption and follow strict privacy protocols to ensure your documents remain secure and private."
              },
              {
                q: "What languages are supported for translation?",
                a: "We support all 22 official languages recognized in the Indian Constitution."
              },
              {
                q: "Are the digitized documents legally valid?",
                a: "Yes, all digitized documents come with a digital verification seal that makes them legally valid for official purposes."
              }
            ].map((item, index) => (
              <div key={index} className="mb-6 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Need Help?</h2>
          <p className="text-center text-xl mb-8">Our support team is available to assist you</p>
          
          <div className="max-w-xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-blue-800 p-6 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Helpline</h3>
              <p className="text-blue-200">1800-XXX-XXXX</p>
              <p className="text-blue-200">(Mon-Sat, 9am-6pm)</p>
            </div>
            
            <div className="bg-blue-800 p-6 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-blue-200">support@digitaldocs.gov.in</p>
              <p className="text-blue-200">(24x7 Support)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="https://www.tn.gov.in/sites/default/Tamil_Nadu_emb.png" alt="Government Emblem" className="h-8" />
                <span className="font-bold text-white">Digital Document Portal</span>
              </div>
              <p className="text-sm">A government initiative to digitize important documents for all citizens.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {/* Social icons would go here */}
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Digital Document Portal. All rights reserved. Government of India.
          </div>
        </div>
      </footer>
    </div>
  );
}