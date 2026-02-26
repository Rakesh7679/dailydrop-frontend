import React, { useEffect, useState } from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
function OrderPlaced() {
    const navigate=useNavigate()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }, [navigate])

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 pb-20 md:pb-4 text-center relative overflow-hidden'>
      <FaCircleCheck className='text-green-500 text-6xl mb-4'/>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed!
      </h1>
      <p className='text-gray-600 max-w-md mb-6'>Thank you for your purchase. Your order is being prepared.  
        You can track your order status in the "My Orders" section.
     </p>
     <p className='text-gray-500 mb-4'>Redirecting to home in {countdown} seconds...</p>
     <div className='flex gap-4'>
       <button className='bg-[#e23744] hover:bg-[#c72333] text-white px-6 py-3 rounded-lg text-lg font-medium transition' onClick={()=>navigate("/my-orders")}>My Orders</button>
       <button className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition' onClick={()=>navigate("/")}>Go to Home</button>
     </div>
    </div>
  )
}

export default OrderPlaced

