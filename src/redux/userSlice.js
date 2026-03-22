import { createSlice, current } from "@reduxjs/toolkit";

const getSavedCartState = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return { cartItems: [], totalAmount: 0 }
    }

    const raw = localStorage.getItem("vingo_cart")
    if (!raw) return { cartItems: [], totalAmount: 0 }

    const parsed = JSON.parse(raw)
    const cartItems = Array.isArray(parsed?.cartItems) ? parsed.cartItems : []
    const totalAmount = cartItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)
    return { cartItems, totalAmount }
  } catch (error) {
    return { cartItems: [], totalAmount: 0 }
  }
}

const saveCartState = (cartItems) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return

    const safeItems = Array.isArray(cartItems) ? cartItems : []
    const totalAmount = safeItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)
    localStorage.setItem("vingo_cart", JSON.stringify({ cartItems: safeItems, totalAmount }))
  } catch (error) {
    // Ignore storage quota/private mode errors to keep app functional
  }
}

const savedCartState = getSavedCartState()

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: savedCartState.cartItems,
    totalAmount: savedCartState.totalAmount,
    myOrders: [],
    ownerUnreadOrders: 0,
    searchItems: null,
    socket: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    addToCart: (state, action) => {
      const cartItem = action.payload
      const existingItem = state.cartItems.find(i => i.id == cartItem.id)
      if (existingItem) {
        existingItem.quantity += cartItem.quantity
      } else {
        state.cartItems.push(cartItem)
      }

      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      saveCartState(state.cartItems)

    },

    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload
    }

    ,

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find(i => i.id == id)
      if (item) {
        item.quantity = quantity
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      saveCartState(state.cartItems)
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      saveCartState(state.cartItems)
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload
      state.ownerUnreadOrders = 0
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders]
    }

    ,
    addRealtimeOwnerOrder: (state, action) => {
      const incomingOrder = action.payload
      const incomingShopId = incomingOrder?.shopOrders?.shop?._id || incomingOrder?.shopOrders?.shop

      const alreadyExists = state.myOrders.some((order) => {
        const existingShopId = order?.shopOrders?.shop?._id || order?.shopOrders?.shop
        return String(order?._id) === String(incomingOrder?._id)
          && String(existingShopId) === String(incomingShopId)
      })

      if (!alreadyExists) {
        state.myOrders = [incomingOrder, ...state.myOrders]
        state.ownerUnreadOrders += 1
      }
    },

    clearOwnerUnreadOrders: (state) => {
      state.ownerUnreadOrders = 0
    }

    ,
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id == shopId) {
          order.shopOrders.status = status
        }
      }
    },

    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
        if (shopOrder) {
          shopOrder.status = status
        }
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload
    },

    clearCart: (state) => {
      state.cartItems = []
      state.totalAmount = 0
      saveCartState(state.cartItems)
    }
  }
})

export const { setUserData, setCurrentAddress, setCurrentCity, setCurrentState, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrder, addRealtimeOwnerOrder, clearOwnerUnreadOrders, updateOrderStatus, setSearchItems, setTotalAmount, setSocket, updateRealtimeOrderStatus, clearCart } = userSlice.actions
export default userSlice.reducer