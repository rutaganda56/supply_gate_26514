"use client"

import { ChevronDown, Globe, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { WebsiteFooter } from "@/app/components/website-footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Supply Gate
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/website/products" className="text-sm text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/website/pricing" className="text-sm text-[#1e4d5c] font-semibold hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/website/support" className="text-sm text-gray-700 hover:text-gray-900">
              Support
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
            <Globe size={16} />
            EN
          </Button>
          <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900">
            login
          </Link>
          <Button asChild className="bg-[#1e4d5c] hover:bg-[#163d49] text-white">
            <Link href="/signUp" className="flex items-center gap-2">
              sign up <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
            <p className="text-gray-600 text-lg">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Perfect for getting started</p>
              <Button asChild variant="secondary" className="w-full mb-6">
                <Link href="/signUp">Get Started</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Browse verified suppliers</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Up to 10 messages per month</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Basic product search</span>
                </li>
              </ul>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-lg border-2 border-[#1e4d5c] p-8 relative shadow-lg">
              <div className="absolute top-0 right-6 bg-[#1e4d5c] text-white px-3 py-1 text-xs font-semibold rounded-b">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For growing businesses</p>
              <Button asChild className="w-full mb-6 bg-[#1e4d5c] hover:bg-[#163d49] text-white">
                <Link href="/signUp">Get Started</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All Free features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Unlimited messages</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Advanced search & filters</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Request for quotes</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For large organizations</p>
              <Button asChild variant="secondary" className="w-full mb-6">
                <Link href="/website/support">Contact Sales</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All Professional features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  )
}
