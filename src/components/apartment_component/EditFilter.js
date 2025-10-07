import React from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../../styles/apartment-styles/EditFilter.scss'

class EditFilter extends React.Component {

    state = {
        currentView: 'main',  // Quản lý màn hình hiển thị: 'main' hoặc 'area'
        filters: {
            soNha: "",
            dienTich: [20, 150], // Giá trị mặc định: từ 20m² đến 150m²
            loaiCanHo: []

        }
    }
    // Chuyển đổi giữa các màn hình
    setView = (view) => {
        this.setState({
            currentView: view
        })
    }
    handleFilterChange = (filterName, value) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [filterName]: value,

            }
        }))
    }

    // Hàm xử lý khi chọn/bỏ chọn loại căn hộ
    handleLoaiCanHoChange = (type) => {
        let { loaiCanHo } = this.state.filters;
        if (loaiCanHo.includes(type)) {
            loaiCanHo = loaiCanHo.filter(item => item !== type)
        }
        else {
            loaiCanHo = [...loaiCanHo, type];
        }
        this.handleFilterChange('loaiCanHo', loaiCanHo);
    }

    // Hàm áp dụng bộ lọc
    handleApplyFilter = () => {
        // Gửi state hiện tại lên component cha (Apartments)
        console.log("filters:", this.state.filters);
        this.props.onApplyFilter(this.state.filters);
        // Đóng modal
        this.props.onClose();
        this.handleReset();
    }
    // Hàm reset bộ lọc
    handleReset = () => {
        this.setState({
            filters: {
                soNha: "",
                dienTich: [20, 150], // Giá trị mặc định: từ 20m² đến 150m²
                loaiCanHo: []
            }
        })
    }

    // Render màn hình chính
    renderMainView() {
        const { filters } = this.state;
        const loaiCanHoOptions = ['Studio', '1PN', '2PN', '3PN', '3PN+1'];
        const dienTichValue = `Từ ${filters.dienTich[0]}m² - ${filters.dienTich[1]}m²`;

        return (
            <>
                <div className="filter-header">
                    <h3> Bộ lọc</h3>
                    <button className="close-button" onClick={this.props.onClose}>&times;</button>
                </div>
                <div className={"filter-body"}>

                    <div className="form-group">
                        <label className="section-title">Số nhà</label>
                        <input type="text"
                            value={filters.soNha}
                            onChange={(e) => this.handleFilterChange('soNha', e.target.value)}
                            placeholder="Nhập số nhà ..." />
                    </div>
                    <div className="form-group">
                        <label className="section-title">Diện tích </label>
                        <div className="filter-row" onClick={() => this.setView('area')}>
                            <span>{dienTichValue}</span>
                            <span className="arrow-icon">&gt;</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="section-title"> Loại căn hộ</label>
                        <div className="options-group button-group">
                            {
                                loaiCanHoOptions.map(type => (
                                    <div key={type} className="checkbox-item">
                                        <button key={type}
                                            className={`option-button ${filters.loaiCanHo.includes(type) ? 'active' : ''}`}
                                            onClick={() => this.handleLoaiCanHoChange(type)}>
                                            {type}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="filter-footer">
                    <button className="reset-btn" onClick={this.handleReset}> Đặt lại </button>
                    <button className="apply-btn" onClick={this.handleApplyFilter}> Xem kết quả </button>
                </div>
            </>
        )
    }

    // Render màn hình chọn diện tích
    renderAreaView() {
        const { dienTich } = this.state.filters;
        return (
            <>
                <div className="filter-header sub-header">
                    <button className="back-button" onClick={() => this.setView('main')}>&larr;</button>
                    <h3> Chọn diện tích</h3>
                    <button className="close-button" onClick={this.props.onClose}>&times; </button>
                </div>

                <div className="filter-body area-slider-body">
                    <div className="area-display">
                        <div className="area-box" > Từ <span>{dienTich[0]}m²</span> </div>
                        <div className="area-box" > Đến <span>{dienTich[1]}m²</span> </div>
                    </div>

                    <Slider
                        range
                        min={0}
                        max={500}
                        value={dienTich}
                        onChange={(value) => { this.handleFilterChange('dienTich', value) }}
                        tipFormatter={value => `${value}m²`}
                        allowCross={false}
                    />
                </div>

                <div className="filter-footer">
                    <button className="apply-btn" onClick={() => this.setView('main')}>Xác nhận</button>
                </div>
            </>

        )
    }


    render() {
        if (this.props.show !== true) {
            return null; // Nếu show là false, không render gì cả
        }

        return (
            <div className="filter-container" >
                <div className="filter-content">

                    {this.state.currentView === 'main' ? this.renderMainView() : this.renderAreaView()}

                </div>

            </div>
        )
    }
}

export default EditFilter;