/**
 * 设施数据定义
 */
export const FACILITY_CATEGORIES = [
    {
        id: 'service',
        name: '服务',
        facilities: [
            { id: 'free_parking', name: '免费停车位', available: false },
            { id: 'paid_parking', name: '付费停车位', available: false },
            { id: 'luggage_storage', name: '行李寄存', available: true },
            { id: 'front_desk', name: '前台接待', available: true },
            { id: 'concierge', name: '管家式服务', available: false },
        ],
    },
    {
        id: 'basic',
        name: '基础',
        facilities: [
            { id: 'wifi', name: '无线网络', available: true },
            { id: 'elevator', name: '电梯', available: true },
            { id: 'window', name: '窗户', available: true },
            { id: 'bedroom_ac', name: '卧室 - 冷暖空调', available: true },
            { id: 'living_ac', name: '客厅 - 冷暖空调', available: false },
            { id: 'heater', name: '暖气', available: true },
            { id: 'drying_rack', name: '晾衣架', available: true },
            { id: 'electric_kettle', name: '电热水壶', available: true },
            { id: 'sofa', name: '沙发', available: true },
            { id: 'tv', name: '电视', available: true },
            { id: 'fridge', name: '冰箱', available: true },
            { id: 'washing_machine', name: '洗衣机', available: true },
            { id: 'air_purifier', name: '空气净化器', available: false },
            { id: 'humidifier', name: '加湿器', available: false },
            { id: 'dryer', name: '烘干机', available: false },
            { id: 'iron', name: '电熨斗', available: true },
            { id: 'water', name: '免费瓶装水', available: true },
        ],
    },
    {
        id: 'bathroom',
        name: '卫浴',
        facilities: [
            { id: 'slippers', name: '一次性拖鞋', available: true },
            { id: 'hot_water', name: '热水', available: true },
            { id: 'private_bathroom', name: '独立卫浴', available: true },
            { id: 'hair_dryer', name: '电吹风', available: true },
            { id: 'toiletries', name: '洗浴用品', available: true },
            { id: 'toothbrush', name: '牙具', available: true },
            { id: 'bath_towel', name: '浴巾', available: true },
            { id: 'towel', name: '毛巾', available: true },
            { id: 'smart_toilet', name: '智能马桶', available: false },
        ],
    },
    {
        id: 'kitchen',
        name: '厨房',
        facilities: [
            { id: 'microwave', name: '微波炉', available: false },
            { id: 'tableware', name: '餐具', available: true },
            { id: 'knife_board', name: '刀具菜板', available: true },
            { id: 'cooking_pots', name: '烹饪锅具', available: true },
            { id: 'induction', name: '电磁炉', available: false },
            { id: 'gas_stove', name: '燃气灶', available: false },
            { id: 'detergent', name: '洗涤用品', available: true },
            { id: 'rice_cooker', name: '电饭煲', available: false },
            { id: 'oven', name: '烤箱', available: false },
            { id: 'dining_table', name: '餐桌', available: true },
        ],
    },
    {
        id: 'nearby',
        name: '周边',
        facilities: [
            { id: 'supermarket', name: '超市', available: true },
            { id: 'convenience_store', name: '便利店', available: true },
            { id: 'restaurant', name: '餐厅', available: true },
            { id: 'pharmacy', name: '药店', available: true },
            { id: 'park', name: '公园', available: false },
            { id: 'market', name: '菜市场', available: true },
            { id: 'atm', name: '提款机', available: true },
            { id: 'playground', name: '儿童乐园', available: false },
        ],
    },
    {
        id: 'safety',
        name: '安全',
        facilities: [
            { id: 'smart_lock', name: '智能门锁', available: true },
            { id: 'card_key', name: '门禁卡', available: true },
            { id: 'security', name: '保安', available: false },
            { id: 'fire_alarm', name: '火灾警报器', available: true },
            { id: 'extinguisher', name: '灭火器', available: true },
        ],
    },
    {
        id: 'entertainment',
        name: '娱乐',
        facilities: [{ id: 'projector', name: '投影设备', available: false }],
    },
    {
        id: 'leisure',
        name: '休闲',
        facilities: [{ id: 'living_room', name: '独立客厅', available: true }],
    },
    {
        id: 'children',
        name: '儿童',
        facilities: [
            { id: 'toys', name: '儿童玩具', available: false },
            { id: 'high_chair', name: '儿童餐椅', available: false },
            { id: 'baby_tub', name: '婴儿浴盆', available: false },
        ],
    },
];
// 获取指定分类的设施
export const getFacilitiesByCategory = (categoryId) => {
    const category = FACILITY_CATEGORIES.find((c) => c.id === categoryId);
    return category?.facilities || [];
};
// 获取特定分类中有的设施
export const getAvailableFacilitiesByCategory = (categoryId) => {
    return getFacilitiesByCategory(categoryId).filter((f) => f.available);
};
// 获取FacilitiesSection需要显示的设施（优先显示有的，最多两行6个）
export const getFacilitiesSectionData = () => {
    const priorities = ['basic', 'bathroom', 'service'];
    const facilities = [];
    for (const categoryId of priorities) {
        const available = getAvailableFacilitiesByCategory(categoryId);
        facilities.push(...available);
        if (facilities.length >= 6) {
            return facilities.slice(0, 6);
        }
    }
    return facilities;
};
// 兼容旧API - 获取指定分类中已有的设施
export const getFacilitiesInCategory = (categoryId, hasFacilities = []) => {
    const category = FACILITY_CATEGORIES.find((c) => c.id === categoryId);
    if (!category)
        return [];
    return category.facilities.filter((item) => hasFacilities.includes(item.name));
};
// 兼容旧API - 获取指定分类中所有设施及其状态
export const getFacilitiesWithStatus = (categoryId, hasFacilities = []) => {
    const category = FACILITY_CATEGORIES.find((c) => c.id === categoryId);
    if (!category)
        return [];
    return category.facilities.map((item) => ({
        name: item.name,
        has: hasFacilities.includes(item.name) || item.available,
    }));
};
//# sourceMappingURL=facilities.js.map