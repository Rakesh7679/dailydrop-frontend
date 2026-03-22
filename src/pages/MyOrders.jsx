import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { clearOwnerUnreadOrders } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';


function MyOrders() {
  const { userData, myOrders,socket} = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)

  // Fetch available assignments for delivery boy
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getAssignments()
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  const cancelAssignment = async (assignmentId) => {
    try {
      await axios.post(`${serverUrl}/api/order/cancel-assignment/${assignmentId}`, {}, { withCredentials: true })
      await getAssignments()
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Failed to cancel assignment")
    }
  }

  useEffect(() => {
    if (userData?.role === 'deliveryBoy') {
      getAssignments()
      getCurrentOrder()
    }
  }, [userData])

  useEffect(() => {
    if (userData?.role === 'deliveryBoy' && socket) {
      socket.on('newAssignment', (data) => {
        setAvailableAssignments(prev => ([...prev, data]))
      })
      return () => {
        socket.off('newAssignment')
      }
    }
  }, [socket, userData])

  useEffect(() => {
    if (userData?.role === 'owner') {
      dispatch(clearOwnerUnreadOrders())
    }
  }, [userData?.role, dispatch])



  
  return (
    <div className='w-full min-h-screen bg-gray-50 flex justify-center px-4 py-8 pb-20 md:pb-8'>
      <div className='w-full max-w-[900px] p-4'>

        <div className='flex items-center gap-5 mb-8'>
          <div className='cursor-pointer hover:scale-110 transition-transform duration-200' onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={40} className='text-[#e23744]' />
          </div>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900'>
            {userData.role === 'deliveryBoy' ? 'Available Orders' : 'My Orders'}
          </h1>
        </div>

        {/* Delivery Boy View */}
        {userData.role === 'deliveryBoy' ? (
          <div className='space-y-6'>
            {currentOrder && (
              <div className='bg-green-50 border border-green-200 rounded-xl p-4 mb-4'>
                <p className='text-green-700 font-semibold text-sm'>You have an active delivery. Complete it first to accept new orders.</p>
                <div className='mt-2 flex items-center gap-2'>
                  <button 
                    className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600'
                    onClick={() => navigate('/')}
                  >
                    Go to Current Order
                  </button>
                  <button
                    className='bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600'
                    onClick={() => cancelAssignment(currentOrder.assignmentId)}
                  >
                    Cancel Delivery
                  </button>
                </div>
              </div>
            )}
            
            {availableAssignments?.length > 0 ? (
              availableAssignments.map((a, index) => (
                <div className='bg-white rounded-xl shadow-md border border-gray-100 p-5' key={index}>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <p className='text-lg font-bold text-gray-900'>{a?.shopName}</p>
                      <p className='text-sm text-gray-600 mt-1'>
                        <span className='font-semibold'>Delivery to:</span> {a?.deliveryAddress?.text}
                      </p>
                      <p className='text-sm text-gray-500 mt-2'>
                        {a?.items?.length} items • ₹{a?.subtotal}
                      </p>
                    </div>
                    <button 
                      className='bg-[#e23744] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#c72333] transition-all disabled:opacity-50 disabled:cursor-not-allowed' 
                      onClick={() => acceptOrder(a.assignmentId)}
                      disabled={currentOrder}
                    >
                      Accept
                    </button>
                    <button
                      className='ml-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all'
                      onClick={() => cancelAssignment(a.assignmentId)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-400 text-lg'>No available orders right now</p>
                <p className='text-gray-400 text-sm mt-2'>New orders will appear here</p>
              </div>
            )}
          </div>
        ) : (
          /* User/Owner View */
          <div className='space-y-6'>
            {myOrders?.map((order, index) => (
              userData.role === "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
