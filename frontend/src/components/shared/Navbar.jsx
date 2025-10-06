import React from "react";
import { useSelector, useDispatch } from "react-redux";
// FIX 1: Import Link from 'react-router-dom', not 'react-router'
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "@/redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLogged = useSelector((store) => store.auth.isLogged);

  const handleLogout = () => {
    // FIX 2: You must call the thunk when dispatching
    dispatch(logoutUser());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-200/50 bg-rose-50/50 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link to={"/"} className="flex items-center">
          <span className="text-2xl font-bold font-serif text-rose-800">
            Virasat
          </span>
        </Link>

        {/* Navigation Links & User Menu / Login Buttons */}
        <div className="flex items-center space-x-8">
          <nav className="hidden items-center space-x-8 md:flex">
            {isLogged ? (
              <>
                <Link to={"/dashboard"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Dashboard
                </Link>
                {/* FIX 3: Added the missing 'to' prop for navigation */}
                <Link to={"/stories"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Stories
                </Link>
                <Link to={"/gallery"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Gallery
                </Link>
                <Link to={"/family"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Family
                </Link>
              </>
            ) : (
              // FIX 4: Removed unnecessary <button> wrappers. The <Link> is the button.
              <>
                <Link
                  to={"/login"}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* User Avatar Popover OR Share a Story Button */}
          {isLogged && (
            // FIX 5: This section now correctly renders the Popover only when logged in
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium">Username</h4>
                    <p className="text-sm text-muted-foreground">
                      A member of the family trunk.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600 mt-4">
                  <div className="flex w-fit items-center gap-2 cursor-pointer hover:text-rose-800">
                    <User2 size={16} />
                    <Button variant="link" className="p-0 text-gray-600 hover:text-rose-800">View Profile</Button>
                  </div>
                  <div onClick={handleLogout} className="flex w-fit items-center gap-2 cursor-pointer hover:text-rose-800">
                    <LogOut size={16} />
                    <Button variant="link" className="p-0 text-gray-600 hover:text-rose-800">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;