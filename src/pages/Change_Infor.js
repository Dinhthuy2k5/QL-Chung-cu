import React from "react";
import axios from "axios";
import '../styles/Change_Infor.scss';
import { getToken } from "../services/localStorageService";
// 1. Import HOC "withTranslation"
import { withTranslation } from "react-i18next";

class Change_Infor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            firstName: '',
            lastName: '',
            dob: '',
            role: ''
        };
    }

    async componentDidMount() {
        // 2. Lấy hàm 't' từ props
        const { t } = this.props;
        const token = getToken();
        if (!token) {
            console.error("Không tìm thấy token, không thể lấy thông tin người dùng.");
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        const apiUrl = `http://localhost:8080/qlcc/users/myInfo`;

        try {
            const response = await axios.get(apiUrl, { headers: headers });
            const userInfo = response.data.result;
            console.log('Lấy thông tin thành công!', userInfo);

            this.setState({
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                dob: userInfo.dob ? userInfo.dob.split('T')[0] : '',
                role: userInfo.role
            });

        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy thông tin:', error.response ? error.response.data : error.message);
            // 3. Dịch alert
            alert(t('user_profile.alert_load_fail'));
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        // 4. Lấy hàm 't' từ props
        const { t } = this.props;
        const { firstName, lastName, dob, currentPassword, newPassword } = this.state;

        const updateData = {
            password: newPassword,
            firstName: firstName,
            lastName: lastName,
            dob: dob
        };

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/users/update`;

        try {
            const response = await axios.put(apiUrl, updateData, config);
            // 5. Dịch các alert
            alert(t('user_profile.alert_update_success'));
            console.log("Server response:", response.data);
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.message || "Có lỗi không xác định xảy ra.";
            alert(t('user_profile.alert_update_fail') + ': ' + errorMessage);
        }
    }

    render() {
        // 6. Lấy hàm 't' từ props để dùng trong render
        const { t } = this.props;

        return (
            <div className="change-info-container">
                {this.props.isChangeInfor === true &&
                    <form className="change-info-form" onSubmit={this.handleSubmit}>
                        <h2>{t('user_profile.title_edit')}</h2>

                        {/* Các trường thông tin cá nhân */}
                        <div className="form-group">
                            <label htmlFor="firstName">{t('user_profile.label_firstname')}</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                                placeholder={t('user_profile.placeholder_firstname')}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">{t('user_profile.label_lastname')}</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                                placeholder={t('user_profile.placeholder_lastname')}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">{t('user_profile.label_dob')}</label>
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
                            <label htmlFor="currentPassword">{t('user_profile.label_current_password')}</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={this.state.currentPassword}
                                onChange={this.handleInputChange}
                                placeholder={t('user_profile.placeholder_current_password')}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">{t('user_profile.label_new_password')}</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleInputChange}
                                placeholder={t('user_profile.placeholder_new_password')}
                            />
                        </div>

                        <button type="submit" className="submit-btn">{t('user_profile.save_button')}</button>
                    </form>
                }
                {
                    this.props.isViewInfor === true &&
                    <form className="change-info-form" onSubmit={(e) => e.preventDefault()}>
                        <h2>{t('user_profile.title_view')}</h2>

                        {/* Các trường thông tin cá nhân (chỉ xem) */}
                        <div className="form-group">
                            <label htmlFor="firstName">{t('user_profile.label_firstname')}</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={this.state.firstName}
                                readOnly // Thêm readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">{t('user_profile.label_lastname')}</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={this.state.lastName}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">{t('user_profile.label_dob')}</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={this.state.dob}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">{t('user_profile.label_role')}</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={this.state.role}
                                readOnly
                            />
                        </div>
                        <hr className="divider" />
                    </form>
                }
            </div>
        )
    }
}

// 7. Bọc component với HOC "withTranslation"
export default withTranslation()(Change_Infor);