"use client"

import { useState, useEffect } from "react"
import { SunIcon, MoonIcon, Globe, Check } from "lucide-react"
import { JSX } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"

// CustomSwitch component từ code bạn đã chia sẻ
interface CustomSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function CustomSwitch({
  checked,
  onCheckedChange,
}: CustomSwitchProps): JSX.Element {
  // Khởi tạo với prop checked, không truy cập localStorage ngay
  const [isChecked, setIsChecked] = useState(checked)

  // Đồng bộ với localStorage sau khi mount
  useEffect(() => {
    // Chỉ chạy trên client
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      const savedValue = JSON.parse(saved)
      setIsChecked(savedValue)
      onCheckedChange(savedValue) // Đồng bộ với parent ngay lập tức
    }
  }, [onCheckedChange]) // Chạy một lần khi mount

  // Đồng bộ với prop checked từ parent
  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  // Xử lý khi toggle
  const handleToggle = (newChecked: boolean) => {
    setIsChecked(newChecked)
    onCheckedChange(newChecked)
    localStorage.setItem("darkMode", JSON.stringify(newChecked))
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => handleToggle(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out shadow-md ${
          isChecked ? "bg-[#4599e3] " : " bg-white"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
            isChecked ? "translate-x-5" : "translate-x-1"
          }`}
        >
          <SunIcon
            className={`w-4 h-4 text-[#4599e3] transition-opacity duration-300 ${
              isChecked ? "opacity-0" : "opacity-100"
            }`}
          />
          <MoonIcon
            className={`w-4 h-4 text-white absolute transition-opacity duration-300 ${
              isChecked ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </label>
  )
}

// Component chuyển đổi ngôn ngữ kiểu vuông theo shadcn UI
interface LanguageSwitchProps {
  language: string
  onLanguageChange: (language: string) => void
}

function LanguageSwitch({ language, onLanguageChange }: LanguageSwitchProps) {
  const languages = [
    { code: "vi", name: "Tiếng Việt" },
    { code: "en", name: "English" },
  ]

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      onLanguageChange(savedLanguage)
    }
  }, [onLanguageChange])

  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem("language", langCode)
    onLanguageChange(langCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{language === "vi" ? "Tiếng Việt" : "English"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span>{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Component chính Settings Tab
export default function SettingsTabContent() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("vi")
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
  })

  // Đồng bộ dark mode với document
  useEffect(() => {
    // Khởi tạo từ localStorage
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode)
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      // Kiểm tra thiết lập của hệ thống
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }

    // Khởi tạo ngôn ngữ từ localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Xử lý khi thay đổi dark mode
  const handleDarkModeChange = (isDark: boolean) => {
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Xử lý khi thay đổi ngôn ngữ
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
  }

  // Các chuỗi văn bản đa ngôn ngữ
  const translations = {
    vi: {
      appearance: "Giao diện",
      darkMode: "Chế độ tối",
      language: "Ngôn ngữ",
      notifications: "Thông báo",
      emailNotif: "Email",
      browserNotif: "Trình duyệt",
    },
    en: {
      appearance: "Appearance",
      darkMode: "Dark mode",
      language: "Language",
      notifications: "Notifications",
      emailNotif: "Email",
      browserNotif: "Browser",
    },
  }

  // Lấy văn bản dựa trên ngôn ngữ hiện tại
  const t = translations[language as keyof typeof translations]

  return (
    <TabsContent
      value="settings"
      className="space-y-6 py-2 overflow-y-auto max-h-[calc(100vh-200px)]"
    >
      <Card>
        <CardHeader>
          <CardTitle>{t.appearance}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.darkMode}</Label>
            </div>
            <CustomSwitch
              checked={darkMode}
              onCheckedChange={handleDarkModeChange}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label>{t.language}</Label>
            <LanguageSwitch
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.notifications}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">{t.emailNotif}</Label>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="browser-notifications">{t.browserNotif}</Label>
            <Switch
              id="browser-notifications"
              checked={notifications.browser}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, browser: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
