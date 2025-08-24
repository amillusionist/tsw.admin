import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { Badge } from "@/components/shadcn/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search, AlertTriangle } from "lucide-react"
import { PopupWrapper } from "@/components/ui/popupWrapper"
import { Link, useNavigate } from "react-router-dom"
import { getHeaders, getAuthHeaders, getApiUrl } from "@/config/headers"

interface Addon {
  _id: string
  name: string
  description: string
  price: number
  image: string
  duration: number
  features: string[]
  requirements: string[]
  notes: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    addons: Addon[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch addons from API
  useEffect(() => {
    fetchAddons()
  }, [])

  const fetchAddons = async () => {
    try {
      setLoading(true)
      const API_URL = getApiUrl()
      const headers = getHeaders()
      const response = await fetch(`${API_URL}/addons`, { headers })
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setAddons(data.data.addons)
      } else {
        console.error("Failed to fetch addons:", data.message)
      }
    } catch (error) {
      console.error("Error fetching addons:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter addons based on search term
  const filteredAddons = addons.filter(addon =>
    addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    addon.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (addon: Addon) => {
    setSelectedAddon(addon)
    setIsDetailPopupOpen(true)
  }

  const handleEditAddon = (addon: Addon) => {
    navigate(`/update-addon/${addon._id}`, { state: { addon } })
  }

  const handleDeleteAddon = (addon: Addon) => {
    setSelectedAddon(addon)
    setIsDeletePopupOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedAddon) return

    setDeleteLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/addons/${selectedAddon._id}`, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()

      if (data.success) {
        // Remove the addon from the list
        setAddons(prev => prev.filter(addon => addon._id !== selectedAddon._id))
        setIsDeletePopupOpen(false)
        setSelectedAddon(null)
      } else {
        throw new Error(data.message || "Failed to delete addon")
      }
    } catch (error) {
      console.error("Error deleting addon:", error)
      alert("Failed to delete addon. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddNewAddon = () => {
    navigate('/add-addon')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading addons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Addons</h1>
          <p className="text-muted-foreground">
            Manage your service addons and extras
          </p>
        </div>
        <Button onClick={handleAddNewAddon}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Addon
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Addons</CardTitle>
          <CardDescription>
            Find specific addons by name or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search addons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Addons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Addons</CardTitle>
          <CardDescription>
            {filteredAddons.length} addon{filteredAddons.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => (
                <TableRow key={addon._id}>
                  <TableCell className="font-medium">{addon.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {addon.description}
                  </TableCell>
                  <TableCell>₹{addon.price}</TableCell>
                  <TableCell>{formatDuration(addon.duration)}</TableCell>
                  <TableCell>
                    <Badge variant={addon.active ? "default" : "secondary"}>
                      {addon.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(addon.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(addon)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAddon(addon)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteAddon(addon)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Popup */}
      <PopupWrapper
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        title={selectedAddon?.name}
        size="lg"
      >
        {selectedAddon && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price</label>
                <p className="text-lg font-semibold">₹{selectedAddon.price}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="text-lg font-semibold">{formatDuration(selectedAddon.duration)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{selectedAddon.description}</p>
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Features</label>
              <div className="mt-2 space-y-1">
                {selectedAddon.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Requirements</label>
              <div className="mt-2 space-y-1">
                {selectedAddon.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedAddon.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="mt-1 text-sm text-muted-foreground">{selectedAddon.notes}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={selectedAddon.active ? "default" : "secondary"}>
                  {selectedAddon.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Created</label>
                <p>{formatDate(selectedAddon.createdAt)}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Updated</label>
                <p>{formatDate(selectedAddon.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </PopupWrapper>

      {/* Delete Confirmation Popup */}
      <PopupWrapper
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        title="Delete Addon"
        size="md"
        showCloseButton={false}
      >
        {selectedAddon && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete "{selectedAddon.name}"?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone. This will permanently delete the addon and remove it from your system.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
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
                {deleteLoading ? "Deleting..." : "Delete Addon"}
              </Button>
            </div>
          </div>
        )}
      </PopupWrapper>
    </div>
  )
}
