import React, { useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../../styles/apartment-styles/EditFilter.scss';
import { useTranslation } from "react-i18next"; // Import hook

// Đã chuyển sang Function Component để dùng hook
function EditFilter(props) {
    const { t } = useTranslation(); // Lấy hàm dịch

    const [currentView, setView] = useState('main');
    const [filters, setFilters] = useState({
        soNha: "",
        dienTich: [20, 150],
        loaiCanHo: []
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    }

    const handleLoaiCanHoChange = (type) => {
        let { loaiCanHo } = filters;
        if (loaiCanHo.includes(type)) {
            loaiCanHo = loaiCanHo.filter(item => item !== type);
        } else {
            loaiCanHo = [...loaiCanHo, type];
        }
        handleFilterChange('loaiCanHo', loaiCanHo);
    }

    const handleReset = () => {
        setFilters({
            soNha: "",
            dienTich: [20, 150],
            loaiCanHo: []
        });
    }

    const handleApplyFilter = () => {
        props.onApplyFilter(filters);
        props.onClose();
        handleReset(); // Reset sau khi áp dụng
    }

    // Render màn hình chính
    const renderMainView = () => {
        const loaiCanHoOptions = ['Studio', '1PN', '2PN', '3PN', '3PN+1'];

        // Dùng key "filter.area_range" để dịch
        const dienTichValue = t('apartment_filter.area_range', {
            min: filters.dienTich[0],
            max: filters.dienTich[1]
        });

        return (
            <>
                <div className="filter-header">
                    <h3>{t('apartment_filter.title')}</h3>
                    <button className="close-button" onClick={props.onClose}>&times;</button>
                </div>
                <div className="filter-body">
                    <div className="form-group">
                        <label className="section-title">{t('apartment_filter.unit_number')}</label>
                        <input type="text"
                            value={filters.soNha}
                            onChange={(e) => handleFilterChange('soNha', e.target.value)}
                            placeholder={t('apartment_filter.unit_number_placeholder')}
                        />
                    </div>
                    <div className="form-group">
                        <label className="section-title">{t('apartment_filter.area')}</label>
                        <div className="filter-row" onClick={() => setView('area')}>
                            <span>{dienTichValue}</span>
                            <span className="arrow-icon">&gt;</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="section-title">{t('apartment_filter.apartment_type')}</label>
                        <div className="options-group button-group">
                            {loaiCanHoOptions.map(type => (
                                <div key={type} className="checkbox-item">
                                    <button key={type}
                                        className={`option-button ${filters.loaiCanHo.includes(type) ? 'active' : ''}`}
                                        onClick={() => handleLoaiCanHoChange(type)}>
                                        {type}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="filter-footer">
                    <button className="reset-btn" onClick={handleReset}>{t('apartment_filter.reset')}</button>
                    <button className="apply-btn" onClick={handleApplyFilter}>{t('apartment_filter.apply')}</button>
                </div>
            </>
        );
    }

    // Render màn hình chọn diện tích
    const renderAreaView = () => {
        const { dienTich } = filters;
        return (
            <>
                <div className="filter-header sub-header">
                    <button className="back-button" onClick={() => setView('main')}>&larr;</button>
                    <h3>{t('apartment_filter.area_select_title')}</h3>
                    <button className="close-button" onClick={props.onClose}>&times;</button>
                </div>
                <div className="filter-body area-slider-body">
                    <div className="area-display">
                        <div className="area-box">{t('apartment_filter.from')}: <span>{dienTich[0]}m²</span></div>
                        <div className="area-box">{t('apartment_filter.to')}: <span>{dienTich[1]}m²</span></div>
                    </div>
                    <Slider
                        range
                        min={0}
                        max={500}
                        value={dienTich}
                        onChange={(value) => handleFilterChange('dienTich', value)}
                        tipFormatter={value => `${value}m²`}
                        allowCross={false}
                    />
                </div>
                <div className="filter-footer">
                    <button className="apply-btn" onClick={() => setView('main')}>{t('apartment_filter.confirm')}</button>
                </div>
            </>
        );
    }

    // --- Render chính của component ---
    if (!props.show) {
        return null;
    }

    return (
        <div className="filter-container" onClick={props.onClose}>
            <div className="filter-content" onClick={e => e.stopPropagation()}>
                {currentView === 'main' ? renderMainView() : renderAreaView()}
            </div>
        </div>
    );
}

export default EditFilter;