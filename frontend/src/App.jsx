import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';
import Family from './components/Family';
import JoinFamily from './components/JoinFamily';
import Spinner from './components/shared/Spinner';

import { getFamilyDetails } from './redux/familyThunks';
import Memories from './components/Memories';
import Circles from './components/Circles';
import { getUserCircles } from './redux/circleThunks';
import ProtectedRoute from './components/ProtectedRoutes';
import VerifyOtp from './components/auth/VerifyOtp';
import Profile from './components/Profile';

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {path: "/verify-otp", element: <VerifyOtp />},
  { path: '/join-family', element: <JoinFamily /> }, // Corrected path name
  {
    element: <ProtectedRoute />, // Wrap protected routes
    children: [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/gallery', element: <Gallery /> },
    { path: '/family', element: <Family /> },
    { path: '/memories', element: <Memories /> },
    { path: '/profile', element: <Profile /> },
    { path: '/circles', element: <Circles /> }, // Corrected path name
    ]
  }
]);

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  // 1. Get the loading state from your family slice
  const { loading: familyLoading } = useSelector(state => state.family);

  useEffect(() => {
    // If the user is authenticated on initial load...
    if (isAuthenticated) {
      console.log('DISPATCH GET FAMILY from App')
      dispatch(getFamilyDetails());
      dispatch(getUserCircles());
    }
  }, [isAuthenticated, dispatch]);

  // 2. Conditionally render the spinner while family data is being fetched
  if (isAuthenticated && familyLoading) {
    return <Spinner />;
  }
  return (
    // Your main app is rendered after the initial fetch is complete
    <RouterProvider router={appRouter} />
  );
};

export default App;