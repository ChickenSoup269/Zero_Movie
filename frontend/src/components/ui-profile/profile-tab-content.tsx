import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Check, X, Key } from "lucide-react"

interface ProfileTabContentProps {
  formData: {
    fullName: string
    username: string
  }
  user: {
    fullName?: string
    username?: string
    email?: string
  }
  userProfile?: {
    fullName?: string
    username?: string
    email?: string
  }
  isEditingFullName: boolean
  isEditingUsername: boolean
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEditFullName: (isEditing: boolean) => void
  onEditUsername: (isEditing: boolean) => void
  onResetPassword: () => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export default function ProfileTabContent({
  formData,
  user,
  userProfile,
  isEditingFullName,
  isEditingUsername,
  isLoading,
  onInputChange,
  onEditFullName,
  onEditUsername,
  onResetPassword,
  onSubmit,
  onCancel,
}: ProfileTabContentProps) {
  return (
    <form onSubmit={onSubmit} className="px-6 pb-6">
      <div className="space-y-4">
        <div className="space-y-4">
          {/* Full Name với icon bút chỉnh sửa */}
          <div>
            <Label htmlFor="fullName" className="flex items-center gap-1 pb-2">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={onInputChange}
                placeholder="Enter your full name"
                disabled={!isEditingFullName}
                className={
                  !isEditingFullName
                    ? "pr-10 bg-gray-50 dark:bg-gray-800"
                    : "pr-20"
                }
              />
              {!isEditingFullName ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-8 w-8"
                  onClick={() => onEditFullName(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-green-600"
                    onClick={() => onEditFullName(false)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-red-600"
                    onClick={() => {
                      onEditFullName(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Username với icon bút chỉnh sửa */}
          <div>
            <Label htmlFor="username" className="flex items-center gap-1 pb-2">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={onInputChange}
                placeholder="Enter your username"
                disabled={!isEditingUsername}
                className={
                  !isEditingUsername
                    ? "pr-10 bg-gray-50 dark:bg-gray-800"
                    : "pr-20"
                }
              />
              {!isEditingUsername ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-8 w-8"
                  onClick={() => onEditUsername(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-green-600"
                    onClick={() => onEditUsername(false)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-red-600"
                    onClick={() => {
                      onEditUsername(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="pb-2">
              Email (Cannot be changed)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                name="email"
                value={userProfile?.email || user?.email || "No email"}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onResetPassword}
                className="flex items-center space-x-1"
              >
                <Key className="h-4 w-4" />
                <span>Reset Password</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
