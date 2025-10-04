import React from "react";
import '../../styles/home-styles/Apartment_Home.scss'
import { useNavigate } from "react-router-dom";
import react from "react";
import { withRouter } from "../../HOC/withRouter";

class Apartment_Home extends React.Component {

    state = {
        number__apartments: 0
    }

    handleAddApartment = () => {
        this.setState({
            number__apartments: this.state.number__apartments + 1
        })
    }

    handleViewAllApartment = () => {
        this.props.navigate("/apartments");
    }
    render() {
        return (
            <div className="apartment-card">
                <div>
                    <h4 className="card-title">
                        Căn hộ
                    </h4>
                    <button className="add-button" onClick={() => this.handleAddApartment()}> +  </button>
                </div>
                <div className="card-body">
                    <span className="label"> Tổng số: </span>
                    <span className="count">{this.state.number__apartments} </span>
                </div>
                <button className="view-all-apartment" onClick={() => this.handleViewAllApartment()}> Xem tất cả</button>


            </div>
        )
    }

}

export default withRouter(Apartment_Home);