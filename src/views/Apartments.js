import React from "react";
import '../styles/apartment-styles/Apartment.scss'
import EditFilter from "../components/apartment_component/EditFilter";
import axios from 'axios';
import { getToken } from "../services/localStorageService";

class Apartment extends React.Component {
    state = {
        originalApartments: [],
        filteredApartments: [],

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
        // Luôn bắt đầu lọc từ danh sách gốc
        let filteredData = [...this.state.originalApartments];

        // 1. Lọc theo Số nhà (nếu có)
        if (filters.soNha) {
            filteredData = filteredData.filter(item =>
                item.soNha.toLowerCase().includes(filters.soNha.toLowerCase())
            );
        }

        // 2. Lọc theo Loại căn hộ (nếu có chọn)
        if (filters.loaiCanHo && filters.loaiCanHo.length > 0) {
            filteredData = filteredData.filter(item =>
                filters.loaiCanHo.includes(item.loaiCanHo)
            );
        }

        // 3. Lọc theo Diện tích
        // Giả sử filters.dienTich luôn là một mảng [min, max]
        filteredData = filteredData.filter(item =>
            item.dienTich >= filters.dienTich[0] && item.dienTich <= filters.dienTich[1]
        );

        // Cập nhật lại danh sách hiển thị
        this.setState({ filteredApartments: filteredData });
        // logic loc danh sach o day
    }

    //Dùng async/await để xử lý bất đồng bộ
    //hàm gọi api lấy thông tin căn hộ
    getListApartment = async () => {
        this.setState({
            originalApartments: this.props.listApartments,
            filteredApartments: this.props.listApartments
        })
        // const token = getToken();
        // if (!token) {
        //     alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        //     return;
        // }

        // const config = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     },
        // }
        // try {
        //     const apiUrl = `http://localhost:8080/qlcc/can-ho`;
        //     // Chờ cho đến khi axios gọi API xong và nhận được kết quả
        //     const response = await axios.get(apiUrl, config);

        //     console.log(" Lấy thông tin căn hộ thành công");
        //     console.log(response.data);
        //     this.setState({
        //         originalApartments: response.data.result,
        //         filteredApartments: response.data.result
        //     })
        //     this.setState({
        //         totalApartments: response.data.result.length
        //     })
        //     this.props.setTotalApartments(response.data.result.length)
        //     console.log("totalApartment", response.data.result.length)

        // } catch (error) {
        //     console.log("Có lỗi khi lấy thông tin căn hộ", error.response ? error.response.data : error.message)
        // }
    }

    componentDidMount = () => {
        this.getListApartment()
    }

    render() {
        let { filteredApartments } = this.state;



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
                            filteredApartments && filteredApartments.length > 0 &&
                            filteredApartments.map((item) => {
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