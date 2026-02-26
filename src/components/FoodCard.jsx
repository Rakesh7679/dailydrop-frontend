import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({data}) {
const [quantity,setQuantity]=useState(0)
const dispatch=useDispatch()
const {cartItems}=useSelector(state=>state.user)
    const renderStars=(rating)=>{   //r=3
        const stars=[];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i<=rating)?(
                <FaStar key={i} className='text-yellow-500 text-lg'/>
            ):(
                <FaRegStar key={i} className='text-yellow-500 text-lg'/>
            )
           )
            
        }
return stars
    }

const handleIncrease=()=>{
    const newQty=quantity+1
    setQuantity(newQty)
}
const handleDecrease=()=>{
    if(quantity>0){
const newQty=quantity-1
    setQuantity(newQty)
    }
    
}

  return (
    <div className='w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group'>
      <div className='relative w-full h-48 overflow-hidden bg-gray-100'>
        <div className='absolute top-3 left-3 bg-white rounded px-2 py-1 shadow-sm z-10 flex items-center gap-1'>
          {data.foodType=="veg"?
            <div className='w-3 h-3 border-2 border-green-600 flex items-center justify-center'><div className='w-1.5 h-1.5 rounded-full bg-green-600'></div></div>
            :
            <div className='w-3 h-3 border-2 border-red-600 flex items-center justify-center'><div className='w-1.5 h-1.5 rounded-full bg-red-600'></div></div>
          }
        </div>

        <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'/>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className='font-bold text-gray-900 text-lg mb-1 truncate'>{data.name}</h1>

        <div className='flex items-center gap-2 mb-2'>
          <div className='flex items-center gap-1'>
            {renderStars(data.rating?.average || 0)}
          </div>
          <span className='text-xs text-gray-500 font-medium'>
            ({data.rating?.count || 0})
          </span>
        </div>

        <div className='flex items-center justify-between mt-auto pt-3 border-t border-gray-100'>
          <span className='font-bold text-gray-900 text-lg'>
            ₹{data.price}
          </span>

          <div className='flex items-center gap-2'>
            {quantity > 0 ? (
              <>
                <button className='w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:border-[#e23744] hover:text-[#e23744] transition-colors' onClick={handleDecrease}>
                  <FaMinus size={10}/>
                </button>
                <span className='font-bold text-gray-900 min-w-[20px] text-center'>{quantity}</span>
                <button className='w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:border-[#e23744] hover:text-[#e23744] transition-colors' onClick={handleIncrease}>
                  <FaPlus size={10}/>
                </button>
              </>
            ) : (
              <button className='px-4 py-2 bg-white border border-[#e23744] text-[#e23744] rounded font-semibold text-sm hover:bg-[#e23744] hover:text-white transition-all' onClick={handleIncrease}>
                ADD
              </button>
            )}
          </div>
        </div>

        {quantity > 0 && !cartItems.some(i=>i.id==data._id) && (
          <button className='mt-2 w-full py-2 bg-[#e23744] text-white rounded font-semibold text-sm hover:bg-[#cb202d] transition-all' onClick={()=>{
            dispatch(addToCart({
              id:data._id,
              name:data.name,
              price:data.price,
              image:data.image,
              shop:data.shop?._id || data.shop,
              quantity,
              foodType:data.foodType
            }))
          }}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

export default FoodCard
