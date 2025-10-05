import React from 'react'
import Home from './components/Home'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter,Router,RouterProvider } from 'react-router'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/Dashboard'

const appRouter = createBrowserRouter([
  {path:'/', element:<Home/>},
  {path:'/login', element:<Login/>},
  {path:'/signup', element:<Signup/>},
  {path:'/dashboard', element:<Dashboard/>},
])

const App = () => {
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}

export default App
