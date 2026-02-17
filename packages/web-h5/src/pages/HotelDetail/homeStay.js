import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import DetailPage from '../../components/homestay/detail';
const HomeStayDetailPage = () => {
    const { id } = useParams();
    // 在实际应用中，这里应该从API获取数据
    // const { data, loading } = useFetchHomeStayDetail(id)
    return _jsx(DetailPage, {});
};
export default HomeStayDetailPage;
//# sourceMappingURL=homeStay.js.map