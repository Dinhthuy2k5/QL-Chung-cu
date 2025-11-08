import React, { useState, useEffect } from "react"; // 1. Import useState và useEffect
import '../styles/apartment-styles/Apartment.scss'
import EditFilter from "../components/apartment_component/EditFilter";
// 2. Import hook 'useTranslation'
import { useTranslation } from 'react-i18next';

// Ghi chú: Bạn không cần 'axios' hay 'getToken' ở đây nữa
// vì 'listApartments' đã được truyền từ App.js qua props

function Apartment(props) {
    // 3. Lấy hàm 't' (translate) từ hook
    const { t } = useTranslation();

    // 4. Quản lý state bằng hook 'useState'
    const [originalApartments, setOriginalApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [isEditFilter, setIsEditFilter] = useState(false);

    // 5. Dùng 'useEffect' để cập nhật state khi props thay đổi
    // (Đây là cách thay thế cho componentDidUpdate)
    useEffect(() => {
        setOriginalApartments(props.listApartments);
        setFilteredApartments(props.listApartments);
    }, [props.listApartments]); // Chỉ chạy lại khi listApartments từ props thay đổi

    // 6. Chuyển đổi các hàm của class thành hàm bình thường
    const handleApplyFilter = (filters) => {
        // Luôn bắt đầu lọc từ danh sách gốc
        let filteredData = [...originalApartments];

        // 1. Lọc theo Số nhà
        if (filters.soNha) {
            filteredData = filteredData.filter(item =>
                item.soNha.toLowerCase().includes(filters.soNha.toLowerCase())
            );
        }
        // 2. Lọc theo Loại căn hộ
        if (filters.loaiCanHo && filters.loaiCanHo.length > 0) {
            filteredData = filteredData.filter(item =>
                filters.loaiCanHo.includes(item.loaiCanHo)
            );
        }
        // 3. Lọc theo Diện tích
        filteredData = filteredData.filter(item =>
            item.dienTich >= filters.dienTich[0] && item.dienTich <= filters.dienTich[1]
        );

        // Cập nhật lại danh sách hiển thị
        setFilteredApartments(filteredData);
    }

    // 7. Render component
    return (
        <div className="apartment-container">
            <div className="table-actions">
                <button className="filter-btn" onClick={() => setIsEditFilter(true)}>
                    <span className="icon">&#128269;</span> {t('apartment_table.filter')} {/* Bạn có thể thêm key 'Lọc' vào file json */}
                </button>
                <EditFilter
                    show={isEditFilter}
                    onClose={() => setIsEditFilter(false)}
                    onApplyFilter={handleApplyFilter}
                />
            </div>
            <div className="apartment-table-container">
                <div className="apartment-header-row">
                    {/* 8. Sử dụng hàm t() để dịch tiêu đề */}
                    <h4>{t('apartment_table.id')}</h4>
                    <h4>{t('apartment_table.unit_number')}</h4>
                    <h4>{t('apartment_table.type')}</h4>
                    <h4>{t('apartment_table.area')}</h4>
                    <h4>{t('apartment_table.address')}</h4>
                </div>

                <div className="apartment-table-body">
                    {
                        filteredApartments && filteredApartments.length > 0 &&
                        filteredApartments.map((item) => {
                            return (
                                <div className="apartment-data-row" key={item.idCanHo}>
                                    <div>{item.idCanHo}</div>
                                    <div>{item.soNha}</div>
                                    <div>{item.loaiCanHo}</div>
                                    <div>{item.dienTich}</div>
                                    <div>{item.diaChi}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

// 9. Export component (không cần HOC 'withTranslation' nữa)
export default Apartment;