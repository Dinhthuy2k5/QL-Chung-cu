import React from "react";
import '../../styles/resident-styles/SearchBar.scss'

class SearchBar extends React.Component {
    state = {
        searchText: '',
        searchCategory: 'hoVaTen',
        isDropdownVisible: false
    };

    searchOptions = [
        { value: 'cccd', label: 'CCCD' },
        { value: 'cccdChuHo', label: 'CCCD Chủ hộ' },
        { value: 'hoVaTen', label: 'Họ và Tên' },
        { value: 'gioiTinh', label: 'Giới Tính' }
    ];

    // Ref để theo dõi thẻ div chính của component
    wrapperRef = React.createRef();

    componentDidMount = () => {
        // Thêm event listener để xử lý khi click ra ngoài
        document.addEventListener('mousedown', this.handleClickOustside);
    }

    componentWillUnmount = () => {
        // Gỡ event listener khi component bị hủy
        document.removeEventListener('mousedown', this.handleClickOustside);
    }

    handleClickOustside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
            this.setState({
                isDropdownVisible: false
            });
    }

    handleInputChange = (event) => {
        const searchText = event.target.value;
        this.setState({ searchText });
        this.props.onSearch({
            text: searchText,
            category: this.state.searchCategory
        })

    }

    // Lấy tên hiển thị của tiêu chí đang chọn
    getSelectedCategoryLabel = () => {
        const selectedOption = this.searchOptions.find(opt => opt.value === this.state.searchCategory);
        return selectedOption ? selectedOption.label : "";
    }

    handleCategorySelect = (category) => {
        console.log("handle category");
        this.setState({
            searchCategory: category,
            isDropdownVisible: false
        });
        // Tự động tìm kiếm lại với tiêu chí mới
        this.props.onSearch({
            text: this.state.searchText,
            category: category
        });
    }

    render() {
        const { searchText, isDropdownVisible } = this.state;

        return (
            <div className="search-bar-wrapper" ref={this.wrapperRef}>
                <div className="search-input-container">
                    <span className="search-icon">&#128269; </span>
                    <input
                        type="text"
                        placeholder={`Tìm kiếm theo ${this.getSelectedCategoryLabel()}...`}
                        value={searchText}
                        onChange={this.handleInputChange}
                        onFocus={() => this.setState({ isDropdownVisible: true })}
                    />
                </div>

                {
                    isDropdownVisible && (
                        <div className="search-dropdown">
                            <div className="dropdown-title">TÌM KIẾM THEO </div>
                            {

                                this.searchOptions.map(option => (
                                    <div key={option.value}
                                        className={`dropdown-option ${option.value === this.state.searchCategory ? 'is-selected' : ''}`}
                                        onClick={() => this.handleCategorySelect(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

            </div>

        )
    }



}

export default SearchBar;