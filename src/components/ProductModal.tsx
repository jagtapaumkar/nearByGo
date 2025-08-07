import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/products';
import { wishlistService } from '../services/wishlist';

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

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (product && isOpen) {
      loadSimilarProducts();
      checkWishlistStatus();
    }
  }, [product, isOpen, user]);

  const loadSimilarProducts = async () => {
    if (!product) return;
    
    try {
      const { data } = await productService.getSimilarProducts(product.id, product.category?.name, 4);
      setSimilarProducts(data || []);
    } catch (error) {
      console.error('Error loading similar products:', error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || !product) return;
    const { data } = await wishlistService.isInWishlist(user.id, product.id);
    setIsLiked(data || false);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    if (!product || !user) return;
    
    setLoading(true);
    try {
      await addToCart(product.id, quantity);
      // Show success message or close modal
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !product) return;
    
    try {
      await wishlistService.toggleWishlist(user.id, product.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-2 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold font-montserrat text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Stock Badge */}
                {product.inventory > 0 ? (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
                
                {/* Wishlist */}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white bg-opacity-90 text-gray-600 hover:bg-red-500 hover:text-white'
                  } hover:scale-110 shadow-lg`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={18} />
                    <span className="text-yellow-600 font-medium ml-1">{product.average_rating || 0}</span>
                  </div>
                  <span className="text-gray-500 ml-2">({product.review_count || 0} reviews)</span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold font-montserrat text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg">{product.metadata?.weight || 'Per unit'}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.inventory < 10 && product.inventory > 0 && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-2 py-1 rounded">
                    Only {product.inventory} left
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} className={quantity <= 1 ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                    >
                      <Plus size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-600">Total: ₹{product.price * quantity}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || product.inventory === 0}
              >
                <ShoppingCart size={20} />
                <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-xl font-semibold font-montserrat text-gray-900 mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Fresh Guarantee</h4>
                <p className="text-green-700 text-sm">100% fresh products with quality assurance</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Fast Delivery</h4>
                <p className="text-blue-700 text-sm">Delivered within 30 minutes to your doorstep</p>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold font-montserrat text-gray-900 mb-6">Similar Products</h3>

            {similarProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProducts.map((similarProduct) => (
                  <div
                    key={similarProduct.id}
                    className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                      <div className="relative overflow-hidden">
                        <img
                          src={similarProduct.image_url}
                          alt={similarProduct.name}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Fresh
                        </span>
                      </div>
                      
                      <div className="p-3">
                        <div className="flex items-center mb-1">
                          <Star className="text-yellow-400 fill-current" size={12} />
                          <span className="text-yellow-600 text-xs font-medium ml-1">
                            {similarProduct.average_rating || 0}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors duration-200">
                          {similarProduct.name}
                        </h4>
                        <p className="text-gray-500 text-xs mb-2">{similarProduct.metadata?.weight || 'Per unit'}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-bold text-gray-900">₹{similarProduct.price}</span>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No similar products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;