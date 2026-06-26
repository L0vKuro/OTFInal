'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  size: string
  nameOnBack: string
  numberOnBack: string
  isVNeck: boolean
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  clearCart: () => void
  total: number
  count: number
  loaded: boolean
  lastAdded: CartItem | null
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
  loaded: false,
  lastAdded: null,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null)

  // Mark as loaded immediately — no localStorage read
  useEffect(() => {
    // Clear any old saved cart from previous version
    try { localStorage.removeItem('ot-cart') } catch {}
    setLoaded(true)
  }, [])

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item])
    setLastAdded(item)
    // Clear lastAdded after 3 seconds
    setTimeout(() => setLastAdded(null), 3000)
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setItems([])
    setLastAdded(null)
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count, loaded, lastAdded }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
