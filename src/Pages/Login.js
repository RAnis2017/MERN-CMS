import React from "react"
import "./Login.css"
import { connect } from "react-redux"
import {
    increaseCounter,
    decreaseCounter,
  } from "../redux/Counter/counter.actions"

function Login(props) {
  return (
    <div>
        Login
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