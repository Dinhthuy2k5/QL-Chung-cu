import React, { useState, useEffect, useMemo } from "react";
import '../styles/apartment-styles/Apartment.scss';
import EditFilter from "../components/apartment_component/EditFilter";
import { useTranslation } from 'react-i18next';

function Apartment(props) {
    const { t } = useTranslation();
    const [originalApartments, setOriginalApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [isEditFilter, setIsEditFilter] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12); // Mặc định 12 thẻ cho đẹp Grid (chia hết cho 2,3,4)

    // --- 1. HÀM SẮP XẾP (Giữ nguyên để đảm bảo thứ tự tầng/phòng đúng) ---
    const sortApartments = (list) => {
        return list.sort((a, b) => {
            const buildingA = a.soNha.match(/^[a-zA-Z]+/)?.[0] || "";
            const buildingB = b.soNha.match(/^[a-zA-Z]+/)?.[0] || "";

            // Lấy số phòng (ví dụ 101, 1205) để sắp xếp tăng dần
            const numberA = parseInt(a.soNha.match(/\d+/)?.[0] || "0", 10);
            const numberB = parseInt(b.soNha.match(/\d+/)?.[0] || "0", 10);

            if (buildingA < buildingB) return -1;
            if (buildingA > buildingB) return 1;
            return numberA - numberB;
        });
    };

    useEffect(() => {
        if (props.listApartments && props.listApartments.length > 0) {
            const sortedList = sortApartments([...props.listApartments]);
            setOriginalApartments(sortedList);
            setFilteredApartments(sortedList);
        }
    }, [props.listApartments]);

    // --- LOGIC TÍNH TOÁN DỮ LIỆU TRANG HIỆN TẠI ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApartments = filteredApartments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset về trang 1 khi đổi số lượng
    };

    // --- 2. HÀM GOM NHÓM (DÙNG DỮ LIỆU ĐÃ PHÂN TRANG: currentApartments) ---
    const groupedApartments = useMemo(() => {
        const groups = {};
        // Lưu ý: Dùng currentApartments thay vì filteredApartments
        currentApartments.forEach(item => {
            const building = item.soNha.match(/^[a-zA-Z]+/)?.[0] || "Khác";
            const groupKey = `${t('apartment_table.building') || "Tòa"} ${building}`;
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });
        return groups;
    }, [currentApartments, t]);
    // --- 3. ICON ĐỘNG (Giữ nguyên) ---
    const getApartmentIcon = (item) => {
        const type = item.loaiCanHo ? item.loaiCanHo.toLowerCase() : "";
        const area = item.dienTich || 0;
        if (type.includes("penthouse") || area > 150) return { icon: "🏰", class: "icon-penthouse", label: "Penthouse" };
        if (type.includes("3") || area > 100) return { icon: "🏢", class: "icon-3pn", label: "3 PN" };
        if (type.includes("2") || (area > 50 && area <= 100)) return { icon: "🏠", class: "icon-2pn", label: "2 PN" };
        return { icon: "🛖", class: "icon-studio", label: "Studio/1PN" };
    };

    const stats = useMemo(() => {
        const total = filteredApartments.length;
        const types = [...new Set(filteredApartments.map(item => item.loaiCanHo))].length;
        const avgArea = total > 0 ? Math.round(filteredApartments.reduce((acc, curr) => acc + curr.dienTich, 0) / total) : 0;
        return { total, types, avgArea };
    }, [filteredApartments]);

    const handleApplyFilter = (filters) => {
        let filteredData = [...originalApartments];
        if (filters.soNha) filteredData = filteredData.filter(item => item.soNha.toLowerCase().includes(filters.soNha.toLowerCase()));
        if (filters.loaiCanHo && filters.loaiCanHo.length > 0) filteredData = filteredData.filter(item => filters.loaiCanHo.includes(item.loaiCanHo));
        filteredData = filteredData.filter(item => item.dienTich >= filters.dienTich[0] && item.dienTich <= filters.dienTich[1]);
        setFilteredApartments(sortApartments(filteredData));
    }

    const getStatusBadge = (dienTich) => {
        if (dienTich > 100) return <span className="badge status-vip">VIP</span>;
        if (dienTich < 50) return <span className="badge status-vacant">Studio</span>;
        return <span className="badge status-occupied">Standard</span>;
    };

    return (
        <div className="apartment-page-wrapper">
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon orange">&#127968;</div>
                    <div className="stat-info"><h3>{stats.total}</h3><p>{t('apartment_table.total_units') || "Tổng căn hộ"}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">&#128202;</div>
                    <div className="stat-info"><h3>{stats.types}</h3><p>{t('apartment_table.types') || "Loại hình"}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">&#128205;</div>
                    <div className="stat-info"><h3>{stats.avgArea} m²</h3><p>{t('apartment_table.avg_area') || "Diện tích TB"}</p></div>
                </div>
            </div>

            <div className="table-controls">
                <div className="left-controls">
                    <h2 className="section-title">{t('apartment_table.list_title') || "Quản lý Căn hộ"}</h2>
                </div>
                <div className="right-controls">
                    <div className="view-toggles">
                        <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>&#9776;</button>
                        <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>&#9638;</button>
                    </div>
                    <button className="filter-btn" onClick={() => setIsEditFilter(true)}>
                        <span className="icon">&#128269;</span> {t('apartment_table.filter') || "Bộ lọc"}
                    </button>
                </div>
                <EditFilter show={isEditFilter} onClose={() => setIsEditFilter(false)} onApplyFilter={handleApplyFilter} />
            </div>

            {/* --- PHẦN HIỂN THỊ DỮ LIỆU --- */}

            {/* VIEW MODE: GRID */}
            {viewMode === 'grid' && (
                <div className="apartment-floors-wrapper">
                    {Object.keys(groupedApartments).length > 0 ? (
                        Object.keys(groupedApartments).sort().map(groupKey => (
                            <div key={groupKey} className="floor-group">
                                <h3 className="floor-title">{groupKey}</h3>
                                <div className="apartment-grid-container">
                                    {groupedApartments[groupKey].map(item => {
                                        const iconData = getApartmentIcon(item);
                                        return (
                                            <div className="apartment-card-item" key={item.idCanHo}>
                                                <div className="card-header">
                                                    <span className="card-id">#{item.idCanHo}</span>
                                                    {getStatusBadge(item.dienTich)}
                                                </div>
                                                <div className="card-body">
                                                    <div className={`card-icon-placeholder ${iconData.class}`}>
                                                        {iconData.icon}
                                                    </div>
                                                    <h3 className="card-title">{item.soNha}</h3>
                                                    <p className="card-subtitle">{item.loaiCanHo || iconData.label}</p>
                                                    <div className="card-details">
                                                        <div className="detail-item">
                                                            <span className="label">Diện tích:</span>
                                                            <span className="value">{item.dienTich} m²</span>
                                                        </div>
                                                        <div className="detail-item full-width">
                                                            <span className="label">Địa chỉ:</span>
                                                            <span className="value address">{item.diaChi}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">{t('apartment_table.no_data') || "Không tìm thấy dữ liệu"}</div>
                    )}
                </div>
            )}

            {/* VIEW MODE: LIST */}
            {viewMode === 'list' && (
                <div className="glass-table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('apartment_table.unit_number')}</th>
                                <th>{t('apartment_table.type')}</th>
                                <th>{t('apartment_table.status') || "Phân loại"}</th>
                                <th>{t('apartment_table.area')}</th>
                                <th>{t('apartment_table.address')}</th>
                                <th>{t() || ""}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dùng currentApartments thay vì filteredApartments */}
                            {currentApartments.length > 0 ? (
                                currentApartments.map((item) => (
                                    <tr key={item.idCanHo}>
                                        <td className="id-col">#{item.idCanHo}</td>
                                        <td className="highlight-text">{item.soNha}</td>
                                        <td>{item.loaiCanHo}</td>
                                        <td>{getStatusBadge(item.dienTich)}</td>
                                        <td>{item.dienTich} m²</td>
                                        <td className="address-col">{item.diaChi}</td>
                                        <td></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" className="no-data">{t('apartment_table.no_data') || "Không tìm thấy dữ liệu"}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
            {filteredApartments.length > 0 && (
                <div className="pagination-wrapper">
                    <div className="rows-per-page">
                        <span>Hiển thị:</span>
                        <select value={itemsPerPage} onChange={handleRowsPerPageChange}>
                            <option value={10}>10</option>
                            <option value={12}>12</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="page-numbers">
                        <button
                            className="page-btn prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {/* Logic hiển thị số trang */}
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                            // Chỉ hiện trang đầu, trang cuối, và các trang xung quanh trang hiện tại
                            (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) ? (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`page-btn ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ) : (
                                (number === currentPage - 2 || number === currentPage + 2) ? <span key={number} className="dots">...</span> : null
                            )
                        ))}

                        <button
                            className="page-btn next"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="page-info">
                        Trang {currentPage} / {totalPages}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Apartment;