import { hotelService } from './hotel.service'

type FakeApi = {
  getHotels: jest.Mock
  getRoomsByHotel: jest.Mock
}

describe('hotelService', () => {
  describe('searchHotels', () => {
    it('computes startingPrice from rooms when hotel DTO lacks price', async () => {
      const fakeApi: any = {
        getHotels: jest.fn().mockResolvedValue({
          data: [{ _id: 'h1', baseInfo: { name: 'A' } }],
          meta: { total: 1, page: 1, limit: 10 },
        }),
        getRoomsByHotel: jest.fn().mockResolvedValue([
          { spuName: 'room1', startingPrice: 300, skus: [] },
          { spuName: 'room2', startingPrice: 250, skus: [] },
        ]),
      }

      const res = await hotelService.searchHotels(fakeApi, {
        city: 'X',
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-02',
        market: 'domestic',
        page: 1,
        limit: 10,
      })

      expect(res.list).toHaveLength(1)
      expect(res.list[0].startingPrice).toBe(250)
      expect(fakeApi.getRoomsByHotel).toHaveBeenCalledWith('h1', { propertyType: 'hotel' })
    })
  })
})
