import { createBrowserRouter, RouterProvider } from "react-router"
import { Contact } from "./pages/Contact"
import { Register } from "./pages/Register"
import { Home } from "./pages/Home"
import Error from "./pages/Error"
import "./App.css"
import { Login } from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import UserProfile from "./components/dashboard/UserProfile"

import { MyPayments } from "./components/dashboard/MyPayments"

import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./pages/AdminDashboard"


import AdminUserProfile from "./components/adminDashboard/AdminUserProfile"

import { AllUsers } from "./components/adminDashboard/AllUsers"

import AllHotels from "./components/adminDashboard/AllHotels"
import Hotels from "./pages/Hotels"
// import Bookings from "./components/dashboard/Bookings"
import Analytics from "./components/adminDashboard/Analytics"
import { About } from "./pages/About"
import { Room } from "./pages/Room"
import AllBookings from "./components/adminDashboard/AllBookings"
import Bookings from "./components/dashboard/Bookings"
import Tickets from "./components/dashboard/Tickets"



function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <Error />,
    },
    {
      path: 'register',
      element: <Register />,
      errorElement: <Error />,
    },
    {
      path: 'About',
      element: <About />,
      errorElement: <Error />,
    },
    {
      path: 'Hotels',
      element: <Hotels />,
      errorElement: <Error />,
    },
    {
      path: "/hotels/:hotelId/rooms",
      element: <Room />,
    
      errorElement: <Error />,
    },
    {
      path: 'login',
      element: <Login />,
      errorElement: <Error />,
    },
    {
      path: 'contact',
      element: <Contact />,
      errorElement: <Error />,
    },
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "me",
          element: <UserProfile />,
        },
        {
          path: "Bookings",
          element: <Bookings />,
        },
        {
          path: "Tickets",
          element: <Tickets />,
        },
        {
          path: "payments",
          element: <MyPayments />,
        },
      ]
    },
    {
      path: 'admindashboard',
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "allbookings",
          element: <AllBookings />,
        },
        {
          path: "allhotels",
          element: <AllHotels />,
        },
        {
          path: "allusers",
          element: <AllUsers />,
        },
        {
          path: "adminprofile",
          element: <AdminUserProfile />,
        },
        
        
      ]
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
