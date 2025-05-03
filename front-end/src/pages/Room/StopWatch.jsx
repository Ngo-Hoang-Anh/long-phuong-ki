import { useState, useEffect, useRef, useCallback } from 'react';
import Proptypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ROOM_MOVE_SEND } from '@/common/constants/SocketEventName';
import useAllowPlayGame from '@/common/hooks/useAllowPlayGame';
const Clock = ({ times, roomDetail, team, isStart, playSound, setIsMuted }) => {
    const isAllow = useAllowPlayGame({ roomDetail });
    const [time, setTime] = useState(times);
    const [byoyomi, setByoyomi] = useState(times.byoyomi);
    const [isExtraTime, setIsExtraTime] = useState(times.time <= 60);
    const socket = useSelector(state => state.socket.socketIo);
    const userData = useSelector(state => state.user.user?.data);
    const workerRef = useRef(null);
    useEffect(() => {
        setTime(times)
    }, [times])
    useEffect(() => {
        let indexOfU = roomDetail.participants.findIndex(x => x?._id === userData._id)
        let isYourTurn = (indexOfU === 0 && roomDetail.gameId.turn === 'C') || (indexOfU === 1 && roomDetail.gameId.turn === 'X');
        if (isStart && isYourTurn && isExtraTime) {
            playSound.loop = true;
            playSound.currentTime = 0;
            playSound.play().catch(() => setIsMuted(true));
        } else {
            playSound.pause();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStart, roomDetail, isExtraTime, userData, playSound]);
    useEffect(() => {
        workerRef.current = new Worker('/timerWorker.js?v=1.0.0');
        workerRef.current.onmessage = (event) => {
            const { type, timeCount, isExtra } = event.data;
            switch (type) {
                case 'TICK':
                    setTime(timeCount);
                    break;
                case 'EXTRATIME':
                    setIsExtraTime(!!isExtra);
                    break;
                case 'TIMEOUT':
                    isAllow && socket.emit(ROOM_MOVE_SEND, {
                        type: 'time_out',
                        roomId: roomDetail._id,
                        gameId: roomDetail.gameId._id,
                        team: roomDetail.gameId.turn
                    });
                    workerRef.current.terminate()
                    break;
                case 'UPDATE':
                    setByoyomi(timeCount.byoyomi);
                    setTime((pre) => ({ ...pre, time: timeCount.time }))
                    break;
                default:
                    break;
            }
        }
        return () => {
            workerRef.current.terminate();
        }
    }, [isAllow]);
    useEffect(() => {
        let isStartClock = false;
        if (team === 'C' && roomDetail.gameId.turn === 'C') {
            isStartClock = roomDetail.gameId.status === 'setup' && roomDetail.gameId.orangePrison.filter(prison => prison.quantity === 1).length === 1;
        }
        if (team === 'X' && roomDetail.gameId.turn === 'X') {
            isStartClock = roomDetail.gameId.status === 'setup' && roomDetail.gameId.greenPrison.filter(prison => prison.quantity === 1).length === 1;
        }
        if ((isStart || isStartClock) && roomDetail.status !== 'done') {
            workerRef.current.postMessage({ type: 'START', timeCount: times })
        }
    }, [isStart, roomDetail, times]);
    const handleTime = useCallback((time) => {
        let minutes = Math.floor(time.time / 60);
        let seconds = Math.floor(time.time - minutes * 60)
        return seconds.toString().length === 1 ? `${minutes} : 0${seconds}` : `${minutes} : ${seconds}`
    }, [])
    return (
        <div style={{ color: time.time >= 0 && time.time <= 60 ? 'red' : null }} className="clock">
            <i className="fa-solid fa-clock" />
            <div className="time" id="hours">{handleTime(time)}</div>
            <div className='parentheses'>({byoyomi})</div>
        </div>
    );
};
Clock.propTypes = {
    times: Proptypes.object,
    isStart: Proptypes.bool.isRequired,
    team: Proptypes.string.isRequired,
    roomDetail: Proptypes.object.isRequired,
    playSound: Proptypes.object.isRequired,
    setIsMuted: Proptypes.func.isRequired
}
export default Clock;

