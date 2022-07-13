import React, { useState } from "react"
import "./Admin.css"
import { connect } from "react-redux"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { faTrash, faPen, faCheck, faCancel, faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchFunc } from "../utils"

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
  const [isPostUpdating, setIsPostUpdating] = useState(false)
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false)
  const queryClient = useQueryClient()


  //Editor

  const [value, setValue] = useState('');


  const { isLoading: categoriesLoading, isSuccess: categoriesSuccess, data: categories } = useQuery('categories', () =>
    fetchFunc('http://localhost:3001/get-categories', 'GET', {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    }, null, navigate)
  )

  const { isLoading: postsLoading, isSuccess: postsSuccess, data: posts } = useQuery('posts', () =>
    fetchFunc('http://localhost:3001/get-posts', 'GET', {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    }, null, navigate)
  )

  const { mutate: postMutate, isSuccess: postIsSuccess, isLoading: postIsLoading, isError: postIsError } = useMutation('add-post', (data) =>
    fetchFunc('http://localhost:3001/add-post', 'POST', {
      'x-access-token': localStorage.getItem('token'),
    }, data, navigate)
    , {
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
    fetchFunc('http://localhost:3001/add-category', 'POST', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, JSON.stringify(data), navigate)
    , {
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

  const deleteCall = (id, isCategory) => {
    if (isCategory) {
      categoryMutateDelete.mutate({
        id
      })
    } else {
      postMutateDelete.mutate({
        id
      })
    }
  }

  const editCall = (id, isCategory) => {
    if (isCategory) {
      setAddCategoryClicked(true)
      setAddCategoryName(categories.find(category => category._id === id).name)
      setIsCategoryUpdating(id)
    } else {
      setAddPostClicked(true)
      setAddPostTitle(posts.find(post => post._id === id).name)
      setAddPostDescription(posts.find(post => post._id === id).description)
      setAddPostCategory(posts.find(post => post._id === id).category._id)
      setAddPostImage(posts.find(post => post._id === id).image_url)
      setAddPostStatus(posts.find(post => post._id === id).status === 'true' ? true : false)
      setIsPostUpdating(id)
    }
  }

  const changeStatusCall = (id, status) => {
    postMutateChangeStatus.mutate({
      id,
      status
    })
  }

  const postMutateDelete = useMutation('delete-post', (data) =>
    fetchFunc(`http://localhost:3001/delete-post/${data.id}`, 'DELETE', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, null, navigate), {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('posts')
    }
  }
  )

  const categoryMutateDelete = useMutation('delete-category', (data) =>
    fetchFunc(`http://localhost:3001/delete-category/${data.id}`, 'DELETE', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, null, navigate), {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('categories')
      queryClient.invalidateQueries('posts')
    }
  }
  )

  const postMutateChangeStatus = useMutation('change-status', (data) =>
    fetchFunc(`http://localhost:3001/change-status/${data.id}`, 'PUT', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, JSON.stringify(data), navigate)
    , {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('posts')
      }
    }
  )

  const { mutate: postUpdateMutate } = useMutation('update-post', (data) =>
    fetchFunc(`http://localhost:3001/update-post/${isPostUpdating}`, 'PUT', {
      'x-access-token': localStorage.getItem('token'),
    }, data, navigate), {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('posts')
      setAddPostClicked(false)
      setAddPostTitle('')
      setAddPostDescription('')
      setAddPostCategory('')
      setAddPostImage('')
      setAddPostStatus('')
      setIsPostUpdating(false)
    }
  }
  )

  const { mutate: categoryUpdateMutate } = useMutation('update-category', (data) =>
    fetchFunc(`http://localhost:3001/update-category/${isCategoryUpdating}`, 'PUT', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, JSON.stringify(data), navigate), {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('categories')
      setAddCategoryClicked(false)
      setAddCategoryName('')
      setIsCategoryUpdating(false)
    }
  }
  )


  // dynamic table component
  const Table = ({ data, isCategory = false }) => {
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
            <tr key={item._id}>
              {
                isCategory ?
                  <>
                    <td>{item.name}</td>
                  </> :
                  <>
                    <td className="truncate max-w-[200px]" title={item.name}>{item.name}</td>
                    <td className="truncate max-w-[100px]" title={item.created_by?.name}>{item.created_by?.name}</td>
                    <td className="truncate max-w-[100px]" title={item.slug}>{item.slug}</td>
                    <td className="truncate max-w-[100px]" title={item.category?.name}>{item.category?.name}</td>
                    <td className={`truncate max-w-xs ${item.status === 'true' ? 'text-green-400' : 'text-red-400'}`}>{item.status === 'true' ? 'Active' : 'Inactive'}</td>
                    <td className="truncate max-w-xs">
                      <a className="btn btn-sm btn-circle" title={item.image_url} href={`http://localhost:3001/${item.image_url}`} target="_blank">
                        <FontAwesomeIcon icon={faImage} className="text-blue-400" />
                      </a>
                    </td>
                  </>
              }

              <td>
                {
                  isCategory ?
                    <></> :
                    <button className="btn btn-circle" onClick={() => changeStatusCall(item._id, item.status)}>
                      {
                        item.status === 'true' ?
                          <FontAwesomeIcon className="text-red-400" icon={faCancel} /> :
                          <FontAwesomeIcon className="text-green-400" icon={faCheck} />
                      }
                    </button>
                }
                <button className="btn btn-circle ml-2" onClick={() => editCall(item._id, isCategory)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="btn btn-circle ml-2 text-red-400" onClick={() => deleteCall(item._id, isCategory)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

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

    if (isPostUpdating) {
      postUpdateMutate(data)
    } else {
      postMutate(data)
    }
  }

  const saveNewCategory = () => {
    if (isCategoryUpdating) {
      categoryUpdateMutate({ name: addCategoryName })
    } else {
      categoryMutate({ name: addCategoryName })
    }
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
        <button className="btn btn-warning" onClick={() => signOut()}>Logout</button>
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
          <Table data={categories} isCategory={true} />
        </div>
        <div className=" h-80 overflow-scroll flex flex-col justify-center items-center">
          <h1 className="mb-5">Posts</h1>
          <Table data={posts} />
        </div>
      </div>

      <div className="flex justify-end">
        <div className=" w-1/3 mt-10">
          {
            addPostClicked ?
              <button className="btn btn-success" onClick={() => saveNewPost()}>{postIsLoading ? 'Saving...' : isPostUpdating ? 'Update Post' : 'Save Post'}</button>
              :
              <button className="btn btn-primary" onClick={() => addNewPost()}>Add Post</button>
          }
          {
            addCategoryClicked ?
              <button className="btn btn-success ml-3" onClick={() => saveNewCategory()}>{categoryIsLoading ? 'Saving...' : isCategoryUpdating ? 'Update Category' : 'Save Category'}</button>
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
                  <input type="text" placeholder="Type here" value={addPostTitle} onChange={(e) => setAddPostTitle(e.target.value)} className="input input-ghost w-full max-w-md" />
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
                  <select className="input input-ghost w-full max-w-md" value={addPostCategory} onChange={(e) => setAddPostCategory(e.target.value)}>
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
                  <select className="input input-ghost w-full max-w-md" value={addPostStatus} onChange={(e) => setAddPostStatus(e.target.value)}>
                    <option>Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                <div className="form-control w-full max-w-md">
                  <label className="label">
                    <span className="label-text text-white">Description</span>
                  </label>
                  <ReactQuill className="bg-slate-800 border-transparent" theme="snow" value={addPostDescription} onChange={(e) => { setAddPostDescription(e) }} />
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
                  <input type="text" placeholder="Type here" value={addCategoryName} onChange={(e) => setAddCategoryName(e.target.value)} className="input input-ghost w-full max-w-md" />
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