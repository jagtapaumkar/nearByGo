import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Address = Database['public']['Tables']['addresses']['Row']

export interface CreateAddressData {
  label: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip_code: string
  country?: string
  geolocation?: {
    latitude: number
    longitude: number
  }
  is_default?: boolean
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

class AddressService {
  // Get user addresses
  async getAddresses(userId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get single address
  async getAddress(userId: string, addressId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', addressId)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Create new address
  async createAddress(userId: string, addressData: CreateAddressData) {
    try {
      // If this is set as default, unset other default addresses
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          ...addressData,
          geolocation: addressData.geolocation || null
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update address
  async updateAddress(userId: string, addressId: string, updates: UpdateAddressData) {
    try {
      // If this is set as default, unset other default addresses
      if (updates.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', addressId)
      }

      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete address
  async deleteAddress(userId: string, addressId: string) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Set default address
  async setDefaultAddress(userId: string, addressId: string) {
    try {
      // Unset all default addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)

      // Set new default
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get default address
  async getDefaultAddress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Geocode address (using browser geolocation or external service)
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // This is a placeholder - in production, you'd use a geocoding service like Google Maps API
      // For now, return null to indicate geocoding is not available
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }
}

export const addressService = new AddressService()