import React, { useState, useRef, useEffect } from "react";
import '../../styles/resident-styles/SearchBar.scss';
import { useTranslation } from "react-i18next"; // 1. Import hook

// 2. Chuyển đổi sang Function Component
function SearchBar({ onSearch }) { // Nhận onSearch qua props

    const { t } = useTranslation(); // 3. Lấy hàm t

    // 4. Định nghĩa các tùy chọn tìm kiếm BẰNG CÁCH DÙNG t()
    const searchOptions = [
        { value: 'cccd', label: t('search_bar.option_cccd') },
        { value: 'cccdChuHo', label: t('search_bar.option_head_cccd') },
        { value: 'hoVaTen', label: t('search_bar.option_name') },
        { value: 'gioiTinh', label: t('search_bar.option_gender') }
    ];

    // 5. Chuyển đổi state sang hooks
    const [searchText, setSearchText] = useState('');
    const [searchCategory, setSearchCategory] = useState('hoVaTen');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const wrapperRef = useRef(null); // Tương đương React.createRef()

    // 6. Chuyển đổi componentDidMount/Unmount sang useEffect (xử lý click ra ngoài)
    useEffect(() => {
        // Sửa lỗi chính tả từ handleClickOustside -> handleClickOutside
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]); // Dependency array

    // 7. Chuyển đổi các hàm
    const handleInputChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
        onSearch({
            text: newSearchText,
            category: searchCategory
        });
    }

    const handleCategorySelect = (category) => {
        setSearchCategory(category);
        setIsDropdownVisible(false);
        onSearch({
            text: searchText,
            category: category
        });
    }

    const getSelectedCategoryLabel = () => {
        const selectedOption = searchOptions.find(opt => opt.value === searchCategory);
        return selectedOption ? selectedOption.label : "";
    }

    // 8. Trả về JSX (từ hàm render cũ)
    return (
        <div className="search-bar-wrapper" ref={wrapperRef}>
            <div className="search-input-container">
                <span className="search-icon">&#128269; </span>
                <input
                    type="text"
                    // Dịch placeholder
                    placeholder={`${t('search_bar.placeholder_prefix')} ${getSelectedCategoryLabel()}...`}
                    value={searchText}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownVisible(true)}
                />
            </div>

            {isDropdownVisible && (
                <div className="search-dropdown">
                    <div className="dropdown-title">{t('search_bar.dropdown_title')}</div>
                    {searchOptions.map(option => (
                        <div key={option.value}
                            className={`dropdown-option ${option.value === searchCategory ? 'is-selected' : ''}`}
                            onClick={() => handleCategorySelect(option.value)}
                        >
                            {/* Label ở đây đã được dịch từ mảng searchOptions */}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;