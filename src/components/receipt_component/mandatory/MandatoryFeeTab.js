import React, { useState } from 'react';
// Lưu ý: Kiểm tra lại đường dẫn import MandatoryFeeList cho đúng với cấu trúc thư mục của bạn
import MandatoryFeeList from './MandatoryFeeList';
import CreateFeeWizard from './CreateFeeWizard';
import CollectFeeWizard from './CollectFeeWizard';
import { useTranslation } from 'react-i18next';
import MandatoryDashboard from './MandatoryDashboard';

const MandatoryFeeTab = ({ cache, setCache }) => {
    const { t } = useTranslation();
    const [showCreateWizard, setShowCreateWizard] = useState(false);
    const [showCollectWizard, setShowCollectWizard] = useState(false);
    const [showList, setShowList] = useState(false);

    // ĐÃ XÓA state paymentResult ở đây vì đã chuyển vào CollectFeeWizard

    return (
        <div className="mandatory-tab">
            <MandatoryDashboard
                onOpenCreate={() => setShowCreateWizard(true)}
                onOpenCollect={() => setShowCollectWizard(true)}
                onOpenList={() => setShowList(true)}
            />

            {/* Modal Tạo Khoản Thu */}
            {showCreateWizard && (
                <CreateFeeWizard onClose={() => setShowCreateWizard(false)} />
            )}

            {/* Modal Thu Phí (Đã bao gồm màn hình kết quả bên trong) */}
            {showCollectWizard && (
                <CollectFeeWizard
                    onClose={() => setShowCollectWizard(false)}
                />
            )}

            {/* Modal Danh Sách */}
            {showList && (
                <div
                    className="modal-overlay top-aligned"
                    onClick={() => setShowList(false)}
                >
                    <div
                        className="modal-content extra-large"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{t('receipt_page.modal_mandatory_list.title')}</h3>
                            <button onClick={() => setShowList(false)}>&times;</button>
                        </div>
                        <div className="modal-body full-width-body">
                            <MandatoryFeeList cache={cache} setCache={setCache} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MandatoryFeeTab;