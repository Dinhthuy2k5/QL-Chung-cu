import React from "react";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import '../../styles/apartment-styles/EditFilter.scss'

class EditFilter extends React.Component {

    state = {
        soNha: "",
        loaiCanHo: [],
        dienTich: ""
    }

    handleInputChange = (event) => {
        this.setState({
            soNha: event.target.value
        })
    }
    // Hàm xử lý khi chọn/bỏ chọn loại căn hộ
    handleLoaiCanHoChange = (event) => {
        const { value, checked } = event.target;
        let { loaiCanHo } = this.state;
        if (checked) loaiCanHo = [...loaiCanHo, value];
        else {
            loaiCanHo = loaiCanHo.filter(item => item !== value)
        }
        this.setState({
            loaiCanHo: loaiCanHo
        })
    }

    handleDienTichChange = (event) => {
        this.setState({
            dienTich: event.target.value
        })
    }

    // Hàm áp dụng bộ lọc
    handleApplyFilter = () => {
        // Gửi state hiện tại lên component cha (Apartments)
        this.props.onApplyFilter(this.state);
        // Đóng modal
        this.props.onClose();
    }
    // Hàm reset bộ lọc
    handleReset = () => {
        this.setState({
            soNha: "",
            loaiCanHo: [],
            dienTich: ""
        })
    }


    render() {
        if (this.props.show !== true) {
            return null; // Nếu show là false, không render gì cả
        }

        const loaiCanHoOptions = ['Studio', '1PN', '2PN', '3PN+1'];
        return (
            <div className="filter-container" >
                <div className="filter-content">
                    <div className="filter-header">
                        <h3> Bộ lọc</h3>
                    </div>
                    <div className={"filter-body"}>

                        <div className="form-group">
                            <label>Số nhà</label>
                            <input type="text" name="sonha" value={this.state.soNha}
                                onChange={this.handleInputChange}
                                placeholder="Nhập số nhà ..." />
                        </div>
                        <div className="form-group">
                            <label> Loại căn hộ</label>
                            <div className="checkbox-group">
                                {
                                    loaiCanHoOptions.map(type => (
                                        <div key={type} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={type}
                                                value={type}
                                                checked={this.state.loaiCanHo.includes(type)}
                                                onChange={this.handleLoaiCanHoChange} />
                                            <label htmlFor="type"> {type}</label>
                                        </div>
                                    )
                                    )
                                }
                            </div>
                        </div>

                        <div className="form-group">
                            <label> Diện tích </label>
                            <div className="radio-group">
                                <div className="radio-item">
                                    <input type="radio" id="dt_all" name="dienTich" value="" checked={this.state.dienTich === ''} onChange={this.handleDienTichChange} />
                                    <label htmlFor="dt_all">Tất cả </label>
                                </div>

                                <div className="radio-item">
                                    <input type="radio" id="dt_duoi50" name="dienTich" value="<50" checked={this.state.dienTich === '<50'} onChange={this.handleDienTichChange} />
                                    <label htmlFor="dt_duoi50">Dưới 50m² </label>
                                </div>

                                <div className="radio-item">
                                    <input type="radio" id="dt_50_100" name="dienTich" value="50-100" checked={this.state.dienTich === '50-100'} onChange={this.handleDienTichChange} />
                                    <label htmlFor="dt_50_100">50m² - 100m² </label>
                                </div>

                                <div className="radio-item">
                                    <input type="radio" id="dt_tren100" name="dienTich" value=">100" checked={this.state.dienTich === '>100'} onChange={this.handleDienTichChange} />
                                    <label htmlFor="dt_tren100">Trên 100m² </label>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="filter-footer">
                        <button className="reset-btn" onClick={this.handleReset}> Đặt lại </button>
                        <button className="apply-btn" onClick={this.handleApplyFilter}> Xem kết quả </button>

                    </div>
                </div>

            </div>
        )
    }
}

export default EditFilter;