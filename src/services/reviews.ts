import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export interface TestimonialWithProfile extends Testimonial {
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
  product?: {
    name: string
    image_url: string | null
  }
}

export interface CreateReviewData {
  product_id: string
  rating: number
  review?: string
}

export interface ReviewFilters {
  product_id?: string
  rating?: number
  limit?: number
  offset?: number
}

class ReviewService {
  // Create review
  async createReview(userId: string, reviewData: CreateReviewData) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          user_id: userId,
          ...reviewData
        })
        .select(`
          *,
          profile:profiles(full_name, avatar_url),
          product:products(name, image_url)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update review
  async updateReview(userId: string, reviewId: string, updates: Partial<CreateReviewData>) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', reviewId)
        .eq('user_id', userId)
        .select(`
          *,
          profile:profiles(full_name, avatar_url),
          product:products(name, image_url)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete review
  async deleteReview(userId: string, reviewId: string) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get reviews with filters
  async getReviews(filters: ReviewFilters = {}) {
    try {
      let query = supabase
        .from('testimonials')
        .select(`
          *,
          profile:profiles(full_name, avatar_url),
          product:products(name, image_url)
        `)

      if (filters.product_id) {
        query = query.eq('product_id', filters.product_id)
      }

      if (filters.rating) {
        query = query.eq('rating', filters.rating)
      }

      query = query.order('created_at', { ascending: false })

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user's reviews
  async getUserReviews(userId: string, limit?: number) {
    try {
      let query = supabase
        .from('testimonials')
        .select(`
          *,
          product:products(name, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get product reviews
  async getProductReviews(productId: string, limit?: number) {
    try {
      let query = supabase
        .from('testimonials')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get featured reviews
  async getFeaturedReviews(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          profile:profiles(full_name, avatar_url),
          product:products(name, image_url)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Check if user can review product (has purchased it)
  async canReviewProduct(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          order:orders!inner(
            user_id,
            status
          )
        `)
        .eq('product_id', productId)
        .eq('order.user_id', userId)
        .eq('order.status', 'delivered')
        .limit(1)

      if (error) throw error
      return { data: !!data?.length, error: null }
    } catch (error) {
      return { data: false, error }
    }
  }

  // Get review statistics for a product
  async getProductReviewStats(productId: string) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('rating')
        .eq('product_id', productId)

      if (error) throw error

      const ratings = data?.map(r => r.rating) || []
      const totalReviews = ratings.length
      const averageRating = totalReviews > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews 
        : 0

      // Count ratings by star
      const ratingCounts = {
        5: ratings.filter(r => r === 5).length,
        4: ratings.filter(r => r === 4).length,
        3: ratings.filter(r => r === 3).length,
        2: ratings.filter(r => r === 2).length,
        1: ratings.filter(r => r === 1).length
      }

      return {
        data: {
          total_reviews: totalReviews,
          average_rating: Math.round(averageRating * 10) / 10,
          rating_counts: ratingCounts
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get user's review for a specific product
  async getUserProductReview(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export const reviewService = new ReviewService()