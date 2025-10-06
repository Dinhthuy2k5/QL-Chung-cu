import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import '../../styles/resident-styles/StatisticByGender.scss'
import { getToken } from "../../services/localStorageService";
import axios from "axios";

// Đăng ký các thành phần của Chart.js mà chúng ta sẽ sử dụng
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// --- Giả lập hàm gọi API ---
const FetchGenderDataFromAPI = async () => {

    const token = getToken();
    if (!token) {
        alert(" Phiên đăng nhập hết hạn");
        return Promise.reject("No token found");
    }

    const config = {
        headers: {
            'Authorization': `bearer ${token}`
        }
    }
    try {
        const apiUrl = `http://localhost:8080/qlcc/thong-ke/gioi-tinh`;

        const response = await axios.get(apiUrl, config);
        console.log("Thống kê giới tính thành công");
        return response.data.result;
    } catch (error) {
        console.log("Có lỗi khi thống kê giới tính", error.response ? error.response.data : error.message);
    }

}

const StatisticByGender = () => {
    //State để lưu dữ liệu cho biểu đồ
    const [chartData, setChartData] = useState(null);
    // Sử dụng useEffect để gọi API khi component được render lần đầu
    useEffect(() => {
        const getData = async () => {
            const data = await FetchGenderDataFromAPI();

            // Cấu hình dữ liệu cho biểu đồ
            setChartData({
                labels: ['Nam', 'Nữ', 'Khác'],
                datasets: [
                    {
                        label: 'Số lượng',
                        data: [data.soLuongNam, data.soLuongNu, data.soLuongKhac],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)', // Màu xanh cho Nam
                            'rgba(255, 99, 132, 0.7)',  // Màu hồng cho Nữ
                            'rgba(255, 206, 86, 0.7)'   // Màu vàng cho Khác
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
        };
        getData();
    }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần
    // Cấu hình các tùy chọn cho biểu đồ (ví dụ: tiêu đề)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white', // Màu chữ của nhãn (Nam, Nữ, Khác)
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Biểu đồ Thống kê Cư dân theo Giới tính',
                color: 'white', // Màu chữ của tiêu đề
                font: {
                    size: 20
                }
            },
        },
    };

    // Nếu chưa có dữ liệu, hiển thị thông báo loading
    if (!chartData) {
        return <div className="loading-message">Đang tải dữ liệu thống kê...</div>;
    }

    return (
        <div className="statistic-gender-container">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default StatisticByGender;
