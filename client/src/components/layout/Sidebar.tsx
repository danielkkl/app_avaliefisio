import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  History,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Activity,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pacientes", href: "/pacientes", icon: Users },
  { name: "Avaliações", href: "/fichas", icon: FileText },
  { name: "Evoluções", href: "/evolucoes", icon: History },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#1e3a8a] text-white">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
          <Activity className="w-5 h-5 text-[#1e3a8a]" />
        </div>
        <span className="font-sans font-bold text-xl tracking-tight text-white">
          Fisioterapia
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1 py-4">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all cursor-pointer group",
                  isActive
                    ? "bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-blue-200 group-hover:text-white"
                )} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold overflow-hidden">
            {user?.firstName?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Dr. Daniel'}
            </p>
            <p className="text-[10px] text-blue-200 truncate uppercase tracking-wider font-bold">Fisioterapeuta</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-blue-100 hover:text-white hover:bg-white/10 px-2"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col shadow-2xl z-20">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-md border-blue-100">
              <Menu className="w-5 h-5 text-[#1e3a8a]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
