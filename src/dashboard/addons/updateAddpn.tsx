import * as React from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddonForm } from "@/components/forms/addonForm"

interface Addon {
  _id: string
  name: string
  description: string
  price: number
  image: string
  duration: number
  features: string[]
  requirements: string[]
  notes: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function UpdateAddonPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const addon = location.state?.addon as Addon

  const handleSuccess = () => {
    navigate('/addons')
  }

  const handleCancel = () => {
    navigate('/addons')
  }

  if (!addon) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Addon not found</p>
          <Button onClick={() => navigate('/addons')} className="mt-4">
            Back to Addons
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/addons')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Addons
        </Button>
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">Edit Addon</h1> */}
          <p className="text-muted-foreground">
            Update addon: {addon.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <AddonForm
          editMode={true}
          initialData={addon}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
