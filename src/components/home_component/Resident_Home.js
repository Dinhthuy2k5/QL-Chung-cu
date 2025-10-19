import React from "react";
import '../../styles/home-styles/Resident_Home.scss';
import { NavLink } from "react-router-dom";
import { withRouter } from "../../HOC/withRouter";

class Resident_Home extends React.Component {

    state = {
        number_resident: 0
    }

    handleViewAllResident = () => {
        this.props.navigate("/residents")
    }

    render() {
        return (
            <div className="resident-card">
                <h4 className="card-title">
                    Cư dân
                </h4>
                <div className="card-body">
                    <span className="label"> Tổng số: </span>
                    <span className="count">{this.props.totalResidents} </span>
                </div>
                <button className="view-all-resident" onClick={() => this.handleViewAllResident()}> Xem tất cả</button>
            </div>
        )
    }

}

export default withRouter(Resident_Home);