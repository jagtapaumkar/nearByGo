import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { query, limit = 10, category_id, min_price, max_price } = await req.json()

    let searchQuery = supabaseClient
      .from('products')
      .select(`
        *,
        category:categories(*),
        testimonials(rating)
      `)
      .eq('is_active', true)

    // Full-text search on name and description
    if (query) {
      searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Apply filters
    if (category_id) {
      searchQuery = searchQuery.eq('category_id', category_id)
    }

    if (min_price) {
      searchQuery = searchQuery.gte('price', min_price)
    }

    if (max_price) {
      searchQuery = searchQuery.lte('price', max_price)
    }

    const { data: products, error } = await searchQuery
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate average ratings and add search relevance
    const productsWithRatings = products?.map(product => {
      const ratings = product.testimonials?.map(t => t.rating) || []
      const average_rating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0

      // Simple relevance scoring based on query match
      let relevance_score = 0
      if (query) {
        const queryLower = query.toLowerCase()
        const nameLower = product.name.toLowerCase()
        const descLower = (product.description || '').toLowerCase()
        
        if (nameLower.includes(queryLower)) relevance_score += 10
        if (nameLower.startsWith(queryLower)) relevance_score += 5
        if (descLower.includes(queryLower)) relevance_score += 3
      }
      
      return {
        ...product,
        average_rating: Math.round(average_rating * 10) / 10,
        review_count: ratings.length,
        relevance_score
      }
    })

    // Sort by relevance if query provided, otherwise by creation date
    if (query) {
      productsWithRatings?.sort((a, b) => b.relevance_score - a.relevance_score)
    }

    return new Response(
      JSON.stringify({ products: productsWithRatings }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})