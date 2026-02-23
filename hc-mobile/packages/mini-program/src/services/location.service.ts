import Taro from '@tarojs/taro'
import type { LocationResult } from '../business/hotel/types'

const TENCENT_MAP_KEY = 'K4ABZ-BFQWM-W3X6S-6SNWG-VE34F-TBBLG'

interface TaroLocationResponse {
  latitude: number
  longitude: number
}

interface TencentGeocoderResponse {
  data: {
    status: number
    result?: {
      address_component: {
        city: string
        nation: string
      }
    }
  }
}

export const getCurrentLocation = (): Promise<TaroLocationResponse> => {
  return new Promise((resolve, reject) => {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        resolve({ latitude: res.latitude, longitude: res.longitude })
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}

export const reverseGeocodeByTencent = async (
  latitude: number,
  longitude: number,
): Promise<LocationResult | null> => {
  const apiRes = await Taro.request<TencentGeocoderResponse['data']>({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${latitude},${longitude}`,
      key: TENCENT_MAP_KEY,
      get_poi: 0,
    },
  })

  if (apiRes.data.status !== 0 || !apiRes.data.result) {
    return null
  }

  return {
    city: apiRes.data.result.address_component.city,
    nation: apiRes.data.result.address_component.nation,
  }
}

