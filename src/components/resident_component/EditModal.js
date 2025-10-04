import React from "react";
import '../../styles/resident-styles/EditModal.scss'; // Tạo file style cho modal

class EditModal extends React.Component {
    constructor(props) {
        super(props);
        // State nội bộ của modal để quản lý việc thay đổi input
        this.state = {
            formData: {}
        };
    }

    componentDidUpdate(prevProps) {
        // Khi props `resident` thay đổi, cập nhật lại state nội bộ `formData`
        // Nếu `resident` là null (trường hợp thêm mới), `formData` sẽ là object rỗng
        if (this.props.resident !== prevProps.resident) {
            this.setState({ formData: { ...this.props.resident } });
        }
    }

    // Xử lý khi người dùng nhập liệu vào các ô input
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    }

    // Xử lý khi nhấn nút Lưu
    handleSave = () => {
        this.props.onSave(this.state.formData);
    }

    render() {
        const { show, onClose, isAddResident } = this.props;
        const { formData } = this.state;

        // Nếu show là false, không render gì cả
        if (!show) {
            return null;
        }

        return (
            <div className="modal-backdrop">
                <div className="modal-content">
                    {/* 1. Thay đổi tiêu đề linh hoạt */}
                    <h3>{isAddResident ? 'Thêm nhân khẩu mới' : 'Chỉnh sửa thông tin cư dân'}</h3>
                    <div className="modal-body">
                        {isAddResident && (
                            <div className="form-group">
                                <label>CCCD:</label>
                                <input type="text" name="cccd" value={formData.cccd || ''} onChange={this.handleInputChange} />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Họ và Tên:</label>
                            <input type="text" name="hoVaTen" value={formData.hoVaTen || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Giới tính:</label>
                            <input type="text" name="gioiTinh" value={formData.gioiTinh || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Ngày Sinh:</label>
                            <input type="date" name="ngaySinh" value={formData.ngaySinh || ''} onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Dân tộc:</label>
                            <input type="text" name="danToc" value={formData.danToc || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Tôn giáo:</label>
                            <input type="text" name="tonGiao" value={formData.tonGiao || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label> Quốc tịch:</label>
                            <input type="text" name="quocTich" value={formData.quocTich || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ:</label>
                            <input type="text" name="diaChi" value={formData.diaChi || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input type="text" name="sdt" value={formData.sdt || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label> Email:</label>
                            <input type="text" name="email" value={formData.email || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Quan hệ :</label>
                            <input type="text" name="quanHe" value={formData.quanHe || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái :</label>
                            <input type="text" name="trangThai" value={formData.trangThai || ''} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>CCCD Chủ hộ:</label>
                            <input type="text" name="cccdChuHo" value={formData.cccdChuHo || ''} onChange={this.handleInputChange} />
                        </div>
                    </div>


                    {/* Thêm các trường khác tương tự nếu bạn muốn sửa */}

                    <div className="modal-actions">
                        <button className="save-btn" onClick={this.handleSave}>Lưu thay đổi</button>
                        <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditModal;