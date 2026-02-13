import { Hotel } from '../modules/hotel/hotel.model';
import { cacheService } from '../utils/cache.service';

class HotDataService {
  /**
   * 获取热门酒店
   */
  async getHotHotels(limit: number = 10): Promise<any[]> {
    const cacheKey = `hot_hotels:${limit}`;
    
    // 尝试从缓存获取
    const cachedData = await cacheService.get<any[]>(cacheKey, {
      keyPrefix: 'hot:',
    });
    
    if (cachedData) {
      return cachedData;
    }
    
    // 从数据库查询
    // 这里简单按创建时间排序，实际应用中可能需要根据评分、预订量等计算热度
    const hotels = await Hotel.find({ 'auditInfo.status': 'approved' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('baseInfo.nameCn baseInfo.city baseInfo.star baseInfo.images baseInfo.description');
    
    // 存入缓存，热门酒店缓存1小时
    await cacheService.set(cacheKey, hotels, {
      keyPrefix: 'hot:',
      expiration: 3600,
    });
    
    return hotels;
  }

  /**
   * 获取城市列表
   */
  async getCities(): Promise<string[]> {
    const cacheKey = 'cities';
    
    // 尝试从缓存获取
    const cachedData = await cacheService.get<string[]>(cacheKey, {
      keyPrefix: 'hot:',
    });
    
    if (cachedData) {
      return cachedData;
    }
    
    // 从数据库查询
    const cities = await Hotel.distinct('baseInfo.city', {
      'auditInfo.status': 'approved',
      'baseInfo.city': { $ne: '' },
    });
    
    // 存入缓存，城市列表缓存24小时
    await cacheService.set(cacheKey, cities, {
      keyPrefix: 'hot:',
      expiration: 86400,
    });
    
    return cities;
  }

  /**
   * 清除热点数据缓存
   */
  async clearHotDataCache(): Promise<void> {
    await cacheService.clearPattern('*', {
      keyPrefix: 'hot:',
    });
  }

  /**
   * 清除酒店相关缓存
   */
  async clearHotelCache(): Promise<void> {
    await cacheService.clearPattern('*', {
      keyPrefix: 'hotel:',
    });
    // 同时清除热点数据缓存
    await this.clearHotDataCache();
  }
}

export const hotDataService = new HotDataService();
