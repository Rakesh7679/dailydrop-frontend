import React from 'react'

function CategoryCard({name,image,onClick,isActive}) {
  return (
    <div className='flex flex-col items-center gap-2 shrink-0 cursor-pointer group transition-all duration-300' onClick={onClick}>
     <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${
       isActive ? 'border-[#e23744] shadow-lg scale-105' : 'border-gray-200 group-hover:border-[#e23744] group-hover:shadow-md'
     }`}>
       <img src={image} alt={name} className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'/>
     </div>
     <div className={`text-center text-sm md:text-base font-semibold transition-colors duration-300 ${
       isActive ? 'text-[#e23744]' : 'text-gray-800 group-hover:text-[#e23744]'
     }`}>
       {name}
     </div>
    </div>
  )
}

export default CategoryCard
