import React, { use } from "react";
import axios from "axios";
import '../styles/Change_Infor.scss'
import { getToken } from "../services/localStorageService";

class Change_Infor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            firstName: '', // Sẽ được lấy từ API
            lastName: '',  // Sẽ được lấy từ API
            dob: '',
            role: ''  //
        };
    }

    async componentDidMount() {
        // 2. Lấy token từ Local Storage
        const token = getToken();
        if (!token) {
            console.error("Không tìm thấy token, không thể lấy thông tin người dùng.");
            // Có thể thêm logic điều hướng về trang đăng nhập ở đây
            return;
        }

        // 3. Tạo header chứa token
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const apiUrl = `http://localhost:8080/qlcc/users/myInfo`;
        try {
            // 4. Gọi API với header và chờ kết quả
            const response = await axios.get(apiUrl, { headers: headers });

            // Lấy dữ liệu từ response.data.result (dựa theo cấu trúc API của bạn)
            const userInfo = response.data.result;

            console.log('Lấy thông tin thành công!', userInfo);

            // 5. Cập nhật state SAU KHI đã có dữ liệu
            this.setState({
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                // Định dạng lại ngày tháng để input type="date" có thể hiển thị
                dob: userInfo.dob ? userInfo.dob.split('T')[0] : '',
                role: userInfo.role
            });

        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy thông tin:', error.response ? error.response.data : error.message);
            alert("Không thể tải thông tin người dùng. Vui lòng thử lại.");
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Hàm xử lý khi form được submit
    handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn trang reload

        const { firstName, lastName, dob, currentPassword, newPassword } = this.state;

        // 1. TẠO ĐỐI TƯỢNG DATA CHỈ CHỨA CÁC TRƯỜNG CẦN GỬI
        const updateData = {
            password: newPassword,
            firstName: firstName,
            lastName: lastName,
            dob: dob

        };

        console.log("Dữ liệu sẽ được gửi lên server:", updateData);

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return;
        }

        // Tạo đối tượng config chứa header
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const apiUrl = `http://localhost:8080/qlcc/users/update`;

        try {
            // 3. SỬA LẠI CÚ PHÁP AXIOS.PUT CHO ĐÚNG
            // axios.put(url, data, config)
            const response = await axios.put(apiUrl, updateData, config);

            alert('Cập nhật thông tin thành công!');
            console.log("Server response:", response.data);

        } catch (error) {
            console.error('Lỗi khi cập nhật:', error.response ? error.response.data : error.message);
            // Hiển thị thông báo lỗi cụ thể từ server nếu có
            const errorMessage = error.response?.data?.message || "Có lỗi không xác định xảy ra.";
            alert('Cập nhật thất bại: ' + errorMessage);
        }
    }
    render() {
        return (
            <div className="change-info-container">
                {this.props.isChangeInfor === true &&
                    <form className="change-info-form" onSubmit={this.handleSubmit}>
                        <h2>Cập nhật thông tin cá nhân</h2>

                        {/* Các trường thông tin cá nhân */}
                        <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                                placeholder="Nhập họ của bạn"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Tên</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                                placeholder="Nhập tên của bạn"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Ngày sinh</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={this.state.dob}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <hr className="divider" />

                        {/* Các trường đổi mật khẩu */}
                        <div className="form-group">
                            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={this.state.currentPassword}
                                onChange={this.handleInputChange}
                                placeholder="Nhập để xác nhận thay đổi"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleInputChange}
                                placeholder="Bỏ trống nếu không muốn đổi"
                            />
                        </div>

                        <button type="submit" className="submit-btn">Lưu thay đổi</button>
                    </form>
                }
                {
                    this.props.isViewInfor === true &&
                    <form className="change-info-form" onSubmit={this.handleSubmit}>
                        <h2>Thông tin cá nhân</h2>

                        {/* Các trường thông tin cá nhân */}
                        <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={this.state.firstName}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Tên</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={this.state.lastName}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Ngày sinh</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={this.state.dob}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role"> Vai trò</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={this.state.role}
                            />
                        </div>


                        <hr className="divider" />




                    </form>
                }
            </div>
        )
    }
}

export default Change_Infor;