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

interface UserFormData {
  name: string
  email: string
  phone: string
  password?: string
  confirmPassword?: string
  status: "active" | "inactive" | "pending"
  role: string
  profileImage?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  isEmailVerified: boolean
  isPhoneVerified: boolean
  userType?: string
}

interface UserFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  editMode?: boolean
  initialData?: Partial<UserFormData> & { _id?: string }
  userType?: "customers" | "partners" | "admins"
}

export function UserForm({ onSuccess, onCancel, editMode = false, initialData, userType = "customers" }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    status: initialData?.status || "active",
    role: initialData?.role || getDefaultRole(userType),
    profileImage: initialData?.profileImage || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    gender: initialData?.gender || "other",
    isEmailVerified: initialData?.isEmailVerified ?? false,
    isPhoneVerified: initialData?.isPhoneVerified ?? false,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_URL = getApiUrl()
  const authHeaders = getAuthHeaders()

  // Debug authentication
  console.log('API URL:', API_URL)
  console.log('Auth headers:', authHeaders)
  console.log('Token from localStorage:', localStorage.getItem("auth"))

  // Get default role based on user type
  function getDefaultRole(type: string): string {
    switch (type) {
      case "customers":
        return "customer"
      case "partners":
        return "partner"
      case "admins":
        return "admin"
      default:
        return "customer"
    }
  }

  // Get role options based on user type
  function getRoleOptions(type: string): { value: string; label: string }[] {
    switch (type) {
      case "customers":
        return [
          { value: "customer", label: "Customer" },
          { value: "premium", label: "Premium Customer" },
          { value: "vip", label: "VIP Customer" }
        ]
      case "partners":
        return [
          { value: "partner", label: "Partner" },
          { value: "verified_partner", label: "Verified Partner" },
          { value: "premium_partner", label: "Premium Partner" }
        ]
      case "admins":
        return [
          { value: "admin", label: "Admin" },
          { value: "super_admin", label: "Super Admin" },
          { value: "moderator", label: "Moderator" }
        ]
      default:
        return [{ value: "customer", label: "Customer" }]
    }
  }

  // Get user type label
  function getUserTypeLabel(type: string): string {
    switch (type) {
      case "customers":
        return "User"
      case "partners":
        return "Partner"
      case "admins":
        return "Admin"
      default:
        return "User"
    }
  }

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!editMode) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (editMode && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (editMode && formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select only JPEG, PNG, or WebP files')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // Max 5MB
      alert('File size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const formDataPayload = new FormData()
      formDataPayload.append('image', file)

      const uploadHeaders = { ...authHeaders }
      delete (uploadHeaders as any)['Content-Type'] // Let browser set Content-Type for FormData

      const response = await fetch(`${API_URL}/upload/images`, {
        method: 'POST',
        headers: uploadHeaders,
        body: formDataPayload
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, profileImage: data.data.url }))
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Form submission started')
    console.log('Form data:', formData)
    console.log('User type:', userType)
    console.log('Edit mode:', editMode)

    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    setLoading(true)

    try {
      let url = ""
      const method = editMode ? "PUT" : "POST"

      if (editMode) {
        // Update user - use unified endpoint
        url = `${API_URL}/users/${initialData?._id}`
      } else {
        // Create user - use unified endpoint for all types
        url = `${API_URL}/users`
      }

      // Remove confirmPassword from the data being sent
      const { confirmPassword, ...submitData } = formData

      // Add userType to the data for create operations
      if (!editMode) {
        submitData.userType = userType
      }

      console.log('Submitting to:', url)
      console.log('Method:', method)
      console.log('Data:', submitData)
      console.log('Headers:', authHeaders)

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(submitData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        console.log('Success! Calling onSuccess')
        onSuccess?.()
      } else {
        throw new Error(data.message || "Failed to save user")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  // Check if fields should be disabled based on user type and edit mode
  const isFieldDisabled = (fieldName: string) => {
    if (!editMode) return false // Always allow editing in create mode
    
    // For customers, disable all fields except status
    if (userType === "customers") {
      return fieldName !== "status"
    }
    
    // For partners and admins, allow full editing
    return false
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Edit Mode Notice for Customers */}
      {editMode && userType === "customers" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-sm">⚠️</span>
              <p className="text-sm">
                <strong>Limited Edit Mode:</strong> For customer accounts, only the status can be modified. 
                Other details are read-only for security reasons.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details of the {getUserTypeLabel(userType).toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
                disabled={isFieldDisabled("name")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
                disabled={isFieldDisabled("email")}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-500" : ""}
                disabled={isFieldDisabled("phone")}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                disabled={isFieldDisabled("dateOfBirth")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as "male" | "female" | "other" }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isFieldDisabled("gender")}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isFieldDisabled("role")}
              >
                {getRoleOptions(userType).map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {!editMode && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isFieldDisabled("password")}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isFieldDisabled("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {editMode && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password"
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isFieldDisabled("password")}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isFieldDisabled("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>
            Enter the user's address details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter full address"
              rows={3}
              disabled={isFieldDisabled("address")}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
                disabled={isFieldDisabled("city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Enter state"
                disabled={isFieldDisabled("state")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="Enter pincode"
                maxLength={6}
                disabled={isFieldDisabled("pincode")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
          <CardDescription>
            Upload a profile picture for the user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-image-url">Profile Image URL</Label>
            <Input
              id="profile-image-url"
              value={formData.profileImage}
              onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
              placeholder="https://example.com/profile-image.jpg"
              disabled={isFieldDisabled("profileImage")}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Profile Image</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ pointerEvents: isFieldDisabled("profileImage") ? "none" : "auto", opacity: isFieldDisabled("profileImage") ? 0.5 : 1 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isFieldDisabled("profileImage")}
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
          {formData.profileImage && (
            <div className="space-y-2">
              <Label>Profile Image Preview</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full overflow-hidden">
                  <img 
                    src={formData.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {formData.profileImage.split('/').pop() || 'Uploaded image'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, profileImage: "" }))}
                  disabled={isFieldDisabled("profileImage")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Account Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" | "pending" }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isFieldDisabled("status")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isEmailVerified"
              checked={formData.isEmailVerified}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isEmailVerified: checked }))}
              disabled={isFieldDisabled("isEmailVerified")}
            />
            <Label htmlFor="isEmailVerified">Email Verified</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPhoneVerified"
              checked={formData.isPhoneVerified}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isPhoneVerified: checked }))}
              disabled={isFieldDisabled("isPhoneVerified")}
            />
            <Label htmlFor="isPhoneVerified">Phone Verified</Label>
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
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            console.log('Test button clicked')
            console.log('Form data:', formData)
            console.log('User type:', userType)
            console.log('Edit mode:', editMode)
            console.log('Auth headers:', authHeaders)
          }}
        >
          Test Debug
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editMode ? `Update ${getUserTypeLabel(userType)}` : `Create ${getUserTypeLabel(userType)}`}
        </Button>
      </div>
    </form>
  )
}
