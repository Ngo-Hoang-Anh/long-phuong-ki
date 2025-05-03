
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function ButtonRoom(props) {
    const { name, id, onClickDelete, password } = props;
    const userData = useSelector(state => state.user.user?.data);
    const history = useHistory()
    return (
        <div className='btn-room btn-roomTrash '>
            <button onClick={() => history.push(`/${id}`)}>
                <div className='btn-room-text'>
                    {name}
                    {password ? <i style={{ marginLeft: '5px' }} className="fa-solid fa-lock" /> : null}
                </div>
            </button>
            {userData._id === props.ownerId || userData.isAdmin ? <button className='btn-trash' onClick={() => onClickDelete(id, name)}>
                <i className="fa-solid fa-trash"></i>
            </button> : null}
        </div>
    )
}
ButtonRoom.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    ownerId: PropTypes.string.isRequired,
    password: PropTypes.string
}

export default ButtonRoom