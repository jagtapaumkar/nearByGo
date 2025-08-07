import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface ProductFilters {
  category_id?: string
  min_price?: number
  max_price?: number
  search?: string
  sort_by?: 'name' | 'price' | 'created_at' | 'rating'
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface ProductWithCategory extends Product {
  category?: Category
  average_rating?: number
  review_count?: number
}

class ProductService {
  // Get all products with filters
  async getProducts(filters: ProductFilters = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          testimonials(rating)
        `)
        .eq('is_active', true)

      // Apply filters
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price)
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at'
      const sortOrder = filters.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate average ratings
      const productsWithRatings = data?.map(product => {
        const ratings = product.testimonials?.map(t => t.rating) || []
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0
        
        return {
          ...product,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length
        }
      })

      return { data: productsWithRatings, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get single product by ID
  async getProduct(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          testimonials(
            id,
            rating,
            review,
            created_at,
            profiles(full_name, avatar_url)
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error

      // Calculate average rating
      const ratings = data.testimonials?.map(t => t.rating) || []
      const average_rating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0

      return {
        data: {
          ...data,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get similar products
  async getSimilarProducts(productId: string, categoryId?: string, limit = 4) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          testimonials(rating)
        `)
        .eq('is_active', true)
        .neq('id', productId)

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate average ratings
      const productsWithRatings = data?.map(product => {
        const ratings = product.testimonials?.map(t => t.rating) || []
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0
        
        return {
          ...product,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length
        }
      })

      return { data: productsWithRatings, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Search products with suggestions
  async searchProducts(query: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .rpc('search_products', { 
          search_query: query,
          result_limit: limit 
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .limit(limit)

      if (error) throw error

      const suggestions = data?.map(product => product.name) || []
      return { data: suggestions, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          testimonials(rating)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Calculate average ratings
      const productsWithRatings = data?.map(product => {
        const ratings = product.testimonials?.map(t => t.rating) || []
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0
        
        return {
          ...product,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length
        }
      })

      return { data: productsWithRatings, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get trending products
  async getTrendingProducts(limit = 8) {
    try {
      const { data, error } = await supabase
        .rpc('get_trending_products', { result_limit: limit })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get category by ID
  async getCategory(id: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export const productService = new ProductService()