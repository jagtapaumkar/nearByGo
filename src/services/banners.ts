import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Banner = Database['public']['Tables']['banners']['Row']

export interface CreateBannerData {
  title: string
  subtitle?: string
  image_url: string
  link_url?: string
  is_active?: boolean
  sort_order?: number
}

export interface UpdateBannerData extends Partial<CreateBannerData> {}

class BannerService {
  // Get active banners
  async getActiveBanners() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all banners (admin)
  async getAllBanners() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get single banner
  async getBanner(id: string) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Create banner (admin)
  async createBanner(bannerData: CreateBannerData) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert(bannerData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update banner (admin)
  async updateBanner(id: string, updates: UpdateBannerData) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete banner (admin)
  async deleteBanner(id: string) {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Toggle banner status (admin)
  async toggleBannerStatus(id: string) {
    try {
      // Get current status
      const { data: banner, error: getError } = await this.getBanner(id)
      if (getError || !banner) throw getError

      // Toggle status
      const { data, error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Reorder banners (admin)
  async reorderBanners(bannerIds: string[]) {
    try {
      const updates = bannerIds.map((id, index) => ({
        id,
        sort_order: index
      }))

      const promises = updates.map(update =>
        supabase
          .from('banners')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      )

      await Promise.all(promises)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Upload banner image
  async uploadBannerImage(file: File) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `banner-${Date.now()}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath)

      return { data: publicUrl, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export const bannerService = new BannerService()