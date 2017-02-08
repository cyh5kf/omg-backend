import React from 'react';
import {Form, Input, Tooltip, Icon} from 'antd';
import LoginStore from '../../stores/LoginStore';
const FormItem = Form.Item;
import './AccountDialog.less';


const AddAccountForm = Form.create()(React.createClass({
    getInitialState() {
        return {passwordDirty: false};
    },

    checkPhoneNumber(rule, value, callback){
        var reg = /^\d+$/;
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

    render() {
        const {getFieldDecorator} = this.props.form;
        const loginUserInfo = LoginStore.getLoginUserInfo() || {};
        const countrycode = loginUserInfo.countrycode || "";
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 12}
        };
        return (
            <Form horizontal>

                <FormItem
                    {...formItemLayout}
                    label="Email"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'Please input a valid email.',
                        }, {
                            required: true, message: 'Please input your E-mail.',
                        }],
                    })(
                        <Input maxLength="100"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Password"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password.',
                        }, {
                            min: 6, max: 16, message: 'The password length must be between be 6 and 16 characters',
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
                        rules: [{required: true, message: 'Please input your name.'}],
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
                        rules: [
                            {required: true, message: 'Please input your phone number.'},
                            {validator: this.checkPhoneNumber}
                        ]
                    })(<Input addonBefore={`+${countrycode}`}/>)}
                </FormItem>

            </Form>
        );
    }
}));

export default AddAccountForm;