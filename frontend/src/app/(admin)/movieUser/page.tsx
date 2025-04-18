/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
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

interface User {
  _id: string
  username: string
  fullName: string
  email: string
  avatar?: string
}

// Mảng các màu nền cho avatar
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
  const [formData, setFormData] = useState<{
    username: string
    fullName: string
    email: string
    password?: string
  }>({
    username: "",
    fullName: "",
    email: "",
    password: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  // Hàm tạo màu ngẫu nhiên cho avatar dựa trên ID của người dùng
  const getAvatarColor = useCallback((userId: string) => {
    const index =
      Math.abs(
        userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }, [])

  // Hàm lấy ký tự đầu tiên từ username hoặc fullName
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
      setUsers(response.data || []) // Fallback to empty array
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
      setUsers(response.data || [])
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
      await register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
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
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    try {
      await UserService.updateProfile({
        username: formData.username,
        fullName: formData.fullName,
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
    })
    setSelectedUser(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Admin Dashboard</CardTitle>
          <CardDescription>
            Manage your user accounts with full CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleSearch}>Search</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto">Add New User</Button>
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
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{renderUserAvatar(user)}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
            <Button onClick={handleUpdateUser}>Update User</Button>
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
              user "{selectedUser?.username}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
