import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Activity, Settings, MessageSquare } from 'lucide-react';
import MobileNavigation from './MobileNavigation';

const Header = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <MobileNavigation />;
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <Activity size={24} />
            <span>RunCoach</span>
          </div>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <Activity size={16} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/customize" 
                className={`nav-link ${isActive('/customize') ? 'active' : ''}`}
              >
                <Settings size={16} />
                <span>Customize</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/update" 
                className={`nav-link ${isActive('/update') ? 'active' : ''}`}
              >
                <MessageSquare size={16} />
                <span>AI Update</span>
              </Link>
            </li>
          </ul>

          <div className="desktop-connect">
            <ConnectButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
