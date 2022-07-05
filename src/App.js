import React from "react"
import "./App.css"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Posts from "./Pages/Posts";

const queryClient = new QueryClient()

function App(props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={ <Login/> } />
            <Route path="admin" element={ <Admin/> } />
            <Route path="posts" element={ <Posts/> } />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App