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
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="mandatory-tab">
            <MandatoryDashboard
                key={refreshKey}
                onOpenCreate={() => setShowCreateWizard(true)}
                onOpenCollect={() => setShowCollectWizard(true)}
                onOpenList={() => setShowList(true)}
            />

            {showCreateWizard && (
                <CreateFeeWizard
                    onClose={() => setShowCreateWizard(false)}
                    onRefresh={handleRefresh}
                />
            )}

            {showCollectWizard && (
                <CollectFeeWizard
                    onClose={() => setShowCollectWizard(false)}
                    onRefresh={handleRefresh}
                />
            )}

            {/* --- THAY ĐỔI TẠI ĐÂY: GỌI TRỰC TIẾP, KHÔNG BỌC DIV --- */}
            {showList && (
                <MandatoryFeeList
                    onClose={() => setShowList(false)} // Truyền hàm đóng vào trong
                    cache={cache}
                    setCache={setCache}
                />
            )}
        </div>
    );
};

export default MandatoryFeeTab;