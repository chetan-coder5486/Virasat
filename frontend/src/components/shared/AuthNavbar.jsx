import React from 'react';
import { Link } from 'react-router';

const AuthNavbar = () => {
  return (
    <header className="absolute top-0 left-0 z-10 w-full p-4 sm:p-6 lg:p-8">
      <nav>
        {/* Brand/Logo linking to Home */}
        <Link to={"/"} className="inline-block">
          <span className="text-2xl font-bold font-serif text-white drop-shadow-md transition-opacity hover:opacity-80">
            Virasat
          </span>
        </Link>
      </nav>
    </header>
  );
};

export default AuthNavbar;