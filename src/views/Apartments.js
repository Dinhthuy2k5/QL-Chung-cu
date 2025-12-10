import React, { useState, useEffect, useMemo } from "react";
import '../styles/apartment-styles/Apartment.scss';
import EditFilter from "../components/apartment_component/EditFilter";
import { useTranslation } from 'react-i18next';

function Apartment(props) {
    const { t } = useTranslation();
    const [originalApartments, setOriginalApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [isEditFilter, setIsEditFilter] = useState(false);

    // 1. State mới để quản lý chế độ hiển thị: 'list' (bảng) hoặc 'grid' (thẻ)
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        setOriginalApartments(props.listApartments);
        setFilteredApartments(props.listApartments);
    }, [props.listApartments]);

    const stats = useMemo(() => {
        const total = filteredApartments.length;
        const types = [...new Set(filteredApartments.map(item => item.loaiCanHo))].length;
        const avgArea = total > 0
            ? Math.round(filteredApartments.reduce((acc, curr) => acc + curr.dienTich, 0) / total)
            : 0;
        return { total, types, avgArea };
    }, [filteredApartments]);

    const handleApplyFilter = (filters) => {
        let filteredData = [...originalApartments];
        if (filters.soNha) {
            filteredData = filteredData.filter(item =>
                item.soNha.toLowerCase().includes(filters.soNha.toLowerCase())
            );
        }
        if (filters.loaiCanHo && filters.loaiCanHo.length > 0) {
            filteredData = filteredData.filter(item =>
                filters.loaiCanHo.includes(item.loaiCanHo)
            );
        }
        filteredData = filteredData.filter(item =>
            item.dienTich >= filters.dienTich[0] && item.dienTich <= filters.dienTich[1]
        );
        setFilteredApartments(filteredData);
    }

    const getStatusBadge = (dienTich) => {
        if (dienTich > 100) return <span className="badge status-vip">VIP</span>;
        if (dienTich < 50) return <span className="badge status-vacant">Studio</span>;
        return <span className="badge status-occupied">Standard</span>;
    };

    return (
        <div className="apartment-page-wrapper">
            {/* --- PHẦN 1: THỐNG KÊ --- */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon orange">&#127968;</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>{t('apartment_table.total_units') || "Tổng căn hộ"}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">&#128202;</div>
                    <div className="stat-info">
                        <h3>{stats.types}</h3>
                        <p>{t('apartment_table.types') || "Loại hình"}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">&#128205;</div>
                    <div className="stat-info">
                        <h3>{stats.avgArea} m²</h3>
                        <p>{t('apartment_table.avg_area') || "Diện tích TB"}</p>
                    </div>
                </div>
            </div>

            {/* --- PHẦN 2: CONTROLS (Thêm nút chuyển view) --- */}
            <div className="table-controls">
                <div className="left-controls">
                    <h2 className="section-title">{t('apartment_table.list_title') || "Danh sách Căn hộ"}</h2>
                </div>

                <div className="right-controls">
                    {/* Nút chuyển chế độ xem */}
                    <div className="view-toggles">
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Xem dạng bảng"
                        >
                            &#9776; {/* Icon List */}
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Xem dạng thẻ"
                        >
                            &#9638; {/* Icon Grid */}
                        </button>
                    </div>

                    <button className="filter-btn" onClick={() => setIsEditFilter(true)}>
                        <span className="icon">&#128269;</span>
                        {t('apartment_table.filter') || "Bộ lọc"}
                    </button>
                </div>

                <EditFilter
                    show={isEditFilter}
                    onClose={() => setIsEditFilter(false)}
                    onApplyFilter={handleApplyFilter}
                />
            </div>

            {/* --- PHẦN 3: HIỂN THỊ DỮ LIỆU (Switch case) --- */}

            {/* VIEW MODE: GRID (Dạng thẻ) */}
            {viewMode === 'grid' && (
                <div className="apartment-grid-container">
                    {filteredApartments.map(item => (
                        <div className="apartment-card-item" key={item.idCanHo}>
                            <div className="card-header">
                                <span className="card-id">#{item.idCanHo}</span>
                                {getStatusBadge(item.dienTich)}
                            </div>
                            <div className="card-body">
                                <div className="card-icon-placeholder">
                                    &#127970;
                                </div>
                                <h3 className="card-title">{item.soNha}</h3>
                                <p className="card-subtitle">{item.loaiCanHo}</p>

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
                            {/* <div className="card-footer">
                                <button className="btn-action edit">{t('apartment_table.edit')}</button>
                                <button className="btn-action delete">{t('apartment_table.delete')}</button>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW MODE: LIST (Dạng bảng cũ) */}
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
                                <th>{t('apartment_table.action') || "Hành động"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApartments && filteredApartments.length > 0 ? (
                                filteredApartments.map((item) => (
                                    <tr key={item.idCanHo}>
                                        <td className="id-col">#{item.idCanHo}</td>
                                        <td className="highlight-text">{item.soNha}</td>
                                        <td>{item.loaiCanHo}</td>
                                        <td>{getStatusBadge(item.dienTich)}</td>
                                        <td>{item.dienTich} m²</td>
                                        <td className="address-col">{item.diaChi}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon edit" title="Edit">&#9998;</button>
                                                <button className="btn-icon delete" title="Delete">&#128465;</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">
                                        {t('apartment_table.no_data') || "Không tìm thấy dữ liệu"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Apartment;