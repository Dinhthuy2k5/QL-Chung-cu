import React from "react";
import '../../styles/resident-styles/Families.scss'; // We will create this file next
import axios from "axios";
import { getToken } from "../../services/localStorageService";

class Families extends React.Component {
    state = {
        listFamilies: [], // Initialize with an empty array
    };

    // Function to get the list of families from the API
    getListFamilies = async () => {
        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh`; // API endpoint for families
            const response = await axios.get(apiUrl, config);
            console.log("Lấy thông tin hộ gia đình thành công");
            this.setState({
                listFamilies: response.data.result
            });
        } catch (error) {
            console.log("Có lỗi khi lấy thông tin hộ gia đình", error.response ? error.response.data : error.message);
        }
    }

    componentDidMount() {
        this.getListFamilies();
    }

    handleChangeHouseholder = async (currentCccdChuHo) => {
        // 1. Hỏi người dùng CCCD của chủ hộ mới
        const cccdNhanKhauMoi = window.prompt("Nhập CCCD của thành viên sẽ làm chủ hộ mới:");
        // 2. Kiểm tra nếu người dùng không nhập hoặc nhấn "Cancel"
        if (!cccdNhanKhauMoi) {
            alert("Thao tác bị hủy bỏ");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn.");
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const data = {
            cccdNhanKhauMoi: cccdNhanKhauMoi
        };


        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh/change-chu-ho/${currentCccdChuHo}`; // API endpoint for families
            const response = await axios.post(apiUrl, data, config);
            console.log("Thay đổi chủ hộ thành công", response.data);
            alert("Đã thay đổi chủ hộ thành công!");

            this.getListFamilies();

        } catch (error) {
            console.log("Có lỗi khi thay đổi chủ hộ", error.response ? error.response.data : error.message);
        }

    }

    render() {
        const { listFamilies } = this.state;

        return (
            <div className="family-list-container">
                <div className="family-list-header">
                    {/* You can add a SearchBar or other buttons here later */}
                    <div /> {/* Placeholder for layout */}
                    <button className="add-family-btn">
                        Thêm hộ gia đình
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>CCCD Chủ hộ</th>
                            <th>Họ tên Chủ hộ</th>
                            <th>ID Căn hộ</th>
                            <th>Số thành viên</th>
                            <th>Số điện thoại</th>
                            <th>Số xe máy</th>
                            <th>Số ô tô</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th className="actions-header">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFamilies && listFamilies.length > 0 ? (
                            listFamilies.map((family) => (
                                <tr key={family.cccdChuHo}>
                                    <td>{family.cccdChuHo}</td>
                                    <td>{family.hoTenChuHo}</td>
                                    <td>{family.idCanHo}</td>
                                    <td>{family.soThanhVien}</td>
                                    <td>{family.sdt}</td>
                                    <td>{family.soXeMay}</td>
                                    <td>{family.soOto}</td>
                                    <td>{family.diaChi}</td>
                                    <td>{family.trangThai}</td>
                                    <td className="action">
                                        <button className="change-owner-btn" onClick={() => this.handleChangeHouseholder(family.cccdChuHo)}>Thay đổi chủ hộ</button>
                                        {/* <button className="delete-btn" onClick={() => this.handleDeleteFamily(family.cccdChuHo)}>Delete</button> */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Không có dữ liệu để hiển thị</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Families;