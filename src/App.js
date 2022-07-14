import React, {useEffect, useState} from "react"
import "./App.css"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Posts from "./Pages/Posts";
import { deniedAlertService } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

function App({ isLoggedIn, email, token }) {

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <ToastContainer limit={1} />
          <Routes>
            <Route path="/" element={ <Login /> } />
            <Route path="admin" element={ <Admin/> } />
            <Route path="posts" element={ <Posts/> } />
            <Route path="*" element={ <Login /> } />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
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
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)