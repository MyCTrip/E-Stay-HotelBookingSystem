import axios from 'axios';
/**
 * 创建 API 实例（工厂函数）
 */
export function createApiService(config) {
    const instance = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout || 10000,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
    });
    // 请求拦截：添加 token（使用存储适配器）
    instance.interceptors.request.use(async (cfg) => {
        try {
            // ✨ 优先使用 storage adapter，回退到 localStorage
            let token = null;
            if (config.storage) {
                token = await config.storage.getItem('auth_token');
            }
            else if (typeof window !== 'undefined') {
                token = localStorage.getItem('auth_token');
            }
            if (token) {
                cfg.headers.Authorization = `Bearer ${token}`;
            }
        }
        catch (err) {
            console.warn('[API] Failed to get auth token:', err);
        }
        return cfg;
    });
    // 响应拦截：统一错误处理
    instance.interceptors.response.use((res) => res.data, (err) => {
        const message = err.response?.data?.message || err.message || 'Unknown error';
        console.error('[API Error]', message);
        if (err?.response?.status === 401) {
            // 清除 token 并导航到登录
            try {
                if (config.storage) {
                    config.storage.removeItem('auth_token');
                }
                else if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                }
            }
            catch (e) {
                console.warn('[API] Failed to clear auth token:', e);
            }
        }
        return Promise.reject(new Error(message));
    });
    // 返回 API 方法集合
    return {
        getHotels: (query) => instance.get('/hotels', { params: query }),
        getHotHotels: (limit = 10) => instance.get('/hotels/hot', { params: { limit } }),
        getHotelDetail: (id) => instance.get(`/hotels/${id}`),
        getRoomsByHotel: (hotelId, params) => instance.get(`/hotels/${hotelId}/rooms`, { params }),
        getRoomDetail: (id) => instance.get(`/rooms/${id}`),
        // 民宿接口
        homestays: {
            search: (params) => instance.get('/homestays/search', { params }),
            getDetail: (id) => instance.get(`/homestays/${id}`),
            getHot: (params) => instance.get('/homestays/hot', { params }),
        },
        // 房间接口
        rooms: {
            getDetail: (id) => instance.get(`/rooms/${id}`),
        },
        // Auth endpoints (预留)
        login: (email, password) => instance.post('/auth/login', { email, password }),
        register: (email, password) => instance.post('/auth/register', { email, password }),
        getMe: () => instance.get('/auth/me'),
    };
}
/**
 * Mock API 实现（开发用）
 */
export function createMockApiService() {
    return {
        getHotels: async (query) => ({
            code: 200,
            data: {
                items: [
                    {
                        _id: '1',
                        baseInfo: {
                            nameCn: '五星级示例酒店',
                            address: '北京市朝阳区',
                            city: 'Beijing',
                            star: 5,
                            phone: '010-12345678',
                            description: '优质酒店',
                            images: ['https://via.placeholder.com/300x200'],
                            facilities: [{ category: '公共', content: '<p>WiFi</p>' }],
                            policies: [{ policyType: 'cancellation', content: '<p>免费取消</p>' }],
                        },
                        auditInfo: { status: 'approved' },
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
            },
            message: 'success',
        }),
        getHotHotels: async (limit = 10) => ({
            code: 200,
            data: [
                {
                    _id: '1',
                    baseInfo: {
                        nameCn: '热门酒店',
                        city: 'Beijing',
                        star: 5,
                        images: ['https://via.placeholder.com/300x200'],
                    },
                },
            ],
            message: 'success',
        }),
        getHotelDetail: async (id) => ({
            code: 200,
            data: {
                _id: id,
                baseInfo: {
                    nameCn: '详情示例酒店',
                    address: '北京市朝阳区',
                    city: 'Beijing',
                    star: 4,
                    phone: '010-12345678',
                    description: '优质酒店描述',
                    images: ['https://via.placeholder.com/300x200'],
                    facilities: [
                        { category: '公共', content: '<p>大厅 WiFi</p>' },
                        { category: '房间', content: '<p>房间 WiFi</p>' },
                    ],
                    policies: [
                        { policyType: 'cancellation', content: '<p>免费取消</p>' },
                        { policyType: 'petAllowed', content: '<p>不允许宠物</p>' },
                    ],
                },
                checkinInfo: { checkinTime: '14:00', checkoutTime: '12:00' },
                auditInfo: { status: 'approved' },
            },
            message: 'success',
        }),
        getRoomsByHotel: async (hotelId, params) => ({
            code: 200,
            data: {
                items: [
                    {
                        _id: 'room1',
                        hotelId,
                        baseInfo: {
                            type: '标准间',
                            price: 299,
                            images: ['https://via.placeholder.com/300x200'],
                            maxOccupancy: 2,
                        },
                        headInfo: {
                            size: '25 sqm',
                            floor: '2F',
                            wifi: true,
                            windowAvailable: true,
                            smokingAllowed: false,
                        },
                        bedInfo: [{ bedType: '双人床', bedNumber: 1, bedSize: '1.8m' }],
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
            },
            message: 'success',
        }),
        getRoomDetail: async (id) => ({
            code: 200,
            data: {
                _id: id,
                baseInfo: {
                    type: '豪华间',
                    price: 599,
                    images: ['https://via.placeholder.com/300x200'],
                    maxOccupancy: 2,
                },
                headInfo: {
                    size: '35 sqm',
                    floor: '3F',
                    wifi: true,
                    windowAvailable: true,
                    smokingAllowed: false,
                },
                bedInfo: [{ bedType: '大床', bedNumber: 1, bedSize: '2.0m' }],
                breakfastInfo: { breakfastType: '自助早餐' },
            },
            message: 'success',
        }),
        // 民宿 Mock API
        homestays: {
            search: async (params) => ({
                code: 200,
                data: {
                    items: [],
                    total: 0,
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                },
                message: 'success',
            }),
            getDetail: async (id) => ({
                code: 200,
                data: {
                    _id: id,
                    baseInfo: {
                        nameCn: '民宿示例',
                        address: '示例地址',
                        city: 'Beijing',
                        images: [],
                    },
                },
                message: 'success',
            }),
            getHot: async (params) => ({
                code: 200,
                data: [],
                message: 'success',
            }),
        },
        // 房间 Mock API
        rooms: {
            getDetail: async (id) => ({
                code: 200,
                data: {
                    _id: id,
                    baseInfo: {
                        type: '标准间',
                        price: 299,
                    },
                },
                message: 'success',
            }),
        },
        // Auth (mock)
        login: async (email, password) => ({
            code: 200,
            data: { token: 'mock_token_' + Date.now() },
            message: 'success',
        }),
        register: async (email, password) => ({
            code: 200,
            data: { id: 'user_' + Date.now(), email },
            message: 'success',
        }),
        getMe: async () => ({
            code: 200,
            data: { id: 'user1', email: 'user@example.com', role: 'user' },
            message: 'success',
        }),
    };
}
export default createApiService;
//# sourceMappingURL=index.js.map