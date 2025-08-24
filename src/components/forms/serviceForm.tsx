import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react"
import { getAuthHeaders, getHeaders, getApiUrl } from "@/config/headers"

interface ServiceFormData {
  categoryId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  featuredImage: string
  images: Array<{
    imageUrl: string
    altText: string
    isPrimary: boolean
  }>
  addons: Array<{
    addonId: string
    isRequired: boolean
    defaultQuantity: number
  }>
  duration: number
  pincodes: string[]
  features: string[]
  requirements: string[]
  instructions: string
  cancellationPolicy: string
  availability: {
    isAvailable: boolean
    availableDays: string[]
    availableTimeSlots: string[]
    maxBookingsPerDay: number
  }
  provider: {
    providerId: string
    providerName: string
    providerRating: number
    providerExperience: number
  }
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  active: boolean
  featured: boolean
  popular: boolean
}

interface ServiceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editMode?: boolean
  initialData?: Partial<ServiceFormData> & { _id?: string }
}

interface Category {
  _id: string
  name: string
  description?: string
}

interface Addon {
  _id: string
  name: string
  price: number
  description?: string
}

export function ServiceForm({ onSuccess, onCancel, editMode = false, initialData }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    categoryId: initialData?.categoryId || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || 0,
    featuredImage: initialData?.featuredImage || "",
    images: initialData?.images || [],
    addons: initialData?.addons || [],
    duration: initialData?.duration || 60,
    pincodes: initialData?.pincodes || [],
    features: initialData?.features || [],
    requirements: initialData?.requirements || [],
    instructions: initialData?.instructions || "",
    cancellationPolicy: initialData?.cancellationPolicy || "",
    availability: initialData?.availability || {
      isAvailable: true,
      availableDays: [],
      availableTimeSlots: [],
      maxBookingsPerDay: 10
    },
    provider: initialData?.provider || {
      providerId: "",
      providerName: "",
      providerRating: 0,
      providerExperience: 0
    },
    tags: initialData?.tags || [],
    seo: initialData?.seo || {
      metaTitle: "",
      metaDescription: "",
      keywords: []
    },
    active: initialData?.active ?? true,
    featured: initialData?.featured ?? false,
    popular: initialData?.popular ?? false,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories and addons on component mount
  useEffect(() => {
    fetchCategories()
    fetchAddons()
  }, [])

  const fetchCategories = async () => {
    try {
      const API_URL = getApiUrl()
      const headers = getHeaders()
      const response = await fetch(`${API_URL}/categories`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchAddons = async () => {
    try {
      const API_URL = getApiUrl()
      const headers = getHeaders()
      const response = await fetch(`${API_URL}/addons`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setAddons(data.data.addons || [])
      }
    } catch (error) {
      console.error("Error fetching addons:", error)
    }
  }

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    if (!formData.featuredImage) {
      newErrors.featuredImage = "Featured image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Only allow image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select only image files (JPEG, PNG, WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      // Remove Content-Type header to let browser set it with boundary for FormData
      const uploadHeaders = { ...headers }
      delete (uploadHeaders as any)['Content-Type']

      const response = await fetch(`${API_URL}/upload/images`, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.data.url }))
      } else {
        throw new Error(data.message || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
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

  // Add feature
  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }))
  }

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }))
  }

  // Update feature
  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  // Add requirement
  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ""] }))
  }

  // Remove requirement
  const removeRequirement = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      requirements: prev.requirements.filter((_, i) => i !== index) 
    }))
  }

  // Update requirement
  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((requirement, i) => i === index ? value : requirement)
    }))
  }

  // Add pincode
  const addPincode = () => {
    setFormData(prev => ({ ...prev, pincodes: [...prev.pincodes, ""] }))
  }

  // Remove pincode
  const removePincode = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      pincodes: prev.pincodes.filter((_, i) => i !== index) 
    }))
  }

  // Update pincode
  const updatePincode = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pincodes: prev.pincodes.map((pincode, i) => i === index ? value : pincode)
    }))
  }

  // Add addon
  const addAddon = () => {
    setFormData(prev => ({ 
      ...prev, 
      addons: [...prev.addons, { addonId: "", isRequired: false, defaultQuantity: 1 }] 
    }))
  }

  // Remove addon
  const removeAddon = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      addons: prev.addons.filter((_, i) => i !== index) 
    }))
  }

  // Update addon
  const updateAddon = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.map((addon, i) => 
        i === index ? { ...addon, [field]: value } : addon
      )
    }))
  }

  // Get addon name by ID
  const getAddonName = (addonId: string) => {
    const addon = addons.find(a => a._id === addonId)
    return addon ? addon.name : "Unknown Addon"
  }

  // Get addon price by ID
  const getAddonPrice = (addonId: string) => {
    const addon = addons.find(a => a._id === addonId)
    return addon ? addon.price : 0
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
        ? `${API_URL}/services/${initialData?._id}` 
        : `${API_URL}/services`
      
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
        throw new Error(data.message || "Failed to save service")
      }
    } catch (error) {
      console.error("Error saving service:", error)
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
            Enter the basic details of the service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Deep House Cleaning"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this service includes..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (INR)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                placeholder="60"
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addons */}
      <Card>
        <CardHeader>
          <CardTitle>Service Addons</CardTitle>
          <CardDescription>
            Add optional addons to this service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.addons.map((addon, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Addon {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAddon(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Addon *</Label>
                  <select
                    value={addon.addonId}
                    onChange={(e) => updateAddon(index, "addonId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Addon</option>
                    {addons.map(addonOption => (
                      <option key={addonOption._id} value={addonOption._id}>
                        {addonOption.name} - ₹{addonOption.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Default Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={addon.defaultQuantity}
                    onChange={(e) => updateAddon(index, "defaultQuantity", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={addon.isRequired}
                      onCheckedChange={(checked: boolean) => updateAddon(index, "isRequired", checked)}
                    />
                    <Label>Required</Label>
                  </div>
                </div>
              </div>

              {addon.addonId && (
                <div className="text-sm text-muted-foreground">
                  <p>Selected: {getAddonName(addon.addonId)}</p>
                  <p>Price: ₹{getAddonPrice(addon.addonId)}</p>
                </div>
              )}
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addAddon}>
            <Plus className="h-4 w-4 mr-2" />
            Add Addon
          </Button>
        </CardContent>
      </Card>

      {/* Service Areas (Pincodes) */}
      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            Add pincodes where this service is available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.pincodes.map((pincode, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={pincode}
                onChange={(e) => updatePincode(index, e.target.value)}
                placeholder="e.g., 400001"
                maxLength={6}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePincode(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPincode}>
            <Plus className="h-4 w-4 mr-2" />
            Add Pincode
          </Button>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
          <CardDescription>
            Upload the main image for this service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featured-image-url">Image URL</Label>
            <Input
              id="featured-image-url"
              value={formData.featuredImage}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              placeholder="https://example.com/service-image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Image File</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                    <p className="text-xs text-gray-500">Image files only, max 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview uploaded image */}
          {formData.featuredImage && (
            <div className="space-y-2">
              <Label>Uploaded Image Preview</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                  <img 
                    src={formData.featuredImage} 
                    alt="Uploaded image" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {formData.featuredImage.split('/').pop() || 'Uploaded image'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Add features included in this service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="e.g., Deep cleaning of all rooms"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>
            Add requirements for this service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="e.g., Customer should be present"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRequirement(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addRequirement}>
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Special instructions for this service..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
            <Textarea
              id="cancellation-policy"
              value={formData.cancellationPolicy}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
              placeholder="Cancellation policy details..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="popular"
              checked={formData.popular}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, popular: checked }))}
            />
            <Label htmlFor="popular">Popular</Label>
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
          {editMode ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  )
}
