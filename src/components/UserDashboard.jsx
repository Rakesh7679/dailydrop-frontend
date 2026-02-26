import React, { useEffect, useRef, useState } from 'react'
import Nav from './NaV.JSX'
import { categories } from '../category'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard'
import ShopCard from './ShopCard'
import { useNavigate } from 'react-router-dom'
import { IoFilter } from 'react-icons/io5'
import { BsLightningFill } from 'react-icons/bs'
import image4 from '../assets/image4.avif'
import image8 from '../assets/image8.avif'
import image10 from '../assets/image10.avif'

const heroBanners = [
  {
    id: 1,
    title: 'MEALS UNDER ₹250',
    subtitle: 'FINAL PRICE, BEST OFFER APPLIED',
    bg: 'from-blue-500 via-blue-400 to-indigo-500',
    image: image4,
  },
  {
    id: 2,
    title: 'FREE DELIVERY',
    subtitle: 'ON YOUR FIRST ORDER TODAY',
    bg: 'from-orange-500 via-red-400 to-pink-500',
    image: image8,
  },
  {
    id: 3,
    title: 'BIRYANI FEST',
    subtitle: 'UP TO 50% OFF SELECT ITEMS',
    bg: 'from-green-500 via-teal-400 to-cyan-500',
    image: image10,
  },
]

const filterChips = [
  { label: 'Near & Fast', icon: true },
  { label: 'New to you', icon: false },
  { label: 'Rating 4.0+', icon: false },
  { label: 'Pure Veg', icon: false },
]
function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } =
    useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateBtn, setShowLeftCateBtn] = useState(false)
  const [showRightCateBtn, setShowRightCateBtn] = useState(false)
  const [showLeftShopBtn, setShowLeftShopBtn] = useState(false)
  const [showRightShopBtn, setShowRightShopBtn] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFilter, setActiveFilter] = useState(null)

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateBtn = (ref, setLeft, setRight) => {
    const el = ref.current
    if (el) {
      setLeft(el.scrollLeft > 0)
      setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }
  }

  const scrollBy = (ref, dir) => {
    ref.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  useEffect(() => {
    const cateEl = cateScrollRef.current
    const shopEl = shopScrollRef.current
    if (!cateEl) return
    const onCate = () => updateBtn(cateScrollRef, setShowLeftCateBtn, setShowRightCateBtn)
    const onShop = () => updateBtn(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn)
    onCate()
    if (shopEl) onShop()
    cateEl.addEventListener('scroll', onCate)
    shopEl?.addEventListener('scroll', onShop)
    return () => {
      cateEl.removeEventListener('scroll', onCate)
      shopEl?.removeEventListener('scroll', onShop)
    }
  }, [shopInMyCity])

  const handleCategoryClick = category => {
    setActiveCategory(category)
    navigate(`/category/${encodeURIComponent(category)}`)
  }

  return (
    <div className='w-screen min-h-screen flex flex-col bg-white pb-16 md:pb-0 overflow-x-hidden'>
      <Nav />

      {/* Search results overlay */}
      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-5xl mx-auto px-4 pt-20'>
          <h2 className='text-gray-900 text-xl font-bold mb-4'>Search Results</h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            {searchItems.map(item => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      {!searchItems && (
        <div className='flex flex-col'>
          {/* ── HERO CAROUSEL ── */}
          <div className='w-full px-3 pt-20 pb-1'>
            <div className='relative w-full h-44 md:h-52 rounded-2xl overflow-hidden shadow-lg'>
              {heroBanners.map((banner, i) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 flex bg-linear-to-r ${banner.bg} transition-opacity duration-700 ease-in-out ${
                    i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className='flex-1 flex flex-col justify-center pl-5 pr-2 gap-2'>
                    <p className='text-white font-black text-xl md:text-2xl leading-tight drop-shadow'>
                      {banner.title}
                    </p>
                    <span className='bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded self-start'>
                      {banner.subtitle}
                    </span>
                    <button className='mt-1 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full self-start flex items-center gap-1 shadow'>
                      Order now <span className='text-base leading-none'>›</span>
                    </button>
                  </div>
                  <div className='w-40 md:w-52 flex items-end justify-end overflow-hidden'>
                    <img src={banner.image} alt='promo' className='h-40 md:h-48 w-auto object-contain drop-shadow-2xl' />
                  </div>
                </div>
              ))}
              {/* Carousel dots */}
              <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20'>
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── CATEGORIES ── */}
          <div className='w-full pt-4 pb-2'>
            <h2 className='text-gray-900 text-base font-bold px-4 mb-2'>What's on your mind?</h2>
            <div className='relative'>
              {showLeftCateBtn && (
                <button
                  className='absolute left-0 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-1 rounded-full shadow-md z-10 border border-gray-200'
                  onClick={() => scrollBy(cateScrollRef, 'left')}
                >
                  <FaCircleChevronLeft size={20} />
                </button>
              )}
              <div className='flex overflow-x-auto gap-0 px-2' ref={cateScrollRef} style={{ scrollbarWidth: 'none' }}>
                {categories.map((cate, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center gap-1 shrink-0 cursor-pointer px-3 py-1'
                    onClick={() => handleCategoryClick(cate.category)}
                  >
                    <div
                      className={`w-[80px] h-[80px] md:w-[95px] md:h-[95px] rounded-full overflow-hidden border-2 transition-all duration-200 ${
                        activeCategory === cate.category ? 'border-[#e23744] shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <img src={cate.image} alt={cate.category} className='w-full h-full object-cover' />
                    </div>
                    <span
                      className={`text-[12px] font-semibold text-center whitespace-nowrap ${
                        activeCategory === cate.category ? 'text-[#e23744]' : 'text-gray-700'
                      }`}
                    >
                      {cate.category}
                    </span>
                    {activeCategory === cate.category && (
                      <div className='w-8 h-0.5 rounded-full bg-[#e23744]' />
                    )}
                  </div>
                ))}
              </div>
              {showRightCateBtn && (
                <button
                  className='absolute right-0 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-1 rounded-full shadow-md z-10 border border-gray-200'
                  onClick={() => scrollBy(cateScrollRef, 'right')}
                >
                  <FaCircleChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className='h-2 bg-gray-100 my-1' />

          {/* ── FILTER CHIPS ── */}
          <div className='flex items-center gap-2 px-3 py-2.5 overflow-x-auto' style={{ scrollbarWidth: 'none' }}>
            <button className='flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 bg-white shrink-0'>
              <IoFilter size={13} /> Filters ▾
            </button>
            {filterChips.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveFilter(prev => (prev === f.label ? null : f.label))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 transition-all duration-150 ${
                  activeFilter === f.label
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 text-gray-700 bg-white'
                }`}
              >
                {f.icon && <BsLightningFill size={11} className='text-green-500' />}
                {f.label}
              </button>
            ))}
          </div>

          {/* ── RESTAURANTS ── */}
          <div className='w-full pt-1 pb-4'>
            <div className='px-4 md:px-6 lg:px-8'>
              <h2 className='text-gray-500 text-[11px] font-bold tracking-widest uppercase mb-3'>
                Recommended for you
              </h2>
            </div>
            <div className='relative px-4 md:px-6 lg:px-8'>
              {showLeftShopBtn && (
                <button
                  className='absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-1 rounded-full shadow-md z-10 border border-gray-200'
                  onClick={() => scrollBy(shopScrollRef, 'left')}
                >
                  <FaCircleChevronLeft size={20} />
                </button>
              )}
              <div className='flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef} style={{ scrollbarWidth: 'none' }}>
                {shopInMyCity && shopInMyCity.length > 0 ? (
                  shopInMyCity.map((shop, i) => <ShopCard key={shop._id || i} data={shop} index={i} />)
                ) : (
                  <div className='w-full py-10 text-center'>
                    <p className='text-gray-400 text-sm'>No restaurants found in {currentCity}</p>
                  </div>
                )}
              </div>
              {showRightShopBtn && (
                <button
                  className='absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white text-gray-700 p-1 rounded-full shadow-md z-10 border border-gray-200'
                  onClick={() => scrollBy(shopScrollRef, 'right')}
                >
                  <FaCircleChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className='h-2 bg-gray-100' />

          {/* ── POPULAR DISHES ── */}
          <div className='w-full pt-4 pb-10'>
            <div className='px-4 md:px-6 lg:px-8'>
              <h2 className='text-gray-900 text-base font-bold mb-4'>Popular dishes near you</h2>
            </div>
            <div className='px-4 md:px-6 lg:px-8'>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {updatedItemsList && updatedItemsList.length > 0 ? (
                  updatedItemsList.map((item, i) => <FoodCard key={i} data={item} />)
                ) : (
                  <div className='col-span-full text-center py-12'>
                    <p className='text-gray-400 text-sm'>No items found near you</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard

