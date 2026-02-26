import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi2";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({data}) {
    const dispatch = useDispatch()
    
    const handleIncrease = (id, currentQty) => {
        dispatch(updateQuantity({id, quantity: currentQty + 1}))
    }
    
    const handleDecrease = (id, currentQty) => {
        if(currentQty > 1) {
            dispatch(updateQuantity({id, quantity: currentQty - 1}))
        }
    }

    return (
        <div className='flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 group'>
            {/* Image */}
            <div className='relative'>
                <img 
                    src={data.image} 
                    alt={data.name} 
                    className='w-20 h-20 object-cover rounded-xl shadow-sm'
                />
                <div className='absolute -top-1 -right-1 w-5 h-5 bg-[#e23744] rounded-full flex items-center justify-center'>
                    <span className='text-white text-[10px] font-bold'>{data.quantity}</span>
                </div>
            </div>
            
            {/* Details */}
            <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-gray-900 truncate'>{data.name}</h3>
                <p className='text-sm text-gray-500 mt-0.5'>₹{data.price} each</p>
                <p className='font-bold text-[#e23744] mt-1'>₹{data.price * data.quantity}</p>
            </div>
            
            {/* Quantity Controls */}
            <div className='flex items-center gap-1'>
                <div className='flex items-center bg-gray-100 rounded-xl overflow-hidden'>
                    <button 
                        className='p-2.5 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#e23744]' 
                        onClick={() => handleDecrease(data.id, data.quantity)}
                    >
                        <FaMinus size={10}/>
                    </button>
                    <span className='font-bold text-gray-900 min-w-[32px] text-center text-sm'>
                        {data.quantity}
                    </span>
                    <button 
                        className='p-2.5 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-green-600' 
                        onClick={() => handleIncrease(data.id, data.quantity)}
                    >
                        <FaPlus size={10}/>
                    </button>
                </div>
                <button 
                    className='p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100'
                    onClick={() => dispatch(removeCartItem(data.id))}
                >
                    <HiOutlineTrash size={18}/>
                </button>
            </div>
        </div>
    )
}

export default CartItemCard
