import Link from "next/link";
import { services } from "@/data/services";
import BaseGraphic from "./BaseGraphic";

const links = [
  { label: "ABOUT", href: "/" },
  { label: "SERVICES", href: "/services" },
  { label: "EVENTS", href: "/events" },
  { label: "COMPANY", href: "/company" },
  { label: "NEWS", href: "/news" },
  { label: "CONTACT", href: "/contact" },
  { label: "PRIVACY", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-white">
      <BaseGraphic className="pointer-events-none absolute -right-6 -top-10 h-28 w-44 text-primary opacity-70 md:h-36 md:w-56" />

      <div className="container-page relative py-16 md:py-20">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="1" y="1" width="22" height="22" fill="none" stroke="#0A1330" strokeWidth="1.4" />
                <line x1="1" y1="14" x2="23" y2="14" stroke="#0A1330" strokeWidth="1.4" />
              </svg>
              <span className="text-lg font-bold text-primary">BaseAI</span>
            </Link>
            <p className="mt-4 text-sm text-primary/60">株式会社BaseAI</p>
            <p className="text-sm text-primary/60">神奈川県藤沢市</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-20">
            <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-1 sm:gap-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary/60 transition-colors hover:text-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wides text-primary/30">
                Services
              </span>
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="text-sm text-primary/50 transition-colors hover:text-blue"
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex gap-5">
            <a
              href="#"
              aria-label="Instagram"
              className="text-primary/50 transition-colors hover:text-blue"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="X" className="text-primary/50 transition-colors hover:text-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.7l-5.2-6.9L5 22H1.9l8.1-9.3L1.4 2H8.3l4.7 6.3L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-primary/50 transition-colors hover:text-blue">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4V21H3V8.98zM9 8.98h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9V8.98z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary/45">&copy; {new Date().getFullYear()} BaseAI Inc.</p>
          <p className="text-xs uppercase tracking-wides text-primary/25">Base / Connection / Community</p>
        </div>
      </div>
    </footer>
  );
}
