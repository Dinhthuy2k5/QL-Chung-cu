import React from "react";
import '../styles/resident-styles/Resident.scss'
import '../styles/resident-styles/List_Resident.scss'
import ListResidents from "../components/resident_component/ListResident";
import EditModal from "../components/resident_component/EditModal";
import axios from "axios";
import { getToken } from "../services/localStorageService";
// import { NavLink } from "react-router-dom";
import { NavLink, Routes, Route } from "react-router-dom";
import StatisticByGender from "../components/resident_component/StatisticByGender";
import StatisticByAge from "../components/resident_component/StatisticByAge";

const StatisticByStatus = () => {
    return <div style={{ color: 'white', padding: '20px' }}>Đây là khu vực hiển thị biểu đồ thống kê theo Tình trạng cư trú.</div>;
};

class Resident extends React.Component {



    state = {
        listResidents: [
            {
                cccd: '012345678901',
                hoVaTen: 'Nguyễn Văn An',
                gioiTinh: 'Nam',
                ngaySinh: '1990-01-15',
                danToc: 'Kinh',
                tonGiao: 'Không',
                quocTich: 'Việt Nam',
                diaChi: 'Số 10, ngõ 25, đường Xuân Thủy, Cầu Giấy, Hà Nội',
                sdt: '0912345678',
                email: 'nguyenvanan@example.com',
                quanHe: 'Chủ hộ',
                trangThai: 'Thường trú',
                cccdChuHo: '012345678901'
            },
            {
                cccd: '098765432102',
                hoVaTen: 'Trần Thị Bình',
                gioiTinh: 'Nữ',
                ngaySinh: '1992-05-20',
                danToc: 'Kinh',
                tonGiao: 'Phật giáo',
                quocTich: 'Việt Nam',
                diaChi: 'Số 10, ngõ 25, đường Xuân Thủy, Cầu Giấy, Hà Nội',
                sdt: '0987654321',
                email: 'tranthibinh@example.com',
                quanHe: 'Vợ',
                trangThai: 'Thường trú',
                cccdChuHo: '012345678901'
            },
            {
                cccd: '023456789013',
                hoVaTen: 'Lê Minh Cường',
                gioiTinh: 'Nam',
                ngaySinh: '1988-11-30',
                danToc: 'Kinh',
                tonGiao: 'Công giáo',
                quocTich: 'Việt Nam',
                diaChi: 'P.201, Tòa nhà A3, Chung cư Green Valley, Nam Từ Liêm, Hà Nội',
                sdt: '0905123456',
                email: 'leminhcuong@example.com',
                quanHe: 'Chủ hộ',
                trangThai: 'Thường trú',
                cccdChuHo: '023456789013'
            },
            {
                cccd: '034567890124',
                hoVaTen: 'Phạm Thị Dung',
                gioiTinh: 'Nữ',
                ngaySinh: '2000-07-22',
                danToc: 'Tày',
                tonGiao: 'Không',
                quocTich: 'Việt Nam',
                diaChi: 'P.201, Tòa nhà A3, Chung cư Green Valley, Nam Từ Liêm, Hà Nội',
                sdt: '0334567890',
                email: 'phamthidung@example.com',
                quanHe: 'Con',
                trangThai: 'Tạm trú',
                cccdChuHo: '023456789013'
            },
            {
                cccd: '045678901235',
                hoVaTen: 'Hoàng Văn Em',
                gioiTinh: 'Nam',
                ngaySinh: '1995-02-10',
                danToc: 'Mường',
                tonGiao: 'Không',
                quocTich: 'Việt Nam',
                diaChi: 'Số 55, đường Trần Duy Hưng, Trung Hòa, Hà Nội',
                sdt: '0978111222',
                email: 'hoangvanem@example.com',
                quanHe: 'Chủ hộ',
                trangThai: 'Thường trú',
                cccdChuHo: '045678901235'
            },
            {
                cccd: '056789012346',
                hoVaTen: 'Vũ Thị Lan Hương',
                gioiTinh: 'Nữ',
                ngaySinh: '1998-09-03',
                danToc: 'Kinh',
                tonGiao: 'Phật giáo',
                quocTich: 'Việt Nam',
                diaChi: 'Số 1, đường Nguyễn Trãi, Thanh Xuân, Hà Nội',
                sdt: '0945333444',
                email: 'vuthilanhuong@example.com',
                quanHe: 'Chủ hộ',
                trangThai: 'Thường trú',
                cccdChuHo: '056789012346'
            },
            {
                cccd: '067890123457',
                hoVaTen: 'Đặng Minh Khôi',
                gioiTinh: 'Nam',
                ngaySinh: '1975-12-12',
                danToc: 'Kinh',
                tonGiao: 'Không',
                quocTich: 'Việt Nam',
                diaChi: 'Số 1, đường Nguyễn Trãi, Thanh Xuân, Hà Nội',
                sdt: '0868555666',
                email: 'dangminhkhoi@example.com',
                quanHe: 'Chồng',
                trangThai: 'Thường trú',
                cccdChuHo: '056789012346'
            }
        ],

        isModalOpen: false,  //QUẢN LÝ MODAL
        editingResident: null,      //Lưu thông tin người đang được sửa
        isAddResident: false, // quản lí khi thêm nhân khẩu 
        isUpdateResident: false,  // quản lí khi update nhân khẩu
        isDropdownStatistic: false,
        isDropdownQuery: false
    }

    deleteAResident = (cccd) => {
        let currentResident = this.state.listResidents;
        currentResident = currentResident.filter(item => item.cccd !== cccd);
        this.setState({
            listResidents: currentResident
        })
    }

    // HÀM MỞ MODAL
    handleOpenEditModal = (resident) => {
        this.setState({
            isModalOpen: true,
            editingResident: resident,
            isAddResident: false,
            isUpdateResident: true
        })
    }

    // HÀM ĐÓNG MODAL
    handleClodeEditModal = () => {
        this.setState({
            isModalOpen: false,
            editingResident: null,
            isAddResident: false,
            isUpdateResident: false
        })
    }

    handleAddResident = () => {
        this.setState({
            isModalOpen: true,
            editingResident: null,
            isAddResident: true,
            isUpdateResident: false
        })
    }

    handleSaveResident = (residentData) => {
        // Nếu là thêm mới (không có cccd hoặc cccd chưa tồn tại)
        const isNew = !this.state.listResidents.some(item => item.cccd === residentData.cccd);

        if (isNew) {

            this.setState(prevState => ({
                listResidents: [...prevState.listResidents, residentData],
                isModalOpen: false,
                editingResident: null,
                isAddResident: false
            }))

            const token = getToken();
            if (!token) {
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                return;
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };


            const apiUrl = `http://localhost:8080/qlcc/nhan-khau`;
            axios.post(apiUrl, residentData, config)
                .then(response => {
                    console.log('Cập nhật thành công!', response.data);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi thêm nhân khẩu:', error.response ? error.response.data : error.message);
                });
            //Gọi API POST để thêm mới ở đây
        }
        else {
            // Logic cập nhật
            let currentResidents = [...this.state.listResidents];
            let index = currentResidents.findIndex(item => item.cccd === residentData.cccd);

            if (index !== -1) {
                currentResidents[index] = residentData; //cập nhật thông tin
                this.setState({
                    listResidents: currentResidents,
                    isModalOpen: false,
                    editingResident: null,
                    isUpdateResident: false
                })

                const apiUrl = `http://localhost:8080/qlcc/nhan-khau/${residentData.cccd}`;
                axios.put(apiUrl, residentData)
                    .then(response => {
                        console.log('Cập nhật thành công!', response.data);
                    })
                    .catch(error => {
                        console.error('Có lỗi xảy ra khi update nhân khẩu:', error.response ? error.response.data : error.message);
                    });
            }

        }
    }

    setIsDropdownStatistic = (temp) => {
        this.setState({
            isDropdownStatistic: temp
        })
    }

    setIsDropdownQuery = (temp) => {
        this.setState({
            isDropdownQuery: temp
        })
    }

    render() {

        const currentPath = window.location.pathname;
        const isStatisticActive = currentPath.startsWith('/residents/statistic');
        const isQueryActive = currentPath.startsWith('/residents/query');

        return (
            <div className="page-container">

                <div className="resident-menu">
                    <NavLink
                        to="/residents"
                        end // Thêm prop "end" để nó chỉ active khi URL là chính xác "/residents"
                        className={({ isActive }) => isActive ? "h4-navlink active-link" : "h4-navlink"}><h4> Danh sách cư dân</h4></NavLink>
                    <div
                        className="menu-item"
                        onMouseEnter={() => this.setIsDropdownStatistic(true)}
                        onMouseLeave={() => this.setIsDropdownStatistic(false)}
                    >
                        <h4 className={isStatisticActive ? "active-link" : ""}> Thống kê</h4>
                        {
                            this.state.isDropdownStatistic &&
                            <div className="dropdown-menu">
                                <NavLink to="statistic/by-gender" className="dropdown-item"
                                    onClick={() => this.setIsDropdownStatistic(false)}>
                                    Theo giới tính
                                </NavLink>
                                <NavLink to="statistic/by-age" className="dropdown-item"
                                    onClick={() => this.setIsDropdownStatistic(false)}>
                                    Theo độ tuổi
                                </NavLink>
                                <NavLink to="statistic/by-status" className="dropdown-item"
                                    onClick={() => this.setIsDropdownStatistic(false)}>
                                    Theo tinh trạng cư trú
                                </NavLink>

                            </div>
                        }
                    </div>


                    <div className="menu-item"
                        onMouseEnter={() => this.setIsDropdownQuery(true)}
                        onMouseLeave={() => this.setIsDropdownQuery(false)}>
                        <h4 className={isQueryActive ? "active-link" : ""}> Truy vấn</h4>
                        {
                            this.state.isDropdownQuery &&
                            <div className="dropdown-menu">
                                <NavLink to="query/search" className="dropdown-item"
                                    onClick={() => this.setIsDropdownQuery(false)}>
                                    Tìm kiếm thông tin
                                </NavLink>
                                <NavLink to="query/history" className="dropdown-item"
                                    onClick={() => this.setIsDropdownQuery(false)}>
                                    Xem lịch sử thay đổi nhân khẩu
                                </NavLink>

                            </div>
                        }

                    </div>

                </div>

                <Routes>
                    <Route index element={
                        <ListResidents listResidents={this.state.listResidents}
                            deleteAResident={this.deleteAResident}
                            handleOpenEditModal={this.handleOpenEditModal}
                            handleAddResident={this.handleAddResident}
                        />} />
                    {/* These are the routes for your statistic charts */}
                    <Route path="statistic/by-gender" element={<StatisticByGender />} />
                    <Route path="statistic/by-age" element={<StatisticByAge />} />
                    <Route path="statistic/by-status" element={<StatisticByStatus />} />

                    {/* Add routes for the "Truy vấn" section as well */}
                    {/* <Route path="query/search" element={<YourSearchComponent />} /> */}
                    {/* <Route path="query/history" element={<YourHistoryComponent />} /> */}
                </Routes>
                <EditModal
                    show={this.state.isModalOpen}
                    resident={this.state.editingResident}
                    onClose={this.handleClodeEditModal}
                    onSave={this.handleSaveResident}
                    isAddResident={this.state.isAddResident}
                    isUpdateResident={this.state.isUpdateResident}
                />

            </div>
        )
    }
}

export default Resident;