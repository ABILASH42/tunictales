import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Search, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate cart badge when count changes
  useEffect(() => {
    if (itemCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'glass border-b border-border/50 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container-luxe">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2 transition-transform active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={cn(
                  'h-6 w-6 absolute transition-all duration-300',
                  isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                )} 
              />
              <X 
                className={cn(
                  'h-6 w-6 absolute transition-all duration-300',
                  isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                )} 
              />
            </div>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="Tunic Tales" 
              className="h-12 md:h-16 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href || 
                (link.href !== '/' && location.pathname.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium gold-underline transition-colors',
                    isActive 
                      ? 'text-primary' 
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex hover:text-accent transition-colors">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-accent transition-colors">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:text-accent transition-colors" asChild>
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span 
                    className={cn(
                      'absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium',
                      cartBounce && 'animate-cart-bounce'
                    )}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hover:text-accent transition-colors">
              <Link to={user ? '/account' : '/auth'}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
            {user && (
              <Button variant="ghost" size="icon" asChild className="hidden md:flex hover:text-accent transition-colors">
                <Link to="/account?tab=orders">
                  <Package className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-500 ease-out',
            isMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-1 pt-4">
            {NAV_LINKS.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'py-3 px-4 rounded-lg text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all animate-fade-in',
                    isActive && 'bg-secondary text-primary font-medium'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-border my-2" />
            <Link
              to={user ? '/account?tab=orders' : '/auth'}
              className="py-3 px-4 rounded-lg text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: '250ms' }}
              onClick={() => setIsMenuOpen(false)}
            >
              <Package className="h-5 w-5" />
              Orders
            </Link>
            <Link
              to={user ? '/account' : '/auth'}
              className="py-3 px-4 rounded-lg text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-all flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: '300ms' }}
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
