"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Globe,
  ArrowRight,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "best";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        index = 0;
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Supply Gate
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
              Home <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
              Products <ChevronDown size={16} />
            </button>
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Support
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
            <Globe size={16} />
            EN
          </button>
          <Link
            href="/login"
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            login
          </Link>
          <Link
            href="/signUp"
            className="bg-[#1e4d5c] text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-[#163d49] transition-colors"
          >
            sign up <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Take Supply From
              <br />
              better to {displayText}
              <span className="inline-block w-0.5 h-8 bg-gray-400 ml-1 animate-pulse" />
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Supply Gate is a trusted online marketplace designed to connect
              businesses with verified manufacturers and suppliers.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-8">Trusted by over 5k users</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1e4d5c] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white italic mb-2">
              Why Suppliers trust
              <br />
              supplyGate
            </h2>
            <Link
              href="#"
              className="text-white text-sm underline hover:no-underline"
            >
              Contact sales to request a demo
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold italic">ISO</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">#1</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">99%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">1000+</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">1000+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
            Loved by rwandan
            <br />
            best companies
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            KABISA
          </p>

          <div className="max-w-md mx-auto">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              "When the pandemic hit, those of us who thrive on in-person
              collaboration were worried that our creativity and productivity
              would suffer. Miro was the perfect tool to help us with
              collaboration whiteboarding, and retrospectives while remote."
            </p>
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Alice Mutoni
                </p>
                <p className="text-gray-500 text-xs">
                  Managing Director at kabisa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto bg-[#1e4d5c] rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Join 5k+ users today
          </h2>
          <p className="text-gray-300 text-sm mb-2">
            Start for free — upgrade anytime.
          </p>
          <Link
            href="#"
            className="text-white text-sm underline hover:no-underline mb-6 inline-block"
          >
            Joining as an organization? Contact Sales
          </Link>
          <div className="mt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1e4d5c] border border-white text-white px-6 py-2.5 rounded text-sm hover:bg-[#163d49] transition-colors"
            >
              Sign up free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e4d5c] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/signUp"
                    className="text-gray-300 text-sm hover:text-white"
                  >
                    supply gate for industries
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 text-sm hover:text-white"
                  >
                    view demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
            </div>
            <div>
              <h3 className="font-semibold mb-4">plans and pricing</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 text-sm hover:text-white"
                  >
                    contact sales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <span>2025 supply gate</span>
              <Link href="#" className="hover:underline">
                terms of service
              </Link>
              <Link href="#" className="hover:underline">
                privacy policy
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
