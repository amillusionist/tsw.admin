import React, { useState, useEffect } from 'react'
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import { 
  Bell, 
  Send, 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  recipients: {
    type: 'all_users' | 'all_providers' | 'specific_users'
    userIds?: string[]
  }
  sentAt: string
  status: 'sent' | 'failed' | 'pending'
  readCount: number
  totalRecipients: number
}

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'provider' | 'admin'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state for sending notifications
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    recipients: {
      type: 'all_users' as 'all_users' | 'all_providers' | 'specific_users',
      userIds: [] as string[]
    }
  })

  useEffect(() => {
    fetchNotifications()
    fetchUsers()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/notifications`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/users`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const sendNotification = async () => {
    setSending(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'info',
          recipients: {
            type: 'all_users',
            userIds: []
          }
        })
        setIsModalOpen(false)
        
        // Refresh notifications list
        fetchNotifications()
        
        alert('Notification sent successfully!')
      } else {
        throw new Error(data.message || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getRecipientTypeText = (type: string) => {
    switch (type) {
      case 'all_users': return 'All Users'
      case 'all_providers': return 'All Providers'
      case 'specific_users': return 'Specific Users'
      default: return type
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || notification.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to users and providers
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Send className="h-4 w-4" />
          Send Notification
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Send New Notification</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Send a notification to users, providers, or specific individuals
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'info' | 'success' | 'warning' | 'error'
                  }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <select
                  id="recipients"
                  value={formData.recipients.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recipients: {
                      ...prev.recipients,
                      type: e.target.value as 'all_users' | 'all_providers' | 'specific_users',
                      userIds: e.target.value === 'specific_users' ? prev.recipients.userIds : []
                    }
                  }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all_users">All Users</option>
                  <option value="all_providers">All Providers</option>
                  <option value="specific_users">Specific Users</option>
                </select>
              </div>

              {formData.recipients.type === 'specific_users' && (
                <div className="space-y-2">
                  <Label>Select Users</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {users.map(user => (
                      <label key={user._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={formData.recipients.userIds?.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                recipients: {
                                  ...prev.recipients,
                                  userIds: [...(prev.recipients.userIds || []), user._id]
                                }
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                recipients: {
                                  ...prev.recipients,
                                  userIds: prev.recipients.userIds?.filter(id => id !== user._id) || []
                                }
                              }))
                            }
                          }}
                        />
                        <span className="text-sm">
                          {user.name} ({user.email}) - {user.role}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendNotification}
                  disabled={sending || !formData.title || !formData.message}
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
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('info')}>
                  Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('success')}>
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('warning')}>
                  Warning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('error')}>
                  Error
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No notifications have been sent yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {getRecipientTypeText(notification.recipients.type)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(notification.sentAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(notification.sentAt).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        {notification.readCount} / {notification.totalRecipients} read
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Resend</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
