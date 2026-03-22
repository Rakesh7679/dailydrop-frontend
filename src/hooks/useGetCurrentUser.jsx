import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch=useDispatch()
  useEffect(()=>{
  const fetchUser=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            dispatch(setUserData(result.data))
  
    } catch (error) {
        // Ignore expected startup/auth errors to avoid noisy console output
        if (
          error.code === "ERR_NETWORK" ||
          error.response?.status === 400 ||
          error.response?.status === 401
        ) {
          return
        }
        console.log(error)
    }
}
fetchUser()
 
  },[])
}

export default useGetCurrentUser
