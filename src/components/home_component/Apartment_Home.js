import React from "react";
import '../../styles/home-styles/Apartment_Home.scss'
import { useNavigate } from "react-router-dom";
import react from "react";
import { withRouter } from "../../HOC/withRouter";
import { withTranslation } from "react-i18next";

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
        const { t } = this.props;
        return (
            <div className="apartment-card">
                <div>
                    <h4 className="card-title">
                        {t('home_card.title_apartment')} {/* 3. Dịch chữ "Căn hộ" */}
                    </h4>

                </div>
                <div className="card-body">
                    <span className="label"> {t('home_card.total_count')} </span>
                    <span className="count">{this.props.totalApartments} </span>
                </div>
                <button className="view-all-apartment" onClick={() => this.handleViewAllApartment()}> {t('home_card.view_all')} {/* Dịch "Xem tất cả" */}</button>


            </div>
        )
    }

}

export default withRouter(withTranslation()(Apartment_Home));