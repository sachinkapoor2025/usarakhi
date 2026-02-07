'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
              <Button onClick={() => router.push('/admin/products')}>Products</Button>
              <Button onClick={() => router.push('/admin/orders')}>Orders</Button>
              <Button variant="outline" onClick={() => router.push('/')}>View Store</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle>Products</CardTitle>
            <Button onClick={() => setIsAddingProduct(!isAddingProduct)}>
              {isAddingProduct ? 'Cancel' : 'Add Product'}
            </Button>
          </CardHeader>
          
          {/* Add Product Form */}
          {isAddingProduct && (
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={3} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" name="stock" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedDays">Estimated Delivery Days</Label>
                    <Input id="estimatedDays" name="estimatedDays" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="availableZipCodes">Available ZIP Codes (comma-separated)</Label>
                    <Input id="availableZipCodes" name="availableZipCodes" />
                  </div>
                </div>
                
                <Button type="submit">Create Product</Button>
              </form>
            </CardContent>
          )}

          {/* Products List */}
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No products found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary-600">${product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}