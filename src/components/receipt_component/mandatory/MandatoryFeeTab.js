import React, { useState } from 'react';
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

    // 1. Thêm state để quản lý việc làm mới dữ liệu
    const [refreshKey, setRefreshKey] = useState(0);

    // 2. Định nghĩa hàm onRefresh
    const handleRefresh = () => {
        // Tăng giá trị key để buộc các component con (Dashboard) re-render và gọi lại API
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="mandatory-tab">
            {/* 3. Truyền key vào Dashboard. Khi key đổi, Dashboard sẽ unmount & mount lại => chạy lại useEffect fetch data */}
            <MandatoryDashboard
                key={refreshKey}
                onOpenCreate={() => setShowCreateWizard(true)}
                onOpenCollect={() => setShowCollectWizard(true)}
                onOpenList={() => setShowList(true)}
            />

            {/* Modal Tạo Khoản Thu */}
            {showCreateWizard && (
                <CreateFeeWizard
                    onClose={() => setShowCreateWizard(false)}
                    onRefresh={handleRefresh} // <--- ĐÃ BỔ SUNG PROP QUAN TRỌNG NÀY
                />
            )}

            {/* Modal Thu Phí */}
            {showCollectWizard && (
                <CollectFeeWizard
                    onClose={() => setShowCollectWizard(false)}
                    // Nếu muốn Thu phí xong cũng cập nhật Dashboard, bạn có thể truyền thêm:
                    onRefresh={handleRefresh}
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
                            <MandatoryFeeList
                                key={refreshKey} // Cũng reload lại list nếu cần
                                cache={cache}
                                setCache={setCache}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MandatoryFeeTab;