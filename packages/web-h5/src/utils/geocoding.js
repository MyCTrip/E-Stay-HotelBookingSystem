/**
 * 地理编码工具 - 使用高德地图 API
 */
// 高德地图 API 密钥 - 可以通过环境变量配置
const AMAP_API_KEY = import.meta.env.VITE_AMAP_API_KEY || 'c7de68cf86c6d1e13f8908fa98c7b5c8';
/**
 * 根据经纬度获取地址
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 地址字符串
 */
export async function getAddressByCoords(latitude, longitude) {
    try {
        const response = await fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${AMAP_API_KEY}&extensions=base`);
        if (!response.ok) {
            throw new Error('高德 API 请求失败');
        }
        const data = await response.json();
        if (data.status === '0') {
            throw new Error('地理编码查询失败: ' + data.info);
        }
        // 组合地址信息（省市区 + 具体地址）
        const result = data.regeocode;
        if (!result) {
            throw new Error('未找到地址信息');
        }
        const addressComponent = result.addressComponent;
        const formattedAddress = result.formatted_address;
        // 优先返回格式化地址
        if (formattedAddress) {
            return formattedAddress;
        }
        // 备选：组合地址信息
        const parts = [];
        if (addressComponent.province)
            parts.push(addressComponent.province);
        if (addressComponent.city)
            parts.push(addressComponent.city);
        if (addressComponent.district)
            parts.push(addressComponent.district);
        if (addressComponent.township)
            parts.push(addressComponent.township);
        return parts.join('');
    }
    catch (error) {
        console.error('地理编码失败:', error);
        // 返回经纬度作为备选
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
}
/**
 * 根据地址获取经纬度（正向地理编码）
 * @param address 地址
 * @param city 城市（可选，提高准确率）
 * @returns 坐标信息 {latitude, longitude}
 */
export async function getCoordsByAddress(address, city) {
    try {
        const query = city ? `city=${city}&address=${address}` : `address=${address}`;
        const response = await fetch(`https://restapi.amap.com/v3/geocode/geo?${query}&key=${AMAP_API_KEY}`);
        if (!response.ok) {
            throw new Error('高德 API 请求失败');
        }
        const data = await response.json();
        if (data.status === '0') {
            throw new Error('地理编码查询失败: ' + data.info);
        }
        if (data.geocodes && data.geocodes.length > 0) {
            const location = data.geocodes[0].location.split(',');
            return {
                longitude: parseFloat(location[0]),
                latitude: parseFloat(location[1]),
            };
        }
        return null;
    }
    catch (error) {
        console.error('正向地理编码失败:', error);
        return null;
    }
}
//# sourceMappingURL=geocoding.js.map