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

interface ApiResponse {
  success: boolean
  message: string
  data: {
    categories: Category[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch categories from API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const API_URL = getApiUrl()
      const headers = getHeaders()
      const response = await fetch(`${API_URL}/categories`, { headers })
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setCategories(data.data.categories)
      } else {
        console.error("Failed to fetch categories:", data.message)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category)
    setIsDetailPopupOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    navigate(`/update-category/${category._id}`, { state: { category } })
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeletePopupOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCategory) return

    setDeleteLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/categories/${selectedCategory._id}`, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()

      if (data.success) {
        // Remove the category from the list
        setCategories(prev => prev.filter(category => category._id !== selectedCategory._id))
        setIsDeletePopupOpen(false)
        setSelectedCategory(null)
      } else {
        throw new Error(data.message || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleAddNewCategory = () => {
    navigate('/add-category')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Render icon (emoji or uploaded image)
  const renderIcon = (category: Category) => {
    if (category.image) {
      return (
        <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded border">
          <img 
            src={import.meta.env.VITE_PUBLIC_UPLOAD_API_URL + category.image} 
            alt={category.name}
            className="w-5 h-5 object-contain"
            onError={(e) => {
              console.log("Image failed to load:", category.image)
              e.currentTarget.style.display = 'none'
              // Show fallback emoji
              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji')
              if (fallback) {
                fallback.classList.remove('hidden')
              }
            }}
            onLoad={(e) => {
              console.log("Image loaded successfully:", category.image)
              // Hide fallback emoji
              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji')
              if (fallback) {
                fallback.classList.add('hidden')
              }
            }}
          />
          <span className="fallback-emoji hidden text-sm">{category.icon}</span>
        </div>
      )
    }
    return <span className="text-lg">{category.icon}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your service categories
          </p>
        </div>
        <Button onClick={handleAddNewCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Categories</CardTitle>
          <CardDescription>
            Find specific categories by name or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderIcon(category)}
                      {/* Fallback emoji (hidden by default, shown if image fails) */}
                      {category.image && (
                        <span className="text-lg hidden">{category.icon}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(category)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category)}
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
        title={selectedCategory?.name}
        size="lg"
      >
        {selectedCategory && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Icon</label>
              <div className="flex items-center gap-3 mt-1">
                {selectedCategory.image ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded border">
                    <img 
                      src={selectedCategory.image} 
                      alt={selectedCategory.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        console.log("Image failed to load:", selectedCategory.image)
                        e.currentTarget.style.display = 'none'
                        // Show fallback emoji
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji')
                        if (fallback) {
                          fallback.classList.remove('hidden')
                        }
                      }}
                      onLoad={(e) => {
                        console.log("Image loaded successfully:", selectedCategory.image)
                        // Hide fallback emoji
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji')
                        if (fallback) {
                          fallback.classList.add('hidden')
                        }
                      }}
                    />
                    <span className="fallback-emoji hidden text-xl">{selectedCategory.icon}</span>
                  </div>
                ) : null}
                <span className="text-2xl">{selectedCategory.icon}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{selectedCategory.description}</p>
            </div>

            {/* Icon URL */}
            {selectedCategory.image && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Icon URL</label>
                <p className="mt-1 text-sm text-muted-foreground break-all">{selectedCategory.image}</p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={selectedCategory.active ? "default" : "secondary"}>
                  {selectedCategory.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Created</label>
                <p>{formatDate(selectedCategory.createdAt)}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Updated</label>
                <p>{formatDate(selectedCategory.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </PopupWrapper>

      {/* Delete Confirmation Popup */}
      <PopupWrapper
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        title="Delete Category"
        size="md"
        showCloseButton={false}
      >
        {selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete "{selectedCategory.name}"?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone. This will permanently delete the category and remove it from your system.
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
                {deleteLoading ? "Deleting..." : "Delete Category"}
              </Button>
            </div>
          </div>
        )}
      </PopupWrapper>
    </div>
  )
}
