import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaChevronDown } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { serverUrl } from '../App'
import { setSearchItems, setUserData } from '../redux/userSlice'
import { FaPlus } from 'react-icons/fa6'
import { TbReceipt2 } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

function Nav() {
  const { userData, currentCity, currentAddress, cartItems } = useSelector(state => state.user)
  const { myShopData } = useSelector(state => state.owner)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/signin")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,{withCredentials:true})
    dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    if (query) {
      handleSearchItems()
    } else {
      dispatch(setSearchItems(null))
    }
  }, [query])

  return (
    <div className='w-full h-16 flex items-center justify-between px-4 md:px-8 fixed top-0 z-50 bg-white shadow-sm overflow-visible border-b border-gray-100'>
      {/* ── MOBILE SEARCH OVERLAY ── */}
      {showSearch && userData.role == 'user' && (
        <div className='w-[90%] h-14 bg-white shadow-xl rounded-lg flex items-center gap-3 fixed top-20 left-[5%] md:hidden border border-gray-200 px-4'>
          <IoIosSearch size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search "thali"'
            className='flex-1 text-gray-800 outline-0 bg-transparent placeholder:text-gray-400 text-sm'
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
          <RxCross2
            size={20}
            className='text-gray-600 cursor-pointer'
            onClick={() => {
              setShowSearch(false)
              setQuery('')
            }}
          />
        </div>
      )}

      {/* ── LEFT: Logo + Location ── */}
      <div className='flex items-center gap-3 md:gap-6 flex-1'>
        <h1
          className='text-2xl font-bold text-[#e23744] tracking-tight cursor-pointer'
          onClick={() => navigate('/')}
        >
          DAILY-DROP
        </h1>

        {userData.role == 'user' && (
          <div className='hidden md:flex items-center gap-2 group cursor-pointer'>
            <div className='flex items-center gap-1.5'>
              <span className='font-bold text-gray-900 text-sm group-hover:text-[#e23744] transition border-b-2 border-gray-900 group-hover:border-[#e23744]'>
                {currentCity || 'Select City'}
              </span>
              <FaChevronDown size={12} className='text-[#e23744]' />
            </div>
            {currentAddress && (
              <span className='text-xs text-gray-500 max-w-xs truncate hidden lg:inline'>
                {currentAddress}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── DESKTOP SEARCH BAR ── */}
      {userData.role == 'user' && (
        <div className='hidden md:flex items-center flex-1 max-w-lg mx-8 h-10 px-4 border border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 transition-colors'>
          <IoIosSearch size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search for restaurants and food'
            className='flex-1 ml-2 text-sm text-gray-800 outline-0 bg-transparent placeholder:text-gray-400'
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </div>
      )}

      {/* ── RIGHT: Actions ── */}
      <div className='flex items-center gap-3'>
        {/* Mobile Search Toggle */}
        {userData.role == 'user' &&
          (showSearch ? (
            <RxCross2
              size={22}
              className='text-gray-600 md:hidden cursor-pointer'
              onClick={() => {
                setShowSearch(false)
                setQuery('')
              }}
            />
          ) : (
            <IoIosSearch
              size={22}
              className='text-gray-600 md:hidden cursor-pointer'
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* Owner Actions */}
        {userData.role == 'owner' ? (
          <>
            {myShopData && (
              <>
                <button
                  className='hidden md:flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg bg-[#e23744] text-white text-sm font-semibold hover:bg-[#cb202d] transition-all'
                  onClick={() => navigate('/add-item')}
                >
                  <FaPlus size={14} />
                  <span>Add Item</span>
                </button>
                <button
                  className='md:hidden flex items-center p-2 cursor-pointer rounded-lg bg-[#e23744] text-white hover:bg-[#cb202d] transition-all'
                  onClick={() => navigate('/add-item')}
                >
                  <FaPlus size={16} />
                </button>
              </>
            )}

            <button
              className='hidden md:flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-all'
              onClick={() => navigate('/my-orders')}
            >
              <TbReceipt2 size={16} />
              <span>Orders</span>
            </button>
            <button
              className='md:hidden flex items-center p-2 cursor-pointer rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all'
              onClick={() => navigate('/my-orders')}
            >
              <TbReceipt2 size={16} />
            </button>
          </>
        ) : (
          <>
            {/* Cart (User only) */}
            {userData.role == 'user' && (
              <div
                className='relative cursor-pointer hidden md:flex'
                onClick={() => navigate('/cart')}
              >
                <FiShoppingCart
                  size={20}
                  className='text-gray-700 hover:text-[#e23744] transition-colors'
                />
                {cartItems.length > 0 && (
                  <span className='absolute -right-1.5 -top-1.5 bg-[#e23744] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                    {cartItems.length}
                  </span>
                )}
              </div>
            )}

            <button
              className='hidden md:block px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-all'
              onClick={() => navigate('/my-orders')}
            >
              {userData.role === 'deliveryBoy' ? 'Available Orders' : 'My Orders'}
            </button>
          </>
        )}

        {/* User Avatar */}
        <div
          className='w-9 h-9 rounded-full flex items-center justify-center bg-[#e23744] text-white text-sm font-bold cursor-pointer hover:bg-[#cb202d] transition-all'
          onClick={() => setShowInfo(prev => !prev)}
        >
          {userData?.fullName.slice(0, 1).toUpperCase()}
        </div>

        {/* User Info Dropdown */}
        {showInfo && (
          <div
            className={`fixed top-16 right-4 ${
              userData.role == 'deliveryBoy' ? 'md:right-[20%]' : 'md:right-8'
            } w-48 bg-white shadow-xl rounded-lg p-4 flex flex-col gap-2 z-50 border border-gray-100`}
          >
            <div className='text-sm font-bold text-gray-900'>{userData.fullName}</div>
            <div className='text-xs text-gray-500'>{userData.email}</div>
            {userData.role == 'user' && (
              <div
                className='md:hidden text-[#e23744] font-semibold cursor-pointer hover:text-[#cb202d] transition-colors py-1 border-t border-gray-100 pt-2 text-sm'
                onClick={() => navigate('/my-orders')}
              >
                My Orders
              </div>
            )}
            <div
              className='text-[#e23744] font-semibold cursor-pointer hover:text-[#cb202d] transition-colors py-1 border-t border-gray-100 pt-2 text-sm'
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Nav
