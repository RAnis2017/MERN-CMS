import React from "react"
import "./App.css"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Posts from "./Pages/Posts";

function App(props) {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={ <Login/> } />
          <Route path="admin" element={ <Admin/> } />
          <Route path="posts" element={ <Posts/> } />
        </Routes>
      </div>
    </Router>
  )
}

export default App