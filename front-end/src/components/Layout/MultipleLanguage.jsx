
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

const MultipleLanguage = () => {
    const { i18n } = useTranslation();
    const [stateOption, setStateOption] = useState(i18n.language)
    const onChangeHandle = (e) => {
        if (e.target.value === 'en') {
            i18n.changeLanguage('en');
        }
        if (e.target.value === 'vi') {
            i18n.changeLanguage('vi');
        }
        setStateOption(e.target.value)
    };
    return (
        <div className='multiple-language flex'>
            <i className="fa-solid fa-globe"></i>
            <div className="language-selector">
                {/* <label htmlFor="language">Choose language:</label> */}
                <select id="language" onChange={onChangeHandle} value={stateOption}>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                </select>
            </div>
        </div>

    )
}

export default MultipleLanguage