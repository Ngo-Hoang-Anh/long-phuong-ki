
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    Form,
    FormGroup,
    FormFeedback,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const objectTimers = [
    {
        byoyomi: 5,
        time: 900,
        style: 900,
        isExtra: false
    },
    {
        byoyomi: 5,
        time: 600,
        style: 600,
        isExtra: false
    },
    {
        byoyomi: 5,
        time: 300,
        style: 300,
        isExtra: false
    }
]
const ModalCreateRoom = ({ modal, toggle, className, onClickSuccess }) => {
    const userData = useSelector(state => state.user.user?.data);
    const { t } = useTranslation(null, { keyPrefix: 'lobby' });
    const creatRoomForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            roomName: t('create_room_name_default') + ` ${userData.name}`,
            timers: "0",
            password: "",
            color: "random"
        },
        validationSchema: Yup.object({
            roomName: Yup.string().required(t('room_name_not_empty')),
            password: Yup.string().notRequired().min(6, t('password_at_least_6_characters'))
        }),
        onSubmit: (values) => {
            const objCreateRoom = {
                ...values,
                timers: objectTimers[values.timers],
                color: values.color === 'random' ? (Math.random() < 0.5 ? "C" : "X") : values.color
            }
            onClickSuccess(objCreateRoom);
        }
    })
    return (
        <Modal
            isOpen={modal}
            toggle={toggle}
            className={className}
            centered
        >
            <ModalHeader>{t('create_room')}</ModalHeader>
            <ModalBody>
                <Form
                    style={{ maxHeight: '400px' }}
                    className="form form-taophong"
                    onSubmit={(e) => {
                        e.preventDefault();
                        creatRoomForm.handleSubmit()
                        return false;
                    }}
                >
                    <FormGroup>
                        <Label for="exampleEmail">
                            {t('room_name')}<span className="text-red ml-4">*</span>
                        </Label>
                        <div className='form-taophong'>

                            <Input
                                name='roomName'
                                onChange={creatRoomForm.handleChange}
                                onBlur={creatRoomForm.handleBlur}
                                value={creatRoomForm.values.roomName}
                                type="text"
                                placeholder={t('room_name')}
                                invalid={
                                    creatRoomForm.touched.roomName && creatRoomForm.errors.roomName
                                        ? true
                                        : false
                                }
                            />
                        </div>

                        {creatRoomForm.touched.roomName && creatRoomForm.errors.roomName ? (
                            <FormFeedback type="invalid">
                                {creatRoomForm.errors.roomName}
                            </FormFeedback>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail">
                            {t('password')}
                        </Label>
                        <Input
                            name='password'
                            onChange={creatRoomForm.handleChange}
                            onBlur={creatRoomForm.handleBlur}
                            value={creatRoomForm.values.password}
                            type="text"
                            placeholder={t('password')}
                            invalid={
                                creatRoomForm.touched.password && creatRoomForm.errors.password
                                    ? true
                                    : false
                            }
                        />
                        {creatRoomForm.touched.password && creatRoomForm.errors.password ? (
                            <FormFeedback type="invalid">
                                {creatRoomForm.errors.password}
                            </FormFeedback>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail">
                            {t('select_time')}
                        </Label>
                        <Input
                            name="timers"
                            type="select"
                            onBlur={creatRoomForm.handleBlur}
                            value={objectTimers.length ? objectTimers.find((_, inx) => inx === creatRoomForm.values.timers) : 0}
                            onChange={(value) => creatRoomForm.setFieldValue('timers', value.target.value)}
                        >
                            <option value={0}>
                                15 + 1 {t('minutes')}
                            </option>
                            <option value={1}>
                                10 + 1 {t('minutes')}
                            </option>
                            <option value={2}>
                                5 + 1 {t('minutes')}
                            </option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleEmail">
                            {t('select_side')}
                        </Label>
                        <Input
                            name="color"
                            type="select"
                            onBlur={creatRoomForm.handleBlur}
                            value={objectTimers.length ? objectTimers.find((_, inx) => inx === creatRoomForm.values.color) : "random"}
                            onChange={(value) => creatRoomForm.setFieldValue('color', value.target.value)}
                        >
                            <option value={"random"}>
                                {t('random')}
                            </option>
                            <option value={"C"}>
                                {t('orange')}
                            </option>
                            <option value={"X"}>
                                {t('green')}
                            </option>
                        </Input>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={(e) => {
                    e.preventDefault();
                    creatRoomForm.handleSubmit()
                }}>
                    {t('create_room')}
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                    {t('cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    )
}


ModalCreateRoom.propTypes = {
    className: PropTypes.string,
    modal: PropTypes.bool.isRequired,
    toggle: PropTypes.func,
    onClickSuccess: PropTypes.func
};
export default ModalCreateRoom