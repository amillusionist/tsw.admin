import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { Badge } from "@/components/shadcn/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search, AlertTriangle, Star } from "lucide-react"
import { PopupWrapper } from "@/components/ui/popupWrapper"
import { Link, useNavigate } from "react-router-dom"
import { getHeaders, getAuthHeaders, getApiUrl } from "@/config/headers"

interface Service {
  _id: string
  categoryId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  featuredImage: string
  images?: Array<{
    imageUrl: string
    altText: string
    isPrimary: boolean
  }>
  addons?: Array<{
    addonId: string
    isRequired: boolean
    defaultQuantity: number
  }>
  duration: number
  location?: {
    type: string
    address: string
    city: string
    pincode: string
  }
  features?: string[]
  requirements?: string[]
  instructions?: string
  cancellationPolicy?: string
  rating?: {
    average: number
    count: number
  }
  availability?: {
    isAvailable: boolean
    availableDays: string[]
    maxBookingsPerDay: number
  }
  tags?: string[]
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  active: boolean
  featured: boolean
  popular: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    services: Service[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch services from API
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const API_URL = getApiUrl()
      const headers = getHeaders()
      const response = await fetch(`${API_URL}/services`, { headers })
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setServices(data.data.services)
      } else {
        console.error("Failed to fetch services:", data.message)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (service: Service) => {
    setSelectedService(service)
    setIsDetailPopupOpen(true)
  }

  const handleEditService = (service: Service) => {
    navigate(`/update-service/${service._id}`, { state: { service } })
  }

  const handleDeleteService = (service: Service) => {
    setSelectedService(service)
    setIsDeletePopupOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedService) return

    setDeleteLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/services/${selectedService._id}`, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()

      if (data.success) {
        setServices(prev => prev.filter(service => service._id !== selectedService._id))
        setIsDeletePopupOpen(false)
        setSelectedService(null)
      } else {
        throw new Error(data.message || "Failed to delete service")
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddNewService = () => {
    navigate('/add-service')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings
          </p>
        </div>
        <Button onClick={handleAddNewService}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Services</CardTitle>
          <CardDescription>
            Find specific services by name or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={service.featuredImage} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(service.price, service.currency)}</div>
                    {service.originalPrice && service.originalPrice > service.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(service.originalPrice, service.currency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDuration(service.duration)}</TableCell>
                  <TableCell>
                    {service.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{service.rating.average.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({service.rating.count})</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                      {service.featured && <Badge variant="outline">Featured</Badge>}
                      {service.popular && <Badge variant="outline">Popular</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(service.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(service)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditService(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteService(service)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Popup */}
      <PopupWrapper
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        title={selectedService?.name}
        size="xl"
      >
        {selectedService && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price</label>
                <p className="text-lg font-semibold">{formatPrice(selectedService.price, selectedService.currency)}</p>
                {selectedService.originalPrice && selectedService.originalPrice > selectedService.price && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(selectedService.originalPrice, selectedService.currency)}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="text-lg">{formatDuration(selectedService.duration)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{selectedService.description}</p>
            </div>

            {/* Rating */}
            {selectedService.rating && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rating</label>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{selectedService.rating.average.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({selectedService.rating.count} reviews)</span>
                </div>
              </div>
            )}

            {/* Features */}
            {selectedService.features && selectedService.features.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Features</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedService.features.map((feature, index) => (
                    <Badge key={index} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {selectedService.requirements && selectedService.requirements.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Requirements</label>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {selectedService.requirements.map((requirement, index) => (
                    <li key={index} className="text-sm">{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location */}
            {selectedService.location && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="mt-1">
                  {selectedService.location.address}, {selectedService.location.city} - {selectedService.location.pincode}
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex gap-2 mt-1">
                <Badge variant={selectedService.active ? "default" : "secondary"}>
                  {selectedService.active ? "Active" : "Inactive"}
                </Badge>
                {selectedService.featured && <Badge variant="outline">Featured</Badge>}
                {selectedService.popular && <Badge variant="outline">Popular</Badge>}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Created</label>
                <p>{formatDate(selectedService.createdAt)}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Updated</label>
                <p>{formatDate(selectedService.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </PopupWrapper>

      {/* Delete Confirmation Popup */}
      <PopupWrapper
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        title="Delete Service"
        size="md"
        showCloseButton={false}
      >
        {selectedService && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete "{selectedService.name}"?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone. This will permanently delete the service and remove it from your system.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDeletePopupOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Service"}
              </Button>
            </div>
          </div>
        )}
      </PopupWrapper>
    </div>
  )
}
