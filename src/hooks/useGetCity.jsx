import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
    
    useEffect(()=>{
        if(!userData) return
        
        const updateCity = async (latitude, longitude) => {
            dispatch(setLocation({lat:latitude,lon:longitude}))
            
            try {
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
                console.log("City updated:", result.data)
                dispatch(setCurrentCity(result?.data?.results[0]?.city||result?.data?.results[0]?.county || "Barasat"))
                dispatch(setCurrentState(result?.data?.results[0]?.state || "West Bengal"))
                dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1 || "Barasat"))
                dispatch(setAddress(result?.data?.results[0]?.address_line2 || "Barasat"))
            } catch (error) {
                console.log("Location API error:", error)
                dispatch(setCurrentCity("Delhi"))
                dispatch(setCurrentState("Delhi"))
            }
        }
        
        // Watch position for real-time updates
        const watchId = navigator.geolocation.watchPosition(
            (position)=>{
                console.log("Location changed:", position.coords)
                updateCity(position.coords.latitude, position.coords.longitude)
            },
            (error)=>{
                console.log("Location denied, using Barasat as default")
                dispatch(setCurrentCity("Barasat"))
                dispatch(setCurrentState("West Bengal"))
                dispatch(setCurrentAddress("Barasat, West Bengal"))
                dispatch(setLocation({ lat: 22.7200, lon: 88.4800 }))
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // Use cached position if less than 1 minute old
            }
        )
        
        // Cleanup
        return ()=>{
            if(watchId) navigator.geolocation.clearWatch(watchId)
        }
    },[userData])
}

export default useGetCity
