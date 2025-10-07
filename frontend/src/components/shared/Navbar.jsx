import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "@/redux/authThunks";

const Navbar = () => {
  const dispatch = useDispatch();
  // FIX 1: Use the new, more robust state from the authSlice
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Helper function to get initials from the user's name
  const getInitials = (name) => {
    if (!name) return "U"; // Default fallback
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
            {/* FIX 2: Conditional rendering now uses 'isAuthenticated' */}
            {isAuthenticated ? (
              <>
                <Link to={"/dashboard"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Dashboard
                </Link>
                <Link to={"/memories"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Memories
                </Link>
                <Link to={"/gallery"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Gallery
                </Link>
                <Link to={"/family"} className="font-medium text-rose-700 hover:text-rose-900 transition-colors">
                  Family
                </Link>
              </>
            ) : (
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

          {/* User Avatar Popover */}
          {isAuthenticated && user && (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  {/* FIX 3: Avatar image is now dynamic from user data */}
                  <AvatarImage src={user.profilePic} alt={user.name} />
                  <AvatarFallback className="bg-rose-200 text-rose-800 font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback className="bg-rose-200 text-rose-800 font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    {/* FIX 4: Username is now dynamic */}
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
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