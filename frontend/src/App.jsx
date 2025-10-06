import React from 'react'
import Home from './components/Home'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter,Router,RouterProvider } from 'react-router'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/Dashboard'
import Gallery from './components/Gallery'
import Family from './components/Family'
import JoinFamily from './components/JoinFamily'

const appRouter = createBrowserRouter([
  {path:'/', element:<Home/>},
  {path:'/login', element:<Login/>},
  {path:'/signup', element:<Signup/>},
  {path:'/dashboard', element:<Dashboard/>},
  {path:'/gallery', element:<Gallery/>},
  {path:'/family', element:<Family/>},
  {path:'/joinfamily', element:<JoinFamily/>},
])

const App = () => {
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}

export default App
