import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { BsCart3, BsBagCheck } from "react-icons/bs";
import { MdDeliveryDining } from "react-icons/md";

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    const deliveryFee = totalAmount > 500 ? 0 : 40
    const grandTotal = totalAmount + deliveryFee

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-16 md:pb-0'>
            {/* Header */}
            <div className='sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
                <div className='max-w-4xl mx-auto px-4 py-4 flex items-center gap-4'>
                    <button 
                        className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200' 
                        onClick={() => navigate("/")}
                    >
                        <IoIosArrowRoundBack size={32} className='text-gray-700' />
                    </button>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-br from-[#e23744] to-[#ff6b6b] rounded-xl'>
                            <BsCart3 className='text-white' size={22} />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold text-gray-900'>Your Cart</h1>
                            <p className='text-xs text-gray-500'>{cartItems?.length || 0} items</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 py-6'>
                {cartItems?.length == 0 ? (
                    <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center mt-8'>
                        <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center'>
                            <BsCart3 size={50} className='text-[#e23744]' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Your Cart is Empty</h2>
                        <p className='text-gray-500 mb-8 max-w-sm mx-auto'>Looks like you haven't added any delicious items yet. Start exploring!</p>
                        <button 
                            className='bg-gradient-to-r from-[#e23744] to-[#ff6b6b] hover:from-[#c72333] hover:to-[#e23744] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5' 
                            onClick={() => navigate('/')}
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Cart Items Section */}
                        <div className='lg:col-span-2 space-y-4'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'>
                                    <h2 className='font-semibold text-gray-700'>Order Items</h2>
                                </div>
                                <div className='divide-y divide-gray-100'>
                                    {cartItems?.map((item, index) => (
                                        <CartItemCard data={item} key={index} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bill Summary Section */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24'>
                                <div className='p-4 bg-gradient-to-r from-[#e23744] to-[#ff6b6b]'>
                                    <h2 className='font-bold text-white flex items-center gap-2'>
                                        <BsBagCheck size={18} />
                                        Bill Summary
                                    </h2>
                                </div>
                                <div className='p-5 space-y-4'>
                                    <div className='flex justify-between items-center text-gray-600'>
                                        <span>Item Total</span>
                                        <span className='font-semibold text-gray-900'>₹{totalAmount}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-gray-600'>
                                        <span className='flex items-center gap-2'>
                                            <MdDeliveryDining size={18} className='text-[#e23744]' />
                                            Delivery Fee
                                        </span>
                                        <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    {deliveryFee > 0 && (
                                        <p className='text-xs text-gray-400 bg-green-50 p-2 rounded-lg'>
                                            💡 Add ₹{500 - totalAmount} more for FREE delivery!
                                        </p>
                                    )}
                                    <div className='border-t border-dashed border-gray-200 pt-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-bold text-gray-900'>To Pay</span>
                                            <span className='text-2xl font-black text-[#e23744]'>₹{grandTotal}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className='w-full bg-gradient-to-r from-[#e23744] to-[#ff6b6b] hover:from-[#c72333] hover:to-[#e23744] text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2' 
                                        onClick={() => navigate("/checkout")}
                                    >
                                        Proceed to Checkout
                                        <span className='text-lg'>→</span>
                                    </button>
                                </div>
                                <div className='px-5 pb-5'>
                                    <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100'>
                                        <p className='text-xs text-green-700 font-medium flex items-center gap-2'>
                                            <span className='text-base'>🛡️</span>
                                            Safe and secure payments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage
