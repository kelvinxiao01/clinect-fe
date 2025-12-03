"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);

    try {
      const response = await login(username.trim());

      if (response.success) {
        router.push("/search");
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Clinect
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Clinical Trial Patient Matching Platform
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Mock authentication - enter any username
          </p>
        </div>
      </div>
    </div>
  );
}
