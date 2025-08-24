import * as React from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { ArrowLeft } from "lucide-react"
import { CategoryForm } from "@/components/forms/categoryForm"

interface Category {
  _id: string
  name: string
  description: string
  image: string
  icon: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function UpdateCategoryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const category = location.state?.category as Category

  const handleSuccess = () => {
    navigate('/categories')
  }

  const handleCancel = () => {
    navigate('/categories')
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Category not found</p>
          <Button onClick={() => navigate('/categories')} className="mt-4">
            Back to Categories
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
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">
            Update category: {category.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <CategoryForm
          editMode={true}
          initialData={category}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
