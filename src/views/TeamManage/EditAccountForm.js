import React from 'react';
import {Form, Input, Tooltip, Icon, Row, Col} from 'antd';
const FormItem = Form.Item;
import './AccountDialog.less';


const EditAccountForm = Form.create()(React.createClass({
    getInitialState() {
        return {passwordDirty: false};
    },

    checkPhoneNumber(rule, value, callback){
        var reg =  /^\d+$/;
        if (value && !reg.test(value)) {
            callback('The phone number that you entered is incorrect.');
        } else {
            callback();
        }
    },

    handlePasswordBlur(e) {
        const value = e.target.value;
        this.setState({passwordDirty: this.state.passwordDirty || !!value});
    },

    checkPassowrd(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent.');
        } else {
            callback();
        }
    },

    checkConfirm(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.passwordDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    },

    //重置密码
    handleResetClick() {
        const {actions} = this.props;
        actions.handleResetPassword();
        this.props.form.setFieldsValue({
            password: '',
        });

    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const {store} = this.props;
        const {editAccountInfo, isReset} = store;
        const {email, name, countrycode, phone} = editAccountInfo;
        var phoneNumber = phone.toString().substring(2);
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 12}
        };
        return (
            <Form horizontal>

                <FormItem
                    {...formItemLayout}
                    label="Email"
                >
                    {getFieldDecorator('email', {initialValue: email})(
                        <span>{email}</span>
                    )}
                </FormItem>

                {
                    isReset?
                        (
                            <div>
                                <FormItem
                                    {...formItemLayout}
                                    label="Password"
                                    hasFeedback
                                >
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true, message: 'Please input your password.',
                                        }, {
                                            min: 6, max: 16, message: 'The password length must be between be 6 and 16 characters.',
                                        }, {
                                            validator: this.checkConfirm,
                                        }],
                                    })(
                                        <Input type="password" maxLength="16" onBlur={this.handlePasswordBlur}/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="Confirm Password"
                                    hasFeedback
                                >
                                    {getFieldDecorator('confirm', {
                                        rules: [{
                                            required: true, message: 'Please confirm your password.',
                                        }, {
                                            validator: this.checkPassowrd,
                                        }],
                                    })(
                                        <Input type="password"/>
                                    )}
                                </FormItem>
                            </div>
                        ):
                        (
                            <div>
                                <Row>
                                    <Col span="8" className="passwdLabel"><span>Password</span></Col>
                                    <Col span="12"><input type="password" value='******' className="input_password" disabled="disabled" /></Col>
                                </Row>
                                <a className="reset_password" href="javascript:;" onClick={this.handleResetClick}>Reset</a>
                            </div>
                        )
                }

                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                                Name&nbsp;
                        </span>
                    )}
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [{ required: true, message: 'Please input your name.' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Phone"
                    hasFeedback
                >
                    {getFieldDecorator('phoneNumber', {
                        initialValue: phoneNumber,
                        rules: [
                            {required: true, message: 'Please input your phone number.'},
                            {validator: this.checkPhoneNumber}
                        ]
                    })(<Input addonBefore={`+${countrycode}`} />)}
                </FormItem>
            </Form>
        );
    }
}));

export default EditAccountForm;

