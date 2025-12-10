import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getToken } from "../../services/localStorageService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatisticByTime = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [timeUnit, setTimeUnit] = useState('month'); // 'month' hoặc 'quarter'
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Hàm gọi API lấy dữ liệu thống kê
    const fetchStatistics = async () => {
        setLoading(true);
        const token = getToken();
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        // Chọn API endpoint dựa trên timeUnit
        const endpoint = timeUnit === 'month' ? 'theo-thang' : 'theo-quy';
        const apiUrl = `http://localhost:8080/qlcc/thong-ke/${endpoint}`;

        // Body request
        const payload = { "nam": selectedYear };

        try {
            const response = await axios.post(apiUrl, payload, config);
            if (response.data && response.data.code === 1000) {
                setApiData(response.data.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thống kê:", error);
            setApiData(null);
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API khi năm hoặc loại thống kê thay đổi
    useEffect(() => {
        fetchStatistics();
    }, [selectedYear, timeUnit]);

    // Chuẩn bị dữ liệu cho biểu đồ từ API response
    const chartData = useMemo(() => {
        if (!apiData) return null;

        // Lấy danh sách chi tiết (theo tháng hoặc theo quý)
        // API theo tháng trả về 'chiTietTheoThang', theo quý trả về 'chiTietTheoQuy' (giả định)
        // Bạn cần kiểm tra key chính xác của API theo quý, ở đây tôi dùng logic linh động
        const details = apiData.chiTietTheoThang || apiData.chiTietTheoQuy || [];

        const labels = details.map(item => item.thangDisplay || item.quyDisplay || `Mốc ${item.thang || item.quy}`);
        const dataMoveIn = details.map(item => item.soNguoiChuyenDen);
        const dataMoveOut = details.map(item => item.soNguoiChuyenDi);
        const dataTotal = details.map(item => item.tongDanSo);

        return {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Tổng dân số',
                    data: dataTotal,
                    borderColor: '#e14eca', // Hồng neon
                    backgroundColor: 'rgba(225, 78, 202, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1',
                    order: 1,
                },
                {
                    type: 'bar',
                    label: 'Chuyển đến',
                    data: dataMoveIn,
                    backgroundColor: '#00f2c3', // Xanh mint
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 2,
                },
                {
                    type: 'bar',
                    label: 'Chuyển đi',
                    data: dataMoveOut,
                    backgroundColor: '#ff8d72', // Cam đỏ
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 3,
                }
            ],
        };
    }, [apiData]);

    // Cấu hình hiển thị biểu đồ
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#ffffff', usePointStyle: true, padding: 20 }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 47, 0.9)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#bbaab5' }
            },
            y: { // Trục Y trái (Biến động nhỏ)
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Biến động (Người)', color: '#bbaab5' },
                ticks: { color: '#bbaab5' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y1: { // Trục Y phải (Tổng dân số lớn)
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Tổng dân số', color: '#e14eca' },
                ticks: { color: '#e14eca' }
            },
        },
    };

    return (
        <div className="time-stats-container">
            {/* 1. Filter Bar */}
            <div className="stats-filter-bar">
                <h3><i className="fas fa-chart-line"></i> Biến động dân số</h3>
                <div className="filter-controls">
                    {/* Chọn Năm */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {[2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>Năm {year}</option>
                        ))}
                    </select>

                    {/* Chọn Đơn vị thời gian */}
                    <select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                    >
                        <option value="month">Theo Tháng</option>
                        <option value="quarter">Theo Quý</option>
                    </select>
                </div>
            </div>

            {/* 2. Summary Cards (Hiển thị dữ liệu tổng hợp từ API) */}
            <div className="stats-summary-grid">
                <div className="summary-card growth">
                    <span className="card-label">Tổng chuyển đến ({selectedYear})</span>
                    <span className="card-value">
                        {apiData ? apiData.tongChuyenDenTrongNam : 0}
                    </span>
                    <span className="card-trend up">
                        <i className="fas fa-user-plus"></i> lượt nhập khẩu
                    </span>
                </div>

                <div className="summary-card loss">
                    <span className="card-label">Tổng chuyển đi ({selectedYear})</span>
                    <span className="card-value">
                        {apiData ? apiData.tongChuyenDiTrongNam : 0}
                    </span>
                    <span className="card-trend down">
                        <i className="fas fa-user-minus"></i> lượt chuyển đi
                    </span>
                </div>

                <div className="summary-card neutral">
                    <span className="card-label">Dân số hiện tại (Cuối kỳ)</span>
                    <span className="card-value">
                        {apiData ? apiData.danSoCuoiNam : 0}
                    </span>
                    <span className="card-trend">
                        Bắt đầu năm: {apiData ? apiData.danSoDauNam : 0}
                    </span>
                </div>
            </div>

            {/* 3. Main Chart */}
            <div className="chart-wrapper">
                <div className="chart-header">
                    <h4>Biểu đồ chi tiết {timeUnit === 'month' ? '12 Tháng' : '4 Quý'} - {selectedYear}</h4>
                </div>
                <div className="canvas-container">
                    {loading ? (
                        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>
                    ) : chartData ? (
                        <Chart type='bar' data={chartData} options={chartOptions} />
                    ) : (
                        <div style={{ color: '#999', textAlign: 'center', marginTop: '50px' }}>Không có dữ liệu</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticByTime;