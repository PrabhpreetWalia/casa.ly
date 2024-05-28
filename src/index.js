import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Layout from './Layout';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
  },
  {
    path: "/profile",
    element: <Layout><Profile /></Layout>,
  },
  {
    path: "/sign-in",
    element: <Layout><SignIn /></Layout>,
  },
  {
    path: "/sign-up",
    element: <Layout><SignUp /></Layout>,
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
)

