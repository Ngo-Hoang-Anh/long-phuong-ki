
import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, FormFeedback, Form, Label } from 'reactstrap'
import { postRegister } from '@/helpers/fetchHelper';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
    const history = useHistory();
    const { t } = useTranslation();
    const regForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            name: "",
            password: "",
            rePassword: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().required(t('register_page.email_not_null')).email(t('register_page.email_invalid')),
            name: Yup.string().required(t('register_page.name_not_null')),
            password: Yup.string().required(t('register_page.password_not_null')).min(6, t('register_page.password_invalid')),
            rePassword: Yup.string().required(t('register_page.field_not_null')).oneOf([Yup.ref('password'), null], t('register_page.password_not_match'))
        }),
        onSubmit: (values) => {
            if (values) {
                postRegister(values).then(() => {
                    regForm.resetForm();
                    toast.success(t('register_page.register_success'));
                    history.push(`/login`);
                }).catch((err) => {
                    if (err instanceof AxiosError) {
                        return toast.error(err.response.data.msg);
                    }
                    toast.error(t('register_page.register_fail'))
                })
            }
        }
    });
    return (
        <React.Fragment>
            <main>
                <section className="my-account">
                    <div className="lu-container">
                        <div className="my-account-container p-54">
                            <Form className="form" onSubmit={(e) => {
                                e.preventDefault();
                                regForm.handleSubmit()
                                return false;
                            }}>
                                <Link className=' icon-back' to="/login">
                                    <i className="fa-solid fa-chevron-left" />
                                    <span className="text-xxs">{t('back')}</span>
                                </Link>

                                <div className="body" id="form-body active">
                                    <div className="signup">
                                        <div className="form-row">
                                            <Label className="form-label">{t('register_page.fullname')}<span className="text-red ml-4">*</span></Label>
                                            <Input
                                                name='name'
                                                onChange={regForm.handleChange}
                                                onBlur={regForm.handleBlur}
                                                value={regForm.values.name}
                                                type="text"
                                                placeholder={t('register_page.fullname')}
                                                invalid={
                                                    regForm.touched.name && regForm.errors.name
                                                        ? true
                                                        : false
                                                }
                                                style={{ outline: 'none' }}
                                            />
                                            {regForm.touched.name && regForm.errors.name ? (
                                                <FormFeedback type="invalid">
                                                    {regForm.errors.name}
                                                </FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="form-row">
                                            <Label>Email <span className="text-red ml-4">*</span></Label>
                                            <Input
                                                name='email'
                                                onChange={regForm.handleChange}
                                                onBlur={regForm.handleBlur}
                                                value={regForm.values.email}
                                                type="text"
                                                placeholder="Email"
                                                invalid={
                                                    regForm.touched.email && regForm.errors.email
                                                        ? true
                                                        : false
                                                }
                                            />

                                            {regForm.touched.email && regForm.errors.email ? (
                                                <FormFeedback type="invalid">
                                                    {regForm.errors.email}
                                                </FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="form-row  form-row-po">
                                            <Label>{t('password')}<span className="text-red ml-4">*</span></Label>
                                            <Input
                                                name='password'
                                                onChange={regForm.handleChange}
                                                value={regForm.values.password}
                                                type="password"
                                                placeholder={t('password')}
                                                invalid={
                                                    regForm.touched.password && regForm.errors.password
                                                        ? true
                                                        : false
                                                }
                                            />
                                            {regForm.touched.password && regForm.errors.password ? (
                                                <FormFeedback type="invalid">
                                                    {regForm.errors.password}
                                                </FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="form-row  form-row-po">
                                            <Label>{t('repassword')}<span className="text-red ml-4">*</span></Label>
                                            <Input
                                                name='rePassword'
                                                onChange={regForm.handleChange}
                                                value={regForm.values.rePassword}
                                                type="password"
                                                placeholder={t('repassword')}
                                                invalid={
                                                    regForm.touched.rePassword && regForm.errors.rePassword
                                                        ? true
                                                        : false
                                                }
                                            />
                                            {regForm.touched.rePassword && regForm.errors.rePassword ? (
                                                <FormFeedback type="invalid">
                                                    {regForm.errors.rePassword}
                                                </FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="form-row" style={{ paddingTop: '40px' }}>
                                            <button className='btn-acction' type="submit">{t('register')}</button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </section>
            </main>

        </React.Fragment>
    )
}

export default Register