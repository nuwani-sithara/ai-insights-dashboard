'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface Product {
  id: number
  title: string
  category: string
  price: number
  stock: number
  brand?: string
  rating?: number
  subcategory?: string
}

interface AnalyticsData {
  totalProducts: number
  totalCategories: number
  averagePrice: number
  totalStock: number
  categoryCounts: Record<string, number>
  categoryDetails: Record<string, {
    count: number
    totalPrice: number
    totalStock: number
    averagePrice: number
    brands: string[]
    subcategories: string[]
  }>
  priceRanges: Record<string, number>
  stockRanges: Record<string, number>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching data from DummyJSON...')
      
      const response = await fetch('https://dummyjson.com/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // Debug: Log the actual response structure
      console.log('API Response:', responseData)
      console.log('Response type:', typeof responseData)
      console.log('Is array?', Array.isArray(responseData))
      
      // Handle the actual API response structure
      // DummyJSON returns { products: [...], total: number, skip: number, limit: number }
      const products: Product[] = responseData.products || responseData
      
      console.log('Products data:', products)
      console.log('Products type:', typeof products)
      console.log('Products is array?', Array.isArray(products))
      
      // Validate that we have an array of products
      if (!Array.isArray(products)) {
        throw new Error(`Invalid data format received from API. Expected array, got: ${typeof products}`)
      }
      
      if (products.length === 0) {
        throw new Error('No products data available')
      }
      
      // Process the data with enhanced analytics
      const categories = [...new Set(products.map(p => p.category))]
      const categoryCounts: Record<string, number> = {}
      const categoryDetails: Record<string, any> = {}
      const priceRanges: Record<string, number> = {
        'Under $10': 0,
        '$10 - $25': 0,
        '$25 - $50': 0,
        '$50 - $100': 0,
        'Over $100': 0
      }
      const stockRanges: Record<string, number> = {
        'Low (0-10)': 0,
        'Medium (11-50)': 0,
        'High (51-100)': 0,
        'Very High (100+)': 0
      }
      
      products.forEach(product => {
        if (product.category) {
          // Category counts
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1
          
          // Category details
          if (!categoryDetails[product.category]) {
            categoryDetails[product.category] = {
              count: 0,
              totalPrice: 0,
              totalStock: 0,
              brands: [],
              subcategories: []
            }
          }
          
          categoryDetails[product.category].count++
          categoryDetails[product.category].totalPrice += product.price || 0
          categoryDetails[product.category].totalStock += product.stock || 0
          
          // Extract brand from title (simple approach)
          const brandMatch = product.title.match(/^([A-Z][a-z]+)/)
          if (brandMatch && !categoryDetails[product.category].brands.includes(brandMatch[1])) {
            categoryDetails[product.category].brands.push(brandMatch[1])
          }
          
          // Extract subcategory from title (simple approach)
          const words = product.title.toLowerCase().split(' ')
          const subcategoryWords = words.filter(word => 
            word.length > 3 && 
            !['the', 'and', 'for', 'with', 'from'].includes(word)
          )
          if (subcategoryWords.length > 0) {
            const subcategory = subcategoryWords[0].charAt(0).toUpperCase() + subcategoryWords[0].slice(1)
            if (!categoryDetails[product.category].subcategories.includes(subcategory)) {
              categoryDetails[product.category].subcategories.push(subcategory)
            }
          }
        }
        
        // Price ranges
        if (product.price) {
          if (product.price < 10) priceRanges['Under $10']++
          else if (product.price < 25) priceRanges['$10 - $25']++
          else if (product.price < 50) priceRanges['$25 - $50']++
          else if (product.price < 100) priceRanges['$50 - $100']++
          else priceRanges['Over $100']++
        }
        
        // Stock ranges
        if (product.stock !== undefined) {
          if (product.stock <= 10) stockRanges['Low (0-10)']++
          else if (product.stock <= 50) stockRanges['Medium (11-50)']++
          else if (product.stock <= 100) stockRanges['High (51-100)']++
          else stockRanges['Very High (100+)']++
        }
      })
      
      // Calculate averages for each category
      Object.keys(categoryDetails).forEach(category => {
        const details = categoryDetails[category]
        details.averagePrice = Math.round(details.totalPrice / details.count * 100) / 100
      })
      
      const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0)
      const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
      
      const analyticsData: AnalyticsData = {
        totalProducts: products.length,
        totalCategories: categories.length,
        averagePrice: Math.round(totalPrice / products.length * 100) / 100,
        totalStock: totalStock,
        categoryCounts,
        categoryDetails,
        priceRanges,
        stockRanges
      }
      
      console.log('Processed analytics data:', analyticsData)
      setData(analyticsData)
      setProducts(products) // Store products in state
    } catch (err) {
      console.error('Analytics fetch error:', err)
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred while fetching data'
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the API. Please check your internet connection.'
        } else if (err.message.includes('HTTP error')) {
          errorMessage = `Server error: ${err.message}`
        } else if (err.message.includes('Invalid data format')) {
          errorMessage = `Data format error: ${err.message}`
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading analytics data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h2>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button 
                onClick={fetchAnalyticsData}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) return null

  // Chart data for main category distribution
  const categoryChartData = {
    labels: Object.keys(data.categoryCounts),
    datasets: [
      {
        label: 'Products per Category',
        data: Object.values(data.categoryCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  // Price range chart data
  const priceRangeChartData = {
    labels: Object.keys(data.priceRanges),
    datasets: [
      {
        label: 'Products by Price Range',
        data: Object.values(data.priceRanges),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  // Stock range chart data
  const stockRangeChartData = {
    labels: Object.keys(data.stockRanges),
    datasets: [
      {
        label: 'Products by Stock Level',
        data: Object.values(data.stockRanges),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156 163 175)' // text-gray-400
        }
      },
      title: {
        display: true,
        text: 'Products Distribution by Category',
        color: 'rgb(17 24 39)' // text-gray-900
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'rgb(156 163 175)' // text-gray-400
        },
        grid: {
          color: 'rgb(75 85 99)' // text-gray-600
        }
      },
      x: {
        ticks: {
          color: 'rgb(156 163 175)' // text-gray-400
        },
        grid: {
          color: 'rgb(75 85 99)' // text-gray-600
        }
      }
    },
  }

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgb(156 163 175)' // text-gray-400
        }
      },
      title: {
        display: true,
        text: 'Distribution Chart',
        color: 'rgb(17 24 39)' // text-gray-900
      },
    },
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Product data insights and visualizations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{data.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{data.totalCategories}</p>
              </div>
            </div>
          </div>

          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Price</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">${data.averagePrice}</p>
              </div>
            </div>
          </div>

          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Stock</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{data.totalStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Distribution Bar Chart */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products by Category</h3>
            <div className="h-80">
              <Bar data={categoryChartData} options={chartOptions} />
            </div>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
            <div className="h-80">
              <Pie data={categoryChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Price and Stock Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Range Chart */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products by Price Range</h3>
            <div className="h-80">
              <Doughnut data={priceRangeChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* Stock Range Chart */}
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products by Stock Level</h3>
            <div className="h-80">
              <Doughnut data={stockRangeChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Category Details Section */}
        <div className="card mb-8 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data.categoryDetails).map(([category, details]) => (
              <div key={category} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{category}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Products:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{details.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Avg Price:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${details.averagePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Stock:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{details.totalStock}</span>
                  </div>
                  {details.brands.length > 0 && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Brands ({details.brands.length}):</span>
                      <div className="mt-1">
                        {details.brands.map((brand, index) => (
                          <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {details.subcategories.length > 0 && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Subcategories ({details.subcategories.length}):</span>
                      <div className="mt-1">
                        {details.subcategories.map((subcategory, index) => (
                          <span key={index} className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                            {subcategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products Table */}
        <div className="card mb-8 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">All Products Data</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subcategory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {products.map((product) => {
                    // Extract brand and subcategory for display
                    const brandMatch = product.title.match(/^([A-Z][a-z]+)/)
                    const brand = brandMatch ? brandMatch[1] : 'N/A'
                    
                    const words = product.title.toLowerCase().split(' ')
                    const subcategoryWords = words.filter((word: string) => 
                      word.length > 3 && 
                      !['the', 'and', 'for', 'with', 'from', 'beauty', 'skincare', 'makeup', 'hair', 'fragrance'].includes(word)
                    )
                    const subcategory = subcategoryWords.length > 0 
                      ? subcategoryWords[0].charAt(0).toUpperCase() + subcategoryWords[0].slice(1)
                      : 'N/A'

                    return (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {product.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            {brand}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            {subcategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock <= 10 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                            product.stock <= 50 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button 
            onClick={fetchAnalyticsData}
            className="btn-secondary"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
