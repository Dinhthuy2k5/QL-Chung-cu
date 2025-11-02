import React from "react";
import '../styles/settings-styles/Settings.scss'; // Sẽ tạo ở bước 2
import axios from "axios";
import { getToken } from "../services/localStorageService";

class Settings extends React.Component {
    state = {
        tenChungCu: 'Chung cư BlueMoon',
        diaChi: '123 Đường Văn Phú, Hà Đông, Hà Nội',
        sdt: '024 1234 5678',
        email: 'bql.bluemoon@example.com',
        isLoading: false
    };

    // (Giả lập) Lấy thông tin cài đặt hiện tại khi tải trang
    componentDidMount() {
        // const token = getToken();
        // const config = { headers: { 'Authorization': `Bearer ${token}` } };
        // axios.get('http://localhost:8080/qlcc/settings', config)
        //     .then(response => {
        //         this.setState({
        //             tenChungCu: response.data.result.tenChungCu,
        //             diaChi: response.data.result.diaChi,
        //             sdt: response.data.result.sdt,
        //             email: response.data.result.email,
        //         });
        //     })
        //     .catch(error => console.error("Lỗi khi tải cài đặt:", error));
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSaveSettings = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            this.setState({ isLoading: false });
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = {
            tenChungCu: this.state.tenChungCu,
            diaChi: this.state.diaChi,
            sdt: this.state.sdt,
            email: this.state.email
        };
        const apiUrl = `http://localhost:8080/qlcc/settings/update`; // API giả định

        try {
            // const response = await axios.post(apiUrl, data, config);
            console.log("Saving settings:", data);
            // Giả lập độ trễ
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert("Cập nhật thông tin thành công!");
            this.setState({ isLoading: false });
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Không thể lưu cài đặt.'}`);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { tenChungCu, diaChi, sdt, email, isLoading } = this.state;

        return (
            <div className="settings-container">
                <div className="settings-panel">
                    <div className="panel-header">
                        <h2>Cài đặt Chung</h2>
                        <p>Quản lý thông tin cơ bản của chung cư. Thông tin này sẽ được sử dụng trong các báo cáo và hóa đơn.</p>
                    </div>

                    <form className="settings-form" onSubmit={this.handleSaveSettings}>
                        <div className="form-group">
                            <label htmlFor="tenChungCu">Tên Chung cư</label>
                            <input
                                type="text"
                                name="tenChungCu"
                                id="tenChungCu"
                                value={tenChungCu}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="diaChi">Địa chỉ</label>
                            <input
                                type="text"
                                name="diaChi"
                                id="diaChi"
                                value={diaChi}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group-row"> {/* Layout 2 cột */}
                            <div className="form-group">
                                <label htmlFor="sdt">Số điện thoại BQL</label>
                                <input
                                    type="text"
                                    name="sdt"
                                    id="sdt"
                                    value={sdt}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Liên hệ</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="save-btn" disabled={isLoading}>
                                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Settings;