import React, { useState } from 'react';
// Lưu ý: Kiểm tra lại đường dẫn import MandatoryFeeList cho đúng với cấu trúc thư mục của bạn
import MandatoryFeeList from './MandatoryFeeList';
import CreateFeeWizard from './CreateFeeWizard';
import CollectFeeWizard from './CollectFeeWizard';
import { useTranslation } from 'react-i18next';

const MandatoryFeeTab = () => {
    const { t } = useTranslation();
    const [showCreateWizard, setShowCreateWizard] = useState(false);
    const [showCollectWizard, setShowCollectWizard] = useState(false);
    const [showList, setShowList] = useState(false);

    // State cho kết quả thanh toán
    const [paymentResult, setPaymentResult] = useState(null);

    return (
        <div className="mandatory-tab">
            <div className="section-header">
                <h2>{t('receipt_page.mandatory_title')}</h2>
                <p>{t('receipt_page.mandatory_desc')}</p>
            </div>

            <div className="section-actions">
                {/* Nút 1: Tạo khoản thu */}
                <button onClick={() => setShowCreateWizard(true)}>
                    ➕ {t('receipt_page.mandatory_btn_create')}
                </button>

                {/* Nút 2: Thu phí (Sử dụng Wizard mới) */}
                <button onClick={() => setShowCollectWizard(true)}>
                    💰 {t('receipt_page.mandatory_btn_collect')}
                </button>

                {/* Nút 3: Xem danh sách */}
                <button onClick={() => setShowList(true)}>
                    📄 {t('receipt_page.mandatory_btn_list')}
                </button>
            </div>

            {/* --- CÁC MODAL --- */}

            {showCreateWizard && (
                <CreateFeeWizard onClose={() => setShowCreateWizard(false)} onRefresh={() => { }} />
            )}

            {showCollectWizard && (
                <CollectFeeWizard
                    onClose={() => setShowCollectWizard(false)}
                    onResult={(result) => setPaymentResult(result)}
                />
            )}

            {/* Modal hiển thị kết quả sau khi thu phí */}
            {paymentResult && (
                <div className="modal-overlay" onClick={() => setPaymentResult(null)}>
                    <div className="modal-content large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('receipt_page.modal_payment_result.title')}</h3>
                            <button onClick={() => setPaymentResult(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="result-summary">
                                <p className="success">Thanh toán thành công: {paymentResult.successCount}</p>
                                <p className="fail">Thất bại: {paymentResult.failCount}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setPaymentResult(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SỬA Ở ĐÂY: MODAL DANH SÁCH --- */}
            {showList && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowList(false)} // 1. Click ra ngoài để đóng modal
                >
                    <div
                        className="modal-content extra-large"
                        onClick={(e) => e.stopPropagation()} // 2. Chặn sự kiện click để không đóng khi bấm vào nội dung
                    >
                        <div className="modal-header">
                            <h3>{t('receipt_page.modal_mandatory_list.title')}</h3>
                            <button onClick={() => setShowList(false)}>&times;</button>
                        </div>
                        <div className="modal-body full-width-body">
                            <MandatoryFeeList />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MandatoryFeeTab;