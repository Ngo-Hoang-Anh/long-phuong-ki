import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
const useAllowPlayGame = ({ roomDetail }) => {
    const userData = useSelector(state => state.user.user?.data);
    if (!roomDetail) return false;
    if (!roomDetail.gameId.isStart) return false; // check game start
    if (roomDetail.participants[0]._id === userData._id && roomDetail.gameId.turn === 'C') {
        return 'C'
    }
    if (roomDetail.participants[1]._id === userData._id && roomDetail.gameId.turn === 'X') {
        return 'X'
    }
    return false;
}
useAllowPlayGame.propTypes = {
    roomDetail: PropTypes.object.isRequired
}
export default useAllowPlayGame