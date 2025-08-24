import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddonForm } from "@/components/forms/addonForm"

export default function AddAddonPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/addons')
  }

  const handleCancel = () => {
    navigate('/addons')
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/addons')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Addons
        </Button>
       
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <AddonForm
          editMode={false}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
