import { useState } from 'react'
import type { LocationResult } from '../business/hotel/types'
import Taro from '@tarojs/taro'
import { getCurrentLocation, reverseGeocodeByTencent } from '../services/location.service'

interface UseLocationResult {
  loading: boolean
  locate: () => Promise<LocationResult | null>
}

let lastLocationTime = 0

export const useLocation = (): UseLocationResult => {
  const [loading, setLoading] = useState<boolean>(false)

  const locate = async (): Promise<LocationResult | null> => {
    const now = Date.now()
    if (now - lastLocationTime < 3000 || loading) {
      return null
    }

    lastLocationTime = now

    try {
      const settingRes = await Taro.getSetting()
      if (!settingRes.authSetting['scope.userLocation']) {
        try {
          await Taro.authorize({ scope: 'scope.userLocation' })
        } catch (_error) {
          const modalRes = await Taro.showModal({
            title: '需要定位授权',
            content: '请在设置中打开地理位置权限，以便为您推荐当前城市的酒店',
            confirmText: '去设置',
          })

          if (!modalRes.confirm) {
            return null
          }

          const openSettingRes = await Taro.openSetting()
          if (!openSettingRes.authSetting['scope.userLocation']) {
            return null
          }
        }
      }

      setLoading(true)
      const locationRes = await getCurrentLocation()
      const geoResult = await reverseGeocodeByTencent(locationRes.latitude, locationRes.longitude)
      return geoResult
    } catch (_error) {
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    locate,
  }
}

