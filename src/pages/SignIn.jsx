import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignIn() {
    const primaryColor = "#e23744";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const [googleLoading,setGoogleLoading]=useState(false)
    const dispatch=useDispatch()
     const handleSignIn=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
            },{withCredentials:true})
           dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
           setErr(error?.response?.data?.message)
           setLoading(false)
        }
     }
     const handleGoogleAuth=async () => {
        if(googleLoading) return
        setGoogleLoading(true)
        setErr("")
        try {
             const provider=new GoogleAuthProvider()
             provider.setCustomParameters({
                 prompt: 'select_account'
             })
             const result=await signInWithPopup(auth,provider)
             const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
                 email:result.user.email,
             },{withCredentials:true})
             dispatch(setUserData(data))
             setGoogleLoading(false)
       } catch (error) {
         console.log(error)
         if(error.code === 'auth/popup-blocked'){
            setErr("Popup blocked by browser. Please allow popups for this site.")
         } else if(error.code === 'auth/cancelled-popup-request'){
            setErr("Sign-in cancelled. Please try again.")
         } else {
            setErr("Google sign-in failed. Please try again.")
         }
         setGoogleLoading(false)
       }
          }
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-gray-50'>
            
            <div className='bg-white shadow-lg rounded-lg w-full max-w-md p-8 border border-gray-200'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-[#e23744] mb-2'>DAILY-DROP</h1>
                    <p className='text-gray-600 text-sm'>Sign in to order delicious food
                    </p>
                </div>

              
                {/* email */}

                <div className='mb-4'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-2 text-sm'>Email</label>
                    <input type="email" className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#e23744] transition-colors text-sm' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                {/* password*/}

                <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700 font-medium mb-2 text-sm'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#e23744] pr-11 transition-colors text-sm' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                        <button className='absolute right-3 cursor-pointer top-3 text-gray-500 hover:text-[#e23744] transition-colors' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye size={18}/> : <FaRegEyeSlash size={18}/>}</button>
                    </div>
                </div>
                <div className='text-right mb-4 cursor-pointer text-[#e23744] font-medium hover:text-[#cb202d] transition-colors text-sm' onClick={()=>navigate("/forgot-password")}>
                  Forgot Password?
                </div>
              

            <button className='w-full font-semibold py-3 rounded-lg transition-all duration-200 bg-[#e23744] text-white hover:bg-[#cb202d] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' onClick={handleSignIn} disabled={loading}>
                {loading?<ClipLoader size={18} color='white'/>:"Sign In"}
            </button>
      {err && <p className='text-red-600 text-center my-3 text-xs font-medium bg-red-50 py-2 px-3 rounded border border-red-200'>*{err}</p>}

            <button className='w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 transition-all duration-200 cursor-pointer hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm' onClick={handleGoogleAuth} disabled={googleLoading}>
{googleLoading ? <ClipLoader size={18} color='#e23744'/> : <><FcGoogle size={20}/><span>Sign In with Google</span></>}
            </button>
            <p className='text-center mt-6 cursor-pointer text-gray-600 text-sm' onClick={()=>navigate("/signup")}>New to DAILY-DROP?  <span className='text-[#e23744] font-semibold hover:text-[#cb202d] transition-colors'>Create account</span></p>
            </div>
        </div>
    )
}

export default SignIn
