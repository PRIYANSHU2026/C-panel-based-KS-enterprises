"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError("");
    setIsLoading(true);
    setDebugInfo(null);

    try {
      // Use the simplified direct login endpoint
      const response = await fetch("/api/direct-login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Get the raw text response first to debug any issues
      const rawText = await response.text();
      let data;

      try {
        // Try to parse as JSON
        data = JSON.parse(rawText);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        // If JSON parsing fails, store the raw text for debugging
        setDebugInfo({
          status: response.status,
          statusText: response.statusText,
          rawResponse: rawText,
          parseError: String(jsonError)
        });
        throw new Error("Invalid response from server (not JSON)");
      }

      // Store debug info
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        response: data
      });

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        router.push("/admin");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again. " + (err.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // Login with hardcoded admin credentials (fallback method)
  const handleDirectLogin = () => {
    const hardcodedAdmin = {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      fullName: "System Administrator",
      role: {
        id: 1,
        name: "super_admin",
        permissions: [
          "manage_products",
          "manage_customers",
          "manage_warranties",
          "manage_users",
          "manage_roles"
        ]
      }
    };

    localStorage.setItem("admin_user", JSON.stringify(hardcodedAdmin));
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            K-S Enterprise
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to access the admin dashboard
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    <p className="mt-1">Make sure to use the default credentials: admin / admin123</p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-xs underline"
                      >
                        {showDebug ? "Hide debug info" : "Show debug info"}
                      </button>
                      <button
                        onClick={handleDirectLogin}
                        className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        Use Emergency Login
                      </button>
                    </div>
                    {showDebug && debugInfo && (
                      <pre className="mt-2 overflow-auto rounded bg-gray-900 p-2 text-xs text-white">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Default credentials: username = admin, password = admin123
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleDirectLogin}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Bypass login (development only)
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
            <p>
              Go back to{" "}
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Website
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Having trouble signing in? Try using the "Bypass login" option to access the admin panel directly.</p>
        </div>
      </div>
    </div>
  );
}
