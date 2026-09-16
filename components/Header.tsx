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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-line bg-white/95 backdrop-blur-sm">
      <div
        className={`container-page flex items-center justify-between transition-[height] duration-300 ease-out ${
          scrolled ? "h-[60px] md:h-16" : "h-[70px] md:h-20"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="1" width="22" height="22" fill="none" stroke="#0A1330" strokeWidth="1.4" />
            <line x1="1" y1="14" x2="23" y2="14" stroke="#0A1330" strokeWidth="1.4" />
          </svg>
          <span className="text-base font-bold tracking-tight text-primary">BaseAI</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            if (item.href === "/services") {
              return (
                <div key={item.href} className="group relative -mb-2 pb-2">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1 py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-blue ${
                      active ? "text-blue" : "text-primary/75"
                    }`}
                  >
                    {item.label}
                    <svg width="9" height="5" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>

                  <div className="pointer-events-none absolute left-1/2 top-full w-60 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="border border-line bg-white py-1.5">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className="block px-5 py-3 text-[13px] font-medium text-primary/75 transition-colors hover:bg-bg-soft hover:text-blue"
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
                className={`text-[13px] font-medium tracking-wide transition-colors hover:text-blue ${
                  active ? "text-blue" : "text-primary/75"
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
            className="border border-primary px-5 py-2 text-[13px] font-semibold text-primary transition-colors hover:border-blue hover:text-blue"
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
            className={`block h-px w-6 bg-primary transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`block h-px w-6 bg-primary transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`block h-px w-6 bg-primary transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>
      </div>

      {open && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white md:hidden ${
            scrolled ? "top-[60px]" : "top-[70px]"
          }`}
        >
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
                      <div className="mt-4 flex flex-col gap-4 border-l border-line pl-4">
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
              className="mt-4 inline-flex w-full items-center justify-center border border-primary px-6 py-3 text-base font-semibold text-primary"
            >
              CONTACT
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
