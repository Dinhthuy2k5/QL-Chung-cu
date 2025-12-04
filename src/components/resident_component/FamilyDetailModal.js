import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from "../../services/localStorageService";
import { useTranslation } from "react-i18next";
import '../../styles/resident-styles/FamilyDetailModal.scss';

const FamilyDetailModal = ({ show, onClose, family }) => {
    const { t } = useTranslation();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && family) {
            fetchMembers(family.cccdChuHo);
        }
    }, [show, family]);

    const fetchMembers = async (cccdChuHo) => {
        setLoading(true);
        const token = getToken();
        // API lấy danh sách thành viên theo CCCD chủ hộ
        const apiUrl = `http://localhost:8080/qlcc/nhan-khau/ho-gia-dinh/${cccdChuHo}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMembers(response.data.result || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách thành viên:", error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    if (!show || !family) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{t('family_detail.title')} - {family.hoTenChuHo}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {/* Phần 1: Thông tin chung */}
                    <div className="family-info-card">
                        <div className="info-item">
                            <label>{t('family_detail.householder')}:</label>
                            <span>{family.hoTenChuHo}</span>
                        </div>
                        <div className="info-item">
                            <label>{t('family_detail.cccd')}:</label>
                            <span>{family.cccdChuHo}</span>
                        </div>
                        <div className="info-item">
                            <label>{t('family_detail.address')}:</label>
                            <span>{family.diaChi}</span>
                        </div>
                        <div className="info-item">
                            <label>{t('family_detail.vehicles')}:</label>
                            <span>{family.soXeMay} {t('common.motorbike')} - {family.soOto} {t('common.car')}</span>
                        </div>
                    </div>

                    {/* Phần 2: Danh sách thành viên */}
                    <div className="members-section">
                        <h4 className="section-title">
                            <span>|</span> {t('family_detail.members_list')} ({members.length})
                        </h4>

                        <div className="members-table-container">
                            <table className="members-table">
                                <thead>
                                    <tr>
                                        <th>{t('resident_table.name')}</th>
                                        <th>{t('resident_table.dob')}</th>
                                        <th>{t('resident_table.gender')}</th>
                                        <th>{t('resident_table.relation')}</th>
                                        <th>{t('resident_table.phone')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center">{t('common.loading')}</td></tr>
                                    ) : members.length > 0 ? (
                                        members.map((mem, index) => (
                                            <tr key={index}>
                                                <td className={mem.cccd === family.cccdChuHo ? 'is-householder' : ''}>
                                                    {mem.hoVaTen}
                                                    {mem.cccd === family.cccdChuHo && <span className="tag-owner">{t('common.owner')}</span>}
                                                </td>
                                                <td>{mem.ngaySinh}</td>
                                                <td>{mem.gioiTinh}</td>
                                                {/* SỬA: Dùng mem.quanHe thay vì quanHeVoiChuHo */}
                                                <td>{mem.quanHe}</td>
                                                <td>{mem.sdt}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center">{t('common.no_data')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>{t('common.close')}</button>
                </div>
            </div>
        </div>
    );
};

export default FamilyDetailModal;