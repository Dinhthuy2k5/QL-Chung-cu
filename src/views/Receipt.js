import React, { useState } from "react";
import '../styles/receipt-styles/Receipt.scss'
import MandatoryFeeTab from "../components/receipt_component/mandatory/MandatoryFeeTab";
import VoluntaryContribution from "../components/receipt_component/VoluntaryContribution";
import ApartmentPaymentHistory from "../components/receipt_component/ApartmentPaymentHistory";
import { useTranslation } from "react-i18next";

function Receipt() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('mandatory');

    return (
        <div className="receipt-container">
            {/* GIAO DIỆN TAB */}
            <div className="receipt-tabs">
                <button
                    className={`tab-button ${activeTab === 'mandatory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mandatory')}
                >
                    {t('receipt_page.tab_mandatory')}
                </button>
                <button
                    className={`tab-button ${activeTab === 'voluntary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('voluntary')}
                >
                    {t('receipt_page.tab_voluntary')}
                </button>
                <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    {t('receipt_page.tab_history')}
                </button>
            </div>

            {/* NỘI DUNG CỦA TAB */}
            <div className="tab-content">
                {activeTab === 'mandatory' && <MandatoryFeeTab />}
                {activeTab === 'voluntary' && <VoluntaryContribution />}
                {activeTab === 'history' && <ApartmentPaymentHistory />}
            </div>
        </div>
    );
}

export default Receipt;