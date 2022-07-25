import React, { useState } from "react"
import { connect } from "react-redux"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { fetchFunc } from "../utils"
const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function UsersAdmin(props) {
  const queryClient = useQueryClient()

  const { isLoading: usersLoading, isSuccess: usersSuccess, data: users } = useQuery('users', () =>
    fetchFunc('http://localhost:3001/admin/users', 'GET', {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    }, null, navigate, 'readAllUsers'),
    {
      refetchOnWindowFocus: false,
      retryError: false,
      refetchOnError: false
    }
  )

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
  
  const formatPermissions = (permissions) => {
    let formattedPermissions = []
    permissions.forEach(permission => {
        formattedPermissions.push(permission.name)
    }
    )

    formattedPermissions = formattedPermissions.join(', ')
    return (
        <>
        {
        permissions.map(permission => 
        <>{permission.name}, <br /></>
        )
        }
        </>
    )
    }

  // dynamic table component
  const Table = ({ data }) => {
    return (
      <>
        <table className="table table-striped table-fixed">
          <thead>
            <tr>
              <th className="">Name</th>
                <th className="">Email</th>
                <th className="">Created Date</th>
                <th className="">Updated Date</th>
                <th className="w-1/2">Permissions</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {data?.length && data?.map(item => (
              <tr key={item._id}>
                <>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.created_date}</td>
                    <td>{item.updated_date}</td>
                    <td className="max-w-md break-normal">{formatPermissions(item.permissions)}</td>
                </>
                <td>
                  <button className="btn btn-circle ml-2">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="btn btn-circle ml-2 text-red-400">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>

        {
          !data || !data?.length || data?.length === 0 ?
            <div className="text-center m-5">
              <h3 className="">No data found</h3>
            </div> : <></>
        }
      </>
    )
  }
  
  return (
    <div>
      <div className=" flex justify-between m-5">
        <button className="btn btn-ghost underline" onClick={() => navigate('/posts')}>Posts</button>
        <button className="btn btn-warning" onClick={() => signOut()}>Logout</button>
      </div>

      <div className="flex justify-around flex-row flex-wrap">
        <div className=" h-80 overflow-scroll flex flex-col justify-center items-center">
          <h1 className="mb-5">Users</h1>
          {
            usersLoading ?
              <div className="flex justify-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              : <></>
          }
          <Table data={users} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    token: state.appState.token,
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersAdmin)