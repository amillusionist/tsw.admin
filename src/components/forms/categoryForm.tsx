import * as React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

interface CategoryFormData {
  name: string
  description: string
  image: string
  icon: string
  active: boolean
}

interface CategoryFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editMode?: boolean
  initialData?: Partial<CategoryFormData> & { _id?: string }
}

export function CategoryForm({ onSuccess, onCancel, editMode = false, initialData }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    icon: initialData?.icon || "",
    active: initialData?.active ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Only allow WebP and PNG formats
    const allowedTypes = ['image/webp', 'image/png']
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select only WebP or PNG files')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('icon', file)

      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      // Remove Content-Type header to let browser set it with boundary for FormData
      const uploadHeaders = { ...headers }
      delete (uploadHeaders as any)['Content-Type']

      const response = await fetch(`${API_URL}/upload/icons`, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }))
      } else {
        throw new Error(data.message || "Failed to upload icon")
      }
    } catch (error) {
      console.error("Error uploading icon:", error)
      alert("Failed to upload icon. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
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
        ? `${API_URL}/categories/${initialData?._id}` 
        : `${API_URL}/categories`
      
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
        throw new Error(data.message || "Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
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
            Enter the basic details of the category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Home Cleaning"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this category includes..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Icon Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Category Icon</CardTitle>
          <CardDescription>
            Upload WebP or PNG icon files (max 2MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icon-url">Icon URL</Label>
            <Input
              id="icon-url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/icon.webp"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Icon File</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".webp,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">WebP or PNG files only, max 2MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview uploaded icon */}
          {formData.image && (
            <div className="space-y-2">
              <Label>Uploaded Icon Preview</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded border">
                  <img 
                    src={formData.image} 
                    alt="Uploaded icon" 
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      console.log("Image failed to load:", formData.image)
                      e.currentTarget.style.display = 'none'
                      // Show fallback text
                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text')
                      if (fallback) {
                        fallback.classList.remove('hidden')
                      }
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully:", formData.image)
                      // Hide fallback text
                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text')
                      if (fallback) {
                        fallback.classList.add('hidden')
                      }
                    }}
                  />
                  <span className="fallback-text hidden text-xs text-gray-500">Icon</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {formData.image.split('/').pop() || 'Uploaded icon'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
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
        <Button type="submit" disabled={loading || uploading}>
          {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editMode ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}
