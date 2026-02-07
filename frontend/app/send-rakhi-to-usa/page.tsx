import Link from 'next/link'
import Image from 'next/image'

export default function SendRakhiToUSA() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Send Rakhi to USA from India
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Fast Rakhi delivery across USA with same day and express options. 
                Celebrate Raksha Bandhan with your brother no matter where he is.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Same day delivery in major US cities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Express shipping across all USA states</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Authentic Indian Rakhis shipped from India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Gift combos with chocolates and dry fruits</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Shop Rakhi Collection
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
                >
                  Get Delivery Help
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl transform rotate-6"></div>
              <Image
                src="/images/send-rakhi-hero.jpg"
                alt="Send Rakhi to USA"
                width={600}
                height={400}
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rakhi Delivery Options in USA
            </h2>
            <p className="text-lg text-gray-600">
              Choose the perfect delivery option for your Raksha Bandhan celebration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Same Day Delivery
              </h3>
              <p className="text-gray-600 mb-6">
                Available in major US cities including New York, Los Angeles, Chicago, 
                Houston, Phoenix, and more. Order by 12 PM for same day delivery.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Fastest delivery option</p>
                <p>• Perfect for last minute orders</p>
                <p>• Track your order in real-time</p>
              </div>
              <Link
                href="/products"
                className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Order Now
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Express Delivery
              </h3>
              <p className="text-gray-600 mb-6">
                2-3 business days delivery across all USA states. Reliable and fast 
                shipping with tracking.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Covers all US states</p>
                <p>• Guaranteed delivery time</p>
                <p>• Professional packaging</p>
              </div>
              <Link
                href="/products"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Order Now
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Standard Delivery
              </h3>
              <p className="text-gray-600 mb-6">
                5-7 business days delivery. Most economical option with reliable service.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Best value for money</p>
                <p>• Trackable shipping</p>
                <p>• Safe and secure</p>
              </div>
              <Link
                href="/products"
                className="inline-block mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Send Rakhi to USA
            </h2>
            <p className="text-lg text-gray-600">
              Simple 4-step process to send Rakhi from India to USA
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Rakhi</h3>
              <p className="text-gray-600">
                Browse our collection and select the perfect Rakhi for your brother
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Cart</h3>
              <p className="text-gray-600">
                Add to cart and customize with gift options if desired
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h3>
              <p className="text-gray-600">
                Complete checkout with secure payment and delivery details
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Delivery</h3>
              <p className="text-gray-600">
                Track your Rakhi delivery and ensure it reaches on time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cities We Serve in USA
            </h2>
            <p className="text-lg text-gray-300">
              Fast Rakhi delivery to major cities across the United States
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
              'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
              'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
              'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
              'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA',
              'Nashville, TN', 'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV',
              'Detroit, MI', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
              'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA',
              'Mesa, AZ', 'Sacramento, CA', 'Atlanta, GA', 'Kansas City, MO',
              'Colorado Springs, CO', 'Miami, FL', 'Raleigh, NC', 'Omaha, NE',
              'Long Beach, CA', 'Virginia Beach, VA', 'Oakland, CA', 'Minneapolis, MN',
              'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA', 'Wichita, KS',
              'Cleveland, OH', 'Tampa, FL', 'Bakersfield, CA', 'Aurora, CO'
            ].map((city) => (
              <div key={city} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-white">{city}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400">
              And many more cities across all 50 states! Contact us for delivery to your city.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from customers who sent Rakhi to their brothers in USA
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah K.</h4>
                  <p className="text-gray-600 text-sm">New York, USA</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I was worried about sending Rakhi to my brother in India, but Usa Rakhi 
                made it so easy! The Rakhi arrived on time and my brother was so happy. 
                Same day delivery in New York is amazing!"
              </p>
              <div className="flex text-yellow-400">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">R</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rahul P.</h4>
                  <p className="text-gray-600 text-sm">Los Angeles, USA</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Living in LA, I was missing the traditional Raksha Bandhan celebration. 
                Usa Rakhi sent me a beautiful traditional Rakhi from India with express 
                delivery. It felt like I was back home!"
              </p>
              <div className="flex text-yellow-400">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anita M.</h4>
                  <p className="text-gray-600 text-sm">Chicago, USA</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I ordered a Rakhi gift combo for my brother in Mumbai. The packaging 
                was beautiful and the delivery was right on time. My brother loved the 
                chocolates and dry fruits along with the Rakhi!"
              </p>
              <div className="flex text-yellow-400">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Send Rakhi to USA?
          </h2>
          <p className="text-lg mb-8 text-primary-100">
            Order now and make this Raksha Bandhan special for your brother. 
            Fast delivery, premium quality, and guaranteed satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Rakhi Collection
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get Delivery Help
            </Link>
          </div>
          <p className="text-primary-100 text-sm mt-4">
            Same day delivery available in major US cities. Order by 12 PM for same day delivery.
          </p>
        </div>
      </section>
    </div>
  )
}