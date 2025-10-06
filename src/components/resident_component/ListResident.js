import React from "react";
import '../../styles/resident-styles/List_Resident.scss'
import SearchBar from "./SearchBar";

class ListResidents extends React.Component {

    state = {
        isFilter: false
    }

    setIsFilter = (temp) => {
        this.setState({
            isFilter: temp
        })
    }
    render() {

        const { listResidents, deleteAResident, handleOpenEditModal, handleAddResident, onSearch } = this.props;
        console.log(listResidents);
        return (
            <div className="list-resident-container">
                <div className="list-resident-header">
                    <SearchBar onSearch={onSearch} />
                    <button className="add-resident-btn" onClick={handleAddResident}>
                        Thêm nhân khẩu
                    </button>
                </div>
                <table>
                    <thead><tr>
                        {/* <th onMouseEnter={()=> this.setIsFilter(true)}
                        onMouseLeave={()=>this.setIsFilter(false)}> Lọc </th> */}
                        <th>CCCD</th>
                        <th>CCCD Chủ hộ</th>

                        <th>Họ và Tên</th>
                        <th>Ngày Sinh</th>
                        <th>Giới Tính</th>
                        <th>Dân Tộc</th>
                        <th>Tôn Giáo</th>
                        <th>Số điện thoại</th>
                        <th>Quan hệ</th>

                        <th className="actions-header">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            listResidents && listResidents.length > 0 ?
                                listResidents.map((item, index) => {
                                    return (
                                        <tr key={item.cccd}>
                                            <td>{item.cccd}</td>
                                            <td>{item.cccdChuHo}</td>

                                            <td>{item.hoVaTen}</td>
                                            <td>{item.ngaySinh}</td>
                                            <td>{item.gioiTinh}</td>
                                            <td>{item.danToc}</td>
                                            <td>{item.tonGiao}</td>
                                            <td>{item.sdt}</td>
                                            <td>{item.quanHe}</td>

                                            <td className="action">
                                                <button className="edit-btn" onClick={() => handleOpenEditModal(item)}>Edit</button>

                                                <button className="delete-btn" onClick={() => deleteAResident(item.cccd)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="8">Không có dữ liệu để hiển thị</td>
                                </tr>

                        }
                    </tbody>
                </table>
            </div >
        )
    }
}

export default ListResidents;