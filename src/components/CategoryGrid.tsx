import React from 'react';
import { Apple, Milk, Beef, Cookie, Candy, Coffee, UtensilsCrossed, Home } from 'lucide-react';
import { productService } from '../services/products';

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const categories = [
    {
      id: 'fruits-vegetables',
      name: 'Fruits & Vegetables',
      items: '500+ items',
      discount: 'Up to 20% off',
      icon: Apple,
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'dairy-eggs',
      name: 'Dairy & Eggs',
      items: '200+ items',
      discount: 'Up to 15% off',
      icon: Milk,
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
      image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'meat-seafood',
      name: 'Meat & Seafood',
      items: '150+ items',
      discount: 'Fresh daily',
      icon: Beef,
      bgColor: 'bg-gradient-to-br from-red-400 to-red-600',
      image: 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'bakery',
      name: 'Bakery',
      items: '100+ items',
      discount: 'Baked fresh',
      icon: Cookie,
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
      image: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'snacks-sweets',
      name: 'Snacks & Sweets',
      items: '300+ items',
      discount: 'Buy 2 Get 1',
      icon: Candy,
      bgColor: 'bg-gradient-to-br from-pink-400 to-pink-600',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'beverages',
      name: 'Beverages',
      items: '250+ items',
      discount: 'Up to 25% off',
      icon: Coffee,
      bgColor: 'bg-gradient-to-br from-amber-400 to-amber-600',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'ready-to-cook',
      name: 'Ready to Cook',
      items: '180+ items',
      discount: 'Quick meals',
      icon: UtensilsCrossed,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
      id: 'household',
      name: 'Household',
      items: '400+ items',
      discount: 'Essentials',
      icon: Home,
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
      image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    }
  ];

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await productService.getCategories();
        if (data && data.length > 0) {
          // Map database categories to display format
          const mappedCategories = data.map(cat => ({
            id: cat.id,
            name: cat.name,
            items: '100+ items', // This would come from a count query
            discount: 'Fresh daily',
            icon: getIconForCategory(cat.name),
            bgColor: getBgColorForCategory(cat.name),
            image: cat.icon_url || getDefaultImageForCategory(cat.name)
          }));
          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getIconForCategory = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'Fruits & Vegetables': Apple,
      'Dairy & Eggs': Milk,
      'Meat & Seafood': Beef,
      'Bakery': Cookie,
      'Snacks & Sweets': Candy,
      'Beverages': Coffee,
      'Ready to Cook': UtensilsCrossed,
      'Household': Home
    };
    return iconMap[name] || Apple;
  };

  const getBgColorForCategory = (name: string) => {
    const colorMap: { [key: string]: string } = {
      'Fruits & Vegetables': 'bg-gradient-to-br from-green-400 to-green-600',
      'Dairy & Eggs': 'bg-gradient-to-br from-blue-400 to-blue-600',
      'Meat & Seafood': 'bg-gradient-to-br from-red-400 to-red-600',
      'Bakery': 'bg-gradient-to-br from-orange-400 to-orange-600',
      'Snacks & Sweets': 'bg-gradient-to-br from-pink-400 to-pink-600',
      'Beverages': 'bg-gradient-to-br from-amber-400 to-amber-600',
      'Ready to Cook': 'bg-gradient-to-br from-purple-400 to-purple-600',
      'Household': 'bg-gradient-to-br from-gray-400 to-gray-600'
    };
    return colorMap[name] || 'bg-gradient-to-br from-green-400 to-green-600';
  };

  const getDefaultImageForCategory = (name: string) => {
    const imageMap: { [key: string]: string } = {
      'Fruits & Vegetables': 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Dairy & Eggs': 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Meat & Seafood': 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Bakery': 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Snacks & Sweets': 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Beverages': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Ready to Cook': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      'Household': 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=500'
    };
    return imageMap[name] || 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500';
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-40 sm:h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-gray-900 mb-4">
            Shop by <span className="text-green-600">Category</span>
          </h2>
          <p className="text-lg text-gray-600">
            Discover fresh groceries and daily essentials organized just for you
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative overflow-hidden rounded-2xl ${category.bgColor} p-6 h-40 sm:h-48 flex flex-col justify-between`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                      <IconComponent className="text-white" size={20} />
                    </div>
                    <span className="text-xs font-medium text-white bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {category.discount}
                    </span>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-white font-semibold text-sm sm:text-base font-montserrat mb-1 group-hover:text-yellow-200 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white text-xs opacity-90">
                      {category.items}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;