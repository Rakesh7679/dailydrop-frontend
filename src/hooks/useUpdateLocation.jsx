import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
 
    useEffect(()=>{
        // Only track location for deliveryBoy
        if(!userData || userData.role !== "deliveryBoy") return
        
        const updateLocation=async (lat,lon) => {
            try {
                // Update backend
                await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
                
                // Update frontend location and city
                dispatch(setLocation({lat,lon}))
                
                // Fetch and update city/address
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`)
                dispatch(setCurrentCity(result?.data?.results[0]?.city || result?.data?.results[0]?.county))
                dispatch(setCurrentState(result?.data?.results[0]?.state))
                dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1))
                dispatch(setAddress(result?.data?.results[0]?.address_line2))
                
                console.log("Location updated:", result?.data?.results[0]?.city)
            } catch (error) {
                console.log("Location update error:", error)
            }
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos)=>{
                updateLocation(pos.coords.latitude,pos.coords.longitude)
            },
            (error)=>{
                console.log("Location watch error:", error.message)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000
            }
        )
        
        // Cleanup
        return ()=>{
            if(watchId) navigator.geolocation.clearWatch(watchId)
        }
    },[userData])
}

export default useUpdateLocation
