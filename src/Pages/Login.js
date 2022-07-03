import React from "react"
import "./Login.css"
import { connect } from "react-redux"
import {
    increaseCounter,
    decreaseCounter,
  } from "../redux/Counter/counter.actions"

function Login(props) {
  return (
    <div className="flex justify-center items-center flex-row min-h-screen bg-slate-800">
        <div className="flex flex-col justify-center items-center bg-slate-700 p-10 w-4/12 rounded-xl drop-shadow-md">
          <div className="mb-2 p-10 text-lg text-white">
              CMS Login
          </div>
          <div className="w-full max-w-md">
            <div class="form-control w-full max-w-md">
              <label class="label">
                <span class="label-text text-white">Email</span>
              </label>
              <input type="text" placeholder="Type here" class="input input-ghost w-full max-w-md" />
            </div>
            <div class="form-control w-full max-w-md">
              <label class="label">
                <span class="label-text text-white">Password</span>
              </label>
              <input type="password" placeholder="Type here" class="input input-ghost w-full max-w-md" />
            </div>
          </div>
          <button class="btn btn-accent mt-5">Login</button>
          <button class="btn btn-ghost mt-5">Google Login</button>
        </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    increaseCounter: () => dispatch(increaseCounter()),
    decreaseCounter: () => dispatch(decreaseCounter()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)