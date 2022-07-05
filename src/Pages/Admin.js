import React from "react"
import "./Admin.css"
import { connect } from "react-redux"
import {
    increaseCounter,
    decreaseCounter,
  } from "../redux/Counter/counter.actions"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"

const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function Admin(props) {
  const navigate = useNavigate()
  const onLogoutSuccess = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/')
  }

  const onFailure = () => {
    console.log('logout failed')
  }

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  })

  return (
    <div>
        <div className=" flex justify-end mr-5">
          <button class="btn btn-warning mt-5" onClick={() => signOut()}>Logout</button>
        </div>  
    </div>
  )
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)