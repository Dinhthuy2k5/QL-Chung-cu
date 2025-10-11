import React from "react";
import Apartment_Home from "../components/home_component/Apartment_Home";
import Resident_Home from "../components/home_component/Resident_Home";
import '../styles/home-styles/Home.scss'
import Receipt_Home from "../components/home_component/Receipt_Home";

class Home extends React.Component {
    render() {
        return (
            <div className="home-container">
                <Apartment_Home totalApartments={this.props.totalApartments} />
                <Resident_Home totalResidents={this.props.totalResidents} />
                <Receipt_Home />
            </div>
        )
    }
}

export default Home;