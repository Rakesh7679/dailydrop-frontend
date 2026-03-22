import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
 
    useEffect(()=>{
        // Track live location for deliveryBoy and owner
        if(!userData || !["deliveryBoy", "owner"].includes(userData.role)) return
        if(!navigator.geolocation){
            console.log("Geolocation is not supported by this browser")
            return
        }

        const promptNoticeKey = `liveLocationPromptNoticeShown_${userData?._id}`
        const deniedNoticeKey = `liveLocationDeniedNoticeShown_${userData?._id}`
        const serviceOffNoticeKey = `liveLocationServiceOffNoticeShown_${userData?._id}`

        let watchId
        
        const updateLocation=async (lat,lon) => {
            try {
                // Update backend
                await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
                
                // Update frontend location and city
                dispatch(setLocation({lat,lon}))
                
                // Fetch and update city/address
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`, {
                    withCredentials: false,
                    headers: { Authorization: undefined }
                })
                dispatch(setCurrentCity(result?.data?.results[0]?.city || result?.data?.results[0]?.county))
                dispatch(setCurrentState(result?.data?.results[0]?.state))
                dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1))
                dispatch(setAddress(result?.data?.results[0]?.address_line2))
                
                console.log("Location updated:", result?.data?.results[0]?.city)
            } catch (error) {
                console.log("Location update error:", error)
            }
        }

        const startWatchLocation = () => {
            watchId = navigator.geolocation.watchPosition(
                (pos)=>{
                    updateLocation(pos.coords.latitude,pos.coords.longitude)
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
                (position)=>{
                    updateLocation(position.coords.latitude, position.coords.longitude)
                    startWatchLocation()
                },
                (error)=>{
                    console.log("Initial delivery location fetch failed:", error.message)

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

export default useUpdateLocation
