"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { href: "/search", label: "Search" },
    { href: "/saved", label: "Saved Trials" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/search" className="text-xl font-semibold text-gray-900">
              Clinect
            </Link>

            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
