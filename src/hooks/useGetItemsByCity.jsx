import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
    const {location}=useSelector(state=>state.map)
  useEffect(()=>{
    if(!currentCity && (!location?.lat || !location?.lon)) return
    
    const fetchItems=async () => {
      try {
        let result
        let itemData = []
        
        if(location?.lat && location?.lon){
          try {
            console.log("Trying location-based item search:", location.lat, location.lon)
            result=await axios.get(`${serverUrl}/api/item/get-by-location?latitude=${location.lat}&longitude=${location.lon}&maxDistance=10000`,{withCredentials:true})
            itemData = result.data || []
            console.log("Location item search returned:", itemData.length, "items")
          } catch (locError) {
            console.log("Location item search failed, falling back to city search:", locError.message)
            itemData = []
          }
        }
        
        if(itemData.length === 0 && currentCity){
          try {
            console.log("Fetching items by city:", currentCity)
            result=await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
            itemData = result.data || []
            console.log("City item search returned:", itemData.length, "items")
          } catch (cityError) {
            console.log("City item search also failed:", cityError.message)
          }
        }
        
        dispatch(setItemsInMyCity(itemData))
      } catch (error) {
        console.log("Error in item fetch logic:", error.message)
        dispatch(setItemsInMyCity([]))
      }
    }
    fetchItems()
  },[currentCity, location?.lat, location?.lon, dispatch])
}

export default useGetItemsByCity
