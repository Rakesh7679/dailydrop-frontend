import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})//itemId:rating

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })

    }

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='bg-white rounded-lg shadow-md p-6 space-y-5 border border-gray-200 hover:shadow-lg transition-all duration-300'>
            <div className='flex justify-between border-b border-gray-200 pb-4'>
                <div>
                    <p className='font-bold text-lg text-gray-900'>
                        Order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-600 mt-1'>
                        {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    {data.paymentMethod == "cod" ? <p className='text-sm text-gray-600 font-semibold bg-amber-50 px-3 py-1 rounded-lg'>{data.paymentMethod?.toUpperCase()}</p> : <p className='text-sm text-gray-600 font-semibold'>Payment: {data.payment ? "✓" : "✗"}</p>}

                    <p className='font-bold text-blue-600 mt-2 bg-blue-50 px-3 py-1.5 rounded-lg text-sm'>{data.shopOrders?.[0].status}</p>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className='border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4' key={index}>
                    <p className='font-bold text-lg text-gray-900'>{shopOrder.shop.name}</p>

                    <div className='flex space-x-4 overflow-x-auto pb-2 custom-scrollbar'>
                        {shopOrder.shopOrderItems.map((item, index) => (
                            item.item ? (
                            <div key={index} className='flex-shrink-0 w-44 border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-all duration-300'>
                                <img src={item.item.image} alt="" className='w-full h-28 object-cover rounded-lg' />
                                <p className='text-sm font-bold mt-2 text-gray-900 truncate'>{item.name}</p>
                                <p className='text-xs text-gray-600 mt-1'>Qty: {item.quantity} x ₹{item.price}</p>

                                {shopOrder.status == "delivered" && <div className='flex space-x-1 mt-3 justify-center'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className={`text-xl transition-all duration-200 hover:scale-125 ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => handleRating(item.item._id,star)}>★</button>
                                    ))}
                                </div>}



                            </div>
                            ) : (
                                <div key={index} className='flex-shrink-0 w-44 border-2 border-gray-200 rounded-2xl p-3 bg-gray-50'>
                                    <div className='w-full h-28 bg-gray-300 rounded-xl flex items-center justify-center'>
                                        <p className='text-xs text-gray-600 font-medium'>Item unavailable</p>
                                    </div>
                                    <p className='text-sm font-bold mt-2 text-gray-700 truncate'>{item.name}</p>
                                    <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity} x ₹{item.price}</p>
                                </div>
                            )
                        ))}
                    </div>
                    <div className='flex justify-between items-center border-t border-gray-200 pt-3'>
                        <p className='font-bold text-gray-900 text-lg'>Subtotal: ₹{shopOrder.subtotal}</p>
                        <span className='text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg'>{shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className='flex justify-between items-center border-t border-gray-200 pt-4'>
                <p className='font-bold text-gray-900 text-xl'>Total: ₹{data.totalAmount}</p>
                <button className='bg-[#e23744] hover:bg-[#c72333] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200' onClick={() => navigate(`/track-order/${data._id}`)}>Track Order</button>
            </div>



        </div>
    )
}

export default UserOrderCard
