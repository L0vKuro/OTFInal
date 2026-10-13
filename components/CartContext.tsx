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
  // Whether this product supports/requires a name-on-back customization at all —
  // false for items like the hoodie that ship as-is with no printing option.
  personalize: boolean
}

const CART_KEY = 'ot-cart-v2'

// Guards against stale/corrupt saved carts (e.g. items saved before the
// `personalize` field existed) — anything that doesn't match the current shape
// is dropped rather than risking a broken checkout.
function isValidItem(i: any): i is CartItem {
  return !!i &&
    typeof i.id === 'string' &&
    typeof i.name === 'string' &&
    typeof i.price === 'number' &&
    typeof i.image === 'string' &&
    typeof i.size === 'string' &&
    typeof i.nameOnBack === 'string' &&
    typeof i.numberOnBack === 'string' &&
    typeof i.isVNeck === 'boolean' &&
    typeof i.personalize === 'boolean'
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

  // Restore the cart from this browser on first load. Before this, the cart
  // lived only in memory — so a refresh, opening /checkout directly, or coming
  // back from Stripe's cancel link (a full page load) all emptied it, even
  // though the checkout page told people their items were still there.
  useEffect(() => {
    try { localStorage.removeItem('ot-cart') } catch {}
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed.filter(isValidItem))
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Save on every change (only after the initial restore, so an empty first
  // render can't wipe the saved cart).
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)) } catch {}
  }, [items, loaded])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_KEY) return
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : []
        if (Array.isArray(parsed)) setItems(parsed.filter(isValidItem))
      } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
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
