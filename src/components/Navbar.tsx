import { Link, useNavigate, useLocation } from "react-router-dom";
import { heroData } from "@/data/heroData";
import { useEffect, useState } from "react";
import { MdMenu, MdHome, MdLightbulb, MdScience, MdClose } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    event.preventDefault();
    setIsOpen(false); // Close mobile menu on navigation
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Section exists on current page — smooth scroll
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Section is on Index page — navigate there with hash
      navigate(`/#${targetId}`);
    }
  };

  const handleDemoClick = () => {
    setIsOpen(false); // Close mobile menu when navigating to demo
  };

  // On location change, if there's a hash, scroll to it after render
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const attempt = (tries: number) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (tries > 0) {
          setTimeout(() => attempt(tries - 1), 100);
        }
      };
      attempt(10);
    }
  }, [location.hash]);

  // Icon mapping for nav links
  const navIcons = {
    Home: MdHome,
    Awareness: MdLightbulb,
    Methodology: MdScience,
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo - responsive sizing */}
        <a href="/" className="flex-shrink-0">
          <img
            src={heroData.institutionLogo.src}
            alt={heroData.institutionLogo.alt}
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Mobile Hamburger Menu - visible on mobile only */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 text-foreground hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                <MdMenu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-4">
                  {heroData.navLinks.map((link, i) => {
                    const Icon = navIcons[link.label as keyof typeof navIcons];
                    return (
                      <a
                        key={i}
                        href={link.href}
                        onClick={(e) => handleScroll(e, link.href.replace("#", ""))}
                        className="flex items-center gap-3 font-sans text-foreground hover:bg-gray-100 px-4 py-3 rounded-lg transition-all text-base"
                      >
                        {Icon && <Icon size={20} />}
                        {link.label}
                      </a>
                    );
                  })}
                </div>

                {/* Demo Button - Mobile */}
                <Link
                  to={heroData.demoRoute}
                  onClick={handleDemoClick}
                  className="border border-foreground px-5 py-3 text-center text-sm font-sans uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors rounded-lg"
                >
                  Try Demo
                </Link>

                {/* Logo in Mobile Menu */}
                <div className="mt-auto pt-6 border-t border-border">
                  <img
                    src={heroData.institutionLogo.src}
                    alt={heroData.institutionLogo.alt}
                    className="h-10 w-auto mx-auto opacity-60"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
