import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="py-16 md:py-12">

          {/* Top Section - Brand & Description */}
          <div className="mb-12 pb-12 border-b border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
                  YURAA
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed max-w-md">
                  Crafting timeless elegance through premium fabrics and meticulous attention to detail.
                </p>
              </div>
              <div className="flex flex-col md:items-end gap-3 text-sm">
                <a href="mailto:yura.info.co@gmail.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-light">yura.info.co@gmail.com</span>
                </a>
                <a href="https://instagram.com/_yuraaclothing_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  <span className="font-light">@_yuraaclothing_</span>
                </a>
                <a href="https://www.linkedin.com/in/yuraaclothing/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="font-light">YURAA Clothing</span>
                </a>
              </div>
            </div>
          </div>

          {/* Links Section */}
          {/* Desktop: All links in one row */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <a href="/collections" className="text-gray-400 hover:text-white font-light transition-colors">
                All Kurties
              </a>
              <span className="text-gray-700">•</span>
              <a href="/collections" className="text-gray-400 hover:text-white font-light transition-colors">
                New Arrivals
              </a>
              <span className="text-gray-700">•</span>
              <a href="/information/size-guide" className="text-gray-400 hover:text-white font-light transition-colors">
                Size Guide
              </a>
              <span className="text-gray-700">•</span>
              <a href="/information/our-story" className="text-gray-400 hover:text-white font-light transition-colors">
                Our Story
              </a>
              <span className="text-gray-700">•</span>
              <a href="/information/shopping-guide" className="text-gray-400 hover:text-white font-light transition-colors">
                Shopping Guide
              </a>
              <span className="text-gray-700">•</span>
              <a href="/information/returns" className="text-gray-400 hover:text-white font-light transition-colors">
                Returns
              </a>
              <span className="text-gray-700">•</span>
              <a href="/legal/terms-conditions" className="text-gray-400 hover:text-white font-light transition-colors">
                Terms & Conditions
              </a>
              <span className="text-gray-700">•</span>
              <a href="/legal/privacy-policy" className="text-gray-400 hover:text-white font-light transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-700">•</span>
              <a href="/legal/shipping-delivery" className="text-gray-400 hover:text-white font-light transition-colors">
                Shipping & Delivery
              </a>
            </div>
          </div>

          {/* Mobile: Organized by sections */}
          <div className="md:hidden space-y-8">

            {/* Shop */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Shop
              </h4>
              <div className="space-y-3">
                <a href="/collections" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  All Kurties
                </a>
                <a href="/collections" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  New Arrivals
                </a>
                <a href="/information/size-guide" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Size Guide
                </a>
              </div>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Information
              </h4>
              <div className="space-y-3">
                <a href="/information/our-story" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Our Story
                </a>
                <a href="/information/shopping-guide" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Shopping Guide
                </a>
                <a href="/information/returns" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Returns & Exchanges
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                Legal
              </h4>
              <div className="space-y-3">
                <a href="/legal/terms-conditions" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Terms & Conditions
                </a>
                <a href="/legal/privacy-policy" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Privacy Policy
                </a>
                <a href="/legal/shipping-delivery" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Shipping & Delivery
                </a>
                <a href="/legal/cancellation-refund" className="block text-sm text-gray-400 hover:text-white font-light transition-colors">
                  Cancellation & Refund
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-gray-500 font-light">
              © {new Date().getFullYear()} YURAA. All rights reserved.
            </p>
            <p className="text-gray-600 font-light">
              Mumbai, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;