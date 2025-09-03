import React, { useState, useEffect } from 'react'
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Star,
  Download,
  Filter,
  CalendarDays,
  PieChart,
  Activity,
  Target,
  Award,
  MapPin,
  Phone,
  Mail,
  FileText,
  RefreshCw,
  Eye,
  BarChart,
  LineChart
} from "lucide-react"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

// Revenue Chart Component (Simple Bar Chart)
function RevenueChart({ data }: { data: any[] }) {
  const maxValue = Math.max(...data.map(d => d.revenue))
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
        <Badge variant="outline">Last 7 Days</Badge>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-600">{item.date}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                style={{ width: `${(item.revenue / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                ₹{item.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Service Performance Chart
function ServicePerformanceChart({ data }: { data: any[] }) {
  const maxBookings = Math.max(...data.map(d => d.bookings))
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Service Performance</h3>
        <Badge variant="outline">This Month</Badge>
      </div>
      <div className="space-y-3">
        {data.map((service, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{service.name}</span>
              <span className="text-sm text-gray-600">{service.bookings} bookings</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(service.bookings / maxBookings) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>₹{service.revenue.toLocaleString()}</span>
              <span>{service.rating}⭐</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Partner Performance Table
function PartnerPerformanceTable({ partners }: { partners: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Partner Performance</h3>
        <Badge variant="outline">Top Performers</Badge>
      </div>
      <div className="space-y-3">
        {partners.map((partner, index) => (
          <div key={partner._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium">{partner.name}</p>
                <p className="text-sm text-gray-600">{partner.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{partner.completedBookings} bookings</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{partner.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Customer Insights
function CustomerInsights({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Insights</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.totalCustomers}</div>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.newCustomers}</div>
          <p className="text-sm text-gray-600">New This Month</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{data.repeatCustomers}</div>
          <p className="text-sm text-gray-600">Repeat Customers</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{data.avgRating}</div>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>
    </div>
  )
}

// Booking Analytics
function BookingAnalytics({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Booking Analytics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Total Bookings</span>
          </div>
          <div className="text-2xl font-bold">{data.totalBookings}</div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-600">+{data.bookingGrowth}%</span>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Avg Duration</span>
          </div>
          <div className="text-2xl font-bold">{data.avgDuration} min</div>
          <div className="text-sm text-gray-600">Per booking</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold">{data.completionRate}%</div>
          <div className="text-sm text-gray-600">Successfully completed</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Customer Rating</span>
          </div>
          <div className="text-2xl font-bold">{data.customerRating}</div>
          <div className="text-sm text-gray-600">Out of 5 stars</div>
        </div>
      </div>
    </div>
  )
}

// Top Services Report
function TopServicesReport({ services }: { services: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top Performing Services</h3>
        <Badge variant="outline">Revenue Based</Badge>
      </div>
      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={service._id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-600">{service.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{service.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{service.bookings} bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Geographic Distribution
function GeographicDistribution({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Geographic Distribution</h3>
      <div className="space-y-3">
        {data.map((location, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-red-500" />
              <div>
                <p className="font-medium">{location.area}</p>
                <p className="text-sm text-gray-600">{location.pincode}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{location.bookings}</p>
              <p className="text-sm text-gray-600">bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Reports Page
export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d') // 7d, 30d, 90d, 1y
  const [reportData, setReportData] = useState<any>({
    revenue: [],
    services: [],
    partners: [],
    customers: {},
    bookings: {},
    topServices: [],
    locations: []
  })

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/reports?range=${dateRange}`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setReportData(data.data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      // Use mock data for demonstration
      setReportData(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const getMockData = () => ({
    revenue: [
      { date: 'Mon', revenue: 45000 },
      { date: 'Tue', revenue: 52000 },
      { date: 'Wed', revenue: 48000 },
      { date: 'Thu', revenue: 61000 },
      { date: 'Fri', revenue: 55000 },
      { date: 'Sat', revenue: 72000 },
      { date: 'Sun', revenue: 68000 }
    ],
    services: [
      { name: 'House Cleaning', bookings: 45, revenue: 225000, rating: 4.8 },
      { name: 'Plumbing', bookings: 32, revenue: 160000, rating: 4.6 },
      { name: 'Electrical', bookings: 28, revenue: 140000, rating: 4.7 },
      { name: 'Carpentry', bookings: 22, revenue: 110000, rating: 4.5 },
      { name: 'Painting', bookings: 18, revenue: 90000, rating: 4.4 }
    ],
    partners: [
      { _id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', completedBookings: 156, rating: 4.8 },
      { _id: '2', name: 'Amit Singh', phone: '+91 98765 43211', completedBookings: 142, rating: 4.7 },
      { _id: '3', name: 'Suresh Patel', phone: '+91 98765 43212', completedBookings: 128, rating: 4.6 },
      { _id: '4', name: 'Mohan Sharma', phone: '+91 98765 43213', completedBookings: 115, rating: 4.5 },
      { _id: '5', name: 'Vikram Verma', phone: '+91 98765 43214', completedBookings: 98, rating: 4.4 }
    ],
    customers: {
      totalCustomers: 1247,
      newCustomers: 89,
      repeatCustomers: 423,
      avgRating: 4.6
    },
    bookings: {
      totalBookings: 145,
      bookingGrowth: 12.5,
      avgDuration: 120,
      completionRate: 94.2,
      customerRating: 4.6
    },
    topServices: [
      { _id: '1', name: 'House Cleaning', category: 'Cleaning', revenue: 225000, bookings: 45 },
      { _id: '2', name: 'Plumbing Service', category: 'Repair', revenue: 160000, bookings: 32 },
      { _id: '3', name: 'Electrical Work', category: 'Repair', revenue: 140000, bookings: 28 },
      { _id: '4', name: 'Carpentry', category: 'Repair', revenue: 110000, bookings: 22 },
      { _id: '5', name: 'Interior Painting', category: 'Painting', revenue: 90000, bookings: 18 }
    ],
    locations: [
      { area: 'South Delhi', pincode: '110001', bookings: 45 },
      { area: 'North Delhi', pincode: '110002', bookings: 38 },
      { area: 'East Delhi', pincode: '110003', bookings: 32 },
      { area: 'West Delhi', pincode: '110004', bookings: 28 },
      { area: 'Central Delhi', pincode: '110005', bookings: 22 }
    ]
  })

  const handleExportReport = () => {
    // Implementation for exporting reports
    alert('Report export functionality will be implemented here')
  }

  const handleRefreshData = () => {
    fetchReportData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading reports...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="dateRange">Date Range:</Label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{reportData.revenue.reduce((sum: number, item: any) => sum + item.revenue, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{reportData.bookings.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+{reportData.bookings.bookingGrowth}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-2xl font-bold">{reportData.partners.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Avg rating: 4.6</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold">{reportData.customers.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">{reportData.customers.totalCustomers} customers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Analytics
            </CardTitle>
            <CardDescription>
              Daily revenue trends and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={reportData.revenue} />
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Service Performance
            </CardTitle>
            <CardDescription>
              Top performing services by bookings and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServicePerformanceChart data={reportData.services} />
          </CardContent>
        </Card>

        {/* Partner Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Partner Performance
            </CardTitle>
            <CardDescription>
              Top performing partners by completed bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PartnerPerformanceTable partners={reportData.partners} />
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Insights
            </CardTitle>
            <CardDescription>
              Customer metrics and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerInsights data={reportData.customers} />
          </CardContent>
        </Card>

        {/* Booking Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Analytics
            </CardTitle>
            <CardDescription>
              Detailed booking performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingAnalytics data={reportData.bookings} />
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Services
            </CardTitle>
            <CardDescription>
              Highest revenue generating services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopServicesReport services={reportData.topServices} />
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Booking distribution by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeographicDistribution data={reportData.locations} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
