import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Settings, MessageSquare, Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Activity size={20} />
    },
    {
      path: '/customize',
      label: 'Customize',
      icon: <Settings size={20} />
    },
    {
      path: '/update',
      label: 'AI Update',
      icon: <MessageSquare size={20} />
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <Activity size={24} />
            <span>RunCoach</span>
          </div>
          
          <div className="mobile-header-actions">
            <div className="mobile-connect-button">
              <ConnectButton />
            </div>
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="mobile-nav-icon">
                    {item.icon}
                  </div>
                  <span className="mobile-nav-label">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon">
              {item.icon}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default MobileNavigation;
