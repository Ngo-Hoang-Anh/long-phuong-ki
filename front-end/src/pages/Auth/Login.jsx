/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../store/auth/login/actions';
import { useDispatch, useSelector } from "react-redux";
import Error from '@/components/common/Error';
import { validateEmail } from '@/common/utils/validates';
import { useTranslation } from 'react-i18next';

function Login(props) {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [errorLocal, setErrorLocal] = useState(null);
    const { error } = useSelector(state => state.login);
    const dispatch = useDispatch();
    const handleChangeInput = (input) => (e) => {
        const val = e.target.value;
        if (input === 'email') {
            setEmail(val);
        }
        if (input === 'password') {
            setPassword(val);
        }
    }
    useEffect(() => {
        if (localStorage.getItem('authUser')) {
            props.history.push("/lobby")
        }
    }, [props.history])
    const handleClickLogin = (e) => {
        e.preventDefault();
        if (!email && !password) return;
        if (!validateEmail(email)) return setErrorLocal(t('login_page.email_not_valid'));
        else setErrorLocal(null)
        dispatch(loginUser({ email, password }, props.history));
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClickLogin();
        }
    };
    return (
        <React.Fragment>
            <main>
                <section className="my-account">
                    <div className="lu-container">
                        <div className="my-account-container p-54">
                            <div className="form">
                                <div className="body" id="form-body">
                                    <div className="login">
                                        <div className="form-row">
                                            <label>Email <span className="text-red ml-4">*</span></label>
                                            <input type="Email" placeholder="Email" value={email} onChange={handleChangeInput('email')} />
                                        </div>
                                        <div className="form-row  form-row-po">
                                            <label>{t('password')} <span className="text-red ml-4">*</span></label>
                                            <input type="password" placeholder={t('password')} value={password} onChange={handleChangeInput('password')} />
                                        </div>
                                        {errorLocal && <Error message={errorLocal} />}
                                        {error && <Error message={t('login_page.account_error')} />}
                                        <div className="rem-row" style={{ textAlign: 'center' }}>
                                            <b>
                                                <Link to="/register">{t('register')}</Link>
                                            </b>
                                        </div>
                                        <div className="form-row" >
                                            <button onKeyDown={handleKeyPress} className='btn-acction' onClick={handleClickLogin}>{t('login_page.login')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </React.Fragment>
    )
}

export default Login