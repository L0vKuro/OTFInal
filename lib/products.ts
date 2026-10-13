// Single source of truth the checkout API trusts for product names, prices and
// options. The cart (which lives in the visitor's browser) only supplies a
// product id, size and any name/number to print — never the price. If you add
// or reprice a product on the store page, update it here too.
export type CatalogProduct = {
  name: string
  price: number
  personalize: boolean
  isVNeck: boolean
}

export const PRODUCT_CATALOG: Record<string, CatalogProduct> = {
  'polo-2026':          { name: 'OFFICIAL 2026 POLO',            price: 65, personalize: true,  isVNeck: false },
  'vneck-jersey-2026':  { name: 'OFFICIAL 2026 V-NECK POLO',     price: 60, personalize: true,  isVNeck: true  },
  'hoodie-black-2026':  { name: 'OFFICIAL 2026 HOODIE — BLACK',  price: 70, personalize: false, isVNeck: false },
  'hoodie-red-2026':    { name: 'OFFICIAL 2026 HOODIE — RED',    price: 70, personalize: false, isVNeck: false },
}

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
