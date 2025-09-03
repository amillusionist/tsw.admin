import React, { useState, useEffect } from 'react'
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Send,
  Edit,
  Eye,
  Users,
  MessageSquare,
  Truck,
  Star,
  FileText,
  CalendarDays
} from "lucide-react"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

// Booking Status Badge Component
function BookingStatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { variant: 'outline' as const, text: 'Pending', color: 'text-yellow-600' }
      case 'confirmed':
        return { variant: 'default' as const, text: 'Confirmed', color: 'text-green-600' }
      case 'in_progress':
        return { variant: 'default' as const, text: 'In Progress', color: 'text-blue-600' }
      case 'completed':
        return { variant: 'default' as const, text: 'Completed', color: 'text-green-600' }
      case 'cancelled':
        return { variant: 'destructive' as const, text: 'Cancelled', color: 'text-red-600' }
      default:
        return { variant: 'secondary' as const, text: status, color: 'text-gray-600' }
    }
  }

  const config = getStatusConfig(status)
  return <Badge variant={config.variant}>{config.text}</Badge>
}

// Assign Partner Modal Component
function AssignPartnerModal({ booking, partners, onAssign, onClose }: {
  booking: any,
  partners: any[],
  onAssign: (bookingId: string, partnerId: string) => void,
  onClose: () => void
}) {
  const [selectedPartner, setSelectedPartner] = useState('')
  const [assigning, setAssigning] = useState(false)

  const handleAssign = async () => {
    if (!selectedPartner) return
    
    setAssigning(true)
    try {
      await onAssign(booking._id, selectedPartner)
      onClose()
    } catch (error) {
      console.error('Error assigning partner:', error)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Assign Partner</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Booking Details</Label>
            <p className="text-sm text-gray-600">
              {booking.serviceName} - {booking.customerName}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner">Select Partner *</Label>
            <select
              id="partner"
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Choose a partner...</option>
              {partners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.name} - {partner.rating}⭐ ({partner.completedBookings} completed)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={!selectedPartner || assigning}
              className="flex items-center gap-2"
            >
              {assigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Assign Partner
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Send Update Modal Component
function SendUpdateModal({ booking, onSendUpdate, onClose }: {
  booking: any,
  onSendUpdate: (bookingId: string, message: string) => void,
  onClose: () => void
}) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    
    setSending(true)
    try {
      await onSendUpdate(booking._id, message)
      onClose()
    } catch (error) {
      console.error('Error sending update:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Send Update to Customer</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Customer</Label>
            <p className="text-sm text-gray-600">{booking.customerName}</p>
            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Update Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter update message for the customer..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || sending}
              className="flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Update
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Booking Details Modal Component
function BookingDetailsModal({ booking, onClose }: {
  booking: any,
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Booking ID</Label>
              <p className="text-sm">{booking._id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div className="mt-1">
                <BookingStatusBadge status={booking.status} />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Service</Label>
              <p className="text-sm">{booking.serviceName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Amount</Label>
              <p className="text-sm font-medium">₹{booking.amount}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Name</Label>
                <p className="text-sm">{booking.customerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Phone</Label>
                <p className="text-sm">{booking.customerPhone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-sm">{booking.customerEmail}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="text-sm">{booking.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Schedule Info */}
          <div>
            <h3 className="font-medium mb-3">Schedule Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Date</Label>
                <p className="text-sm">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Time</Label>
                <p className="text-sm">{booking.scheduledTime}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Duration</Label>
                <p className="text-sm">{booking.duration} minutes</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p className="text-sm">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Partner Info */}
          {booking.assignedPartner && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Assigned Partner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-sm">{booking.assignedPartner.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Rating</Label>
                    <p className="text-sm flex items-center gap-1">
                      {booking.assignedPartner.rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-sm">{booking.assignedPartner.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Experience</Label>
                    <p className="text-sm">{booking.assignedPartner.experience} years</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Special Instructions */}
          {booking.specialInstructions && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Special Instructions</h3>
                <p className="text-sm text-gray-600">{booking.specialInstructions}</p>
              </div>
            </>
          )}

          {/* Updates History */}
          {booking.updates && booking.updates.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Updates History</h3>
                <div className="space-y-2">
                  {booking.updates.map((update: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{update.sender}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Booking Card Component
function BookingCard({ booking, onAssignPartner, onSendUpdate, onViewDetails }: {
  booking: any,
  onAssignPartner: (booking: any) => void,
  onSendUpdate: (booking: any) => void,
  onViewDetails: (booking: any) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-gray-600 mb-2">{booking.customerName}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">₹{booking.amount}</p>
            <p className="text-sm text-gray-500">{booking.duration} min</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{booking.scheduledTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{booking.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{booking.customerPhone}</span>
          </div>
        </div>

        {booking.assignedPartner && (
          <div className="bg-blue-50 p-2 rounded-md mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Assigned:</span>
              <span>{booking.assignedPartner.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{booking.assignedPartner.rating}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(booking)}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Details
          </Button>
          
          {!booking.assignedPartner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignPartner(booking)}
              className="flex items-center gap-1"
            >
              <Users className="h-3 w-3" />
              Assign
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendUpdate(booking)}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Bookings Page
export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  useEffect(() => {
    fetchBookings()
    fetchPartners()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/bookings`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setBookings(data.data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPartners = async () => {
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/partners`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setPartners(data.data.partners || [])
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    }
  }

  const handleAssignPartner = async (bookingId: string, partnerId: string) => {
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/bookings/${bookingId}/assign-partner`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ partnerId })
      })
      
      const data = await response.json()
      if (data.success) {
        setBookings(prev => prev.map(b => 
          b._id === bookingId ? { ...b, assignedPartner: data.data.assignedPartner } : b
        ))
        alert('Partner assigned successfully!')
      } else {
        throw new Error(data.message || 'Failed to assign partner')
      }
    } catch (error) {
      console.error('Error assigning partner:', error)
      alert('Failed to assign partner. Please try again.')
      throw error
    }
  }

  const handleSendUpdate = async (bookingId: string, message: string) => {
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/bookings/${bookingId}/send-update`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message })
      })
      
      const data = await response.json()
      if (data.success) {
        setBookings(prev => prev.map(b => 
          b._id === bookingId ? { ...b, updates: [...(b.updates || []), data.data.update] } : b
        ))
        alert('Update sent successfully!')
      } else {
        throw new Error(data.message || 'Failed to send update')
      }
    } catch (error) {
      console.error('Error sending update:', error)
      alert('Failed to send update. Please try again.')
      throw error
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      in_progress: bookings.filter(b => b.status === 'in_progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading bookings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
        <p className="text-muted-foreground">
          Manage customer bookings, assign partners, and send updates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-xs text-gray-500">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.in_progress}</div>
            <p className="text-xs text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-gray-500">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by customer, service, phone, or booking ID..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onAssignPartner={(booking) => {
              setSelectedBooking(booking)
              setShowAssignModal(true)
            }}
            onSendUpdate={(booking) => {
              setSelectedBooking(booking)
              setShowUpdateModal(true)
            }}
            onViewDetails={(booking) => {
              setSelectedBooking(booking)
              setShowDetailsModal(true)
            }}
          />
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No bookings have been created yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showAssignModal && selectedBooking && (
        <AssignPartnerModal
          booking={selectedBooking}
          partners={partners}
          onAssign={handleAssignPartner}
          onClose={() => {
            setShowAssignModal(false)
            setSelectedBooking(null)
          }}
        />
      )}

      {showUpdateModal && selectedBooking && (
        <SendUpdateModal
          booking={selectedBooking}
          onSendUpdate={handleSendUpdate}
          onClose={() => {
            setShowUpdateModal(false)
            setSelectedBooking(null)
          }}
        />
      )}

      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBooking(null)
          }}
        />
      )}
    </div>
  )
}
