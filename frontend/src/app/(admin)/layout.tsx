import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/ui-navbar/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <SidebarTrigger className="mr-10" />
        {children}
      </main>
    </SidebarProvider>
  )
}
