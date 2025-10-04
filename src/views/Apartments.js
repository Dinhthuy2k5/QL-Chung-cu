import React from "react";
import '../styles/apartment-styles/Apartment.scss'
import EditFilter from "../components/apartment_component/EditFilter";

class Apartment extends React.Component {
    state = {
        listApartments: [
            { id: 'A001', soNha: '101', loaiCanHo: '2PN', dienTich: '75m²', diaChi: 'Tòa S1, Vinhomes Ocean Park' },
            { id: 'A002', soNha: '102', loaiCanHo: 'Studio', dienTich: '35m²', diaChi: 'Tòa S1, Vinhomes Ocean Park' },
            { id: 'B205', soNha: '205', loaiCanHo: '3PN+1', dienTich: '98m²', diaChi: 'Tòa P4, Times City' },
            { id: 'C512', soNha: '512', loaiCanHo: '1PN', dienTich: '50m²', diaChi: 'Tòa G3, Green Bay' }
        ],
        isEditFilter: false
    }

    setIsEditFilter = (temp) => {
        this.setState({
            isEditFilter: temp
        })
    }
    render() {
        let { listApartments } = this.state;
        return (
            <div className="apartment-table-container">
                <div className="apartment-header-row">
                    <button onClick={() => this.setIsEditFilter(true)}
                    > Lọc </button>

                    <EditFilter show={this.state.isEditFilter} />

                    <h4>Id Căn hộ</h4>
                    <h4>Số nhà</h4>
                    <h4>Loại căn hộ</h4>
                    <h4>Diện tích</h4>
                    <h4>Địa chỉ</h4>
                </div>

                <div className="apartment-table-body">
                    {
                        listApartments && listApartments.length > 0 &&
                        listApartments.map((item, index) => {
                            return (
                                <div className="apartment-data-row" key={item.id}>
                                    <div>{item.id} </div>
                                    <div> {item.soNha} </div>
                                    <div>  {item.loaiCanHo} </div>
                                    <div> {item.dienTich} </div>
                                    <div> {item.diaChi}</div>

                                </div>
                            )

                        })
                    }
                </div>
            </div>
        )


    }
}

export default Apartment;