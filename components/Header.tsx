"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/data/services";

const navItems = [
  { label: "ABOUT", href: "/" },
  { label: "SERVICES", href: "/services" },
  { label: "EVENTS", href: "/events" },
  { label: "COMPANY", href: "/company" },
  { label: "NEWS", href: "/news" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-bg-mist bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="12" fill="#071745" />
              <circle cx="20" cy="24" r="6" fill="#3B7DD8" />
              <circle cx="44" cy="24" r="6" fill="#3B7DD8" />
              <circle cx="32" cy="44" r="6" fill="#F7F9FC" />
              <line x1="20" y1="24" x2="44" y2="24" stroke="#EEF3F8" strokeWidth="2" />
              <line x1="20" y1="24" x2="32" y2="44" stroke="#EEF3F8" strokeWidth="2" />
              <line x1="44" y1="24" x2="32" y2="44" stroke="#EEF3F8" strokeWidth="2" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-primary">BaseAI</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.href === "/services") {
                return (
                  <div key={item.href} className="group relative -mb-2 pb-2">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-1 py-2 text-sm font-medium tracking-wide transition-colors hover:text-blue ${
                        active ? "text-blue" : "text-primary/80"
                      }`}
                    >
                      {item.label}
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </Link>

                    <div className="pointer-events-none absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-primary/10 bg-white py-2 shadow-lg">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            className="block px-5 py-3 text-sm font-medium text-primary/80 transition-colors hover:bg-bg-soft hover:text-blue"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-blue ${
                    active ? "text-blue" : "text-primary/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
            >
              CONTACT
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-primary transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-primary transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-primary transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white md:hidden">
          <nav className="container-page flex flex-col gap-6 py-10">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.href === "/services") {
                return (
                  <div key={item.href}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`text-xl font-semibold ${active ? "text-blue" : "text-primary"}`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={mobileServicesOpen ? "SERVICESを閉じる" : "SERVICESを開く"}
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="flex h-9 w-9 items-center justify-center text-primary"
                      >
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          aria-hidden="true"
                          className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                        >
                          <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    {mobileServicesOpen && (
                      <div className="mt-4 flex flex-col gap-4 border-l border-primary/10 pl-4">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            onClick={() => setOpen(false)}
                            className="text-base font-medium text-primary/70"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`text-xl font-semibold ${active ? "text-blue" : "text-primary"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-white"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
