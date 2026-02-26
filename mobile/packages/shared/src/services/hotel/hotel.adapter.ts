import type {
  GeoPoint,
  HotelAdapterContext,
  HotelMarket,
  HotelRoomBedInfoModel,
  HotelRoomHeadInfoModel,
  HotelRoomSKUModel,
  HotelRoomSPUModel,
} from '../../domain/hotel'

// 2. 强制定向到最底层的核心数据图纸
import type {
  HotelDomainModel,
  FacilityModel as HotelFacilityModel,
  PolicyModel as HotelPolicyModel,
  SurroundingModel as HotelSurroundingModel,
} from '../../domain/hotel/hotel.types'

const EARTH_RADIUS_METERS = 6371000

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isUnknownArray = (value: unknown): value is unknown[] => Array.isArray(value)

const toStringSafe = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return fallback
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    if (value === 'true') {
      return true
    }
    if (value === 'false') {
      return false
    }
  }
  return undefined
}

const toRadians = (degree: number): number => (degree * Math.PI) / 180

const getRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined

const getStringArray = (value: unknown): string[] => {
  if (!isUnknownArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === 'string' ? item : ''))
    .filter((item) => item.length > 0)
}

const formatDistanceText = (distanceMeters: number): string => {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    return ''
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`
}

const isValidGeoPoint = (point: GeoPoint): boolean =>
  Number.isFinite(point.lng) &&
  Number.isFinite(point.lat) &&
  point.lng >= -180 &&
  point.lng <= 180 &&
  point.lat >= -90 &&
  point.lat <= 90

const calculateDistanceMeters = (from: GeoPoint, to: GeoPoint): number => {
  const latDiff = toRadians(to.lat - from.lat)
  const lngDiff = toRadians(to.lng - from.lng)
  const fromLatRad = toRadians(from.lat)
  const toLatRad = toRadians(to.lat)

  const haversineValue =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(fromLatRad) *
      Math.cos(toLatRad) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2)

  const arc = 2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
  return EARTH_RADIUS_METERS * arc
}

const getGeoPointFromCoordinates = (value: unknown): GeoPoint | undefined => {
  if (!isUnknownArray(value) || value.length < 2) {
    return undefined
  }

  const lng = toNumber(value[0])
  const lat = toNumber(value[1])

  if (lng === null || lat === null) {
    return undefined
  }

  const point: GeoPoint = { lng, lat }
  return isValidGeoPoint(point) ? point : undefined
}

const getGeoPointFromDto = (dto: Record<string, unknown>): GeoPoint | undefined => {
  const location = getRecord(dto.location)
  return getGeoPointFromCoordinates(location?.coordinates)
}

const extractHotelGeoPoint = (
  dtoRecord: Record<string, unknown>,
  baseInfoRecord: Record<string, unknown>
): GeoPoint | undefined => {
  const baseInfoLocation = getRecord(baseInfoRecord.location)

  return (
    getGeoPointFromCoordinates(baseInfoLocation?.coordinates) ??
    getGeoPointFromCoordinates(baseInfoRecord.coordinates) ??
    getGeoPointFromDto(dtoRecord)
  )
}

const toHotelMarket = (value: unknown): HotelMarket =>
  value === 'international' ? 'international' : 'domestic'

const mapFacilities = (value: unknown): HotelFacilityModel[] => {
  if (!isUnknownArray(value)) {
    return []
  }

  return value
    .map((item): HotelFacilityModel | null => {
      if (!isRecord(item)) {
        return null
      }

      return {
        category: toStringSafe(item.category),
        content: toStringSafe(item.content),
        summary: toStringSafe(item.summary) || undefined,
      }
    })
    .filter((item): item is HotelFacilityModel => item !== null)
}

const getPolicyFromList = (value: unknown): string => {
  if (!isUnknownArray(value)) {
    return ''
  }

  const firstPolicy = value.find(
    (item): item is Record<string, unknown> => isRecord(item) &&
      (typeof item.content === 'string' || typeof item.policyType === 'string')
  )

  if (!firstPolicy) {
    return ''
  }

  return toStringSafe(firstPolicy.content)
}

const mapPolicies = (
  baseInfoRecord: Record<string, unknown>,
  dtoRecord: Record<string, unknown>
): HotelPolicyModel => {
  const checkInInfo = getRecord(dtoRecord.checkinInfo)

  const checkInTime =
    toStringSafe(baseInfoRecord.checkInTime) ||
    toStringSafe(checkInInfo?.checkinTime) ||
    '14:00'

  const checkOutTime =
    toStringSafe(baseInfoRecord.checkOutTime) ||
    toStringSafe(checkInInfo?.checkoutTime) ||
    undefined

  const cancellationPolicy =
    toStringSafe(baseInfoRecord.cancellationPolicy) ||
    toStringSafe(dtoRecord.cancellationPolicy) ||
    getPolicyFromList(baseInfoRecord.policies) ||
    'Please follow hotel cancellation policy'

  return {
    checkInTime,
    checkOutTime,
    cancellationPolicy,
  }as any
}

const mapSurroundings = (
  value: unknown,
  userLocation?: GeoPoint
): HotelSurroundingModel[] => {
  if (!isUnknownArray(value)) {
    return []
  }

  return value
    .map((item): HotelSurroundingModel | null => {
      if (!isRecord(item)) {
        return null
      }

      const surName = toStringSafe(item.surName || item.name)
      const surType = toStringSafe(item.surType || item.type)
      const distanceMeters = toNumber(item.distance)

      const itemPoint = getGeoPointFromDto(item)
      const fromUserDistance =
        userLocation && itemPoint && isValidGeoPoint(userLocation) && isValidGeoPoint(itemPoint)
          ? calculateDistanceMeters(userLocation, itemPoint)
          : null

      const normalizedDistance = fromUserDistance ?? distanceMeters ?? undefined

      const distanceText =
        toStringSafe(item.distanceText) ||
        (normalizedDistance !== undefined ? formatDistanceText(normalizedDistance) : undefined)

      return {
        surName,
        surType,
        distanceMeters: normalizedDistance,
        distanceText,
      } as any
    })
    .filter((item): item is HotelSurroundingModel => item !== null)
}

const getHotelDistanceText = (
  userLocation: GeoPoint | undefined,
  hotelLocation: GeoPoint | undefined
): string | undefined => {
  if (!userLocation || !hotelLocation) {
    return undefined
  }

  if (!isValidGeoPoint(userLocation) || !isValidGeoPoint(hotelLocation)) {
    return undefined
  }

  return formatDistanceText(calculateDistanceMeters(userLocation, hotelLocation))
}

const resolveSkuStatus = (value: unknown): 'available' | 'sold_out' => {
  const rawStatus = toStringSafe(value).toLowerCase()
  const availableStatusSet = new Set(['available', 'approved', 'online', 'on_sale'])
  return availableStatusSet.has(rawStatus) ? 'available' : 'sold_out'
}

const getNightlyPrice = (room: Record<string, unknown>): number => {
  const directPriceInfo = getRecord(room.priceInfo)
  const baseInfo = getRecord(room.baseInfo)

  return (
    toNumber(directPriceInfo?.nightlyPrice) ??
    toNumber(baseInfo?.price) ??
    toNumber(room.nightlyPrice) ??
    0
  )
}

interface RoomDTO extends Record<string, unknown> {
  _id?: unknown
  id?: unknown
  baseInfo?: unknown
  spuName?: unknown
}

const isRoomDTO = (value: unknown): value is RoomDTO => {
  if (!isRecord(value)) {
    return false
  }

  return '_id' in value || 'id' in value || 'baseInfo' in value || 'spuName' in value
}

const mapHeadInfo = (headInfo: Record<string, unknown> | undefined): HotelRoomHeadInfoModel => ({
  size: toStringSafe(headInfo?.size) || undefined,
  floor: toStringSafe(headInfo?.floor) || undefined,
  wifi: toBoolean(headInfo?.wifi),
  windowAvailable: toBoolean(headInfo?.windowAvailable),
  smokingAllowed: toBoolean(headInfo?.smokingAllowed),
})

const mapBedInfo = (value: unknown): HotelRoomBedInfoModel[] => {
  if (!isUnknownArray(value)) {
    return []
  }

  return value
    .map((bed): HotelRoomBedInfoModel | null => {
      if (!isRecord(bed)) {
        return null
      }

      return {
        bedType: toStringSafe(bed.bedType),
        bedNumber: toNumber(bed.bedNumber) ?? 0,
        bedSize: toStringSafe(bed.bedSize),
      }
    })
    .filter((bed): bed is HotelRoomBedInfoModel => bed !== null)
}

const getSkuCancellationRule = (room: RoomDTO, baseInfo: Record<string, unknown>): string => {
  const ruleFromRoom = toStringSafe(room.cancellationRule)
  if (ruleFromRoom) {
    return ruleFromRoom
  }

  const ruleFromBaseInfo = toStringSafe(baseInfo.cancellationPolicy)
  if (ruleFromBaseInfo) {
    return ruleFromBaseInfo
  }

  const ruleFromPolicies = getPolicyFromList(baseInfo.policies)
  if (ruleFromPolicies) {
    return ruleFromPolicies
  }

  return 'Please follow hotel cancellation policy'
}

const computeStartingPrice = (skus: HotelRoomSKUModel[]): number => {
  const allPrices = skus
    .map((sku) => sku.priceInfo.nightlyPrice)
    .filter((price) => Number.isFinite(price) && price >= 0)

  const availablePrices = skus
    .filter((sku) => sku.status === 'available')
    .map((sku) => sku.priceInfo.nightlyPrice)
    .filter((price) => Number.isFinite(price) && price >= 0)

  if (availablePrices.length > 0) {
    return Math.min(...availablePrices)
  }

  if (allPrices.length > 0) {
    return Math.min(...allPrices)
  }

  return 0
}

export const mapHotelDtoToDomain = (
  dto: unknown,
  ctx?: HotelAdapterContext
): HotelDomainModel => {
  const dtoRecord = getRecord(dto) ?? {}
  const baseInfo = getRecord(dtoRecord.baseInfo) ?? {}

  const hotelLocation = extractHotelGeoPoint(dtoRecord, baseInfo)
  const distanceText = getHotelDistanceText(ctx?.userLocation, hotelLocation)

  const surroundingsSource = baseInfo.surroundings ?? dtoRecord.surroundings

  return {
    _id: toStringSafe(dtoRecord._id || dtoRecord.id),
    market: toHotelMarket(dtoRecord.market ?? baseInfo.market),
    baseInfo: {
      nameCn: toStringSafe(baseInfo.nameCn || baseInfo.name),
      star: toNumber(baseInfo.star) ?? 0,
      address: toStringSafe(baseInfo.address),
      description: toStringSafe(baseInfo.description),
      images: getStringArray(baseInfo.images),
    }as any,
    facilities: mapFacilities(baseInfo.facilities),
    policies: mapPolicies(baseInfo, dtoRecord),
    surroundings: mapSurroundings(surroundingsSource, ctx?.userLocation),
    rating: {
      score: toNumber(dtoRecord.rating ?? baseInfo.star) ?? 0,
      count: toNumber(dtoRecord.reviewCount ?? baseInfo.reviewCount) ?? 0,
      label: toStringSafe(dtoRecord.ratingLabel) || undefined,
    },
    distanceText,
    startingPrice: toNumber(dtoRecord.startingPrice ?? dtoRecord.minPrice ?? baseInfo?.price) ?? 0,
  }as any
}

export const mapHotelListDtoToDomainList = (
  dtos: unknown[],
  ctx?: HotelAdapterContext
): HotelDomainModel[] => {
  if (!isUnknownArray(dtos)) {
    return []
  }

  return dtos.map((dto) => mapHotelDtoToDomain(dto, ctx))
}

export const groupRoomsToSPU = (rawRooms: unknown[]): HotelRoomSPUModel[] => {
  if (!isUnknownArray(rawRooms)) {
    return []
  }

  const groupedSpuMap = new Map<string, HotelRoomSPUModel>()

  rawRooms.filter(isRoomDTO).forEach((roomDto, index) => {
    const baseInfo = getRecord(roomDto.baseInfo) ?? {}
    const headInfo = getRecord(roomDto.headInfo) ?? getRecord(baseInfo.headInfo)

    const roomId = toStringSafe(roomDto._id || roomDto.id || `room-${index}`)
    const spuName = toStringSafe(baseInfo.type || roomDto.spuName || 'Unknown Room')
    const images = getStringArray(baseInfo.images ?? roomDto.images)
    const bedInfo = mapBedInfo(roomDto.bedInfo ?? baseInfo.bedInfo)

    const sku: HotelRoomSKUModel = {
      roomId,
      priceInfo: {
        nightlyPrice: getNightlyPrice(roomDto),
      },
      status: resolveSkuStatus(
        roomDto.status ??
          baseInfo.status ??
          getRecord(roomDto.auditInfo)?.status
      ),
      cancellationRule: getSkuCancellationRule(roomDto, baseInfo),
    }

    const existingSpu = groupedSpuMap.get(spuName)
    if (existingSpu) {
      if (existingSpu.images.length === 0 && images.length > 0) {
        existingSpu.images = images
      }

      if (existingSpu.bedInfo.length === 0 && bedInfo.length > 0) {
        existingSpu.bedInfo = bedInfo
      }

      existingSpu.skus.push(sku)
      return
    }

    groupedSpuMap.set(spuName, {
      spuName,
      images,
      headInfo: mapHeadInfo(headInfo),
      bedInfo,
      startingPrice: 0,
      skus: [sku],
    })
  })

  return Array.from(groupedSpuMap.values())
    .map((spu) => {
      const sortedSkus = [...spu.skus].sort(
        (left, right) => left.priceInfo.nightlyPrice - right.priceInfo.nightlyPrice
      )

      return {
        ...spu,
        skus: sortedSkus,
        startingPrice: computeStartingPrice(sortedSkus),
      }
    })
    .sort((left, right) => left.startingPrice - right.startingPrice)
}

export const __internal__ = {
  calculateDistanceMeters,
  formatDistanceText,
}

