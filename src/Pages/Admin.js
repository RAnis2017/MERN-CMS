import React, { useState } from "react"
import "./Admin.css"
import { connect } from "react-redux"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"

const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function Admin(props) {
  const [addPostClicked, setAddPostClicked] = useState(false)
  const [addCategoryClicked, setAddCategoryClicked] = useState(false)
  const [addPostTitle, setAddPostTitle] = useState('')
  const [addPostDescription, setAddPostDescription] = useState('')
  const [addPostCategory, setAddPostCategory] = useState('')
  const [addPostImage, setAddPostImage] = useState('')
  const [addPostStatus, setAddPostStatus] = useState('')
  const [addCategoryName, setAddCategoryName] = useState('')
  const queryClient = useQueryClient()

  const { isLoading: categoriesLoading, isSuccess: categoriesSuccess, data: categories } = useQuery('categories', () =>
    fetch('http://localhost:3001/get-categories', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }).then(res =>
      res.json()
    )
  )

  const { isLoading: postsLoading, isSuccess: postsSuccess, data: posts } = useQuery('posts', () =>
    fetch('http://localhost:3001/get-posts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }
    }).then(res =>
      res.json()
    )
  )

  const { mutate: postMutate, isSuccess: postIsSuccess, isLoading: postIsLoading, isError: postIsError } = useMutation('add-post', (data) =>
    fetch('http://localhost:3001/add-post', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
      method: 'POST',
      body: data
    }).then(res =>
      res.json()
    ), {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('posts')
        setAddPostClicked(false)
        setAddPostTitle('')
        setAddPostDescription('')
        setAddPostCategory('')
        setAddPostImage('')
        setAddPostStatus('')
      }
    }
  )

  const { mutate: categoryMutate, isSuccess: categoryIsSuccess, isLoading: categoryIsLoading, isError: categoryIsError } = useMutation('add-category', (data) =>
    fetch('http://localhost:3001/add-category', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res =>
      res.json()
    ), {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('categories')
        setAddCategoryClicked(false)
        setAddCategoryName('')
      }
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

  // dynamic table component
  const Table = ({data, isCategory = false}) => {
    return (
      <table className="table table-striped relative">
        <thead>
          <tr>
            {
              isCategory ? <>
              <th className="sticky top-0">Name</th>
              </>
              : <>
              <th className="sticky top-0">Title</th>
              <th className="sticky top-0">Author</th>
              <th className="sticky top-0">Slug</th>
              <th className="sticky top-0">Category</th>
              <th className="sticky top-0">Status</th>
              <th className="sticky top-0">Image</th>
              </>
            }
            
            <th className="sticky top-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(item => (
            <tr key={item.id}>
              {
                isCategory ?
                <>
                <td>{item.name}</td>
                </> :
                <>
                <td>{item.name}</td>
                <td>{item.created_by?.name}</td>
                <td>{item.slug}</td>
                <td>{item.category?.name}</td>
                <td>{item.status}</td>
                <td>{item.image_url}</td>
                </>
              }
              
              <td>
                <button className="btn btn-danger" onClick={() => deletePost(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const deletePost = id => {
  }

  const exampleData = []

  const addNewCategory = () => {
    setAddPostClicked(false)
    setAddCategoryClicked((prev) => !prev)
  }

  const addNewPost = () => {
    setAddCategoryClicked(false)
    setAddPostClicked((prev) => !prev)
  }

  const saveNewPost = () => {
    const data = new FormData()
    const image = addPostImage
    data.append('image', image)
    data.append('title', addPostTitle)
    data.append('description', addPostDescription)
    data.append('category', addPostCategory)
    data.append('slug', convertToSlug(addPostTitle))
    data.append('status', addPostStatus)
    postMutate(data)
  }

  const saveNewCategory = () => {
    categoryMutate({name: addCategoryName})
  }

  const convertToSlug = (text) => {
    return text?.toLowerCase()
               .replace(/[^\w ]+/g, '')
               .replace(/ +/g, '-');
  }
  
  const addImageToPost = (e) => {
    setAddPostImage(e.target.files[0])
  }

  return (
    <div>
        <div className=" flex justify-between m-5">
          <button className="btn btn-ghost underline" onClick={() => navigate('/posts')}>Posts</button>
          <button class="btn btn-warning" onClick={() => signOut()}>Logout</button>
        </div>  

        <div className="flex justify-around flex-row flex-wrap">
          <div className=" h-80 overflow-scroll flex flex-col justify-center items-center">
            <h1 className="mb-5">Categories</h1>
            {
              categoriesLoading ?
              <div className="flex justify-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              : <></>
            }
            <Table data={categories} isCategory={true}/>
          </div>
          <div className=" h-80 overflow-scroll flex flex-col justify-center items-center">
          <h1 className="mb-5">Posts</h1>
            <Table data={posts}/>
          </div>
        </div>

        <div className="flex justify-end">
          <div className=" w-1/3 mt-10">
            {
              addPostClicked ?
              <button className="btn btn-success" onClick={() => saveNewPost()}>{postIsLoading ? 'Saving...' : 'Save Post' }</button>
              :
              <button className="btn btn-primary" onClick={() => addNewPost()}>Add Post</button>
            }
            {
              addCategoryClicked ?
              <button className="btn btn-success ml-3" onClick={() => saveNewCategory()}>{categoryIsLoading ? 'Saving...' : 'Save Category' }</button>
              :
              <button className="btn btn-primary ml-3" onClick={() => addNewCategory()}>Add Category</button>
            }
          </div>
        </div>
        {
          addPostClicked ?
          <div className="flex justify-center mt-5 mb-10">
            <div className="w-6/12 bg-slate-700 rounded-lg p-5 shadow-lg flex justify-center flex-row">
              <div className="w-full max-w-md">
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Title</span>
                  </label>
                  <input type="text" placeholder="Type here" onChange={(e) => setAddPostTitle(e.target.value)} className="input input-ghost w-full max-w-md" />
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Slug</span>
                  </label>
                  <input type="text" disabled={true} placeholder={"Auto generated slug"} value={convertToSlug(addPostTitle)} className="input input-ghost w-full max-w-md" />
                </div>
                
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Category</span>
                  </label>
                  <select className="input input-ghost w-full max-w-md" onChange={(e) => setAddPostCategory(e.target.value)}>
                    <option value={''}>Select Category</option>
                    { 
                      categories.map(item => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Status</span>
                  </label>
                  <select className="input input-ghost w-full max-w-md" onChange={(e) => setAddPostStatus(e.target.value)}>
                    <option>Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Description</span>
                  </label>
                  <textarea className="input input-ghost w-full max-w-md" onChange={(e) => setAddPostDescription(e.target.value)} rows={20} placeholder="Type here"></textarea>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Image</span>
                  </label>
                  <input type="file" name="image" placeholder="Insert Post Image" onChange={(e) => addImageToPost(e)} className="input input-ghost w-full max-w-md" />
                </div>
              </div>
            </div>
          </div>
          :
          <></>
        }

        {
          addCategoryClicked ?
          <div className="flex justify-center mt-5 mb-10">
            <div className="w-6/12 bg-slate-700 rounded-lg p-5 shadow-lg flex justify-center flex-row">
              <div className="w-full max-w-md">
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Name</span>
                  </label>
                  <input type="text" placeholder="Type here" onChange={(e) => setAddCategoryName(e.target.value)} className="input input-ghost w-full max-w-md" />
                </div>
              </div>
            </div>
          </div>
          :
          <></>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin)