import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { wishlistService } from '../services/wishlist';
import ProductModal from './ProductModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image_url: string;
  metadata?: any;
  category?: {
    name: string;
  };
  average_rating?: number;
  review_count?: number;
}

const ProductShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const products: Product[] = [
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Organic Apples',
      description: 'Fresh, crispy organic apples sourced directly from certified organic farms. Rich in fiber, vitamins, and antioxidants.',
      price: 120,
      inventory: 50,
      image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '1 kg', origin: 'Kashmir', organic: true },
      average_rating: 4.5,
      review_count: 178,
      category: { name: 'Fruits & Vegetables' }
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440008',
      name: 'Fresh Chicken',
      description: 'Premium quality fresh chicken, antibiotic-free and sourced from trusted farms. Perfect for healthy meals.',
      price: 280,
      inventory: 20,
      image_url: 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '1 kg', cut: 'whole', antibiotic_free: true },
      average_rating: 4.7,
      review_count: 95,
      category: { name: 'Meat & Seafood' }
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440007',
      name: 'Paneer',
      description: 'Fresh homemade paneer made from pure milk. Rich in protein and perfect for Indian cuisine.',
      price: 95,
      inventory: 25,
      image_url: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '200g', homemade: true },
      average_rating: 4.4,
      review_count: 112,
      category: { name: 'Dairy & Eggs' }
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'Mixed Vegetables',
      description: 'A perfect mix of seasonal vegetables, freshly harvested and carefully selected for quality.',
      price: 80,
      inventory: 30,
      image_url: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '500g', variety: 'seasonal' },
      average_rating: 4.3,
      review_count: 87,
      category: { name: 'Fruits & Vegetables' }
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440010',
      name: 'Brown Bread',
      description: 'Wholesome brown bread made with whole wheat flour. Rich in fiber and perfect for healthy breakfast.',
      price: 45,
      inventory: 35,
      image_url: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '400g', whole_wheat: true },
      average_rating: 4.6,
      review_count: 203,
      category: { name: 'Bakery' }
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440018',
      name: 'Basmati Rice',
      description: 'Premium quality Basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulao.',
      price: 450,
      inventory: 30,
      image_url: 'https://images.pexels.com/photos/33355/grain-de-riz-riz-cereales-aliments.jpg?auto=compress&cs=tinysrgb&w=500',
      metadata: { weight: '5 kg', aged: '2 years', premium: true },
      average_rating: 4.8,
      review_count: 156,
      category: { name: 'Household' }
    }
  ];

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextProducts = () => {
    setCurrentIndex(Math.min(currentIndex + 1, maxIndex));
  };

  const prevProducts = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const toggleLike = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;
    
    try {
      await wishlistService.toggleWishlist(user.id, productId);
      const newLikedProducts = new Set(likedProducts);
      if (newLikedProducts.has(productId)) {
        newLikedProducts.delete(productId);
      } else {
        newLikedProducts.add(productId);
      }
      setLikedProducts(newLikedProducts);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;
    
    try {
      await addToCart(productId, 1);
      
    // Add ripple effect
    const button = e.currentTarget as HTMLButtonElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-montserrat text-gray-900 mb-2">
              Best Sellers
            </h2>
            <p className="text-gray-600">Most loved products by our customers</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={prevProducts}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextProducts}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-1/2 sm:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
                onClick={() => handleProductClick(product)}
              >
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Fresh
                    </span>
                    
                    {/* Wishlist */}
                    <button
                      onClick={(e) => toggleLike(product.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        likedProducts.has(product.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'
                      } hover:scale-110`}
                    >
                      <Heart size={16} fill={likedProducts.has(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 fill-current" size={14} />
                        <span className="text-yellow-600 text-sm font-medium ml-1">
                          {product.average_rating}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm ml-1">({product.review_count})</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{product.metadata?.weight || 'Per unit'}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      </div>
                      
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 overflow-hidden"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="bg-yellow-400 text-black font-semibold py-3 px-8 rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            View All Products
          </button>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductShowcase;