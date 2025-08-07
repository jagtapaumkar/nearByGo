import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewService } from '../services/reviews';

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultTestimonials = [
    {
      id: 1,
      name: 'Vikram Singh',
      location: 'Pune',
      rating: 5,
      review: 'Best grocery delivery app! Fresh fruits and vegetables, great prices, and they never miss the delivery time.',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      orders: 45
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      review: 'Amazing service! Fresh vegetables delivered within 30 minutes. The quality is outstanding and the app is so easy to use.',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      orders: 32
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      location: 'Delhi',
      rating: 5,
      review: 'Reliable and fast delivery. The quality of meat and dairy products is excellent. Highly recommend NearbyNow!',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      orders: 67
    },
    {
      id: 4,
      name: 'Sneha Patel',
      location: 'Bangalore',
      rating: 5,
      review: 'Love the variety and freshness! The organic section is amazing and the prices are very competitive.',
      avatar: 'https://images.pexels.com/photos/1858176/pexels-photo-1858176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      orders: 28
    },
    {
      id: 5,
      name: 'Amit Gupta',
      location: 'Chennai',
      rating: 5,
      review: 'Excellent customer service and super fast delivery. The app interface is user-friendly and the quality is top-notch.',
      avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      orders: 51
    }
  ];

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const { data } = await reviewService.getFeaturedReviews(5);
        if (data && data.length > 0) {
          const formattedTestimonials = data.map(testimonial => ({
            ...testimonial,
            name: testimonial.profile?.full_name || 'Anonymous User',
            location: 'India',
            avatar: testimonial.profile?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
            orders: Math.floor(Math.random() * 50) + 10
          }));
          setTestimonials(formattedTestimonials);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-6"></div>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-gray-900 mb-4">
            What Our <span className="text-green-600">Customers</span> Say
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of happy customers who trust NearbyNow for their daily grocery needs
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105">
                      <div className="mb-6">
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-current" size={24} />
                          ))}
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed italic mb-6">
                          "{testimonial.review}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-green-200"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 font-montserrat">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 text-sm">{testimonial.location}</p>
                          <p className="text-green-600 text-sm font-medium">
                            {testimonial.orders} orders completed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 font-montserrat mb-2">
              50K+
            </div>
            <div className="text-gray-600 font-medium">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 font-montserrat mb-2">
              1M+
            </div>
            <div className="text-gray-600 font-medium">Orders Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 font-montserrat mb-2">
              4.8
            </div>
            <div className="text-gray-600 font-medium">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 font-montserrat mb-2">
              30min
            </div>
            <div className="text-gray-600 font-medium">Avg Delivery Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;