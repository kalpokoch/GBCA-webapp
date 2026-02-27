import { Link } from "react-router-dom";
import { heroData } from "@/data/heroData";
import { useEffect } from "react";

const Navbar = () => {
  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    targetElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="/">
          <img
            src={heroData.institutionLogo.src}
            alt={heroData.institutionLogo.alt}
            className="h-12 w-auto"
          />
        </a>

        <div className="flex items-center gap-8">
          {heroData.navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href.replace("#", ""))}
              className="font-sans text-foreground hover:underline underline-offset-4 transition-all text-sm"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={heroData.demoRoute}
            className="border border-foreground px-5 py-1.5 text-sm font-sans uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Demo
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
