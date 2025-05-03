import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { JOIN_GAME_SEND } from '@/common/constants/SocketEventName'
import { JoinGameType } from '@/common/constants/Varibles'
import LoadingByText from '@/components/common/LoadingByText'
import { useTranslation } from 'react-i18next'

const ButtonPlay = ({ roomDetail, moreClass }) => {
    const userData = useSelector(state => state.user.user?.data);
    const { t } = useTranslation(null, { keyPrefix: 'room' });
    const socket = useSelector(state => state.socket.socketIo);
    if (roomDetail.status === 'done') {
        return (
            <button className={'btn-end text-transform ' + moreClass} style={{ borderBottom: 0, fontSize: '14px', margin: '0 49px 16px 0' }}>
                {t('end')}
            </button>
        );
    }
    if (roomDetail.status === 'playing')
        return (
            <button className={'btn-room text-transform ' + moreClass} style={{ borderBottom: 0, fontSize: '14px' }}>
                {t('playing')}...
            </button>
        );
    const clickJoinGame = () => {
        socket.emit(JOIN_GAME_SEND, { roomId: roomDetail._id, gameId: roomDetail.gameId._id, type: JoinGameType.JOIN });
    }
    const clickStartGame = () => {
        socket.emit(JOIN_GAME_SEND, { roomId: roomDetail._id, gameId: roomDetail.gameId._id, type: JoinGameType.START });
    }
    if (userData._id === roomDetail.ownerId) {
        if (roomDetail.gameId.isStart) return null;
        if (roomDetail.participants.findIndex(item => item === null) === -1)
            return (
                <button onClick={clickStartGame} className={'btn-room text-transform ' + moreClass} style={{ borderBottom: 0 }}>
                    <div style={{ fontSize: '14px' }} className="btn-room-text start-text">{t('play')}</div>
                </button>
            )
        else {
            return (
                <button className={'btn-room text-transform ' + moreClass} style={{ borderBottom: 0, fontSize: '14px' }}>
                    <LoadingByText label={t('wait')} />
                </button>
            )
        }
    }
    if (roomDetail.participants.findIndex(item => item === null) !== -1) {
        return (
            <button onClick={clickJoinGame} className={'btn-room text-transform ' + moreClass} style={{ backgroundColor: "#F47F28", borderBottom: 0 }}>
                <div style={{ fontSize: '14px' }} className="btn-room-text start-text">{t('sit')}</div>
            </button>
        )
    }
    if (roomDetail.participants.findIndex(item => item._id === userData._id) !== -1) {
        return (
            <button disabled className={'btn-room text-transform ' + moreClass} style={{ borderBottom: 0, fontSize: '14px' }}>
                <LoadingByText label={t('wait')} />
            </button>
        )
    }
    return null;
}
ButtonPlay.propTypes = {
    roomDetail: PropTypes.object,
    moreClass: PropTypes.string
}
export default ButtonPlay