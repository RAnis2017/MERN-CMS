import React, { useState } from "react"
import "./Admin.css"
import { connect } from "react-redux"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"

const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function Admin(props) {
  const [addPostClicked, setAddPostClicked] = useState(false)
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

  // dynamic table component
  const Table = ({data}) => {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.createdBy}</td>
              <td>{item.image_url}</td>
              <td>
                <button className="btn btn-danger" onClick={() => deletePost(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const deletePost = id => {
  }

  const exampleData = [{
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  },{
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  },{
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  },{
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  },{
    id: 1,
    title: 'Post 1',
    createdBy: 'John Doe',
    image_url: 'https://via.placeholder.com/150'
  }, {
    id: 2,
    title: 'Post 2',
    createdBy: 'Jane Doe',
    image_url: 'https://via.placeholder.com/150'
  }]

  const addNewPost = () => {
    setAddPostClicked(true)
  }

  return (
    <div>
        <div className=" flex justify-between m-5">
          <button className="btn btn-ghost" onClick={() => navigate('/posts')}>Posts</button>
          <button class="btn btn-warning" onClick={() => signOut()}>Logout</button>
        </div>  

        <div className="flex justify-center">
          <div className="w-3/12 flex justify-center items-center">
            <h1>Posts</h1>
          </div>
          <div className="w-7/12 h-80 overflow-scroll">
            <Table data={exampleData}/>
          </div>
        </div>

        <div className="flex justify-end">
          <div className=" w-1/3 mt-10">
            <button className="btn btn-primary" onClick={() => addNewPost()}>Add Post</button>
          </div>
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