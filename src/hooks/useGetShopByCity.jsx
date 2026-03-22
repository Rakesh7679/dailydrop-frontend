import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity } from '../redux/userSlice'

function useGetShopByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
    const {location}=useSelector(state=>state.map)
  useEffect(()=>{
    if(!currentCity && (!location?.lat || !location?.lon)) return
    
    const fetchShops=async () => {
      try {
        let result
        let shopData = []
        
        if(location?.lat && location?.lon){
          try {
            console.log("Trying location-based search:", location.lat, location.lon)
            result=await axios.get(`${serverUrl}/api/shop/get-by-location?latitude=${location.lat}&longitude=${location.lon}&maxDistance=10000`,{withCredentials:true})
            shopData = result.data || []
            console.log("Location search returned:", shopData.length, "shops")
          } catch (locError) {
            console.log("Location search failed, falling back to city search:", locError.message)
            shopData = []
          }
        }
        
        if(shopData.length === 0 && currentCity){
          try {
            console.log("Fetching shops by city:", currentCity)
            result=await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
            shopData = result.data || []
            console.log("City search returned:", shopData.length, "shops")
          } catch (cityError) {
            console.log("City search also failed:", cityError.message)
          }
        }
        
        dispatch(setShopsInMyCity(shopData))
      } catch (error) {
        console.log("Error in shop fetch logic:", error.message)
        dispatch(setShopsInMyCity([]))
      }
    }
    fetchShops()
  },[currentCity, location?.lat, location?.lon, dispatch])
}

export default useGetShopByCity
