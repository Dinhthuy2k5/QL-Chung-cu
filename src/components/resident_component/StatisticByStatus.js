import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import '../../styles/resident-styles/StatisticByStatus.scss'; // Dùng chung file style cũ
import { getToken } from "../../services/localStorageService";
import axios from "axios";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Hàm gọi API để lấy dữ liệu thống kê tình trạng cư trú
const fetchStatusDataFromAPI = async () => {
    const token = getToken();
    if (!token) {
        alert("Phiên đăng nhập đã hết hạn");
        return Promise.reject("No token found");
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    // try {
    //     const apiUrl = `http://localhost:8080/qlcc/thong-ke/tam-tru-tam-vang`; // Giả sử đây là API của bạn
    //     const response = await axios.get(apiUrl, config);
    //     console.log("Thống kê tình trạng cư trú thành công")

    //     // Giả sử API trả về object có dạng: { result: { soLuongThuongTru: 150, soLuongTamTru: 30, soLuongTamVang: 5 } }
    //     return response.data.result;
    // } catch (error) {
    // console.error("Có lỗi khi thống kê tình trạng cư trú", error);

    return { soLuongThuongTru: 150, soLuongTamTru: 30, soLuongTamVang: 5 };
    // }
}

const StatisticByStatus = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchStatusDataFromAPI();

            const total = data.soLuongThuongTru + data.soLuongTamTru + data.soLuongTamVang;

            setChartData({
                labels: ['Thường trú', 'Tạm trú', 'Tạm vắng'],
                datasets: [
                    {
                        label: 'Số lượng',
                        data: [data.soLuongThuongTru, data.soLuongTamTru, data.soLuongTamVang],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.7)',  // Màu xanh lá
                            'rgba(255, 159, 64, 0.7)', // Màu cam
                            'rgba(153, 102, 255, 0.7)'  // Màu tím
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        };

        getData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white', font: { size: 14 } }
            },
            title: {
                display: true,
                text: 'Biểu đồ Thống kê theo Tình trạng Cư trú',
                color: 'white',
                font: { size: 20 }
            },
        },
    };

    if (!chartData) {
        return <div className="loading-message">Đang tải dữ liệu thống kê...</div>;
    }

    return (
        <div className="statistic-container">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default StatisticByStatus;