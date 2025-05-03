/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Proptypes from 'prop-types'
import ChatBox from './ChatBox'
import { useSelector } from 'react-redux'
import BoardGame from '@/components/BoardGame'
import Clock from './StopWatch'
import { Link, useHistory } from 'react-router-dom'
import { JOIN_GAME_RECEIVE, JOIN_ROOM, ROOM_MOVE_RECEIVE, ROOM_MOVE_SEND } from '@/common/constants/SocketEventName'
import { getDetailRoom } from '@/helpers/fetchHelper'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ClockLoader } from 'react-spinners'
import ButtonPlay from './ButtonPlay'
import { JoinGameType } from '@/common/constants/Varibles'
import useAllowPlayGame from '@/common/hooks/useAllowPlayGame'
import { ChessType } from '@/common/constants/Enum'
import { Button, Input, Label } from 'reactstrap'
import PlayerHand from './PlayerHand'
import { checkIsSameType } from '@/components/BoardGame/engine'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next';
import moveSound from '/sound/play_chess.mp3';
import tiktakSound from "/sound/_tiktac.mp3";
import Logo from '/image/logo.png';
import ShortRule from './ShortRule'



function Room({ match }) {
    const roomId = match.params.id;
    const socket = useSelector(state => state.socket.socketIo);
    const { t } = useTranslation(null, { keyPrefix: 'room' });
    // eslint-disable-next-line no-unused-vars
    const [playSound, _] = useState(new Audio(moveSound));
    const [playSoundExtratime] = useState(new Audio(tiktakSound));
    const userData = useSelector(state => state.user.user?.data);
    const [isCloseKypho, setCloseKypho] = useState(window.innerWidth >= 1300 ? true : false);
    const [isChatOpen, setIsChatOpen] = useState(window.innerWidth >= 1300 ? true : false);
    const [isMute, setIsMute] = useState(false);
    const history = useHistory();
    const [pickChess, setPickChess] = useState(null);
    const [isMoveTeam, setIsMoveTeam] = useState(false);
    const [chessboard, setChessboard] = useState([]);
    const [roomDetail, setRoomDetail] = useState(null);
    const [message, setMessage] = useState([]);
    const [idxOfPlayer, setIdxOfPlayer] = useState(-1);
    const [passwordRoom, setPasswordRoom] = useState({ permisstion: false, inputPassword: '', error: null });
    const [isClick, setIsClick] = useState(true);
    const chessBoardRef = useRef(null);
    const kyPhoRef = useRef(null);
    const isAllow = useAllowPlayGame({ roomDetail });
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isOpenRule, setIsOpenRule] = useState(false);
    const handlePopupMainClick = () => {
        setPopupVisible(!isPopupVisible);
    };
    useEffect(() => {
        if (roomId && passwordRoom.permisstion) {
            socket.emit(JOIN_ROOM, { roomId });
        }
    }, [roomId, socket, passwordRoom.permisstion]);
    useEffect(() => {
        if (kyPhoRef.current) {
            kyPhoRef.current.scrollTop = kyPhoRef.current.scrollHeight;
        }
    }, [roomDetail?.gameId.history])
    useEffect(() => {
        socket.on(ROOM_MOVE_RECEIVE, (data) => {
            if (data) {
                if (data.game._id !== roomDetail.gameId._id) return;
                if (data.isPlaySound) {
                    playSound.play().catch(() => setIsMute(true))
                }
                if (data.type === 'end_game') {
                    const { room, board } = data;
                    setChessboard(board);
                    setRoomDetail(room);
                    return;
                }
                if (data.type === 'move') {
                    const { endRow, endCol } = data.position;
                    if (isAllow)
                        setPickChess(data.game.board[endRow][endCol]);
                }
                if (data.type === 'done') {
                    setPickChess(null);
                }
                setChessboard(data.game.board);
                setRoomDetail(() => ({
                    ...roomDetail,
                    gameId: data.game
                }))
            } else {
                console.log('data from socket is null');
            }
            setIsClick(true);
        })
        return () => {
            socket.off(ROOM_MOVE_RECEIVE);
        }
    }, [chessboard, setChessboard, setPickChess, socket, roomDetail])
    useEffect(() => {
        if (roomId) {
            socket.on(JOIN_GAME_RECEIVE, ({ data, type }) => {
                switch (type) {
                    case JoinGameType.JOIN: {
                        let idx = data.participants.findIndex(i => i?._id === userData._id);
                        setIdxOfPlayer(idx === -1 || idx === 1 ? 1 : 0);
                        setRoomDetail(data);
                    }
                        break;
                    case JoinGameType.START: {
                        setRoomDetail(data);
                        break;
                    }
                    default:
                        break;
                }
            });
            return () => {
                socket.off(JOIN_GAME_RECEIVE)
            }
        }
    }, [roomId, socket, roomDetail]);
    useEffect(() => {//width control
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);
    const updateDimensions = () => {
        if (window.innerWidth >= 1300) {
            setCloseKypho(true);
            setIsChatOpen(true);
        } else {
            setCloseKypho(false);
            setIsChatOpen(false);
        }
    }

    const handleCancelClick = () => {
        setIsChatOpen((pre) => !pre)
    }
    const handleKyphoClick = () => {
        setCloseKypho((pre) => !pre)
    }
    const buttonClickRotate = useCallback((type) => () => {
        if (!pickChess) return;
        const { isRotate, position } = pickChess;
        if (!isRotate) return;
        if (isAllow && ((roomDetail.gameId.isMoved && position.row === roomDetail.gameId.historyTemp.end.row && position.col === roomDetail.gameId.historyTemp.end.col) || !roomDetail.gameId.isMoved)) {
            let isSameType = checkIsSameType({ row: position.row, col: position.col, chessboard, piece: pickChess });
            socket.emit(ROOM_MOVE_SEND, {
                type: 'rotate',
                roomId: roomDetail._id,
                isSameType,
                gameId: roomDetail.gameId._id,
                objChest: pickChess,
                direction: type
            });
        }
        if (roomDetail.gameId.isDrop) return;
        return setPickChess(null);
    }, [pickChess, roomDetail]);
    const buttonClickOk = useCallback(() => {
        isAllow && roomDetail.gameId.isMoved && socket.emit(ROOM_MOVE_SEND, {
            type: 'done',
            roomId: roomDetail._id,
            gameId: roomDetail.gameId._id
        }) && setPickChess(null);
    }, [roomDetail])
    const buttonClickMoveTeam = useCallback(() => {
        setIsMoveTeam(() => !isMoveTeam)
    }, [roomDetail, isMoveTeam])
    const buttonClickSurrender = useCallback(() => {
        if (isAllow) {
            Swal.fire({
                title: t('surrender_text'),
                showDenyButton: true,
                confirmButtonText: t('confirm'),
                denyButtonText: t('cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    socket.emit(ROOM_MOVE_SEND, {
                        roomId: roomDetail._id,
                        gameId: roomDetail.gameId._id,
                        type: 'surrender'
                    })
                }
            });
        }
    }, [roomDetail])
    const handleDragStartChessFromPrison = (chessItem) => () => {
        if (isAllow === 'C' && chessItem.teamType === 'C' && roomDetail.gameId.status === 'setup') {
            let bRow = chessboard[1].map((chess) => ({ ...chess, isRecommed: true }))
            chessboard[1] = bRow;
            setChessboard([...chessboard]);
        }
        else if (isAllow === 'X' && chessItem.teamType === 'X' && roomDetail.gameId.status === 'setup') {
            let hRow = chessboard[7].map(chess => ({ ...chess, isRecommed: true }));
            chessboard[7] = hRow;
            setChessboard([...chessboard]);
        } else {
            let fullRow = chessboard.map((row) => row.map(chess => {
                if (!chess?.teamType || chess.teamType === isAllow && (chess.type !== ChessType.Vuong)) {
                    return { ...chess, isRecommed: true }
                } return chess;
            }));
            setChessboard(fullRow);
        }
        setPickChess(chessItem)
    }
    const resetReccomandChess = useCallback(() => {
        setChessboard((preChess) => preChess.map((row) => row.map(item => item?.isRecommed ? { ...item, isRecommed: false } : item)));
        setPickChess(null);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chessBoardRef.current && !chessBoardRef.current.contains(event.target)) {
                resetReccomandChess();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [resetReccomandChess]);
    useEffect(() => {
        getDetailRoom(roomId).then((res) => {
            if (res.data) {
                setRoomDetail(res.data.room);
                setChessboard(res.data.room.gameId.board);
                setMessage(res.data.listMessages);
                let idx = res.data.room.participants.findIndex(i => i?._id === userData._id);
                setIdxOfPlayer(idx === -1 || idx === 1 ? 1 : 0);
                if (res.data.room.password === '') {
                    setPasswordRoom((pre) => ({ ...pre, permisstion: true }))
                } else if (res.data.room.participants.findIndex(item => item?._id === userData._id) !== -1) {
                    setPasswordRoom((pre) => ({ ...pre, permisstion: true }))
                }
            } else {
                toast.error(t('current_room_unavailable'));
                setTimeout(() => {
                    history.push('/');
                }, 1000);
            }
        }).catch((err) => {
            if (err instanceof AxiosError) {
                setTimeout(() => {
                    history.push('/');
                }, 1000);
                return toast.error(err.response.data.msg);
            }
            console.log(err)
            toast.error(t('get_room_info_failed'))
        })
    }, [roomId]);
    const handleInputPassword = (e) => {
        let value = e.target.value;
        setPasswordRoom((preState) => ({
            ...preState,
            inputPassword: value,
            error: null
        }))
    }
    const handleClickConfirmPassword = () => {
        if (passwordRoom.inputPassword === roomDetail.password) {
            setPasswordRoom((preState) => ({ ...preState, permisstion: true, error: null }))
        } else {
            setPasswordRoom((preState) => ({ ...preState, error: t('incorrect_room_password') }))
        }
    }
    if (!roomDetail) {
        return null
    }
    if (!passwordRoom.permisstion) {
        return (
            <React.Fragment>
                <div className='room'>
                    <div className='lu-container'>
                        <div className='lu-container-header'>
                            <Link className=' icon-back' to="/login">
                                <i className="fa-solid fa-chevron-left" style={{ paddingBottom: '10px' }} />
                                <span className="text-xxs" style={{ paddingBottom: '10px' }}>{t('back')}</span>
                            </Link>
                        </div>
                    </div>
                    <div className='lu-container'>
                        <div className='my-account-container p-54 room-password'>
                            <Label className='text-password'>
                                {t('room_password')}<span className="text-red ml-4">*</span>
                            </Label>
                            <Input
                                type='password'
                                onChange={handleInputPassword}
                                value={passwordRoom.inputPassword}
                            />
                            {passwordRoom.error ? <span className="text-red ml-4">{passwordRoom.error}</span> : null}
                            <Button onClick={handleClickConfirmPassword}>
                                {t('confirm_password')}
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <div className='room' style={{ pointerEvents: !isClick ? 'none' : null }}>
                <div className='lu-container'>
                    <div className='lu-container-header'>
                        <Link className=' icon-back' to="/login">
                            <i className="fa-solid fa-chevron-left" style={{ paddingBottom: '10px' }} />
                            <span className="text-xxs" style={{ paddingBottom: '10px' }}>{t('back')}</span>
                        </Link>
                        <ButtonPlay moreClass='' roomDetail={roomDetail} />
                    </div>
                    <div className='room-container'>
                        <div className='roomPlayer'>
                            <div className='xl-flex'>
                                <div className="lobby-inner online-inner board-infor ">
                                    <div className="justify-center gap-10 flex bolr-4">
                                        <div className="lu-h3">{
                                            idxOfPlayer === 1 ?
                                                (roomDetail.participants[0] ? <Link
                                                    style={{ fontWeight: 'bold' }}
                                                    className='link-un-decoration'
                                                    to={`/player/${roomDetail.participants[0]._id}`}>{roomDetail.participants[0].name}
                                                </Link> : t('no_players')) : (
                                                    roomDetail.participants[1] ? <Link
                                                        style={{ fontWeight: 'bold' }}
                                                        className='link-un-decoration'
                                                        to={`/player/${roomDetail.participants[1]._id}`}>{roomDetail.participants[1].name}
                                                    </Link> : t('no_players')
                                                )
                                        }
                                        </div>
                                        {
                                            idxOfPlayer === 1 ?
                                                (roomDetail?.gameId?.turn === 'C' && roomDetail.status === 'playing' && <ClockLoader color='#b95910' size={25} />) :
                                                (roomDetail?.gameId?.turn === 'X' && roomDetail.status === 'playing' && <ClockLoader color='#5d9948' size={25} />)
                                        }
                                    </div>
                                    {idxOfPlayer === 1 ?
                                        (<Clock
                                            team='C'
                                            times={roomDetail.gameId.timers[0]}
                                            isStart={roomDetail.gameId.status === 'play' && roomDetail.gameId.turn === 'C' && roomDetail.status === 'playing'}
                                            roomDetail={roomDetail}
                                            playSound={playSoundExtratime}
                                            setIsMuted={setIsMute}
                                        />) :
                                        (<Clock
                                            team='X'
                                            times={roomDetail.gameId.timers[1]}
                                            isStart={roomDetail.gameId.status === 'play' && roomDetail.gameId.turn === 'X' && roomDetail.status === 'playing'}
                                            roomDetail={roomDetail}
                                            playSound={playSoundExtratime}
                                            setIsMuted={setIsMute}
                                        />)
                                    }
                                    <div className='chess-square-box right'>
                                        <div className='chess-square-inner'>
                                            {
                                                idxOfPlayer === 1 ?
                                                    (<PlayerHand
                                                        prisons={roomDetail.gameId.orangePrison.map(item => ({ ...item, rotate: item.rotate + 180 }))}
                                                        isResverse
                                                    />) :
                                                    (<PlayerHand
                                                        prisons={roomDetail.gameId.greenPrison.map(item => ({ ...item, rotate: item.rotate + 180 }))}
                                                        isResverse
                                                    />)
                                            }
                                        </div>
                                    </div>
                                </div>
                                <ChatBox
                                    handleCancelClick={handleCancelClick}
                                    isChatOpen={isChatOpen}
                                    stateMessage={[message, setMessage]}
                                    roomId={roomId}
                                    roomStatus={roomDetail.status}
                                    participants={roomDetail.participants}
                                />
                            </div>
                        </div>
                        <div className='chessboard-wrapper' ref={chessBoardRef}>
                            <div className='chessboard-icon'>
                                <button onClick={buttonClickRotate('left')} className='btn-play' data-tooltip="Xoay Trái">
                                    <i className="fa-solid fa-rotate-left" />
                                </button>

                                <button onClick={buttonClickRotate('right')} className='btn-play' data-tooltip="Xoay Phải">
                                    <i className="fa-solid fa-rotate-right" />
                                </button>

                                <button onClick={buttonClickMoveTeam} className='btn-play' data-tooltip={isMoveTeam ? 'Đi đội' : "Không đi đội"}>
                                    <i className="fa-regular fa-clone" />
                                    {!isMoveTeam ? <i className="close-icon fa-solid fa-xmark" /> : null}
                                </button>
                                <button onClick={buttonClickOk} className='btn-play' data-tooltip="OK">
                                    <i className="fa-solid fa-check" />
                                </button>
                                <button onClick={buttonClickSurrender} className='btn-play' data-tooltip="Đầu hàng">
                                    <i className="fa-regular fa-flag" />
                                </button>
                                {isMute ? <button onClick={() => setIsMute(false)} className='btn-play' data-tooltip="Open Volume">
                                    <i className="fa-solid fa-volume-up" />
                                </button> : null}
                            </div>
                            <BoardGame
                                roomDetail={roomDetail}
                                gameId={roomDetail.gameId._id}
                                satePickChess={[pickChess, setPickChess]}
                                sateChessBoard={[chessboard, setChessboard]}
                                isMoveTeam={isMoveTeam}
                                setIsClick={setIsClick}
                            />

                        </div>

                        <div className='sibar-room-right'>
                            {isCloseKypho &&
                                <div className="lobby-inner online-inner pp-kypho">
                                    <div style={{
                                        gap: 0
                                    }} className="lobby-side-left-header justify-center gap-10 flex bolr-4 flex-column">
                                        <div className="lu-h3">{t('record')}</div>
                                        <div style={{ fontSize: '12px' }}>{roomDetail?.name}</div>
                                        <div className="hidden-xl kypho-list" onClick={handleKyphoClick}>
                                            <i className="fa-regular fa-circle-xmark"></i></div>
                                    </div>
                                    <div className="ky-pho-list" ref={kyPhoRef}>
                                        <div className='move-right'>
                                            <div className='name-kp text-name-kypho'>{roomDetail.participants[0] ? roomDetail.participants[0].name : ""}</div>
                                            {roomDetail?.gameId.history.map((item, index) => {
                                                if ((index + 1) % 2 === 1) {
                                                    return (
                                                        <div key={index} className="move">
                                                            <span>{index + 1}</span>
                                                            <span>{item}</span>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <div className='move-left'>
                                            <div className='name-kp text-name-kypho'>{roomDetail.participants[1] ? roomDetail.participants[1].name : ""}</div>
                                            {roomDetail?.gameId.history.map((item, index) => {
                                                if ((index + 1) % 2 === 0) {
                                                    return (
                                                        <div key={index} className="move">
                                                            <span>{index + 1}</span>
                                                            <span>{item}</span>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>

                                    </div>
                                </div>}
                            <div className="lobby-inner online-inner board-infor bottom  ">
                                <div className="justify-center gap-10 flex bolr-4">
                                    <div className="lu-h3">
                                        {idxOfPlayer === 1 ?
                                            (roomDetail.participants[1] ? <Link style={{ fontWeight: 'bold' }}
                                                className='link-un-decoration'
                                                to={`/player/${roomDetail.participants[1]._id}`}>{roomDetail.participants[1].name}
                                            </Link> : t('no_players')) :
                                            (roomDetail.participants[0] ? <Link style={{ fontWeight: 'bold' }}
                                                className='link-un-decoration'
                                                to={`/player/${roomDetail.participants[0]._id}`}>{roomDetail.participants[0].name}
                                            </Link> : t('no_players'))
                                        }
                                    </div>
                                    {idxOfPlayer === 1 ?
                                        (roomDetail?.gameId?.turn === 'X' && roomDetail.status === 'playing' && <ClockLoader color='#5d9948' size={25} />) :
                                        (roomDetail?.gameId?.turn === 'C' && roomDetail.status === 'playing' && <ClockLoader color='#b95910' size={25} />)
                                    }
                                </div>
                                {idxOfPlayer === 1 ?
                                    (<Clock
                                        team='X'
                                        times={roomDetail.gameId.timers[1]}
                                        isStart={roomDetail.gameId.status === 'play' && roomDetail.gameId.turn === 'X' && roomDetail.status === 'playing'}
                                        roomDetail={roomDetail}
                                        playSound={playSoundExtratime}
                                        setIsMuted={setIsMute}
                                    />) :
                                    (<Clock
                                        team='C'
                                        times={roomDetail.gameId.timers[0]}
                                        isStart={roomDetail.gameId.status === 'play' && roomDetail.gameId.turn === 'C' && roomDetail.status === 'playing'}
                                        roomDetail={roomDetail}
                                        playSound={playSoundExtratime}
                                        setIsMuted={setIsMute}
                                    />)
                                }
                                <div className='chess-square-box'>
                                    <div className='chess-square-inner'>
                                        {

                                            idxOfPlayer === 1 ?
                                                (<PlayerHand
                                                    prisons={roomDetail.gameId.greenPrison}
                                                    handleClickChess={handleDragStartChessFromPrison}
                                                    isAllow={isAllow}
                                                />) :
                                                (<PlayerHand
                                                    prisons={roomDetail.gameId.orangePrison}
                                                    handleClickChess={handleDragStartChessFromPrison}
                                                    isAllow={isAllow}
                                                />)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='popupLobby'>
                            <div className={`pu-logo-items popup-question hidden-xl ${isPopupVisible ? '' : 'hidden'}`} onClick={() => setIsOpenRule((pre) => !pre)}>
                                <i className="fa-solid fa-question"></i>
                            </div>
                            <div className={`hidden-xl pp-item1 ${isPopupVisible ? '' : 'hidden'}`}>
                                <div className='pu-logo-items popup-chat' onClick={handleCancelClick}>
                                    <i className="fa-brands fa-rocketchat"></i>
                                </div>
                                <div className='pu-logo-items popup-kypho' onClick={handleKyphoClick}>
                                    <i className="fa-solid fa-rectangle-list"></i>
                                </div>
                            </div>
                            <div className='hidden-xl popup-main' onClick={handlePopupMainClick}>
                                <div className='pu-logo-items'>
                                    <img style={{ borderRadius: '50%' }} className="logo" src={Logo} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ShortRule isOpen={[isOpenRule, setIsOpenRule]} />
                </div>
            </div>
        </React.Fragment>
    )
}
Room.propTypes = {
    match: Proptypes.object
}
export default Room