import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import FoodCard from '../components/FoodCard'
import Nav from '../components/Nav'

function CategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const { itemsInMyCity, currentCity } = useSelector(state => state.user)
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    if (itemsInMyCity) {
      const decodedCategory = decodeURIComponent(categoryName)
      if (decodedCategory === "All") {
        setFilteredItems(itemsInMyCity)
      } else {
        const filtered = itemsInMyCity.filter(item => item.category === decodedCategory)
        setFilteredItems(filtered)
      }
    }
  }, [categoryName, itemsInMyCity])

  return (
    <div className='w-screen min-h-screen flex flex-col bg-gray-50 pb-16 md:pb-0'>
      <Nav />
      
      {/* Header */}
      <div className='w-full bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center gap-4'>
          <button 
            onClick={() => navigate('/')} 
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <IoIosArrowRoundBack size={30} className='text-[#e23744]' />
          </button>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {decodeURIComponent(categoryName)}
            </h1>
            <p className='text-gray-500 text-sm'>
              {filteredItems.length} items found in {currentCity}
            </p>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className='max-w-7xl mx-auto w-full p-6'>
        {filteredItems.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredItems.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <div className='w-full text-center py-20'>
            <div className='text-6xl mb-4'>🍽️</div>
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
              No {decodeURIComponent(categoryName)} items found
            </h2>
            <p className='text-gray-500 mb-6'>
              Try exploring other categories or check back later
            </p>
            <button 
              onClick={() => navigate('/')}
              className='px-6 py-3 bg-[#e23744] text-white rounded-lg hover:bg-[#c92d3a] transition-colors font-medium'
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
