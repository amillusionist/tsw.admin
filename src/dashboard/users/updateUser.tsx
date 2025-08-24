import React from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { UserForm } from "@/components/forms/userForm"

export default function UpdateUserPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const user = location.state?.user
  const userType = location.state?.userType || "customers"

  const handleSuccess = () => {
    navigate("/users")
  }

  const handleCancel = () => {
    navigate("/users")
  }

  const getUserTypeLabel = (type: string): string => {
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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getUserTypeLabel(userType)} Not Found</h1>
          <p className="text-gray-600 mb-6">
            The {getUserTypeLabel(userType).toLowerCase()} data could not be loaded. Please go back and try again.
          </p>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Update {getUserTypeLabel(userType)}</h1>
        <p className="text-muted-foreground">
          Update {getUserTypeLabel(userType).toLowerCase()} information and account details
        </p>
      </div>

      <UserForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        editMode={true}
        initialData={user}
        userType={userType}
      />
    </div>
  )
}
