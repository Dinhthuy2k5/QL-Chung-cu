import './styles/App.scss';
import Home from './views/Home.js';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from './pages/Login.js'
import { useState } from 'react';
import Header from './views/Nav/Header.js';
import Apartment from './views/Apartments.js';
import Resident from './views/Residents.js';
import Settings from './views/Settings.js';
import { removeToken } from './services/localStorageService.js';
import Change_Infor from './pages/Change_Infor.js';
import VantaBackground from './views/VantaBackground.js';
import Receipt from './views/Receipt.js';
import axios from 'axios';
import { getToken } from './services/localStorageService.js';
import { useEffect } from 'react';



// Component AppContent sẽ chứa toàn bộ logic và giao diện của bạn
function AppContent() {
  const navigate = useNavigate(); // <-- Bây giờ useNavigate được gọi BÊN TRONG Router, nên sẽ hoạt động

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState("");

  const [isViewInfor, setIsViewInfor] = useState(false);
  const [isChangeInfor, setIsChangeInfor] = useState(false);

  const [apartments, setApartments] = useState([]);
  const [residents, setResidents] = useState([]);

  // --- 1. TẠO CACHE CHO HOME ---
  const [homeCache, setHomeCache] = useState({
    chartData: null,
    residentActivities: [],
    feeActivities: [],
    hasLoaded: false // Cờ đánh dấu đã tải dữ liệu lần đầu hay chưa
  });

  // Hàm gọi API (bạn có thể gộp 2 hàm này lại)
  const fetchData = async () => {
    const token = getToken();
    if (!token) return;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      // Lấy dữ liệu căn hộ
      const resApartments = await axios.get(`http://localhost:8080/qlcc/can-ho`, config);
      if (resApartments.data && resApartments.data.result) {
        setApartments(resApartments.data.result);
      }
      // Lấy dữ liệu cư dân
      const resResidents = await axios.get(`http://localhost:8080/qlcc/nhan-khau`, config);
      if (resResidents.data && resResidents.data.result) {
        setResidents(resResidents.data.result);
      }
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu cho App.js", error);
    }
  };

  // Gọi API khi đăng nhập thành công
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLoggedIn = () => {
    setIsLoggedIn(true);
  }

  const handleLoggedOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserLoggedIn("");

    // Thêm 2 dòng này để xóa dữ liệu khi đăng xuất
    setApartments([]);
    setResidents([]);

    // RESET CACHE KHI ĐĂNG XUẤT
    setHomeCache({
      chartData: null,
      residentActivities: [],
      feeActivities: [],
      hasLoaded: false
    });

    navigate("/"); // <-- Lệnh navigate này giờ đã hợp lệ


  }

  const handleUserLoggedIn = (username) => {
    setUserLoggedIn(username);
  }


  return (
    <div className="App">
      <header className="App-header">
        <Header isLoggedIn={isLoggedIn} handleLoggedOut={handleLoggedOut} userLoggedIn={userLoggedIn}
          setIsChangeInfor={setIsChangeInfor}
          setIsViewInfor={setIsViewInfor} />

        <Routes>
          <Route path="/" element={
            <Home
              totalApartments={apartments.length}
              totalResidents={residents.length}
              homeCache={homeCache}           // Truyền dữ liệu đã lưu
              setHomeCache={setHomeCache}     // Truyền hàm cập nhật
            />
          } />
          <Route path="/log-in" element={<Login onLoggedIn={handleLoggedIn} setUserLoggedIn={handleUserLoggedIn} />} />
          <Route path="/apartments" element={<Apartment listApartments={apartments} />} />
          <Route path="/residents/*" element={<Resident listResidents={residents} />} />
          <Route path="/change-infor" element={<Change_Infor username={userLoggedIn} isChangeInfor={isChangeInfor} />} />
          <Route path="/view-infor" element={<Change_Infor username={userLoggedIn} isViewInfor={isViewInfor} />} />
          <Route path="/receipts/*" element={<Receipt />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </header>
    </div>
  );
}

// Component App chính giờ đây chỉ có nhiệm vụ duy nhất là cung cấp BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <VantaBackground />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;