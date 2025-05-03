import PropTypes from 'prop-types'
function Error(props) {
    const { message } = props
    return (
        <div
            style={{ color: 'red' }}
        >
            {message ? message : "Lỗi"}
        </div>
    )
}

Error.propTypes = {
    message: PropTypes.string.isRequired
}
export default Error