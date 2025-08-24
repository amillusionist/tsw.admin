import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { CategoryForm } from "@/components/forms/categoryForm"

export default function AddCategoryPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/categories')
  }

  const handleCancel = () => {
    navigate('/categories')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
          <p className="text-muted-foreground">
            Create a new service category
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <CategoryForm
          editMode={false}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
