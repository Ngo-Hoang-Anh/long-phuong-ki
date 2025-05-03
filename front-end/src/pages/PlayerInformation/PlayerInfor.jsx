import { useEffect, useState } from 'react';
import Proptypes from 'prop-types'
import { getHistoryPlayer } from '@/helpers/fetchHelper';
import moment from 'moment';
import { jsPDF } from "jspdf";
import { useTranslation } from 'react-i18next';

const PlayerInfo = ({ match }) => {
    const playerId = match.params.id;
    const { t } = useTranslation(null, { keyPrefix: 'player_info' });
    const [playerHistories, setPlayerHistories] = useState(null);
    const [history, setHistory] = useState([]);
    const [gameInfo, setGameInfo] = useState(null);
    useEffect(() => {
        if (playerId) {
            getHistoryPlayer(playerId).then((res) => {
                if (!res.error) {
                    setPlayerHistories(res.data);
                } else {
                    console.log('get player error')
                }
            }).catch(err => console.log(err))
        }
    }, [playerId]);
    const handleClickRow = (history) => {
        setHistory(history.gameId.history);
        setGameInfo(history);
    }
    const handleClickDownload = () => {
        if (history.length && gameInfo) {
            const doc = new jsPDF();
            doc.addFont('/font/Roboto-Regular.ttf', 'Roboto', 'normal');
            doc.setFont("Roboto");
            doc.text(t('game_record'), 85, 10);
            doc.text(t('room_name') + `: ${gameInfo.name}`, 5, 25);
            doc.text(t('play_date_time') + `: ${moment(gameInfo.createdAt).format("DD-MM-YYYY HH:mm")}`, 5, 35);
            doc.text(t('winner') + `: ${gameInfo.win === "C" ? gameInfo.participants[0].name + `(${t("orange")})` : gameInfo.participants[1].name + `(${t("green")})`}`, 5, 45);
            doc.text(t('orange_player') + `: ${gameInfo.participants[0].name}`, 5, 55);
            doc.text(t('green_player') + `: ${gameInfo.participants[1].name}`, 120, 55);
            let y = 55;
            for (let index = 1; index < history.length + 2; index += 2) {
                const odd = history[index - 1];
                const even = history[index];
                if (y + 15 >= doc.internal.pageSize.height) {
                    doc.addPage();
                    y = 15;
                } else {
                    y += 15;
                }
                odd && doc.text(`${index}.${odd}`, 5, y);
                even && doc.text(`${index + 1}.${even}`, 120, y);
            }
            doc.save(t('file_name') + `_(${moment().locale('vi').format('DD-MM HH:mm:ss')}).pdf`);
        }
    }
    return (
        <div className='playerInfo'>
            <div className='lu-container'>
                <div className='header-playerInfo'>
                    <span className='header-text-h1'>{t('player_info')}</span>
                </div>

                <div className='section-playerInfo'>
                    <div className='header-text-h2'>{t('player_name')}</div>
                    <p>{t('name')}: <strong>{playerHistories && playerHistories.playerInfo.name}   </strong></p>

                    <div className='wrapper-playerInfo'>
                        <div className="match-history">
                            <div className='header-text-h2'>{t('match_history')}</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t('sequence_number')}</th>
                                        <th>{t('time')}</th>
                                        <th>{t('opponent')}</th>
                                        <th>{t('result')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playerHistories && playerHistories.histories.map((history, idx) => (
                                        <tr style={{ cursor: 'pointer' }} key={history._id} onClick={() => handleClickRow(history)}>
                                            <td>{idx + 1}</td>
                                            <td>{moment(history.createdAt).locale('vi').format('DD-MM-YYYY HH:mm')}</td>
                                            <td>{history.participants.filter(i => i._id !== playerId)[0].name}</td>
                                            <td>{
                                                (history.win === 'C' && history.participants[0]._id === playerId) || (history.win === 'X' && history.participants[1]._id === playerId)
                                                    ? t('win')
                                                    : t('lose')
                                            }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        <div className="move-history">
                            <div className="lobby-inner online-inner ">
                                <div className="lobby-side-left-header justify-center gap-10 flex bolr-4 flex-column">
                                    <div className="lu-h3">{t('record')}</div>
                                    <div style={{ fontSize: '12px' }}>{gameInfo?.name}</div>
                                </div>
                                <div className="ky-pho-list-playerInfo">
                                    <div className='move-right'>
                                        {history.map((item, index) => {
                                            if ((index + 1) % 2 === 1) {
                                                return (
                                                    <div key={index} className="move">
                                                        <span>{index + 1}</span>
                                                        <span>{item}</span>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div className='move-left'>
                                        {history.map((item, index) => {
                                            if ((index + 1) % 2 === 0) {
                                                return (
                                                    <div key={index} className="move">
                                                        <span>{index + 1}</span>
                                                        <span>{item}</span>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="load-more">
                                <button onClick={() => handleClickDownload()} className='dl-playerInfo'>{t('download_pdf')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

PlayerInfo.propTypes = {
    match: Proptypes.object
}
export default PlayerInfo;
