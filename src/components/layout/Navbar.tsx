"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, Search, Lock, Star, HelpCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    label: "Layanan Jasa",
    href: "#layanan",
    icon: <FileText size={16} />,
    children: [
      { label: "Paket-Hemat", href: "/paket-hemat" },
      { label: "CV ATS Friendly", href: "/cv-ats" },
      { label: "Surat Lamaran Profesional", href: "/surat-lamaran" },
      { label: "Surat Legal", href: "/legal" },
      { label: "Pendaftaran NPWP", href: "/npwp" },
      { label: "Pendampingan Akademik", href: "/akademik" },
      { label: "Data Entry", href: "/data-entry" },
      
    ],
  },
  {
    label: "Cara Kerja",
    href: "/cara-kerja",
    icon: <HelpCircle size={16} />,
  },

  {
    label: "Testimoni",
    href: "/testimoni",
    icon: <Star size={16} />,
  },
  {
    label: "Kontak",
    href: "/kontak",
    icon: <Phone size={16} />,
  },
  {
    label: "Cek status pesanan",
    href: "/cek-order",
    icon: <Search size={16} />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-md transition-transform group-hover:scale-105">
            <Image
              src="/logo.avif"
              alt="Arifin Docs & Design"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-blue-800 sm:text-base">
              Arifin Docs
            </span>
            <span className="text-[10px] font-medium text-blue-400 tracking-wider uppercase">
              & Design
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative group">
              {item.children ? (
                <>
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                      activeDropdown === item.label && "bg-blue-50 text-blue-700"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.label}
                  >
                    {item.icon}
                    {item.label}
                    <svg
                      className={cn(
                        "h-3 w-3 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    className={cn(
                      "absolute left-0 top-full mt-1 w-56 origin-top-left rounded-xl border border-blue-100 bg-white py-1.5 shadow-xl transition-all duration-150",
                      activeDropdown === item.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map((child) => {
                      const isPaketHemat = child.href === "/paket-hemat";

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm text-slate-600 transition-colors",
                            isPaketHemat
                              ? "hover:text-transparent hover:bg-linear-to-r hover:from-blue-700 hover:via-cyan-500 hover:to-sky-400 hover:bg-clip-text"
                              : "hover:bg-blue-50 hover:text-blue-700",
                            pathname === child.href && "bg-blue-50 font-semibold text-blue-700"
                          )}
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-300" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                    pathname === item.href && "text-blue-700"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-50 hover:border-blue-300"
          >
            <Lock size={14} />
            Login Admin
          </Link>
          <Link
            href="#layanan"
            className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md active:scale-95"
          >
            Mulai Sekarang
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 lg:hidden"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          "overflow-hidden border-t border-blue-100 bg-white transition-all duration-300 lg:hidden",
          isMenuOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50"
                    aria-expanded={activeDropdown === item.label}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <svg
                      className={cn(
                        "h-4 w-4 transition-transform text-slate-400",
                        activeDropdown === item.label && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeDropdown === item.label && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-blue-100 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenu}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors",
                            child.href === "/paket-hemat"
                              ? "hover:text-transparent hover:bg-linear-to-r hover:from-blue-700 hover:via-cyan-500 hover:to-sky-400 hover:bg-clip-text"
                              : "hover:bg-blue-50 hover:text-blue-700",
                            pathname === child.href && "font-semibold text-blue-700"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50"
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile CTA */}
          <div className="border-t border-blue-100 pt-3 space-y-2">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              <Lock size={14} />
              Login Admin
            </Link>
            <Link
              href="#layanan"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}