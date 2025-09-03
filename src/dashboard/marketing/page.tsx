import React, { useState, useEffect } from 'react'
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import { 
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Target,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

// Coupon Form Component
function CouponForm({ coupon, onSave, onCancel }: { 
  coupon?: any, 
  onSave: (coupon: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    discountType: coupon?.discountType || 'percentage', // percentage, fixed
    discountValue: coupon?.discountValue || 0,
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscount: coupon?.maxDiscount || 0,
    usageLimit: coupon?.usageLimit || 0,
    usageLimitPerUser: coupon?.usageLimitPerUser || 1,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
    validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    isActive: coupon?.isActive ?? true,
    applicableServices: coupon?.applicableServices || [],
    applicableCategories: coupon?.applicableCategories || [],
    firstTimeUsersOnly: coupon?.firstTimeUsersOnly || false,
    newUsersOnly: coupon?.newUsersOnly || false
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const url = coupon?._id 
        ? `${API_URL}/coupons/${coupon._id}` 
        : `${API_URL}/coupons`
      
      const method = coupon?._id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        onSave(data.data.coupon)
        alert(coupon?._id ? 'Coupon updated successfully!' : 'Coupon created successfully!')
      } else {
        throw new Error(data.message || 'Failed to save coupon')
      }
    } catch (error) {
      console.error('Error saving coupon:', error)
      alert('Failed to save coupon. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {coupon?._id ? 'Edit Coupon' : 'Create New Coupon'}
        </CardTitle>
        <CardDescription>
          Configure discount settings and conditions for your coupon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Coupon Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Summer Sale 20% Off"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Get 20% off on all services this summer"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <select
                id="discountType"
                value={formData.discountType}
                onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                min="0"
                max={formData.discountType === 'percentage' ? "100" : "10000"}
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
              <Input
                id="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: parseFloat(e.target.value) }))}
                min="0"
                placeholder="0 = No limit"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) }))}
                min="0"
                placeholder="0 = No minimum"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Total Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                min="0"
                placeholder="0 = Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usageLimitPerUser">Usage Limit Per User</Label>
              <Input
                id="usageLimitPerUser"
                type="number"
                value={formData.usageLimitPerUser}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimitPerUser: parseInt(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                min={formData.validFrom || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Special Conditions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="firstTimeUsersOnly"
                  checked={formData.firstTimeUsersOnly}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstTimeUsersOnly: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="firstTimeUsersOnly">First-time users only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newUsersOnly"
                  checked={formData.newUsersOnly}
                  onChange={(e) => setFormData(prev => ({ ...prev, newUsersOnly: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="newUsersOnly">New users only (registered within 30 days)</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {coupon?._id ? 'Update Coupon' : 'Create Coupon'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Coupon List Component
function CouponList({ coupons, onEdit, onDelete, onToggleStatus }: {
  coupons: any[],
  onEdit: (coupon: any) => void,
  onDelete: (couponId: string) => void,
  onToggleStatus: (couponId: string, isActive: boolean) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive) ||
                         (filterStatus === 'inactive' && !coupon.isActive)
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (coupon: any) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    if (!coupon.isActive) return <Badge variant="secondary">Inactive</Badge>
    if (now < validFrom) return <Badge variant="outline">Upcoming</Badge>
    if (now > validUntil) return <Badge variant="destructive">Expired</Badge>
    return <Badge variant="default">Active</Badge>
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Coupon code copied to clipboard!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Coupons ({filteredCoupons.length})
        </CardTitle>
        <CardDescription>
          Manage your discount coupons and promotional codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Coupons List */}
          <div className="space-y-3">
            {filteredCoupons.map((coupon) => (
              <div key={coupon._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{coupon.code}</h3>
                      {getStatusBadge(coupon)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-2">{coupon.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {coupon.discountType === 'percentage' ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'} off
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {coupon.usageCount || 0} used
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(coupon._id, !coupon.isActive)}
                    >
                      {coupon.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(coupon._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCoupons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No coupons found. Create your first coupon to get started!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Marketing Page
export default function MarketingPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/coupons`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setCoupons(data.data.coupons || [])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCoupon = (savedCoupon: any) => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c._id === savedCoupon._id ? savedCoupon : c))
    } else {
      setCoupons(prev => [...prev, savedCoupon])
    }
    setShowForm(false)
    setEditingCoupon(null)
  }

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon)
    setShowForm(true)
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/coupons/${couponId}`, {
        method: 'DELETE',
        headers
      })
      
      const data = await response.json()
      if (data.success) {
        setCoupons(prev => prev.filter(c => c._id !== couponId))
        alert('Coupon deleted successfully!')
      } else {
        throw new Error(data.message || 'Failed to delete coupon')
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
      alert('Failed to delete coupon. Please try again.')
    }
  }

  const handleToggleStatus = async (couponId: string, isActive: boolean) => {
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/coupons/${couponId}/toggle-status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ isActive })
      })
      
      const data = await response.json()
      if (data.success) {
        setCoupons(prev => prev.map(c => 
          c._id === couponId ? { ...c, isActive } : c
        ))
        alert(`Coupon ${isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        throw new Error(data.message || 'Failed to update coupon status')
      }
    } catch (error) {
      console.error('Error updating coupon status:', error)
      alert('Failed to update coupon status. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading coupons...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground">
            Create and manage promotional campaigns and coupons
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Content */}
      {showForm ? (
        <CouponForm
          coupon={editingCoupon}
          onSave={handleSaveCoupon}
          onCancel={() => {
            setShowForm(false)
            setEditingCoupon(null)
          }}
        />
      ) : (
        <CouponList
          coupons={coupons}
          onEdit={handleEditCoupon}
          onDelete={handleDeleteCoupon}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  )
}
