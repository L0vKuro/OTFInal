'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => setItems(prev => [...prev, item])
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index))
  const clearCart = () => setItems([])
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
