import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { ServiceForm } from "@/components/forms/serviceForm"

export default function AddServicePage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/services')
  }

  const handleCancel = () => {
    navigate('/services')
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
          <p className="text-muted-foreground">
            Create a new service offering
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ServiceForm
          editMode={false}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
