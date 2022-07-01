import React from "react"
import "./Admin.css"
import { connect } from "react-redux"
import {
    increaseCounter,
    decreaseCounter,
  } from "../redux/Counter/counter.actions"

function Admin(props) {
  return (
    <div>
        Admin
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin)