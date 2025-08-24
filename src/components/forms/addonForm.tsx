import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Plus, X, Loader2 } from "lucide-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

interface AddonFormData {
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  requirements: string[]
  notes: string
  active: boolean
  image: string
}

interface AddonFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editMode?: boolean
  initialData?: Partial<AddonFormData> & { _id?: string }
}

export function AddonForm({ onSuccess, onCancel, editMode = false, initialData }: AddonFormProps) {
  const [formData, setFormData] = useState<AddonFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    duration: initialData?.duration || 30,
    features: initialData?.features || [],
    requirements: initialData?.requirements || [],
    notes: initialData?.notes || "",
    active: initialData?.active ?? true,
    image: initialData?.image || "",
  })

  const [newFeature, setNewFeature] = useState("")
  const [newRequirement, setNewRequirement] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    if (formData.features.length === 0) {
      newErrors.features = "At least one feature is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add feature
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
      setErrors(prev => ({ ...prev, features: "" }))
    }
  }

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  // Add requirement
  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  // Remove requirement
  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const url = editMode 
        ? `${API_URL}/addons/${initialData?._id}` 
        : `${API_URL}/addons`
      
      const method = editMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        onSuccess?.()
      } else {
        throw new Error(data.message || "Failed to save addon")
      }
    } catch (error) {
      console.error("Error saving addon:", error)
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details of the addon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Kitchen Deep Clean"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="250"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                placeholder="90"
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this addon includes..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            List the features included in this addon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature..."
              onKeyPress={(e: React.KeyboardEvent) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>
            List any requirements for this addon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement..."
              onKeyPress={(e: React.KeyboardEvent) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" onClick={addRequirement} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.requirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((requirement, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {requirement}
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or instructions..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editMode ? "Update Addon" : "Create Addon"}
        </Button>
      </div>
    </form>
  )
}
