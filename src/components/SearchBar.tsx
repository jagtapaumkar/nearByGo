import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { productService } from '../services/products';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: {
    name: string;
  };
}

interface SearchBarProps {
  onProductSelect?: (product: Product) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onProductSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular search suggestions
  const popularSuggestions = [
    'Fresh apples',
    'Organic vegetables',
    'Dairy products',
    'Chicken breast',
    'Bread & bakery',
    'Basmati rice',
    'Fresh milk',
    'Mixed vegetables'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        setSuggestions(popularSuggestions);
        return;
      }

      setLoading(true);
      try {
        // Search products
        const { data: products } = await productService.getProducts({
          search: query,
          limit: 8
        });
        setResults(products || []);

        // Get search suggestions
        const { data: searchSuggestions } = await productService.getSearchSuggestions(query, 5);
        setSuggestions(searchSuggestions || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleProductClick = (product: Product) => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
    onProductSelect?.(product);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions(popularSuggestions);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (query.length < 2) {
      setSuggestions(popularSuggestions);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className={`relative transition-all duration-300 ${isOpen ? 'transform scale-105' : ''}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search for products..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-yellow-50 hover:bg-yellow-100"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              <span className="mt-2 block">Searching...</span>
            </div>
          )}

          {!loading && query.length >= 2 && results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                Products ({results.length})
              </div>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                  </div>
                  <span className="font-semibold text-green-600">₹{product.price}</span>
                </button>
              ))}
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                {query.length < 2 ? 'Popular Searches' : 'Suggestions'}
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center"
                >
                  <Search size={16} className="mr-3 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <p>No products found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for something else</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;