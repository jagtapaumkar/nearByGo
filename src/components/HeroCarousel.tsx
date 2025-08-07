import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { bannerService } from '../services/banners';

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultSlides = [
    {
      id: 1,
      title: 'Fresh Groceries Delivered in 30 Minutes',
      subtitle: 'Get your daily essentials delivered super fast',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      cta: 'Order Now'
    },
    {
      id: 2,
      title: 'Fresh Organic Vegetables',
      subtitle: 'Farm-fresh produce delivered to your doorstep',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      cta: 'Shop Vegetables'
    },
    {
      id: 3,
      title: 'Premium Dairy Products',
      subtitle: 'Pure and fresh dairy from trusted farms',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      cta: 'Explore Dairy'
    }
  ];

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { data } = await bannerService.getActiveBanners();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          setBanners(defaultSlides);
        }
      } catch (error) {
        setBanners(defaultSlides);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  const slides = banners.length > 0 ? banners : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return <div className="h-96 sm:h-[500px] bg-gray-200 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="relative h-96 sm:h-[500px] overflow-hidden rounded-lg shadow-xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className={`h-full ${slide.bgColor} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${slide.image_url || slide.image})` }}
            ></div>
            
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="flex items-center mb-4">
                    <Clock className="text-white mr-2" size={20} />
                    <span className="text-white text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      30 Min Delivery
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-montserrat mb-4 animate-in slide-in-from-left duration-700">
                    {slide.title || slide.name}
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-white mb-8 opacity-90 animate-in slide-in-from-left duration-700 delay-200">
                    {slide.subtitle}
                  </p>
                  
                  <button className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-in slide-in-from-left duration-700 delay-400">
                    {slide.cta || 'Shop Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Features Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm">
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Free Delivery above ₹500
            </div>
            <div className="flex items-center text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              30-minute delivery
            </div>
            <div className="flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Fresh & Quality assured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;