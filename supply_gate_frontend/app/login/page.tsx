"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowRight, LogOut } from "lucide-react";
import CheckBox from "@/app/components/ui/checkbox";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left teal sidebar */}
      <div className="w-60 bg-[#1e4d5c] hidden md:block" />

      {/* Right content area */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl font-medium text-center mb-10 text-gray-800">
            Supply Gate
          </h1>

          {/* Form */}
          <form className="space-y-6">
            {/* Username/Email field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="username/email"
                className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-600 placeholder:text-gray-400"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="w-full pl-12 pr-12 py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-600 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckBox
                  id="remember"
                  className="border-gray-400 data-[state=checked]:bg-[#1e4d5c] data-[state=checked]:border-[#1e4d5c]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-[#1e4d5c] hover:underline">
                forgot password?
              </Link>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full bg-[#1e4d5c] text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-[#163d49] transition-colors"
            >
              <Link href={"/dashboard"}>login</Link>
              <LogOut className="w-5 h-5" />
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account ?{" "}
            <Link href="/signUp" className="text-[#1e4d5c] hover:underline">
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
