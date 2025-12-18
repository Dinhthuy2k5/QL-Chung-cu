import React, { useState, useEffect } from "react";
// Bỏ import { error } from "three"; vì nó không cần thiết và sai
import { getToken } from "../../../services/localStorageService";
import '../../../styles/receipt-styles/MandatoryFeeListnew.scss'
import axios from "axios";
// 1. Import hook
import { useTranslation } from "react-i18next";

// 2. Chuyển sang Function Component
function MandatoryFeeList({ cache, setCache }) {

    // 3. Lấy hàm 't'
    const { t } = useTranslation();

    // 4. Chuyển đổi state
    // 1. KHỞI TẠO STATE TỪ CACHE (Nếu có cache thì dùng, không thì rỗng)
    const [idThoiGianThu, setIdThoiGianThu] = useState(cache?.id || '');
    const [feeData, setFeeData] = useState(cache?.data || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);




    // 5. Chuyển đổi các hàm
    const handleInputChange = (event) => {
        setIdThoiGianThu(event.target.value);
    }

    const handleGenerateList = async () => {
        if (!idThoiGianThu) {
            alert(t('mandatory_fee_list.alert_time_id_required'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setFeeData(null);

        const token = getToken();
        if (!token) {
            setIsLoading(false);
            setError(t('alerts.session_expired'));
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const apiUrl = `http://localhost:8080/qlcc/phi/phi-bat-buoc/${idThoiGianThu}`;

        try {
            const response = await axios.get(apiUrl, config);
            console.log("Lập danh sách thành công:", response.data);

            let paidCount = 0;
            if (response.data.result && response.data.result.danhSachTongThanhToan) {
                paidCount = response.data.result.danhSachTongThanhToan.filter(
                    item => item.trangThai === 'DA_THANH_TOAN'
                ).length;
            }

            const newData = {
                ...response.data.result,
                paidApartmentCount: paidCount
            };

            setFeeData(newData);

            // 2. QUAN TRỌNG: CẬP NHẬT NGƯỢC LẠI VÀO CACHE Ở FILE CHA
            if (setCache) {
                setCache({
                    id: idThoiGianThu,
                    data: newData
                });
            }
            setIsLoading(false);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : t('mandatory_fee_list.error_loading_generic');
            console.error(t('mandatory_fee_list.error_loading'), errorMessage);
            setError(`${t('mandatory_fee_list.error_loading_prefix')}: ${errorMessage}`);
            setIsLoading(false);
        }
    }

    const formatCurrency = (number) => {
        return (number || 0).toLocaleString('vi-VN'); // Bỏ 'đ' để Excel dễ tính toán nếu cần
    }

    // HÀM : Format ngày tháng từ yyyy-mm-dd sang dd/mm/yyyy
    const formatDate = (dateString) => {
        if (!dateString) return "";
        // Giả sử dateString có dạng "2025-10-26"
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`; // Trả về 26/10/2025
        }
        return dateString;
    }

    // HÀM XUẤT BÁO CÁO ĐƯỢC VIẾT LẠI CHUYÊN NGHIỆP
    const handleExportReport = () => {
        if (!feeData) {
            alert(t('mandatory_fee_list.export_alert_no_data'));
            return;
        }

        // Lấy ngày hiện tại
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        // Lấy tên người dùng
        const currentUser = localStorage.getItem("user") || "Admin";

        // Hàm giúp escape ký tự đặc biệt cho CSV
        const e = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

        // Tạo cấu trúc dữ liệu theo dòng
        const rows = [];

        // 1. Header: Thông tin đơn vị & Quốc hiệu
        rows.push([e(t('mandatory_fee_list.csv.company_name')), "", "", "", e(t('mandatory_fee_list.csv.motto_1'))]);
        rows.push([e(t('mandatory_fee_list.csv.company_address')), "", "", "", e(t('mandatory_fee_list.csv.motto_2'))]);
        rows.push([e(t('mandatory_fee_list.csv.company_phone')), "", "", "", "-------------------"]);
        rows.push([]);

        // 2. Tiêu đề báo cáo
        rows.push(["", "", e(t('mandatory_fee_list.csv.title'))]);
        rows.push(["", "", e(`${t('mandatory_fee_list.csv.report_period')} ${idThoiGianThu}`)]);
        rows.push(["", "", e(`${t('mandatory_fee_list.csv.created_at')} ${day} ${t('mandatory_fee_list.csv.month')} ${month} ${t('mandatory_fee_list.csv.year')} ${year}`)]);
        rows.push([]);

        // 3. Thông tin tóm tắt (SỬ DỤNG formatDate Ở ĐÂY)
        rows.push([e(t('mandatory_fee_list.csv.summary_section'))]);
        // Chèn thêm dấu nháy đơn (') hoặc khoảng trắng để Excel hiểu là text, hoặc dùng formatDate để chuẩn hóa
        rows.push([e(t('mandatory_fee_list.summary_collection_date')), e(formatDate(feeData.ngayThu))]);
        rows.push([e(t('mandatory_fee_list.summary_due_date')), e(formatDate(feeData.hanThu))]);
        rows.push([e(t('mandatory_fee_list.csv.summary_paid_count')), `'${feeData.paidApartmentCount}/${feeData.totalCanHo}`]); // Thêm dấu ' để tránh Excel tự chuyển thành ngày tháng (ví dụ 2/2 thành 02-Feb)
        rows.push([e(t('mandatory_fee_list.csv.summary_total_collected')), formatCurrency(feeData.tongPhiAll) + " VNĐ"]);
        rows.push([e(t('mandatory_fee_list.csv.reporter')), currentUser]);
        rows.push([]);

        // 4. Bảng chi tiết
        rows.push([e(t('mandatory_fee_list.csv.detail_section'))]);
        const tableHeaders = [
            t('mandatory_fee_list.table_header.apartment_id'),
            t('mandatory_fee_list.table_header.status'),
            t('mandatory_fee_list.table_header.total_fee'),
            t('mandatory_fee_list.table_header.apartment_fee'),
            t('mandatory_fee_list.table_header.parking_fee'),
            t('mandatory_fee_list.table_header.utility_fee'),
            t('mandatory_fee_list.table_header.paid_amount'),
            t('mandatory_fee_list.table_header.debt_amount')
        ];
        rows.push(tableHeaders.map(e));

        feeData.danhSachTongThanhToan.forEach(item => {
            rows.push([
                e(item.idCanHo),
                e(item.trangThai),
                e(formatCurrency(item.tongPhi)),
                e(formatCurrency(item.tongPhiChungCu)),
                e(formatCurrency(item.tongGuiXe)),
                e(formatCurrency(item.tongTienIch)),
                e(formatCurrency(item.soTienDaNop)),
                e(formatCurrency(item.soDu))
            ]);
        });

        // Dòng tổng kết cuối bảng
        rows.push([]);
        rows.push([
            e(t('mandatory_fee_list.csv.summary_footer_title')),
            "",
            e(formatCurrency(feeData.tongPhiAll)),
            e(formatCurrency(feeData.tongPhiChungCuAll)),
            e(formatCurrency(feeData.tongGuiXeAll)),
            e(formatCurrency(feeData.tongTienIchAll)),
            "", ""
        ]);

        rows.push([]);
        rows.push([]);

        // 5. Phần chữ ký
        rows.push([
            e(t('mandatory_fee_list.csv.footer_prepared_by')),
            "", "",
            e(t('mandatory_fee_list.csv.footer_accountant')),
            "", "",
            e(t('mandatory_fee_list.csv.footer_director'))
        ]);
        rows.push([
            e(t('mandatory_fee_list.csv.footer_sign_placeholder')),
            "", "",
            e(t('mandatory_fee_list.csv.footer_sign_placeholder')),
            "", "",
            e(t('mandatory_fee_list.csv.footer_sign_placeholder'))
        ]);

        const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `BaoCao_ThuPhi_${idThoiGianThu}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 6. Trả về JSX
    return (
        <div className="fee-list-container">
            <div className="fee-list-controls">
                <input
                    type="text"
                    placeholder={t('mandatory_fee_list.placeholder_time_id')}
                    value={idThoiGianThu}
                    onChange={handleInputChange}
                />
                <button onClick={handleGenerateList} disabled={isLoading}>
                    {isLoading ? t('mandatory_fee_list.loading_button') : t('mandatory_fee_list.generate_button')}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {feeData && (
                <div className="fee-list-results">
                    <div className="fee-list-summary">
                        <div className="summary-item"><span>{t('mandatory_fee_list.summary_collection_date')}</span><strong>{feeData.ngayThu}</strong></div>
                        <div className="summary-item"><span>{t('mandatory_fee_list.summary_due_date')}</span><strong>{feeData.hanThu}</strong></div>
                        <div className="summary-item success"><span>{t('mandatory_fee_list.summary_paid')}</span>
                            <strong>{feeData.paidApartmentCount} / {feeData.totalCanHo}</strong></div>
                        <div className="summary-item total"><span>{t('mandatory_fee_list.summary_total')}</span><strong>{formatCurrency(feeData.tongPhiAll)}</strong></div>
                    </div>

                    <div className="fee-list-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('mandatory_fee_list.table_header.apartment_id')}</th>
                                    <th>{t('mandatory_fee_list.table_header.status')}</th>
                                    <th>{t('mandatory_fee_list.table_header.total_fee')}</th>
                                    <th>{t('mandatory_fee_list.table_header.apartment_fee')}</th>
                                    <th>{t('mandatory_fee_list.table_header.parking_fee')}</th>
                                    <th>{t('mandatory_fee_list.table_header.utility_fee')}</th>
                                    <th>{t('mandatory_fee_list.table_header.paid_amount')}</th>
                                    <th>{t('mandatory_fee_list.table_header.debt_amount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeData.danhSachTongThanhToan.map(item => (
                                    <tr key={item.idCanHo}>
                                        <td>{item.idCanHo}</td>
                                        <td><span className={`status ${item.trangThai === 'DA_THANH_TOAN' ? 'paid' : 'unpaid'}`}>
                                            {item.trangThai === 'DA_THANH_TOAN' ? t('mandatory_fee_list.status_paid') : t('mandatory_fee_list.status_unpaid')}
                                        </span></td>
                                        <td>{formatCurrency(item.tongPhi)}</td>
                                        <td>{formatCurrency(item.tongPhiChungCu)}</td>
                                        <td>{formatCurrency(item.tongGuiXe)}</td>
                                        <td>{formatCurrency(item.tongTienIch)}</td>
                                        <td>{formatCurrency(item.soTienDaNop)}</td>
                                        <td>{formatCurrency(item.soDu)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="fee-list-footer">
                        <button className="export-btn" onClick={handleExportReport}>
                            {t('mandatory_fee_list.export_button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MandatoryFeeList;