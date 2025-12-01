"use client"

import { useState } from "react"
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="min-h-screen flex">
            {/* Left teal sidebar */}
            <div className="w-[180px] bg-[#1e4d5c] hidden md:block" />

            {/* Right content area */}
            <div className="flex-1 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">
                    {/* Title */}
                    <h1 className="text-3xl font-medium text-center mb-10 text-gray-800">Register</h1>

                    {/* Form */}
                    <form className="space-y-5">
                        {/* Full names field */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="full names"
                                className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Phone number field */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Phone size={18} />
                            </div>
                            <input
                                type="tel"
                                placeholder="phone number"
                                className="w-full pl-12 pr-4 py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-600 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Email field */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="email"
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

                        {/* Confirm password field */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="confirm password"
                                className="w-full pl-12 pr-12 py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none text-gray-600 placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Sign up button */}
                        <button
                            type="submit"
                            className="w-full bg-[#1e4d5c] text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-[#163d49] transition-colors mt-8"
                        >
                            sign up
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
