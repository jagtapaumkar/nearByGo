import React, { useState } from 'react';
import { Apple, Milk, Beef, Cookie, Candy, Coffee, Sparkles, ChevronDown } from 'lucide-react';

interface NavigationProps {
  isMobileOpen: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobileOpen }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const categories = [
    { 
      id: 'fruits-vegetables', 
      name: 'Fruits & Vegetables', 
      icon: Apple, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      subcategories: ['Fresh Fruits', 'Leafy Greens', 'Seasonal Vegetables', 'Organic Options']
    },
    { 
      id: 'dairy-eggs', 
      name: 'Dairy & Eggs', 
      icon: Milk, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      subcategories: ['Milk & Cream', 'Cheese', 'Yogurt', 'Fresh Eggs']
    },
    { 
      id: 'meat-seafood', 
      name: 'Meat & Seafood', 
      icon: Beef, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      subcategories: ['Fresh Chicken', 'Mutton', 'Fish', 'Prawns']
    },
    { 
      id: 'bakery', 
      name: 'Bakery', 
      icon: Cookie, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      subcategories: ['Fresh Bread', 'Cakes', 'Cookies', 'Pastries']
    },
    { 
      id: 'snacks-sweets', 
      name: 'Snacks & Sweets', 
      icon: Candy, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      subcategories: ['Chips & Crackers', 'Traditional Sweets', 'Chocolates', 'Nuts']
    },
    { 
      id: 'beverages', 
      name: 'Beverages', 
      icon: Coffee, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      subcategories: ['Tea & Coffee', 'Juices', 'Soft Drinks', 'Energy Drinks']
    },
    { 
      id: 'special-offers', 
      name: 'Special Offers', 
      icon: Sparkles, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      subcategories: ['Daily Deals', 'Combo Offers', 'Bulk Discounts', 'Flash Sales']
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${category.bgColor} ${category.color} hover:transform hover:scale-105`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{category.name}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {activeDropdown === category.id && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 py-2 w-48 animate-in slide-in-from-top-2 duration-200 z-50">
                      {category.subcategories.map((subcategory, index) => (
                        <button
                          key={index}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-200">
          <div className="bg-white w-80 h-full overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6 mt-16">
              <h2 className="text-lg font-semibold font-montserrat mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id}>
                      <button
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${category.bgColor} ${category.color}`}
                        onClick={() => setActiveDropdown(activeDropdown === category.id ? null : category.id)}
                      >
                        <IconComponent size={20} />
                        <span className="font-medium flex-1 text-left">{category.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {activeDropdown === category.id && (
                        <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {category.subcategories.map((subcategory, index) => (
                            <button
                              key={index}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors duration-150"
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;