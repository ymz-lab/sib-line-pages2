import Link from "next/link";

const links = [
  { label: "ABOUT", href: "/#about" },
  { label: "MISSION", href: "/#mission" },
  { label: "BUSINESS", href: "/#business" },
  { label: "EVENTS", href: "/#events" },
  { label: "PARTNERS", href: "/#partners" },
  { label: "COMPANY", href: "/#company" },
  { label: "CONTACT", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-bg-mist bg-bg-soft">
      <div className="container-page py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <span className="text-xl font-bold text-primary">BaseAI</span>
            <p className="mt-3 text-sm text-primary/70">株式会社BaseAI</p>
            <p className="text-sm text-primary/70">神奈川県藤沢市</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary/70 transition-colors hover:text-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-primary/60 transition-colors hover:border-blue hover:text-blue"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="X"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-primary/60 transition-colors hover:border-blue hover:text-blue"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.7l-5.2-6.9L5 22H1.9l8.1-9.3L1.4 2H8.3l4.7 6.3L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-primary/60 transition-colors hover:border-blue hover:text-blue"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4V21H3V8.98zM9 8.98h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9V8.98z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-primary/50">&copy; {new Date().getFullYear()} BaseAI Inc.</p>
          <Link href="/privacy" className="text-xs text-primary/50 hover:text-blue">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
