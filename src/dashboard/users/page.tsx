import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Badge } from "@/components/shadcn/ui/badge"
import { PopupWrapper } from "@/components/ui/popupWrapper"
import { Search, Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { getHeaders, getAuthHeaders, getApiUrl } from "@/config/headers"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
  role: string
  createdAt: string
  lastLogin?: string
  profileImage?: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    customers?: User[]
    partners?: User[]
    admins?: User[]
  }
}

type UserType = "customers" | "partners" | "admins"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType>("customers")

  const navigate = useNavigate()
  const API_URL = getApiUrl()

  useEffect(() => {
    fetchUsers()
  }, [userType])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userType}`, { 
        headers: getAuthHeaders()
      })
      const data: ApiResponse = await response.json()

      if (data.success) {
        // Handle different response structures
        if (data.data[userType]) {
          setUsers(data.data[userType] || [])
        } else if (Array.isArray(data.data)) {
          setUsers(data.data || [])
        } else {
          setUsers([])
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailPopupOpen(true)
  }

  const handleEdit = (user: User) => {
    navigate(`/update-user/${user._id}`, { state: { user, userType } })
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setIsDeletePopupOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (data.success) {
        setUsers(users.filter(user => user._id !== userToDelete._id))
        setIsDeletePopupOpen(false)
        setUserToDelete(null)
      } else {
        throw new Error(data.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleBlockUser = async (user: User) => {
    try {
      const response = await fetch(`${API_URL}/users/${user._id}/block`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ blocked: user.status === "active" })
      })

      const data = await response.json()

      if (data.success) {
        // Update the user status in the list
        setUsers(users.map(u => 
          u._id === user._id 
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        ))
      } else {
        throw new Error(data.message || "Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      alert("Failed to update user status. Please try again.")
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case "customers":
        return "Users"
      case "partners":
        return "Partners"
      case "admins":
        return "Admins"
      default:
        return "Users"
    }
  }

  const getUserTypeIcon = (type: UserType) => {
    switch (type) {
      case "customers":
        return "👥"
      case "partners":
        return "🤝"
      case "admins":
        return "🛡️"
      default:
        return "👥"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all registered users, partners, and admins
        </p>
      </div>

      {/* User Type Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">User Type:</span>
            <div className="flex gap-2">
              {(["customers", "partners", "admins"] as UserType[]).map((type) => (
                <Button
                  key={type}
                  variant={userType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserType(type)}
                  className="flex items-center gap-2"
                >
                  <span>{getUserTypeIcon(type)}</span>
                  {getUserTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${getUserTypeLabel(userType).toLowerCase()} by name, email, or phone...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => navigate("/add-user", { state: { userType } })}>
              <Plus className="h-4 w-4 mr-2" />
              Add New {getUserTypeLabel(userType).slice(0, -1)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All {getUserTypeLabel(userType)}</CardTitle>
          <CardDescription>
            {filteredUsers.length} {getUserTypeLabel(userType).toLowerCase()}{filteredUsers.length !== 1 ? '' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(user.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlockUser(user)}
                        className={user.status === "active" ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                        title={user.status === "active" ? "Block User" : "Unblock User"}
                      >
                        {user.status === "active" ? "🚫" : "✅"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Popup */}
      {selectedUser && (
        <PopupWrapper
          isOpen={isDetailPopupOpen}
          onClose={() => setIsDetailPopupOpen(false)}
          title={`${getUserTypeLabel(userType).slice(0, -1)} Details`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {selectedUser.profileImage ? (
                  <img 
                    src={selectedUser.profileImage} 
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-muted-foreground">{selectedUser.email}</p>
                {getStatusBadge(selectedUser.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{selectedUser.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joined</label>
                <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <p className="text-sm">
                  {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never"}
                </p>
              </div>
            </div>
          </div>
        </PopupWrapper>
      )}

      {/* Delete Confirmation Popup */}
      <PopupWrapper
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        title={`Delete ${getUserTypeLabel(userType).slice(0, -1)}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeletePopupOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </PopupWrapper>
    </div>
  )
}
