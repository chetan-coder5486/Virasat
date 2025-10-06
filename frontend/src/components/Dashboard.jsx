import React from 'react';
import { useSelector } from 'react-redux';
import CreateFamilyDashboard from '@/components/CreateFamilyDashboard';
import MainDashboard from '@/components/MainDashboard'; // Your real, feature-rich dashboard

const Dashboard = () => {
  // Get the isFamily flag from the Redux store
  const { isFamily } = useSelector((state) => state.family);

  // Conditionally render the correct component
  return isFamily ? <MainDashboard /> : <CreateFamilyDashboard />;
};

export default Dashboard;