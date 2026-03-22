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
        if(!navigator.geolocation){
            console.log("Geolocation is not supported by this browser")
            return
        }

        const promptNoticeKey = `locationPromptNoticeShown_${userData?._id}`
        const deniedNoticeKey = `locationDeniedNoticeShown_${userData?._id}`
        const serviceOffNoticeKey = `locationServiceOffNoticeShown_${userData?._id}`

        let watchId
        
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
            }
        }

        const startWatchLocation = () => {
            watchId = navigator.geolocation.watchPosition(
                (position)=>{
                    console.log("Location changed:", position.coords)
                    updateCity(position.coords.latitude, position.coords.longitude)
                },
                (error)=>{
                    console.log("Location watch error:", error.message)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }
            )
        }

        const requestInitialLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateCity(position.coords.latitude, position.coords.longitude)
                    startWatchLocation()
                },
                (error) => {
                    console.log("Initial location access failed:", error.message)

                    if (error.code === error.PERMISSION_DENIED && !sessionStorage.getItem(deniedNoticeKey)) {
                        alert("Location access denied. Please allow location permission from browser settings.")
                        sessionStorage.setItem(deniedNoticeKey, "1")
                    }

                    if (
                        (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) &&
                        !sessionStorage.getItem(serviceOffNoticeKey)
                    ) {
                        alert("Location is off or unavailable. Please turn on your device location service and try again.")
                        sessionStorage.setItem(serviceOffNoticeKey, "1")
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }
            )
        }

        const requestPermissionAwareLocation = async () => {
            try {
                if (navigator.permissions?.query) {
                    const geolocationPermission = await navigator.permissions.query({ name: "geolocation" })
                    if (geolocationPermission.state === "prompt" && !sessionStorage.getItem(promptNoticeKey)) {
                        alert("Please turn on location and allow browser permission to continue.")
                        sessionStorage.setItem(promptNoticeKey, "1")
                    }

                    if (geolocationPermission.state === "denied" && !sessionStorage.getItem(deniedNoticeKey)) {
                        alert("Location permission is blocked. Please allow location from browser site settings.")
                        sessionStorage.setItem(deniedNoticeKey, "1")
                    }
                }
            } catch (error) {
                console.log("Geolocation permission check failed:", error)
            }

            requestInitialLocation()
        }

        requestPermissionAwareLocation()
        
        // Cleanup
        return ()=>{
            if(watchId) navigator.geolocation.clearWatch(watchId)
        }
    },[userData, apiKey, dispatch])
}

export default useGetCity
