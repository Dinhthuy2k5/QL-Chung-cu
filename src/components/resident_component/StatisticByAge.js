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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Giả lập hàm gọi API để lấy dữ liệu độ tuổi ---
const fetchAgeDataFromAPI = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Dữ liệu mẫu nhận được từ backend, đã được phân nhóm
            const apiResponse = {
                success: true,
                data: {
                    under18: 30,    // Dưới 18 tuổi
                    from18to35: 95, // Từ 18 - 35 tuổi
                    from36to60: 82, // Từ 36 - 60 tuổi
                    over60: 18,     // Trên 60 tuổi
                }
            };
            resolve(apiResponse.data);
        }, 1000); // Giả lập độ trễ 1 giây
    });
};

// function component chính
const StatisticByAge = () => {
    const [chartData, setChartData] = useState(null);

    // hợp nhất 3 phương thức vòng đời(ở đây chỉ dùng khi component được gọi ra)
    useEffect(() => {
        const getData = async () => {
            const data = await fetchAgeDataFromAPI();

            setChartData({
                labels: ['Dưới 18', '18 - 35', '36 - 60', 'Trên 60'],
                datasets: [
                    {
                        label: 'Số lượng cư dân',
                        data: [data.under18, data.from18to35, data.from36to60, data.over60],
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