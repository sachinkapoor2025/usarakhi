import Link from 'next/link'

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Best Rakhi Gifts for Brothers in USA 2024',
      excerpt: 'Discover the top Rakhi gift ideas for your brother living in USA. From traditional to modern, find the perfect Raksha Bandhan gift.',
      category: 'Gift Ideas',
      readTime: '5 min read',
      image: '/images/blog-rakhi-gifts.jpg',
      slug: 'best-rakhi-gifts-brothers-usa',
      publishedDate: '2024-07-15'
    },
    {
      id: 2,
      title: 'How to Send Rakhi from India to USA: Complete Guide',
      excerpt: 'Step-by-step guide on sending Rakhi from India to USA. Learn about shipping options, delivery timelines, and tips for NRI families.',
      category: 'Shipping Guide',
      readTime: '8 min read',
      image: '/images/blog-send-rakhi-usa.jpg',
      slug: 'send-rakhi-india-usa-guide',
      publishedDate: '2024-07-10'
    },
    {
      id: 3,
      title: 'Raksha Bandhan Ideas for NRI Families',
      excerpt: 'Creative ways to celebrate Raksha Bandhan when separated by distance. Virtual celebrations, gift ideas, and emotional connection tips.',
      category: 'Celebration Ideas',
      readTime: '6 min read',
      image: '/images/blog-nri-celebration.jpg',
      slug: 'raksha-bandhan-nri-families',
      publishedDate: '2024-07-20'
    },
    {
      id: 4,
      title: 'Rakhi Delivery Guide USA: Timelines & Options',
      excerpt: 'Everything you need to know about Rakhi delivery in USA. Same day, express, and standard delivery options explained.',
      category: 'Delivery Guide',
      readTime: '4 min read',
      image: '/images/blog-delivery-guide.jpg',
      slug: 'rakhi-delivery-usa-guide',
      publishedDate: '2024-07-05'
    },
    {
      id: 5,
      title: 'Traditional vs Modern Rakhi: What to Choose?',
      excerpt: 'Compare traditional and modern Rakhi designs. Learn which style suits your brother best and the significance behind each type.',
      category: 'Rakhi Guide',
      readTime: '3 min read',
      image: '/images/blog-traditional-modern.jpg',
      slug: 'traditional-vs-modern-rakhi',
      publishedDate: '2024-07-12'
    },
    {
      id: 6,
      title: 'Rakhi Gift Combos That Will Make Your Brother Smile',
      excerpt: 'Explore the best Rakhi gift combinations that go beyond just the thread. Perfect for making Raksha Bandhan extra special.',
      category: 'Gift Combos',
      readTime: '5 min read',
      image: '/images/blog-gift-combos.jpg',
      slug: 'rakhi-gift-combos-brother',
      publishedDate: '2024-07-18'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Header */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Raksha Bandhan Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your guide to celebrating Raksha Bandhan across oceans. Tips, ideas, and stories 
              to make your bond stronger, no matter the distance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                Gift Ideas
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                Shipping Guide
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                NRI Tips
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                Celebration Ideas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="aspect-video bg-gray-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      {new Date(post.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Celebrating Raksha Bandhan Across Oceans
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Raksha Bandhan is more than just a festival; it's a celebration of the 
                  unbreakable bond between siblings. For NRIs living in USA, this festival 
                  holds special significance as it connects them to their roots and loved ones 
                  back home.
                </p>
                <p>
                  At Usa Rakhi, we understand the emotional value of this festival. That's why 
                  we've made it our mission to bridge the distance between siblings separated 
                  by oceans, ensuring that no brother misses receiving his sister's love and 
                  blessings on this special day.
                </p>
                <p>
                  Whether you're looking for traditional Rakhis that remind you of home or 
                  modern designs that suit your brother's style, our collection has something 
                  for every taste and preference.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Shop Rakhi Collection
                </Link>
                <Link
                  href="/contact"
                  className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Get Personalized Help
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Same day and express delivery options available across USA
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Authentic Quality</h3>
                <p className="text-gray-600 text-sm">
                  Handcrafted Rakhis made with traditional techniques from India
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Gift Combos</h3>
                <p className="text-gray-600 text-sm">
                  Complete gift packages with chocolates, dry fruits, and more
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                <p className="text-gray-600 text-sm">
                  Dedicated support team to help with your Rakhi shopping
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated for Raksha Bandhan
          </h2>
          <p className="text-gray-300 mb-8">
            Get the latest Rakhi trends, delivery updates, and special offers 
            delivered to your inbox. Don't miss out on early bird discounts!
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  )
}