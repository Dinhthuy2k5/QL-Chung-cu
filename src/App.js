import './styles/App.scss';
import Home from './views/Home.js';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from './pages/Login.js'
import { useState } from 'react';
import Header from './views/Nav/Header.js';
import Apartment from './views/Apartments.js';
import Resident from './views/Residents.js';
import { removeToken } from './services/localStorageService.js';
import Change_Infor from './pages/Change_Infor.js';
import VantaBackground from './views/VantaBackground.js';
import Receipt from './views/Receipt.js';


// Component AppContent sẽ chứa toàn bộ logic và giao diện của bạn
function AppContent() {
  const navigate = useNavigate(); // <-- Bây giờ useNavigate được gọi BÊN TRONG Router, nên sẽ hoạt động

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState("");

  const [isViewInfor, setIsViewInfor] = useState(false);
  const [isChangeInfor, setIsChangeInfor] = useState(false);

  const [totalApartments, setTotalApartments] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);

  const handleLoggedIn = () => {
    setIsLoggedIn(true);
  }

  const handleLoggedOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserLoggedIn("");
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
          <Route path="/" element={<Home totalApartments={totalApartments} totalResidents={totalResidents} />} />
          <Route path="/log-in" element={<Login onLoggedIn={handleLoggedIn} setUserLoggedIn={handleUserLoggedIn} />} />
          <Route path="/apartments" element={<Apartment setTotalApartments={setTotalApartments} />} />
          <Route path="/residents/*" element={<Resident setTotalResidents={setTotalResidents} />} />
          <Route path="/change-infor" element={<Change_Infor username={userLoggedIn} isChangeInfor={isChangeInfor} />} />
          <Route path="/view-infor" element={<Change_Infor username={userLoggedIn} isViewInfor={isViewInfor} />} />
          <Route path="/receipts" element={<Receipt />} />
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