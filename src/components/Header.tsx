import React, { useState } from 'react';
import { MapPin, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import SearchBar from './SearchBar';
import AuthModal from './AuthModal';
import ProductModal from './ProductModal';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getCartItemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden mr-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center group cursor-pointer">
              <span className="text-2xl font-bold font-montserrat bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
                Nearby
              </span>
              <span className="text-2xl font-bold font-montserrat text-yellow-400 transform group-hover:scale-105 transition-transform duration-300">
                Now
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="hidden sm:flex items-center text-gray-600 hover:text-green-600 cursor-pointer transition-colors duration-200">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">Deliver to Mumbai, 400001</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative">
            <SearchBar onProductSelect={handleProductSelect} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="hidden sm:flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200">
                  <User size={20} className="mr-1" />
                  <span className="text-sm">{user.profile?.full_name || 'Account'}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Addresses</a>
                    <hr className="my-1" />
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                <User size={20} className="mr-1" />
                <span className="text-sm">Sign In</span>
              </button>
            )}
            
            <button className="relative p-2 text-gray-700 hover:text-green-600 transition-colors duration-200">
              <ShoppingCart size={24} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      
      <ProductModal
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
      />
    </>
  );
};

export default Header;