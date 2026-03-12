import { ReactNode, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "wouter";
import {
  Stethoscope,
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  Images,
  Activity,
  Users,
  BookOpen,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "wouter";
import { PolicyModal } from "@/components/clinic/PolicyModal";

interface PublicLayoutProps {
  children: ReactNode;
  clinicName?: string;
  logoUrl?: string;
  branches?: { address?: string }[];
  contact?: {
    opening_hours?: { days: string; hours: string; is_closed?: boolean }[];
    phone?: string;
    address?: string;
  };
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  policies?: {
    privacy_policy?: string;
    terms_conditions?: string;
  };
  footer_description?: string;
  openingHours?: { days: string; hours: string; is_closed?: boolean }[];
  seo?: { meta_title?: string; meta_description?: string } | undefined;
  features: {
    enable_blog: boolean;
    enable_faq: boolean;
  };
}

export function PublicLayout({
  children,
  clinicName = "Our Clinic",
  logoUrl,
  branches,
  contact,
  social,
  policies,
  footer_description,
  seo,
  features,
}: PublicLayoutProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
  });
  useEffect(() => {
    try {
      const title = seo?.meta_title || clinicName;
      if (title) document.title = title;

      const desc = seo?.meta_description;
      let meta = document.querySelector(
        'meta[name="description"]',
      ) as HTMLMetaElement | null;
      if (desc) {
        if (meta) meta.content = desc;
        else {
          meta = document.createElement("meta");
          meta.name = "description";
          meta.content = desc;
          document.head.appendChild(meta);
        }
      } else if (meta) {
        // clear existing description if none provided
        meta.content = "";
      }
    } catch (e) {
      // noop in server-side or if document not available
    }
  }, [seo, clinicName]);

  // Scroll to top on route change (for SPA navigation)
  const [location] = useLocation();
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    } catch (e) {
      // noop
    }
  }, [location]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWhatsappMessage, setShowWhatsappMessage] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<string>("5rem");

  // Get active nav item based on current location
  const getActiveNav = (href: string) => {
    const hash = window.location.hash.slice(1); // Remove # from hash
    const pathname = location;

    if (href.startsWith("#")) {
      // Hash links are only active on home page
      return pathname === "/" && hash === href.slice(1);
    }
    return pathname === href;
  };

  // Handle hash link navigation from other pages
  const handleHashNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (location !== "/") {
      e.preventDefault();
      // Navigate to home page with hash
      window.location.href = `/#${hash.slice(1)}`;
    }
  };

  useLayoutEffect(() => {
    function update() {
      try {
        const el = headerRef.current;
        if (el) {
          // Prefer bounding rect bottom so we place the drawer below the visible header
          const rect = el.getBoundingClientRect();
          const bottom = rect.bottom;
          if (bottom && !isNaN(bottom) && bottom > 0) {
            setHeaderHeight(`${Math.round(bottom)}px`);
          } else {
            const h = el.offsetHeight;
            if (h) setHeaderHeight(`${h}px`);
          }
        }
      } catch (e) {
        // noop
      }
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // Recompute header height when menu opens (ensures correct placement)
  useEffect(() => {
    if (!menuOpen) return;
    try {
      const el = headerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const bottom = rect.bottom;
        if (bottom && !isNaN(bottom) && bottom > 0)
          setHeaderHeight(`${Math.round(bottom)}px`);
        else if (el.offsetHeight) setHeaderHeight(`${el.offsetHeight}px`);
      }
    } catch (e) {
      // noop
    }
  }, [menuOpen]);
  const primaryAddress =
    contact?.address || branches?.[0]?.address || "123 Medical Center Blvd.";
  const phone = contact?.phone || "(555) 123-4567";
  // `social` comes from clinic config top-level (optional)
  const openingHours = contact?.opening_hours || [
    { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { days: "Saturday", hours: "9:00 AM - 2:00 PM" },
    { days: "Sunday", hours: "Closed", is_closed: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm font-medium">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Opening hours - only on desktop */}
            <span className="hidden md:flex items-center gap-2 whitespace-nowrap text-sm text-primary-foreground/90">
              <Clock className="w-4 h-4" />
              {openingHours[0]?.hours}
            </span>

            {/* Address - show on mobile and desktop, truncate if long */}
            <span className="flex items-center gap-2 min-w-0 max-w-[100%] md:max-w-[200%]">
              <MapPin className="w-4 h-4" />{" "}
              <span className="truncate">{primaryAddress}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <Phone className="w-4 h-4" />
            {/* Show 'Emergency:' label only on md+ screens */}
            <span className="hidden md:inline">Emergency:&nbsp;</span>
            <span className="truncate">{phone}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 glass-panel border-b border-border/50"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={clinicName}
                className="h-10 w-auto object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground font-display tracking-tight truncate whitespace-nowrap">
                {clinicName}
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-foreground/80">
            <a
              href="#services"
              onClick={(e) => handleHashNavigation(e, "#services")}
              className={`flex items-center gap-2 transition-colors ${getActiveNav("#services") ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              <Activity className="w-4 h-4" />
              Services
            </a>
            <a
              href="#doctors"
              onClick={(e) => handleHashNavigation(e, "#doctors")}
              className={`flex items-center gap-2 transition-colors ${getActiveNav("#doctors") ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              <Users className="w-4 h-4" />
              Our Doctors
            </a>
            <Link
              href="/gallery"
              className={`flex items-center gap-2 transition-colors ${getActiveNav("/gallery") ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              <Images className="w-4 h-4" />
              Gallery
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleHashNavigation(e, "#contact")}
              className={`flex items-center gap-2 transition-colors ${getActiveNav("#contact") ? "text-primary font-bold" : "hover:text-primary"}`}
            >
              <Phone className="w-4 h-4" />
              Contact
            </a>
            {features.enable_blog && (
              <Link
                href="/blogs"
                className={`flex items-center gap-2 transition-colors ${getActiveNav("/blogs") ? "text-primary font-bold" : "hover:text-primary"}`}
              >
                <BookOpen className="w-4 h-4" />
                Blogs
              </Link>
            )}
            <Link href="/appointment">
              <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                Book Appointment
              </button>
            </Link>
          </nav>
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
              className="p-2 rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 hover:shadow-md transition-all"
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="w-6 h-6 flex items-center justify-center">
                {menuOpen ? (
                  <X className="w-6 h-6 text-slate-700 transition-transform duration-200" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700 transition-transform duration-200" />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {/* Mobile nav drawer — overlay so it doesn't push content down */}
      <div
        className={`md:hidden fixed left-0 right-0 z-40 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen
            ? "max-h-[60vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ top: headerHeight }}
        aria-hidden={!menuOpen}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 overflow-auto">
          <a
            href="#services"
            onClick={(e) => {
              handleHashNavigation(e, "#services");
              setMenuOpen(false);
            }}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${getActiveNav("#services") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50"}`}
          >
            <Activity className="w-4 h-4" />
            Services
          </a>
          <a
            href="#doctors"
            onClick={(e) => {
              handleHashNavigation(e, "#doctors");
              setMenuOpen(false);
            }}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${getActiveNav("#doctors") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50"}`}
          >
            <Users className="w-4 h-4" />
            Our Doctors
          </a>
          <Link
            href="/gallery"
            onClick={() => setMenuOpen(false)}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${getActiveNav("/gallery") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50"}`}
          >
            <Images className="w-4 h-4" />
            Gallery
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              handleHashNavigation(e, "#contact");
              setMenuOpen(false);
            }}
            className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${getActiveNav("#contact") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50"}`}
          >
            <Phone className="w-4 h-4" />
            Contact
          </a>
          {features.enable_blog && (
            <Link
              href="/blogs"
              onClick={() => setMenuOpen(false)}
              className={`py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${getActiveNav("/blogs") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-50"}`}
            >
              <BookOpen className="w-4 h-4" />
              Blogs
            </Link>
          )}
          <Link href="/appointment">
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full text-left py-3 px-3 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              Book Appointment
            </button>
          </Link>
        </div>
      </div>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-16 lg:py-24 border-t border-slate-800/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="space-y-6">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={clinicName}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white font-display tracking-tight">
                  {clinicName}
                </h3>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                {footer_description ||
                  "Providing world-class medical care with compassion and expertise. Your health and well-being are our top priorities."}
              </p>
              <div className="flex items-center gap-4">
                {/* Render social icons only when corresponding URL is present */}
                {social?.twitter ? (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                ) : null}
                {social?.instagram ? (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                ) : null}
                {social?.facebook ? (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.1h-1.07c-1.06 0-1.39.66-1.39 1.34v1.6h2.36l-.38 2.9h-1.98v7A10 10 0 0022 12z" />
                    </svg>
                  </a>
                ) : null}
                {social?.tiktok ? (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 3h2.5v2A5.5 5.5 0 0016 11.5V9a3 3 0 01-3-3V4H9v11a6 6 0 106 6v-6a4 4 0 01-4-4V6a1 1 0 011-1h4z" />
                    </svg>
                  </a>
                ) : null}
                {social?.youtube ? (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.5 6.2a3 3 0 00-2.1-2.12C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.58A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.12c1.8.58 9.4.58 9.4.58s7.6 0 9.4-.58a3 3 0 002.1-2.12A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
                Quick Links
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#services"
                    className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    Medical Services
                  </a>
                </li>
                <li>
                  <a
                    href="#doctors"
                    className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    Meet Our Doctors
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    Contact & Map
                  </a>
                </li>
                <li>
                  <Link
                    href="/appointment"
                    className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
                Contact Details
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="pt-1">{primaryAddress}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="pt-1">{phone}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">
                Opening Hours
              </h4>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <ul className="space-y-3 text-sm">
                  {openingHours.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="font-medium">{item.days}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-md ${item.is_closed ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}
                      >
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} {clinicName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    title: "Privacy Policy",
                    content: policies?.privacy_policy || "",
                  })
                }
                className="hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    title: "Terms of Service",
                    content: policies?.terms_conditions || "",
                  })
                }
                className="hover:text-slate-300 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
        <PolicyModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          title={modalState.title}
          content={modalState.content}
        />
      </footer>

      {/* WhatsApp floating button with message */}
      {phone &&
        (() => {
          // Normalize phone to digits only for wa.me link
          const digits = String(phone).replace(/\D/g, "");
          const waLink = digits ? `https://wa.me/${digits}` : `https://wa.me/`;
          return (
            <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end gap-3">
              {/* Message Box */}
              {showWhatsappMessage && (
                <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="relative">
                    <div className="bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-sm font-medium max-w-xs whitespace-nowrap">
                      👋 Chat with us on WhatsApp!
                    </div>
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                  </div>
                  <button
                    onClick={() => setShowWhatsappMessage(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
              {/* WhatsApp Button */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-400/30 text-white transition-all hover:scale-110">
                  <FaWhatsapp className="w-7 h-7" />
                </div>
              </a>
            </div>
          );
        })()}
    </div>
  );
}
