import React, {useEffect, useState} from "react"
import "./App.css"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { useQuery } from 'react-query'
import Login from "./Pages/Login";
import PostsAdmin from "./Pages/PostsAdmin";
import Posts from "./Pages/Posts";
import { deniedAlertService, fetchFunc } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesAdmin from "./Pages/CategoriesAdmin";
import UsersAdmin from "./Pages/UsersAdmin";
import { SetPermissionsAction } from "./redux/App/app.actions";

const AppOutlet = () => {
  // ... perhaps some authentication logic to protect routes?
  return (
      <>
          <div>
              <header className="sticky top-0 z-50">
                  Here
              </header>
              <main className="relative">
                  <Outlet />
              </main>
          </div>
      </>
  );
};

function App({ setPermissions }) {
  const { data: permissions } = useQuery('permissions', () =>
    fetchFunc('http://localhost:3001/get-user-permissions', 'GET', {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    }, null, null, 'getUserPermissions'),
    {
      refetchOnWindowFocus: false,
      retryError: false,
      refetchOnError: false,
      onSuccess: (data) => {
        setPermissions(data)
      }
    }
  )
  useEffect(() => {
    // subscribe to home component messages
    const subscription = deniedAlertService.onDeniedAlert().subscribe(message => {
        if (message) {
          toast.error(message.text,{
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            
          });
        }
    });

    // return unsubscribe method to execute when component unmounts
    return () => {
        subscription.unsubscribe();
    }
  }, []);

  return (
      <Router>
        <div className="min-h-screen">
          
              <ToastContainer limit={1} />
              <Routes>
                <Route path="/" element={ <Login /> } />
                <Route element={<AppOutlet />}>
                  <Route path="admin/posts" element={ <PostsAdmin/> } />
                  <Route path="admin/categories" element={ <CategoriesAdmin/> } />
                  <Route path="posts" element={ <Posts/> } />
                  <Route path="admin/users" element={ <UsersAdmin/> } />
                </Route>
                <Route path="*" element={ <Login /> } />
              </Routes>
           
        </div>
      </Router>
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.appState.isLoggedIn,
    email: state.appState.email,
    token: state.appState.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPermissions: (permissions) => dispatch(SetPermissionsAction(permissions)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)