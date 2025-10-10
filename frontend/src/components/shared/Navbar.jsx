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
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b" 
        style={{ 
          background: 'linear-gradient(to right, #fdf6e3, #f0e1c6)',
          borderBottom: '1px solid rgba(200, 170, 120, 0.5)',
          backdropFilter: 'blur(8px)'
        }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link to={"/"} className="flex items-center">
          <span className="text-2xl font-bold font-serif text-green-800">
            Virasat
          </span>
        </Link>

        {/* Navigation Links & User Menu / Login Buttons */}
        <div className="flex items-center space-x-8">
          <nav className="hidden items-center space-x-8 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to={"/dashboard"}
                  className="font-medium text-green-700 hover:text-green-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to={"/memories"}
                  className="font-medium text-green-700 hover:text-green-900 transition-colors"
                >
                  Memories
                </Link>
                <Link
                  to={"/circles"}
                  className="font-medium text-green-700 hover:text-green-900 transition-colors"
                >
                  Circles
                </Link>
                <Link
                  to={"/gallery"}
                  className="font-medium text-green-700 hover:text-green-900 transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  to={"/family"}
                  className="font-medium text-green-700 hover:text-green-900 transition-colors"
                >
                  Family
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-green-50 text-green-800 hover:bg-green-100 rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-colors duration-300"
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
                  <AvatarImage src={user.profilePic} alt={user.name} />
                  <AvatarFallback className="bg-green-200 text-green-800 font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-green-50 border border-green-300">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback className="bg-green-200 text-green-800 font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium text-green-900">{user.name}</h4>
                    <p className="text-sm text-green-700">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col my-2 mt-4">
                  <div className="flex w-fit items-center gap-2 cursor-pointer hover:text-green-800">
                    <User2 size={16} />
                    <Button asChild variant="link" className="p-0 text-green-700 hover:text-green-900">
                      <Link to={"/profile"}> View Profile</Link>
                     
                    </Button>
                  </div>
                  <div onClick={handleLogout} className="flex w-fit items-center gap-2 cursor-pointer hover:text-green-800">
                    <LogOut size={16} />
                    <Button variant="link" className="p-0 text-green-700 hover:text-green-900">
                      Logout
                    </Button>
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
