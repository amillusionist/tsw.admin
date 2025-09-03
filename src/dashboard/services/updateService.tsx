import * as React from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { ServiceForm } from "@/components/forms/serviceForm"

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

export default function UpdateServicePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const service = location.state?.service as Service

  const handleSuccess = () => {
    navigate('/services')
  }

  const handleCancel = () => {
    navigate('/services')
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Service not found</p>
          <Button onClick={() => navigate('/services')} className="mt-4">
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/services')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">
            Update service: {service.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ServiceForm
          editMode={true}
          initialData={service as any}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
