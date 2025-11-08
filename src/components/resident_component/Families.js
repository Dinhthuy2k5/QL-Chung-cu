import React, { useState, useEffect, useCallback } from "react";
import '../../styles/resident-styles/Families.scss';
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import { useTranslation } from "react-i18next"; // Import hook

// Đã chuyển sang Function Component
function Families() {
    // Lấy hàm dịch 't'
    const { t } = useTranslation();
    const [listFamilies, setListFamilies] = useState([]);

    // useCallback để tránh tạo lại hàm getListFamilies mỗi lần render
    const getListFamilies = useCallback(async () => {
        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh`;
            const response = await axios.get(apiUrl, config);
            console.log("Lấy thông tin hộ gia đình thành công");
            setListFamilies(response.data.result || []);
        } catch (error) {
            console.log("Có lỗi khi lấy thông tin hộ gia đình", error.response ? error.response.data : error.message);
        }
    }, [t]); // Thêm 't' vào dependency array của useCallback

    // Tương đương componentDidMount
    useEffect(() => {
        getListFamilies();
    }, [getListFamilies]);

    const handleChangeHouseholder = async (currentCccdChuHo) => {
        const cccdNhanKhauMoi = window.prompt(t('families_page.prompts.enter_new_owner_cccd'));
        if (!cccdNhanKhauMoi) {
            alert(t('families_page.alerts.action_cancelled'));
            return;
        }

        const token = getToken();
        if (!token) {
            alert(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const data = { cccdNhanKhauMoi: cccdNhanKhauMoi };

        try {
            const apiUrl = `http://localhost:8080/qlcc/ho-gia-dinh/change-chu-ho/${currentCccdChuHo}`;
            const response = await axios.post(apiUrl, data, config);
            console.log("Thay đổi chủ hộ thành công", response.data);
            alert(t('families_page.alerts.owner_change_success'));
            getListFamilies(); // Tải lại danh sách sau khi thay đổi thành công
        } catch (error) {
            console.log("Có lỗi khi thay đổi chủ hộ", error.response ? error.response.data : error.message);
            // Bạn cũng nên hiển thị lỗi này cho người dùng, có thể dịch nó
            alert(error.response?.data?.message || "Đã có lỗi xảy ra.");
        }
    }

    return (
        <div className="family-list-container">
            <div className="family-list-header">
                <div />
                <button className="add-family-btn">
                    {t('families_page.add_button')}
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        {/* Dịch toàn bộ tiêu đề bảng */}
                        <th>{t('families_page.table_headers.head_cccd')}</th>
                        <th>{t('families_page.table_headers.head_name')}</th>
                        <th>{t('families_page.table_headers.apartment_id')}</th>
                        <th>{t('families_page.table_headers.member_count')}</th>
                        <th>{t('families_page.table_headers.phone')}</th>
                        <th>{t('families_page.table_headers.motorbikes')}</th>
                        <th>{t('families_page.table_headers.cars')}</th>
                        <th>{t('families_page.table_headers.address')}</th>
                        <th>{t('families_page.table_headers.status')}</th>
                        <th className="actions-header">{t('families_page.table_headers.actions')}</th>
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
                                    <button className="change-owner-btn" onClick={() => handleChangeHouseholder(family.cccdChuHo)}>
                                        {t('families_page.actions.change_owner_button')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">{t('families_page.no_data')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Families;