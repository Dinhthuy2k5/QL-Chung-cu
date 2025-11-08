import React from "react";
import '../../styles/resident-styles/List_Resident.scss'
import SearchBar from "./SearchBar";
import TemporaryAbsenceModal from "./TemporaryAbsenceModal";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import TemporaryAddressModal from "./TemporaryAddressModal";

import { withTranslation } from 'react-i18next';

class ListResidents extends React.Component {

    state = {
        isTemporaryAbsence: false,
        isTemporaryAddress: false
    }

    setIsTemporaryAbsence = (temp) => {
        this.setState({
            isTemporaryAbsence: temp
        })
    }

    setIsTemporaryAddress = (temp) => {
        this.setState({
            isTemporaryAddress: temp
        })
    }

    // 2. Thêm hàm xử lý khi form tạm vắng được submit
    handleGrantAbsence = async (formData) => {
        const { t } = this.props;
        console.log("Dữ liệu tạm vắng:", formData);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = {
            headers: {
                'Authorization': `bearer ${token}`
            }
        }
        // Tại đây, bạn sẽ gọi API để gửi dữ liệu lên backend
        const apiUrl = `http://localhost:8080/qlcc/tam-vang`;
        const data = {
            "cccd": formData.cccd,
            "ngayBatDau": formData.ngayBatDau,
            "ngayKetThuc": formData.ngayKetThuc,
            "lyDo": formData.lyDo
        };

        console.log("data: ", data);
        try {
            const response = await axios.post(apiUrl, data, config);

            console.log("Gửi thông tin tạm vắng thành công", response.data);
            alert(t('resident_list.alerts.absence_success'));


        } catch (error) {
            console.log("Có lỗi khi gửi thông tin tạm vắng", error.response ? error.response.data : error.message);
        }

        // Sau khi xử lý xong, đóng modal
        this.setIsTemporaryAbsence(false);
    }

    // 2. Thêm hàm xử lý khi form tạm trú được submit
    handleGrantAddress = async (formData) => {
        const { t } = this.props;
        console.log("Dữ liệu tạm trú:", formData);

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = {
            headers: {
                'Authorization': `bearer ${token}`
            }
        }
        const apiUrl = `http://localhost:8080/qlcc/tam-tru`;
        const data = {
            "cccd": formData.cccd,
            "hoVaTen": formData.hoVaTen,
            "idCanHo": formData.idCanHo,
            "ngayBatDau": formData.ngayBatDau,
            "ngayKetThuc": formData.ngayKetThuc,
            "lyDo": formData.lyDo
        };

        console.log("data: ", data);
        try {
            const response = await axios.post(apiUrl, data, config);

            console.log("Gửi thông tin tạm trú thành công", response.data);
            alert(t('resident_list.alerts.address_success'));


        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : "Error";
            console.log("Có lỗi khi gửi thông tin tạm trú", errorMsg);
            alert(`${t('resident_list.alerts.address_fail')}: ${errorMsg}`);
        }

        // Sau khi xử lý xong, đóng modal
        this.setIsTemporaryAddress(false);
    }

    render() {

        const { listResidents, deleteAResident, handleOpenEditModal, handleAddResident, onSearch, t } = this.props;
        console.log(listResidents);
        return (
            <div className="list-resident-container">
                <div className="list-resident-header">
                    <SearchBar onSearch={onSearch} />
                    <button className="add-resident-btn" onClick={() => this.setIsTemporaryAbsence(true)} >
                        {t('resident_list.temp_absence_button')}
                    </button>
                    <button className="add-resident-btn" onClick={() => this.setIsTemporaryAddress(true)}>
                        {t('resident_list.temp_residence_button')}
                    </button>
                    <button className="add-resident-btn" onClick={handleAddResident}>
                        {t('resident_list.add_resident_button')}
                    </button>

                    <TemporaryAbsenceModal
                        show={this.state.isTemporaryAbsence}
                        onClose={() => this.setIsTemporaryAbsence(false)}
                        onSubmit={this.handleGrantAbsence} />
                    <TemporaryAddressModal
                        show={this.state.isTemporaryAddress}
                        onClose={() => this.setIsTemporaryAddress(false)}
                        onSubmit={this.handleGrantAddress}
                    />


                </div>
                <table>
                    <thead><tr>
                        {/* <th onMouseEnter={()=> this.setIsFilter(true)}
                        onMouseLeave={()=>this.setIsFilter(false)}> Lọc </th> */}
                        <th>{t('resident_list.table_header.cccd')}</th>
                        <th>{t('resident_list.table_header.head_cccd')}</th>

                        <th>{t('resident_list.table_header.name')}</th>
                        <th>{t('resident_list.table_header.dob')}</th>
                        <th>{t('resident_list.table_header.gender')}</th>
                        <th>{t('resident_list.table_header.ethnicity')}</th>
                        <th>{t('resident_list.table_header.religion')}</th>
                        <th>{t('resident_list.table_header.phone')}</th>
                        <th>{t('resident_list.table_header.relationship')}</th>

                        <th className="actions-header">{t('resident_list.table_header.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            listResidents && listResidents.length > 0 ?
                                listResidents.map((item, index) => {
                                    return (
                                        <tr key={item.cccd}>
                                            <td>{item.cccd}</td>
                                            <td>{item.cccdChuHo}</td>

                                            <td>{item.hoVaTen}</td>
                                            <td>{item.ngaySinh}</td>
                                            <td>{item.gioiTinh}</td>
                                            <td>{item.danToc}</td>
                                            <td>{item.tonGiao}</td>
                                            <td>{item.sdt}</td>
                                            <td>{item.quanHe}</td>

                                            <td className="action">
                                                <button className="edit-btn" onClick={() => handleOpenEditModal(item)}>Edit</button>

                                                <button className="delete-btn" onClick={() => deleteAResident(item.cccd)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="8">{t('resident_list.no_data')}</td>
                                </tr>

                        }
                    </tbody>
                </table>
            </div >
        )
    }
}

export default withTranslation()(ListResidents);