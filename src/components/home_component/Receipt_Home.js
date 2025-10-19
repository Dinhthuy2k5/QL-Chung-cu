import React from "react";
import { withRouter } from "../../HOC/withRouter";
import '../../styles/home-styles/Receipt_Home.scss'

class Receipt_Home extends React.Component {

    state = {
        number_receipt: 0
    }

    handleViewAllReceipt = () => {
        this.props.navigate("/receipts");
    }
    render() {
        return (
            <div className="receipt-card">
                <h4 className="card-title">
                    Khoản thu
                </h4>
                <div className="card-body">
                    <span className="label"> Tổng số: </span>
                    <span className="count">{this.state.number_receipt} </span>
                </div>
                <button className="view-all-receipt" onClick={() => this.handleViewAllReceipt()}> Xem tất cả</button>
            </div>
        )
    }

}

export default withRouter(Receipt_Home);