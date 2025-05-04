"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Role } from "../../lib/types";

// Icons
import {
  Package, Users, UserCog, ShieldCheck, ClipboardCheck,
  ChevronDown, ChevronRight, LogOut, Menu, X
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simple check - in a real app, you'd validate the session server-side
        const userData = localStorage.getItem('admin_user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.includes(permission);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>; // This allows the login page to render
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <ClipboardCheck size={18} />,
      active: pathname === "/admin",
      permission: null
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package size={18} />,
      active: pathname.startsWith("/admin/products"),
      permission: "manage_products"
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users size={18} />,
      active: pathname.startsWith("/admin/customers"),
      permission: "manage_customers"
    },
    {
      name: "Warranties",
      href: "/admin/warranties",
      icon: <ShieldCheck size={18} />,
      active: pathname.startsWith("/admin/warranties"),
      permission: "manage_warranties"
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: <UserCog size={18} />,
      active: pathname.startsWith("/admin/users"),
      permission: "manage_users"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold text-gray-800">
          K-S Enterprise Admin
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar & Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? "fixed inset-0 z-50 block" : "hidden"
          } lg:relative lg:block bg-white border-r border-gray-200 w-64 h-screen overflow-y-auto`}
        >
          <div className="p-6 hidden lg:block">
            <Link href="/admin" className="text-xl font-bold text-gray-800">
              K-S Enterprise Admin
            </Link>
          </div>

          {/* Close button for mobile */}
          {isMobileMenuOpen && (
            <div className="p-4 flex justify-end lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {/* User info */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user.fullName?.charAt(0) || user.username.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.fullName || user.username}</p>
                <p className="text-xs text-gray-500">{user.role?.name || "User"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2 px-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                // Skip items the user doesn't have permission for
                if (item.permission && !hasPermission(item.permission)) {
                  return null;
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm rounded-md ${
                        item.active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="px-6 py-4 mt-auto border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
