"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, Heart } from "lucide-react";

const NAVIGATION = [
  { id: "shop", href: "/collections", title: "Shop Kurties" },
  { id: "new", href: "/collections", title: "New Arrivals" },
  { id: "story", href: "/information/our-story", title: "Our Story" },
  { id: "care", href: "/information/returns", title: "Customer Care" },
];

import { useCart } from "@/context/cart-context";

export default function PremiumKurtiHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed w-full z-50">
      {/* Subtle Top Banner */}
      <div className="bg-gray-900 text-white border-b border-gray-800 overflow-hidden relative h-[32px]">
        <div className="absolute top-0 left-0 w-full h-full flex items-center overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center mx-8 text-xs tracking-wider">
                <span className="font-medium text-yellow-200 mr-2">LAUNCH OFFER:</span>
                <span className="font-light mr-4">Get 25% OFF on all products! Valid until Feb 26, 2026</span>
                <span className="text-gray-600">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <span className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 transition-opacity duration-300 group-hover:opacity-70">
                YURA
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAVIGATION.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="relative text-sm font-light tracking-wide text-gray-700 hover:text-gray-900 transition-colors duration-300 py-2 group"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gray-900 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <a
                href="/collections"
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </a>

              <a href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gray-900 text-white text-[10px] font-medium rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300"
                aria-label="Menu"
              >
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? "top-[9px] rotate-45" : "top-1"
                      }`}
                  ></span>
                  <span
                    className={`absolute left-0 top-[9px] w-5 h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"
                      }`}
                  ></span>
                  <span
                    className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? "top-[9px] -rotate-45" : "top-[17px]"
                      }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
            style={{ top: "88px" }}
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed left-0 right-0 lg:hidden bg-white shadow-xl"
            style={{ top: "88px", maxHeight: "calc(100vh - 88px)", overflowY: "auto" }}
          >
            <div className="container mx-auto px-0 sm:px-6 py-8">
              <nav className="space-y-1">
                {NAVIGATION.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 border-b border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <span className="text-sm font-light tracking-wide">{item.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}