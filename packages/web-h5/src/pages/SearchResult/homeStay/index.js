import { jsx as _jsx } from "react/jsx-runtime";
/**
 * 民宿搜索结果页面 - Web H5版本
 * 集成 Zustand Store 获取搜索结果数据
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useHomestayStore } from '@estay/shared';
import SearchResultList from '../../../components/homestay/search/SearchResultList';
import styles from './index.module.scss';
const SearchResultPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // 获取 Store 状态和 Action
    const { searchParams: storeSearchParams, homestays, searchLoading, fetchSearchResults, } = useHomestayStore();
    // 本地过滤条件
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '上海',
        checkInDate: searchParams.get('checkIn') || dayjs().format('YYYY-MM-DD'),
        checkOutDate: searchParams.get('checkOut') || dayjs().add(1, 'day').format('YYYY-MM-DD'),
        roomCount: Number(searchParams.get('rooms')) || 1,
        guestCount: Number(searchParams.get('guests')) || 1,
    });
    // 首次进入页面时获取搜索结果
    useEffect(() => {
        const handleSearch = async () => {
            try {
                // 从 URL 参数构建搜索参数
                const params = {
                    city: searchParams.get('city') || '上海',
                    checkIn: searchParams.get('checkIn')
                        ? new Date(searchParams.get('checkIn'))
                        : dayjs().toDate(),
                    checkOut: searchParams.get('checkOut')
                        ? new Date(searchParams.get('checkOut'))
                        : dayjs().add(1, 'day').toDate(),
                    guests: Number(searchParams.get('guests')) || 1,
                    rooms: Number(searchParams.get('rooms')) || 1,
                    beds: 0,
                    keyword: '',
                    selectedTags: [],
                    priceMin: 0,
                    priceMax: 10000,
                    page: 1,
                    limit: 20,
                };
                // 调用 Store 的搜索函数
                await fetchSearchResults(params);
            }
            catch (error) {
                console.error('Failed to load search results:', error);
            }
        };
        handleSearch();
    }, [searchParams, fetchSearchResults]);
    // 处理筛选条件变化
    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);
    // 处理修改搜索条件
    const handleModifySearch = useCallback(() => {
        // 返回到首页页面修改搜索条件
        navigate('/home/homeStay');
    }, [navigate]);
    return (_jsx("div", { className: styles.container, children: _jsx(SearchResultList, { data: homestays, loading: searchLoading, filters: filters, onFiltersChange: handleFiltersChange, onModifySearch: handleModifySearch }) }));
};
export default SearchResultPage;
//# sourceMappingURL=index.js.map