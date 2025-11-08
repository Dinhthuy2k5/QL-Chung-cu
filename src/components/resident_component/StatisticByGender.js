import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import '../../styles/resident-styles/StatisticByGender.scss'
import { getToken } from "../../services/localStorageService";
import axios from "axios";
// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- Hàm gọi API (Cập nhật để ném lỗi) ---
const FetchGenderDataFromAPI = async () => {
    const token = getToken();
    if (!token) {
        // Ném lỗi để useEffect có thể bắt
        throw new Error("session_expired");
    }

    const config = { headers: { 'Authorization': `bearer ${token}` } };

    try {
        const apiUrl = `http://localhost:8080/qlcc/thong-ke/gioi-tinh`;
        const response = await axios.get(apiUrl, config);
        console.log("Thống kê giới tính thành công");
        return response.data.result;
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.log("Có lỗi khi thống kê giới tính", errorMessage);
        // Ném lỗi ra ngoài
        throw new Error(errorMessage);
    }
}

const StatisticByGender = () => {
    // 2. Lấy hàm dịch 't'
    const { t } = useTranslation();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await FetchGenderDataFromAPI();

                // 3. Xây dựng labels và dataset bằng hàm t()
                setChartData({
                    labels: [
                        t('stats_gender_chart.labels.male'),
                        t('stats_gender_chart.labels.female'),
                        t('stats_gender_chart.labels.other')
                    ],
                    datasets: [
                        {
                            label: t('stats_gender_chart.dataset_label'),
                            data: [data.soLuongNam, data.soLuongNu, data.soLuongKhac],
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(255, 206, 86, 0.7)'
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)'
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                // 4. Xử lý lỗi và hiển thị alert đã dịch
                if (error.message === "session_expired") {
                    alert(t('alerts.session_expired'));
                } else {
                    alert(t('stats_gender_chart.error') + ": " + error.message);
                }
                console.error(error);
            }
        };
        getData();
    }, [t]); // Thêm 't' vào dependency array

    // 5. Cập nhật options với hàm t()
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: { size: 14 }
                }
            },
            title: {
                display: true,
                text: t('stats_gender_chart.title'), // Dịch tiêu đề
                color: 'white',
                font: { size: 20 }
            },
        },
    };

    if (!chartData) {
        // 6. Dịch thông báo loading
        return <div className="loading-message">{t('stats_gender_chart.loading')}</div>;
    }

    return (
        <div className="statistic-gender-container">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default StatisticByGender;