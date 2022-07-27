import React from "react"
import "./Posts.css"
import { connect } from "react-redux"
import { useGoogleLogout } from 'react-google-login'
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { faUser, faCalendar, faDna } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { fetchFunc } from "../utils"

const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

function Posts(props) {
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

  const { data: posts, isLoading: isPostsLoading, isError: isPostsError } = useQuery('posts', () => 
    fetchFunc(`http://localhost:3001/get-posts`, 'GET', {
      'x-access-token': localStorage.getItem('token'),
      'accept': 'application/json',
      'content-type': 'application/json'
    }, null, navigate, 'readAllPosts'),
    {
      refetchOnWindowFocus: false,
      retry: false,
      retryError: false,
      refetchOnError: false
    }
  )

  return (
    <div>
      <div className="posts-container flex justify-center content-center flex-wrap flex-col">
        {isPostsLoading ? <p>Loading...</p> : null}
        {isPostsError ? <p>Error</p> : null}
        {posts?.length && posts?.map(post => (
          <div className="post-container p-5 bg-white max-w-4xl rounded-xl shadow-xl mb-10" key={post._id}>
            <div className="post-title text-2xl">
              <h1>{post.name}</h1>
            </div>
            <div className="post-date">
              <FontAwesomeIcon icon={faCalendar} className="mr-5" />
              {(new Date(post.created_date).toDateString())}</div>
            <div className="post-author">
              <FontAwesomeIcon icon={faUser} className="mr-5" />
              {post.created_by.name}
            </div>
            <div className="post-category">
              <FontAwesomeIcon icon={faDna} className="mr-5" />
              {post.category.name}
            </div>
            <div className="post-img flex justify-center content-center mt-5">
              <img src={`http://localhost:3001/${post.image_urls?.[0]}`} className="rounded-lg shadow-lg" alt={post.slug} />
            </div>
            <div className="post-description mt-10"><div dangerouslySetInnerHTML={{__html: post.description}}></div></div>
          </div>
        ))}
        {
          !posts?.length && !isPostsLoading && !isPostsError ? <p>No posts found</p> : null
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Posts)