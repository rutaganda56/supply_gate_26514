import { Sidebar } from "@/app/components/sidebar";
import { Calendar, User, Phone, Mail, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">12, July 2025</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Edit profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full name */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Full name:
              </label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">ruta vale</span>
              </div>
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Phone number
              </label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">+250 78662012</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email:</label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">valentin@gmail.com</span>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                username:
              </label>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">new shop</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Status:
              </label>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal-600" />
                <span className="text-gray-700">Approved</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
