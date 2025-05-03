import Proptypes from 'prop-types';
const LoadingByText = ({ label }) => {

    return (
        <div className="loading-container">
            <div className="loading-text">
                {
                    label.split('').map((char, idx) => (
                        <span key={idx} style={{ '--index': idx }}>{char}</span>
                    ))
                }
            </div>
        </div>
    )
}
LoadingByText.propTypes = {
    label: Proptypes.string.isRequired
}
export default LoadingByText