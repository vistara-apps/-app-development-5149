import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Activity, Settings, MessageSquare } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <Activity size={24} />
            RunCoach
          </div>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/customize" 
                className={isActive('/customize') ? 'active' : ''}
              >
                <Settings size={16} />
                Customize
              </Link>
            </li>
            <li>
              <Link 
                to="/update" 
                className={isActive('/update') ? 'active' : ''}
              >
                <MessageSquare size={16} />
                AI Update
              </Link>
            </li>
          </ul>

          <ConnectButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;