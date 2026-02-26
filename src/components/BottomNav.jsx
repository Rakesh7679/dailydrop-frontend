import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { RiRestaurant2Line } from 'react-icons/ri'
import { FiShoppingCart } from 'react-icons/fi'
import { useSelector } from 'react-redux'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useSelector(state => state.user)

  const tabs = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: MdOutlineLocalOffer, label: 'Under ₹250', path: '/category/Fast%20Food' },
    { icon: RiRestaurant2Line, label: 'Dining', path: '/category/Main%20Course' },
  ]

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50'>
      <div className='flex items-center justify-around py-2 px-2'>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-[#e23744]' : 'text-gray-500'
              }`}
            >
              <Icon size={22} />
              <span className='text-[11px] font-semibold'>{tab.label}</span>
              {isActive && <div className='w-1 h-1 rounded-full bg-[#e23744]' />}
            </button>
          )
        })}

        {/* Cart tab */}
        <button
          onClick={() => navigate('/cart')}
          className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-colors relative ${
            location.pathname === '/cart' ? 'text-[#e23744]' : 'text-gray-500'
          }`}
        >
          <div className='relative'>
            <FiShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className='absolute -right-2 -top-2 bg-[#e23744] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                {cartItems.length}
              </span>
            )}
          </div>
          <span className='text-[11px] font-semibold'>Cart</span>
          {location.pathname === '/cart' && <div className='w-1 h-1 rounded-full bg-[#e23744]' />}
        </button>
      </div>
    </div>
  )
}

export default BottomNav
