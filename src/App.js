import React, {useEffect} from "react"
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

const queryClient = new QueryClient()

function App({ isLoggedIn, email, token }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={ <Login /> } />
            <Route path="admin" element={ <Admin/> } />
            <Route path="posts" element={ <Posts/> } />
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