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
import StatisticByStatus from "../components/resident_component/StatisticByStatus";



class Resident extends React.Component {

    state = {
        listResidents: [

        ],

        isModalOpen: false,  //QUẢN LÝ MODAL
        editingResident: null,      //Lưu thông tin người đang được sửa
        isAddResident: false, // quản lí khi thêm nhân khẩu 
        isUpdateResident: false,  // quản lí khi update nhân khẩu
        isDropdownStatistic: false,
        isDropdownQuery: false,
        // Thêm state để lưu trữ query tìm kiếm
        searchQuery: {
            text: '',
            category: 'hoVaTen'
        }
    }

    // Hàm nhận query từ SearchBar và cập nhật state
    handleSearch = (query) => {
        this.setState({ searchQuery: query });
    }

    // hàm xóa 1 nhân khẩu
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

    // hàm thêm hoặc update nhân khẩu
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

    // hàm gọi api lấy thông tin nhân khẩu
    getListResidents = async () => {
        const token = getToken();
        if (!token) {
            alert(" Phiên đăng nhập hết hạn");
            return;
        }

        const config = {
            headers: {
                'Authorization': `bearer ${token}`
            }
        }
        const apiUrl = `http://localhost:8080/qlcc/nhan-khau`;
        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lấy thông tin nhân khẩu thành công");
            this.setState({
                listResidents: response.data.result
            })

        } catch (error) {
            console.log("Có lỗi khi lấy thông tin nhân khẩu", error.response ? error.response.data : error.message);
        }
    }

    componentDidMount = () => {
        this.getListResidents();
    }

    render() {

        const { listResidents, searchQuery } = this.state;

        // --- LOGIC LỌC ---
        // Lọc danh sách cư dân ngay trước khi render
        const filteredResidents = listResidents.filter(resident => {
            const searchText = searchQuery.text.toLowerCase();
            const searchCategory = searchQuery.category;

            if (!searchText) {
                return true; // Nếu không có text tìm kiếm, hiển thị tất cả
            }

            const residentData = resident[searchCategory];
            if (residentData) {
                return residentData.toString().toLowerCase().includes(searchText);
            }
            return false;
        });


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
                        <ListResidents listResidents={filteredResidents}
                            deleteAResident={this.deleteAResident}
                            handleOpenEditModal={this.handleOpenEditModal}
                            handleAddResident={this.handleAddResident}
                            onSearch={this.handleSearch}
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