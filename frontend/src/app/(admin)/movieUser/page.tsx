/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import UserService from "@/services/userService"
import { register } from "@/services/authService"
import { getFullImageUrl } from "@/utils/getFullImageUrl"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, UserRoundPlus, Eye } from "lucide-react"
interface User {
  _id: string
  username: string
  fullName: string
  email: string
  avatar?: string
  role: string
}

// Array of background colors for avatars
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
]

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<string>("")
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    avatar: true,
    username: true,
    fullName: true,
    email: true,
    role: true,
  })
  const [formData, setFormData] = useState<{
    username: string
    fullName: string
    email: string
    password?: string
    role: string
  }>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "user",
  })
  const { toast } = useToast()
  const router = useRouter()

  // Function to generate a random color for avatar based on user ID
  const getAvatarColor = useCallback((userId: string) => {
    const index =
      Math.abs(
        userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }, [])

  // Function to get the first character from username or fullName
  const getInitial = useCallback((user: User) => {
    if (user.fullName && user.fullName.trim().length > 0) {
      return user.fullName.trim()[0].toUpperCase()
    }
    if (user.username && user.username.trim().length > 0) {
      return user.username.trim()[0].toUpperCase()
    }
    return "?"
  }, [])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to continue",
          variant: "destructive",
        })
        router.push("/login")
        return
      }
      const response = await UserService.getAllUsers()
      console.log("Fetch Users Response:", response)

      // Add a default role if none is provided
      const usersWithRoles = (response.data || []).map(
        (user: { role: any }) => ({
          ...user,
          role: user.role || "user",
        })
      )

      setUsers(usersWithRoles)
    } catch (error: any) {
      console.error("Fetch Users Error:", error.response || error)
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      if (error.response?.status === 401) {
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast, router])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchUsers()
      return
    }
    setIsLoading(true)
    try {
      const response = await UserService.searchUsers(searchTerm)
      console.log("Search Users Response:", response)
      // Add a default role if none is provided
      const usersWithRoles = (response.data || []).map(
        (user: { role: any }) => ({
          ...user,
          role: user.role || "user",
        })
      )
      setUsers(usersWithRoles)
    } catch (error: any) {
      console.error("Search Users Error:", error.response || error)
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to search users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }
    try {
      // Assuming the register function has been updated to accept a role parameter
      await register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      toast({
        title: "Success",
        description: "User added successfully",
      })
      fetchUsers()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to add user",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role || "user",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    try {
      // Assuming the updateProfile function has been updated to accept a role parameter
      await UserService.updateProfile({
        username: formData.username,
        fullName: formData.fullName,
        role: formData.role,
        avatarFile: undefined,
        backgroundFile: undefined,
      })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      fetchUsers()
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await UserService.deleteUser(selectedUser._id)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      fetchUsers()
      setIsDeleteDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "user",
    })
    setSelectedUser(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  // Function to toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }))
  }

  const renderUserAvatar = useCallback(
    (user: User) => {
      // Check if user has an avatar
      if (user.avatar) {
        const avatarUrl = getFullImageUrl(user.avatar)
        return (
          <img
            src={avatarUrl}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover"
          />
        )
      }

      // Generate avatar with initials and background color
      return (
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(
            user._id
          )}`}
        >
          {getInitial(user)}
        </div>
      )
    },
    [getAvatarColor, getInitial]
  )

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user._id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleBulkAction = async () => {
    if (selectedUsers.length === 0 || !bulkAction) {
      toast({
        title: "Error",
        description: "Please select users and an action",
        variant: "destructive",
      })
      return
    }

    try {
      // Implement bulk action logic based on the action type
      switch (bulkAction) {
        case "delete":
          // Call API to delete selected users
          await Promise.all(
            selectedUsers.map((userId) => UserService.deleteUser(userId))
          )
          toast({
            title: "Success",
            description: `${selectedUsers.length} users deleted successfully`,
          })
          break
        case "changeRole":
          break
        default:
          toast({
            title: "Error",
            description: "Invalid action selected",
            variant: "destructive",
          })
      }

      fetchUsers()
      setIsBulkActionDialogOpen(false)
      setSelectedUsers([])
      setBulkAction("")
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to perform bulk action",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-400 hover:bg-blue-500"
      default:
        return "bg-black hover:bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="mb-8 shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">
            User Admin Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage your user accounts with full CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="">
              <Input
                placeholder="filter users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 font-mono"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-black hover:bg-gray-700 duration-300"
            >
              Search
            </Button>

            {selectedUsers.length > 0 && (
              <Button
                onClick={() => setIsBulkActionDialogOpen(true)}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Actions ({selectedUsers.length})
              </Button>
            )}

            {/* View Column Toggle Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto mr-2 border-gray-400 text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" /> View Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.avatar}
                  onCheckedChange={() => toggleColumnVisibility("avatar")}
                >
                  Avatar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.username}
                  onCheckedChange={() => toggleColumnVisibility("username")}
                >
                  Username
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.fullName}
                  onCheckedChange={() => toggleColumnVisibility("fullName")}
                >
                  Full Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.email}
                  onCheckedChange={() => toggleColumnVisibility("email")}
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.role}
                  onCheckedChange={() => toggleColumnVisibility("role")}
                >
                  Role
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-700">
                  Add New User <UserRoundPlus className="ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new user
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      defaultValue={formData.role}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    className="bg-black hover:bg-gray-700 duration-300"
                  >
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onCheckedChange={handleSelectAllUsers}
                      />
                    </TableHead>
                    {columnVisibility.avatar && <TableHead>Avatar</TableHead>}
                    {columnVisibility.username && (
                      <TableHead>Username</TableHead>
                    )}
                    {columnVisibility.fullName && (
                      <TableHead>Full Name</TableHead>
                    )}
                    {columnVisibility.email && <TableHead>Email</TableHead>}
                    {columnVisibility.role && <TableHead>Role</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user._id}
                        className={
                          selectedUsers.includes(user._id) ? "bg-blue-50" : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user._id)}
                            onCheckedChange={() => handleSelectUser(user._id)}
                          />
                        </TableCell>
                        {columnVisibility.avatar && (
                          <TableCell>{renderUserAvatar(user)}</TableCell>
                        )}
                        {columnVisibility.username && (
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                        )}
                        {columnVisibility.fullName && (
                          <TableCell>{user.fullName}</TableCell>
                        )}
                        {columnVisibility.email && (
                          <TableCell className="text-gray-600">
                            {user.email}
                          </TableCell>
                        )}
                        {columnVisibility.role && (
                          <TableCell>
                            <Badge
                              className={`${getRoleBadgeStyle(user.role)}`}
                            >
                              {user.role || "user"}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2"
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                                onClick={() => handleDeleteClick(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {users.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing {users.length} users{" "}
                {selectedUsers.length > 0 &&
                  `(${selectedUsers.length} selected)`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                defaultValue={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="bg-blue-400 hover:bg-blue-600"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user "{selectedUser?.username}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog */}
      <Dialog
        open={isBulkActionDialogOpen}
        onOpenChange={setIsBulkActionDialogOpen}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply actions to {selectedUsers.length} selected users
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-action">Select Action</Label>
              <Select onValueChange={(value) => setBulkAction(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="changeRole">Change Role</SelectItem>
                  <SelectItem value="delete">Delete Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkAction === "changeRole" && (
              <div className="space-y-2">
                <Label htmlFor="new-role">New Role</Label>
                <Select
                  defaultValue={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBulkActionDialogOpen(false)
                setBulkAction("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkAction}
              className={
                bulkAction === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              Apply to {selectedUsers.length} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
