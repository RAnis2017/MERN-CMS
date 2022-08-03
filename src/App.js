import React, { useEffect } from "react"
import "./App.css"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate
} from "react-router-dom";
import { useQuery } from 'react-query'
import Login from "./Pages/Login";
import PostsAdmin from "./Pages/PostsAdmin";
import Posts from "./Pages/Posts";
import { deniedAlertService, fetchFunc } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesAdmin from "./Pages/CategoriesAdmin";
import UsersAdmin from "./Pages/UsersAdmin";
import { SetPermissionsAction } from "./redux/App/app.actions";
import { useGoogleLogout } from "react-google-login";
const clientId = '874157957573-9ghj35jep265q5u0ksfjr5mm22qmbb1k.apps.googleusercontent.com'

const AppOutlet = ({ setPermissions }) => {
  const { data: permissions } = useQuery('permissions', () =>
    fetchFunc('http://localhost:3001/get-user-permissions', 'GET', {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    }, null, null, 'getUserPermissions'),
    {
      refetchOnWindowFocus: false,
      retryError: false,
      refetchOnError: false,
      onSuccess: (data) => {
        setPermissions(data)
      }
    }
  )

  const permissionsList = permissions?.map(permission => permission.label)
  const navigate = useNavigate()
  const onLogoutSuccess = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/')
  }

  const onFailure = (error) => {
    console.log(error)
  }

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  })

  return (
    <>
      <div>
        <header className="sticky top-0 z-50 bg-gray-800">
          <nav className="flex justify-start items-center p-4">
            <div className="flex items-center">
              <img src="https://www.gstatic.com/images/branding/product/1x/keep_48dp.png" alt="logo" className="w-8 h-8" />
              <h1 className="ml-2 text-2xl font-bold">React CMS</h1>
            </div>
            <div className="flex items-center ml-5">
              {permissionsList?.includes('can_admin_posts') &&
                <button className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/admin/posts')}>
                  <span className="">Create Posts</span>
                </button>
              }
              {permissionsList?.includes('can_admin_categories') &&
                <button className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => navigate('/admin/categories')}>
                  <span className="">Create Categories</span>
                </button>
              }
              {permissionsList?.includes('can_admin_users') &&
                <button className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => navigate('/admin/users')}>
                  <span className="">Edit Users</span>
                </button>
              }
              {permissionsList?.includes('can_see_posts') &&
                <button className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => navigate('/posts')}>
                  <span className="">Posts</span>
                </button>
              }
            </div>
            <div className="flex items-center ml-auto">
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut()}>
                <span className="">Logout</span>
              </button>
            </div>
          </nav>
        </header>
        <main className="my-20">
          <Outlet />
        </main>
        {/* <footer class="fixed inset-x-0 bottom-0 bg-gray-800">
          <div className="flex justify-center items-center h-full">
            <span className="text-white text-center m-5">React CMS</span>
          </div>
        </footer> */}
      </div>
    </>
  );
};

function App({ setPermissions }) {

  useEffect(() => {
    // subscribe to home component messages
    const subscription = deniedAlertService.onDeniedAlert().subscribe(message => {
      if (message) {
        toast.error(message.text, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,

        });
      }
    });

    // return unsubscribe method to execute when component unmounts
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen">

        <ToastContainer limit={1} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppOutlet setPermissions={setPermissions} />}>
            <Route path="admin/posts" element={<PostsAdmin />} />
            <Route path="admin/categories" element={<CategoriesAdmin />} />
            <Route path="posts" element={<Posts />} />
            <Route path="admin/users" element={<UsersAdmin />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>

      </div>
    </Router>
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.appState.isLoggedIn,
    email: state.appState.email,
    token: state.appState.token,
    permissions: state.appState.permissions,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPermissions: (permissions) => dispatch(SetPermissionsAction(permissions)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)