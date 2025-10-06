import React from "react";
import '../styles/apartment-styles/Apartment.scss'
import EditFilter from "../components/apartment_component/EditFilter";
import axios from 'axios';
import { getToken } from "../services/localStorageService";

class Apartment extends React.Component {
    state = {
        listApartments: [

        ],
        isEditFilter: false,
        activeFilters: {} // State mới để lưu các filter đang áp dụng
    }

    setIsEditFilter = (temp) => {
        this.setState({
            isEditFilter: temp
        })
    }

    // hàm lọc filter
    handleApplyFilter = (filters) => {
        this.setState({
            activeFilters: filters
        })
        // logic loc danh sach o day
    }

    //Dùng async/await để xử lý bất đồng bộ
    //hàm gọi api lấy thông tin căn hộ
    getListApartment = async () => {
        const token = getToken();
        if (!token) {
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            // params: {
            //     page: 0,  // Bắt đầu từ trang 0
            //     size: 10  // Lấy 10 căn hộ mỗi trang
            // }
        }
        try {
            const apiUrl = `http://localhost:8080/qlcc/can-ho`;
            // Chờ cho đến khi axios gọi API xong và nhận được kết quả
            const response = await axios.get(apiUrl, config);

            console.log(" Lấy thông tin căn hộ thành công");
            console.log(response.data);
            this.setState({
                listApartments: response.data.result
            })

        } catch (error) {
            console.log("Có lỗi khi lấy thông tin căn hộ", error.response ? error.response.data : error.message)
        }
    }

    componentDidMount = () => {
        this.getListApartment()
    }

    render() {
        let { listApartments } = this.state;

        return (
            <div className="apartment-container">
                <div className="table-actions">
                    <button className="filter-btn" onClick={() => this.setIsEditFilter(true)}>
                        <span className="icon">&#128269;</span> Lọc
                    </button>
                    <EditFilter show={this.state.isEditFilter}
                        onClose={() => { this.setIsEditFilter(false) }}
                        onApplyFilter={this.handleApplyFilter} />
                </div>
                <div className="apartment-table-container">
                    <div className="apartment-header-row">




                        <h4>Id Căn hộ</h4>
                        <h4>Số nhà</h4>
                        <h4>Loại căn hộ</h4>
                        <h4>Diện tích</h4>
                        <h4>Địa chỉ</h4>
                    </div>

                    <div className="apartment-table-body">
                        {
                            listApartments && listApartments.length > 0 &&
                            listApartments.map((item) => {
                                return (
                                    <div className="apartment-data-row" key={item.idCanHo}>
                                        <div>{item.idCanHo} </div>
                                        <div> {item.soNha} </div>
                                        <div>  {item.loaiCanHo} </div>
                                        <div> {item.dienTich} </div>
                                        <div> {item.diaChi}</div>

                                    </div>
                                )

                            })
                        }
                    </div>
                </div>
            </div>
        )


    }
}

export default Apartment;