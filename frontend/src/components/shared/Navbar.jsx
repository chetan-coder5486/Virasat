import store from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Navbar = () => {
  const isLogged = useSelector((store) => store.auth.isLogged);
  const loading = useSelector((store) => store.auth.loading);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-200/50 bg-rose-50/50 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold font-serif text-rose-800">
            Virasat
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-8 md:flex">
          {isLogged ? (
            <>
              <Link className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                Memories
              </Link>
              <Link className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                Stories
              </Link>
              <Link className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                Gallery
              </Link>
            </>
          ) : (
            <>
              <button>
                <Link
                  to={"/login"}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
                >
                  Login
                </Link>
              </button>
              <button>
                <Link
                  to={"/signup"}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
                >
                  Signup
                </Link>
              </button>
            </>
          )}
        </nav>

        {/* Call to Action Button */}
        {isLogged ==
        (
          <div>
            <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300">
              Share a Story
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
