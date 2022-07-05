import React, { useEffect } from "react"
import "./Login.css"
import { connect } from "react-redux"
import {
  GoogleSignInSuccess,
  LoginSuccessAction,
} from "../redux/App/app.actions"
import GoogleLogin from "react-google-login"
import { gapi } from 'gapi-script';
import { useMutation, useQuery } from 'react-query'

const clientID = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function Login(props) {
  const { googleSignInSuccess, email } = props
  const { isLoading, isSuccess, data, mutate } = useMutation('login-google', ({email, name}) =>
     fetch('http://localhost:3001/login-google', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name
      })
     }).then(res =>
       res.json()
     ), {
      onSuccess: (data, variables, context) => {
        console.log(data)
      }
     }
   )

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const onSuccess = response => {
    console.log(response.profileObj)
    googleSignInSuccess(response.profileObj.email)
    mutate({email: response.profileObj.email, name: response.profileObj.name})
  }

  const onFailure = response => {
    console.log('Login Failure ===> ', response)
  }

  return (
    <div className="flex justify-center items-center flex-row min-h-screen bg-slate-800">
      <div className="flex flex-col justify-center items-center bg-slate-700 p-10 w-4/12 rounded-xl drop-shadow-md">
        <div className="mb-2 p-10 text-lg text-white">
          CMS Login
        </div>
        <div className="w-full max-w-md">
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text text-white">Email</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-ghost w-full max-w-md" />
          </div>
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text text-white">Password</span>
            </label>
            <input type="password" placeholder="Type here" className="input input-ghost w-full max-w-md" />
          </div>
        </div>
        <button class="btn btn-accent mt-5">Login</button>
        <GoogleLogin className="mt-5" clientId={clientID} buttonText='Google Login' onSuccess={onSuccess} onFailure={onFailure} isSignedIn={true} cookiePolicy={'single_host_origin'} class="btn btn-ghost mt-5 text-white"></GoogleLogin>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.appState.isLoggedIn,
    email: state.appState.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    googleSignInSuccess: (email) => dispatch(GoogleSignInSuccess(email)),
    loginSuccessAction: () => dispatch(LoginSuccessAction()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)