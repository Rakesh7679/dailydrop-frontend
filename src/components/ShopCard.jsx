import React from 'react'
import { FaStar } from 'react-icons/fa'
import { BsLightningFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const discountLabels = [
  '50% OFF select items',
  '₹50 OFF above ₹199',
  'Items at ₹139',
  'Free Delivery',
  '30% OFF select items',
  '₹100 OFF above ₹299',
]

function ShopCard({ data, index = 0 }) {
  const navigate = useNavigate()
  const discount = discountLabels[index % discountLabels.length]
  const isFast = index % 3 !== 2
  const deliveryTime = isFast ? null : `${20 + (index % 4) * 5}-${25 + (index % 4) * 5} mins`
  const rating = (3.8 + (index % 7) * 0.1).toFixed(1)

  return (
    <div
      className='w-44 md:w-52 shrink-0 cursor-pointer group'
      onClick={() => navigate(`/shop/${data._id}`)}
    >
      {/* Image */}
      <div className='relative w-full h-32 md:h-36 rounded-xl overflow-hidden bg-gray-100'>
        <img
          src={data.image}
          alt={data.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        {/* Discount badge */}
        <div className='absolute top-0 left-0 right-0 bg-linear-to-b from-black/60 to-transparent px-2 pt-2 pb-4'>
          <span className='text-white text-[10px] font-bold leading-tight line-clamp-1'>{discount}</span>
        </div>
        {/* Rating badge */}
        <div className='absolute bottom-2 left-2 bg-white rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm'>
          <FaStar className='text-green-600' size={10} />
          <span className='text-xs font-bold text-gray-900'>{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className='mt-2 px-0.5'>
        <h3 className='font-bold text-gray-900 text-sm truncate'>{data.name}</h3>
        <div className='flex items-center gap-1 mt-0.5'>
          {isFast ? (
            <>
              <BsLightningFill className='text-[#e23744]' size={10} />
              <span className='text-xs text-[#e23744] font-semibold'>Near &amp; Fast</span>
            </>
          ) : (
            <span className='text-xs text-gray-500'>{deliveryTime}</span>
          )}
        </div>
        <p className='text-xs text-gray-400 truncate mt-0.5'>{data.city}</p>
      </div>
    </div>
  )
}

export default ShopCard
