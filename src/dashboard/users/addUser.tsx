import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserForm } from "@/components/forms/userForm"

export default function AddUserPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New {getUserTypeLabel(userType)}</h1>
        <p className="text-muted-foreground">
          Create a new {getUserTypeLabel(userType).toLowerCase()} account with all necessary details
        </p>
      </div>

      <UserForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        editMode={false}
        userType={userType}
      />
    </div>
  )
}
