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
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">About</Link>
            </li>
            <li>
              <Link to="/posts">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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