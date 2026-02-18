/**
 * 地理编码工具 - 使用高德地图 API
 */
/**
 * 根据经纬度获取地址
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 地址字符串
 */
export declare function getAddressByCoords(latitude: number, longitude: number): Promise<string>;
/**
 * 根据地址获取经纬度（正向地理编码）
 * @param address 地址
 * @param city 城市（可选，提高准确率）
 * @returns 坐标信息 {latitude, longitude}
 */
export declare function getCoordsByAddress(address: string, city?: string): Promise<{
    latitude: number;
    longitude: number;
} | null>;
//# sourceMappingURL=geocoding.d.ts.map