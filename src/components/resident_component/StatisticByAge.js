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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Giả lập hàm gọi API để lấy dữ liệu độ tuổi ---
const fetchAgeDataFromAPI = async () => {
    const token = getToken();
    if (!token) {
        alert("Phiên đăng nhập hết hạn ");
        return;
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
        console.log("Có lỗi khi thống kê giới tính", error.response ? error.response.data : error.message);

    }
};

// function component chính
const StatisticByAge = () => {
    const [chartData, setChartData] = useState(null);

    // hợp nhất 3 phương thức vòng đời(ở đây chỉ dùng khi component được gọi ra)
    useEffect(() => {
        const getData = async () => {
            const data = await fetchAgeDataFromAPI();

            setChartData({
                labels: ['Dưới vị thành niên', 'Trong độ tuổi lao động', 'Trên tuổi lao động'],
                datasets: [
                    {
                        label: 'Số lượng cư dân',
                        data: [data.duoiViThanhNien, data.trongDoTuoiLaoDong, data.trenTuoiLaoDong],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        };

        getData();
    }, []);  //mảng trống -> chỉ chạy 1 lần
    // Cấu hình các tùy chọn cho biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Thường không cần legend cho biểu đồ chỉ có 1 bộ dữ liệu
            },
            title: {
                display: true,
                text: 'Biểu đồ Thống kê Cư dân theo Độ tuổi',
                color: 'white',
                font: {
                    size: 20
                }
            },
        },
        scales: { // Tùy chỉnh màu sắc cho các trục tọa độ
            y: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                },
                beginAtZero: true
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        }
    };

    if (!chartData) {
        return <div className="loading-message">Đang tải dữ liệu thống kê...</div>;
    }

    return (
        <div className="statistic-age-container">
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default StatisticByAge;