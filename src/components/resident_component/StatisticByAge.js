import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";
import '../../styles/resident-styles/StatisticByAge.scss'
import axios from "axios";
import { getToken } from "../../services/localStorageService";
// 1. Import hook useTranslation
import { useTranslation } from "react-i18next";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Hàm gọi API ---
// (Giữ nguyên hàm này, chúng ta sẽ xử lý alert trong component)
const fetchAgeDataFromAPI = async () => {
    const token = getToken();
    if (!token) {
        // Ném lỗi để useEffect có thể bắt
        throw new Error("Phiên đăng nhập hết hạn");
    }

    const config = {
        headers: {
            'Authorization': `bearer ${token}`
        }
    }

    try {
        const apiUrl = `http://localhost:8080/qlcc/thong-ke/do-tuoi`;
        const response = await axios.get(apiUrl, config);
        console.log("Thống kê độ tuổi thành công");
        return response.data.result;
    } catch (error) {
        // Sửa lỗi chính tả "giới tính" -> "độ tuổi" và ném lỗi
        const errorMessage = error.response ? error.response.data.message : "Lỗi khi thống kê độ tuổi";
        console.log(errorMessage, error);
        throw new Error(errorMessage);
    }
};

// --- Function component chính ---
const StatisticByAge = () => {
    // 2. Lấy hàm dịch 't'
    const { t } = useTranslation();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchAgeDataFromAPI();

                // 3. Xây dựng labels và options bằng hàm t()
                const labels = [
                    t('stats_age_chart.labels.underage'),
                    t('stats_age_chart.labels.working_age'),
                    t('stats_age_chart.labels.over_working_age')
                ];

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: t('stats_age_chart.dataset_label'),
                            data: [data.duoiViThanhNien, data.trongDoTuoiLaoDong, data.trenTuoiLaoDong],
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                // 4. Xử lý lỗi và hiển thị alert đã dịch
                if (error.message === "Phiên đăng nhập hết hạn") {
                    alert(t('alerts.session_expired'));
                } else {
                    alert(t('stats_age_chart.error') + ": " + error.message);
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
            legend: { display: false },
            title: {
                display: true,
                text: t('stats_age_chart.title'), // Dịch tiêu đề
                color: 'white',
                font: { size: 20 }
            },
        },
        scales: {
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' },
                beginAtZero: true
            },
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' }
            }
        }
    };

    if (!chartData) {
        // 6. Dịch thông báo loading
        return <div className="loading-message">{t('stats_age_chart.loading')}</div>;
    }

    return (
        <div className="statistic-age-container">
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default StatisticByAge;