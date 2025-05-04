"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Users, ShieldCheck, ClipboardList,
  ArrowUpRight, Calendar, BarChart3
} from "lucide-react";

interface DashboardStats {
  products: number;
  customers: number;
  warranties: number;
  activeWarranties: number;
  expiringWarranties: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    customers: 0,
    warranties: 0,
    activeWarranties: 0,
    expiringWarranties: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchStats = async () => {
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          setStats({
            products: 48,
            customers: 26,
            warranties: 32,
            activeWarranties: 28,
            expiringWarranties: 3
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  // Dashboard cards with key metrics
  const cards = [
    {
      title: "Products",
      value: stats.products,
      icon: <Package className="h-8 w-8 text-blue-500" />,
      href: "/admin/products",
      color: "blue"
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: <Users className="h-8 w-8 text-green-500" />,
      href: "/admin/customers",
      color: "green"
    },
    {
      title: "Warranties",
      value: stats.warranties,
      icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
      href: "/admin/warranties",
      color: "purple"
    },
    {
      title: "Active Warranties",
      value: stats.activeWarranties,
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      href: "/admin/warranties?status=active",
      color: "indigo"
    },
  ];

  // Quick actions for common tasks
  const quickActions = [
    {
      title: "Add new product",
      href: "/admin/products/new",
      icon: <Package size={16} />,
      color: "blue"
    },
    {
      title: "Add new customer",
      href: "/admin/customers/new",
      icon: <Users size={16} />,
      color: "green"
    },
    {
      title: "Register warranty",
      href: "/admin/warranties/new",
      icon: <ShieldCheck size={16} />,
      color: "purple"
    },
    {
      title: "View reports",
      href: "/admin/reports",
      icon: <BarChart3 size={16} />,
      color: "gray"
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to K-S Enterprise Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`block p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">{card.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Expiring Warranties Alert */}
      {stats.expiringWarranties > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarAlert className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Attention Required</h3>
              <div className="mt-1 text-sm text-amber-700">
                {stats.expiringWarranties} {stats.expiringWarranties === 1 ? 'warranty' : 'warranties'} expiring in the next 30 days.{' '}
                <Link href="/admin/warranties?expiring=true" className="font-medium underline">
                  View all
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`flex items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`flex-shrink-0 p-2 rounded-md bg-${action.color}-50 text-${action.color}-700`}>
                {action.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">{action.title}</p>
              </div>
              <ArrowUpRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-4 text-sm text-gray-500 text-center">
              No recent activity to display.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarAlert(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M12 15h.01" />
      <path d="M12 11v2" />
    </svg>
  );
}
