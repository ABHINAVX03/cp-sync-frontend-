import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLoginUrl, isLoggedIn, clearToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function handleAuth() {
    if (loggedIn) {
      clearToken();
      navigate("/");
    } else {
      window.location.href = getLoginUrl();
    }
  }

  const isLanding = location.pathname === "/";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || !isLanding
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_oklch(0.58_0.22_285/0.5)] transition-all duration-300 group-hover:shadow-[0_0_30px_oklch(0.58_0.22_285/0.7)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            CP<span className="text-primary">Sync</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn && (
            <Link to="/dashboard">
              <Button
                variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
          )}
          {loggedIn && (
            <Link to="/profile">
              <Button
                variant={location.pathname === "/profile" ? "secondary" : "ghost"}
                size="sm"
              >
                Profile
              </Button>
            </Link>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <GitHubIcon />
            GitHub
          </a>
          <Button
            variant={loggedIn ? "outline" : "default"}
            size="sm"
            onClick={handleAuth}
          >
            {loggedIn ? "Sign out" : "Sign in with Google"}
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-6 py-4 space-y-2">
          {loggedIn && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
                Dashboard
              </button>
            </Link>
          )}
          {loggedIn && (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors">
                Profile
              </button>
            </Link>
          )}
          <button
            onClick={() => { handleAuth(); setMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-primary hover:bg-secondary transition-colors"
          >
            {loggedIn ? "Sign out" : "Sign in with Google"}
          </button>
        </div>
      )}
    </nav>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}