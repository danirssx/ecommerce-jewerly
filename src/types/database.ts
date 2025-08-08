export interface Product {
  id: number
  product_type_id: number
  code: string
  name: string
  description?: string
  price: number
  original_price?: number
  sale_price?: number
  original_url?: string
  created_at: string
  updated_at: string
  brand_id?: number
  // Relaciones
  product_types?: ProductType
  brands?: Brand
  product_images?: ProductImage[]
  color_products?: ColorProduct[]
  inventory_current?: InventoryCurrent
}

export interface ProductType {
  id: number
  name: string
}

export interface Brand {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  alt_text?: string
  sort_order: number
}

export interface Color {
  hex_code: string
  name: string
}

export interface ColorProduct {
  product_id: number
  color_hex_code: string
  colors?: Color
}

export interface InventoryCurrent {
  product_id: number
  quantity: number
  updated_at: string
} 