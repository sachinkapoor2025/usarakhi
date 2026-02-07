'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Toaster, toast } from 'sonner'

export default function AdminPage() {
  const { user } = useAuthenticator((context) => [context.user])
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  // Check if user is admin (you would implement this logic)
  const isAdmin = user && user.attributes?.email === 'admin@usarakhi.com'

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    } else if (!isAdmin) {
      router.push('/')
    } else {
      fetchProducts()
    }
  }, [user, isAdmin, router])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Fetch products from API
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      sku: formData.get('sku'),
      stock: parseInt(formData.get('stock') as string),
      deliveryInfo: {
        estimatedDays: parseInt(formData.get('estimatedDays') as string),
        availableZipCodes: (formData.get('availableZipCodes') as string).split(',').map(code => code.trim())
      }
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast.success('Product created successfully')
        setIsAddingProduct(false)
        fetchProducts()
      } else {
        toast.error('Failed to create product')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => router.push('/admin/products')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => router.push('/admin/orders')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Orders
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Store
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Products</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Orders</div>
            <div className="text-2xl font-bold">0</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600 mb-2">Revenue</div>
            <div className="text-2xl font-bold">$0.00</div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-semibold">Products</h2>
            <button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
            >
              {isAddingProduct ? 'Cancel' : 'Add Product'}
            </button>
          </div>
          
          {/* Add Product Form */}
          {isAddingProduct && (
            <div className="p-6">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input 
                      id="name" 
                      name="name" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input 
                      id="sku" 
                      name="sku" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    rows={3} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input 
                      id="price" 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input 
                      id="stock" 
                      name="stock" 
                      type="number" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input 
                      id="category" 
                      name="category" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="estimatedDays" className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Days</label>
                    <input 
                      id="estimatedDays" 
                      name="estimatedDays" 
                      type="number" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="availableZipCodes" className="block text-sm font-medium text-gray-700 mb-1">Available ZIP Codes (comma-separated)</label>
                    <input 
                      id="availableZipCodes" 
                      name="availableZipCodes" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Product
                </button>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No products found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
