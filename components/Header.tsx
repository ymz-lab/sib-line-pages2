"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "ABOUT", href: "/#about" },
  { label: "MISSION", href: "/#mission" },
  { label: "BUSINESS", href: "/#business" },
  { label: "EVENTS", href: "/#events" },
  { label: "PARTNERS", href: "/#partners" },
  { label: "COMPANY", href: "/#company" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-bg-mist bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-primary/80 transition-colors hover:text-blue"
            >
              {item.label}
            </Link>
          ))}
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
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-6 py-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-xl font-semibold text-primary"
              >
                {item.label}
              </Link>
            ))}
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
