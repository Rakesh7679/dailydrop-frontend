import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './ownerItemCard';
function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  
  return (
    <div className='w-full min-h-screen bg-gray-50 flex flex-col items-center'>
      <Nav />
      {!myShopData &&
        <div className='flex justify-center items-center p-4 sm:p-6 mt-20'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-[#e23744] p-5 rounded-full mb-6'>
                <FaUtensils className='text-white w-12 h-12 sm:w-16 sm:h-16' />
              </div>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-6 text-sm sm:text-base leading-relaxed'>Join our food delivery platform and reach thousands of hungry customers every day.
              </p>
              <button className='bg-[#e23744] hover:bg-[#c72333] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-200' onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }

      {myShopData &&
        <div className='w-full flex flex-col items-center gap-8 px-4 sm:px-6 pt-20'>
          <h1 className='text-3xl sm:text-4xl text-gray-900 font-bold flex items-center gap-4 text-center'><FaUtensils className='text-[#e23744] w-14 h-14' />Welcome to {myShopData.name}</h1>

          <div className='bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-full max-w-4xl relative'>
            <div className='absolute top-6 right-6 bg-[#e23744] text-white p-3 rounded-full shadow-md hover:bg-[#c72333] transition-all duration-200 cursor-pointer z-10' onClick={()=>navigate("/create-edit-shop")}>
<FaPen size={22}/>
            </div>
             <img src={myShopData.image} alt={myShopData.name} className='w-full h-56 sm:h-80 object-cover'/>
             <div className='absolute inset-0 h-56 sm:h-80 bg-gradient-to-t from-black/40 to-transparent pointer-events-none'></div>
             <div className='p-6 sm:p-8'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3'>{myShopData.name}</h1>
              <p className='text-gray-600 font-medium text-lg'>{myShopData.city}, {myShopData.state}</p>
              <p className='text-gray-500 mt-1'>{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length==0 && 
            <div className='flex justify-center items-center p-4 sm:p-6 mb-8'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-[#e23744] p-5 rounded-full mb-6'>
                <FaUtensils className='text-white w-12 h-12 sm:w-16 sm:h-16' />
              </div>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3'>Add Your Food Item</h2>
              <p className='text-gray-600 mb-6 text-sm sm:text-base leading-relaxed'>Share your delicious creations with our customers by adding them to the menu.
              </p>
              <button className='bg-[#e23744] hover:bg-[#c72333] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-200' onClick={() => navigate("/add-item")}>
              Add Food
              </button>
            </div>
          </div>
        </div>
            }

            {myShopData.items.length>0 && <div className='flex flex-col items-center gap-6 w-full max-w-4xl mb-8'>
              {myShopData.items.map((item,index)=>(
                <OwnerItemCard data={item} key={index}/>
              ))}
              </div>}
            
        </div>}



    </div>
  )
}

export default OwnerDashboard
