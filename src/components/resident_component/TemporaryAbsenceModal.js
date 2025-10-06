import React from "react";
import '../../styles/resident-styles/TemporaryAbsenceModal.scss'

class TemporaryAbsenceModal extends React.Component {

    state = {
        cccd: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        lyDo: '',
    };

    // Hàm chung để xử lý thay đổi trên các input
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang
        // Gửi dữ liệu từ state lên component cha
        this.props.onSubmit(this.state);
        // Reset form sau khi submit
        this.setState({ cccd: '', ngayBatDau: '', ngayKetThuc: '', lyDo: '' });
    }
    render() {

        if (this.props.show === false) return null;
        return (
            <div className="modal-overlay">
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3> Cấp Giấy Tạm Vắng</h3>
                        <button className="close-button" onClick={this.props.onClose}>&times;</button>
                    </div>

                    <form className="absence-form" onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="cccd">CCCD Cư dân</label>
                                <input
                                    type="text"
                                    id="cccd"
                                    name="cccd"
                                    value={this.state.cccd}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ngayBatDau">Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    id="ngayBatDau"
                                    name="ngayBatDau"
                                    value={this.state.ngayBatDau}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ngayKetThuc">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    id="ngayKetThuc"
                                    name="ngayKetThuc"
                                    value={this.state.ngayKetThuc}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lyDo">Lý do tạm vắng</label>
                                <textarea
                                    id="lyDo"
                                    name="lyDo"
                                    rows="4"
                                    value={this.state.lyDo}
                                    onChange={this.handleInputChange}
                                    required
                                ></textarea>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="submit-btn">Xác nhận</button>
                        </div>

                    </form>

                </div>

            </div>

        )
    }

}

export default TemporaryAbsenceModal;