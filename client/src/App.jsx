import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Mainpage from './Pages/Mainpage'
import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import AdminPage from './Pages/AdminPage'
import UserPage from './Pages/UserPage'
import QRScannerPage from './Pages/QRScannerPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

const App = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Mainpage/>}/>
                <Route path='/login' element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }/>
                <Route path='/signup' element={
                    <PublicRoute>
                        <Signup/>
                    </PublicRoute>
                }/>
                <Route path='/forgot-password' element={
                    <PublicRoute>
                        <ForgotPassword/>
                    </PublicRoute>
                }/>
                
                {/* Protected Routes */}
                <Route 
                    path='/admin' 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPage/>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path='/user' 
                    element={
                        <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <UserPage/>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path='/scanner' 
                    element={
                        <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <QRScannerPage/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  )
}

export default App