import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const categories = [
    {
      name: 'Send Rakhi to USA',
      description: 'Traditional and modern Rakhi designs for your brother in USA',
      image: '/images/rakhi-category.jpg',
      href: '/products?category=rakhi',
    },
    {
      name: 'Rakhi + Chocolate Combo USA',
      description: 'Perfect Rakhi gift for your sibling in USA',
      image: '/images/chocolate-combo.jpg',
      href: '/products?category=chocolate-combo',
    },
    {
      name: 'Rakhi + Roli + Moli USA',
      description: 'Complete Raksha Bandhan kit for NRI families',
      image: '/images/roli-moli.jpg',
      href: '/products?category=roli-moli',
    },
    {
      name: 'Rakhi + Flowers USA',
      description: 'Elegant floral arrangements with Rakhi for USA delivery',
      image: '/images/flowers.jpg',
      href: '/products?category=flowers',
    },
    {
      name: 'Premium Rakhi Hampers USA',
      description: 'Luxury gift hampers for Raksha Bandhan in USA',
      image: '/images/hampers.jpg',
      href: '/products?category=hampers',
    },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: 'Golden Thread Rakhi - USA Delivery',
      price: 25.99,
      image: '/images/golden-rakhi.jpg',
      description: 'Elegant golden thread Rakhi with traditional design, shipped from India to USA',
    },
    {
      id: 2,
      name: 'Silver Pearl Rakhi - USA Shipping',
      price: 29.99,
      image: '/images/silver-rakhi.jpg',
      description: 'Beautiful silver pearl Rakhi with intricate details, perfect for brothers in USA',
    },
    {
      id: 3,
      name: 'Premium Designer Combo - USA',
      price: 49.99,
      image: '/images/designer-combo.jpg',
      description: 'Premium Rakhi with chocolate and dry fruits, same day delivery in USA',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Rakhi Delivery in USA
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Celebrate Raksha Bandhan with authentic Indian Rakhis delivered 
                to your doorstep across the USA. Fast shipping, premium quality, 
                and best prices guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Shop Now
                </Link>
                <Link
                  href="/categories"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl transform rotate-6"></div>
              <Image
                src="/images/hero-rakhi.jpg"
                alt="Rakhi Collection"
                width={600}
                height={400}
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect Rakhi for your loved ones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <span className="text-primary-600 font-medium group-hover:text-primary-700">
                  View Products →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Our most popular Rakhis and gift combinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="aspect-square bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-300">
              We're committed to making your Raksha Bandhan celebration special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-400 text-sm">
                Express shipping across USA with tracking
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">
                Authentic Indian craftsmanship and materials
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-400 text-sm">
                Safe and secure payment processing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Care</h3>
              <p className="text-gray-400 text-sm">
                Dedicated support for all your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Celebrate Raksha Bandhan?
          </h2>
          <p className="text-lg mb-8 text-primary-100">
            Order your Rakhis today and make this festival unforgettable for your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}