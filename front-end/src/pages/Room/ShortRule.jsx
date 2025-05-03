import { useTranslation } from "react-i18next";

function ShortRule({ isOpen }) {
    const [isOpenRule, setIsOpenRule] = isOpen;
    const { t } = useTranslation(null, { keyPrefix: 'rule' });
    const toggleOpen = () => {
        setIsOpenRule((pre) => !pre);
    }
    return (
        <div hidden={!isOpenRule} className='rule'>
            <div className='rule-header'>
                <div className="lu-h3">rule</div>
                <div className="rule-icon" onClick={toggleOpen}>
                    <i className="fa-regular fa-circle-xmark" />
                </div>
            </div>
            <div className='rule-content'>
                <div>

                    <div className="rule-title" >
                        <div>{t('short_rule.title')}</div>
                    </div>
                    <div className='rule-text'>
                        <ol>
                            <li>{t('short_rule.1')}</li>
                            <li>{t('short_rule.2')}</li>
                            <li>{t('short_rule.3')}</li>
                            <li>{t('short_rule.4')}</li>
                            <li>{t('short_rule.5')}</li>
                            <li>{t('short_rule.6')}</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className="rule-title" >
                        <div>{t('move_rule.title')}</div>
                    </div>
                    <div className='rule-text'>
                        <ol>
                            <li>{t('move_rule.1')}</li>
                            <li>{t('move_rule.1_1')}</li>
                            <li>{t('move_rule.1_2')}</li>
                            <li>{t('move_rule.2')}</li>
                            <li>{t('move_rule.2_1')}</li>
                            <li>{t('move_rule.2_2')}.</li>
                            <li>{t('move_rule.2_3')}</li>
                            <li>{t('move_rule.2_4')}</li>
                            <li> {t('move_rule.2_5')}</li>
                            <li>{t('move_rule.3')}</li>
                            <li>{t('move_rule.3_1')}</li>
                            <li>{t('move_rule.3_2')}</li>
                            <li>{t('move_rule.3_3')}.</li>
                            <li>{t('move_rule.3_4')}</li>
                            <li>{t('move_rule.4')}</li>
                            <li>{t('move_rule.4_1')}</li>
                            <li>{t('move_rule.4_2')}</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className="rule-title" >
                        <div>{t('game_end.title')}</div>
                    </div>
                    <div className='rule-text'>
                        <ol>
                            <li>{t('game_end.1')}</li>
                            <li>{t('game_end.2')}</li>
                            <li>{t('game_end.3')}</li>
                            <li>{t('game_end.4')}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShortRule