import './styles/App.scss';
import Home from './views/Home.js';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from './pages/Login.js'
import { useState, useEffect } from 'react'; // Đảm bảo import useEffect
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

function AppContent() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState("");

  const [isViewInfor, setIsViewInfor] = useState(false);
  const [isChangeInfor, setIsChangeInfor] = useState(false);

  const [apartments, setApartments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [families, setFamilies] = useState([]);

  // --- 1. TẠO CACHE CHO HOME ---
  const [homeCache, setHomeCache] = useState({
    chartData: null,
    residentActivities: [],
    feeActivities: [],
    hasLoaded: false
  });

  // --- 2. THÊM MỚI: TỰ ĐỘNG RESET CACHE KHI DỮ LIỆU THAY ĐỔI ---
  useEffect(() => {
    // Nếu Cache đã được load (tức là người dùng đã vào Home rồi),
    // mà sau đó dữ liệu residents/families/apartments thay đổi (do Thêm/Sửa/Xóa),
    // thì ta cần đánh dấu cache là "cũ" (hasLoaded = false).
    if (homeCache.hasLoaded) {
      console.log("Dữ liệu thay đổi, reset cache Home để tải lại hoạt động mới...");
      setHomeCache(prev => ({
        ...prev,
        hasLoaded: false
      }));
    }
    // Effect này sẽ chạy mỗi khi biến residents, families hoặc apartments thay đổi
  }, [residents, families, apartments]);
  // -------------------------------------------------------------

  const fetchData = async () => {
    const token = getToken();
    if (!token) return;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      const resApartments = await axios.get(`http://localhost:8080/qlcc/can-ho`, config);
      if (resApartments.data?.result) setApartments(resApartments.data.result);

      const resResidents = await axios.get(`http://localhost:8080/qlcc/nhan-khau`, config);
      if (resResidents.data?.result) setResidents(resResidents.data.result);

      const resFamilies = await axios.get(`http://localhost:8080/qlcc/ho-gia-dinh`, config);
      if (resFamilies.data?.result) setFamilies(resFamilies.data.result);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu cho App.js", error);
    }
  };

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

    setApartments([]);
    setResidents([]);
    setFamilies([]);

    setHomeCache({
      chartData: null,
      residentActivities: [],
      feeActivities: [],
      hasLoaded: false
    });

    navigate("/");
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
              homeCache={homeCache}
              setHomeCache={setHomeCache}
            />
          } />
          <Route path="/log-in" element={<Login onLoggedIn={handleLoggedIn} setUserLoggedIn={handleUserLoggedIn} />} />
          <Route path="/apartments" element={<Apartment listApartments={apartments} />} />
          <Route path="/residents/*" element={<Resident listResidents={residents}
            setListResidents={setResidents}
            listFamilies={families}
            setListFamilies={setFamilies} />} />
          <Route path="/change-infor" element={<Change_Infor username={userLoggedIn} isChangeInfor={isChangeInfor} />} />
          <Route path="/view-infor" element={<Change_Infor username={userLoggedIn} isViewInfor={isViewInfor} />} />
          <Route path="/receipts/*" element={<Receipt />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <VantaBackground />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;