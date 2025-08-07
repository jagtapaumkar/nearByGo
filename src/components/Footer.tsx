import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ChevronDown, Shield, Truck, Clock, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState('');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
    alert('Thank you for subscribing!');
  };

  const faqs = [
    {
      question: 'What are your delivery hours?',
      answer: 'We deliver 24/7 within 30 minutes in most areas. Some locations may have specific time slots.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is confirmed, you\'ll receive a tracking link via SMS and email to monitor your delivery in real-time.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.'
    },
    {
      question: 'Do you have a minimum order value?',
      answer: 'No minimum order value. However, free delivery is available on orders above ₹500.'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Indicators */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold font-montserrat">30-Min Delivery</h4>
                <p className="text-gray-400 text-sm">Lightning fast service</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold font-montserrat">Quality Assured</h4>
                <p className="text-gray-400 text-sm">Fresh & premium products</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold font-montserrat">Secure Payments</h4>
                <p className="text-gray-400 text-sm">Multiple payment options</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <Headphones className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold font-montserrat">Easy Ordering</h4>
                <p className="text-gray-400 text-sm">User-friendly app</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold font-montserrat bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                Nearby
              </span>
              <span className="text-3xl font-bold font-montserrat text-yellow-400">
                Now
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for fresh groceries and daily essentials. We bring quality products to your doorstep in just 30 minutes.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Phone size={16} className="mr-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <Mail size={16} className="mr-3" />
                <span>support@nearbynow.com</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <MapPin size={16} className="mr-3" />
                <span>Mumbai, Delhi, Bangalore, Pune</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold font-montserrat mb-6">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Blog', 'Investor Relations'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold font-montserrat mb-6">Customer Care</h3>
            <ul className="space-y-3">
              {['Help Center', 'Track Your Order', 'Returns & Refunds', 'Contact Us', 'Feedback'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold font-montserrat mb-6">Categories</h3>
            <ul className="space-y-3">
              {['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Household Items'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center lg:text-left lg:mx-0">
            <h3 className="text-lg font-semibold font-montserrat mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Get the latest offers and updates directly in your inbox</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-r-lg font-semibold transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <h3 className="text-lg font-semibold font-montserrat mb-6 text-center lg:text-left">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-800 rounded-lg">
                <button
                  onClick={() => toggleSection(`faq-${index}`)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors duration-200"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`transform transition-transform duration-200 ${
                      expandedSections.has(`faq-${index}`) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {expandedSections.has(`faq-${index}`) && (
                  <div className="px-4 pb-4 text-gray-400 animate-in slide-in-from-top-2 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 lg:mb-0">
              © 2024 NearbyNow. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'YouTube' }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-200"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>We accept:</span>
                <div className="flex space-x-2">
                  <div className="bg-white text-black px-2 py-1 rounded text-xs font-semibold">VISA</div>
                  <div className="bg-white text-black px-2 py-1 rounded text-xs font-semibold">MC</div>
                  <div className="bg-white text-black px-2 py-1 rounded text-xs font-semibold">UPI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;