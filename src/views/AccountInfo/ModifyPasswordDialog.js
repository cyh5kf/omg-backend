import React from 'react';
import {Modal,Button,Form,Input} from 'antd';
const FormItem = Form.Item;

const TheForm = Form.create()(React.createClass({
    getInitialState() {
        return {
            passwordDirty: false
        };
    },


    handlePasswordBlur(e) {
        const value = e.target.value;
        this.setState({passwordDirty: this.state.passwordDirty || !!value});
    },

    checkPassowrd(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    },

    checkConfirm(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.passwordDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14}
        };
        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="Old Password"
                >
                    {getFieldDecorator('oldPassword', {
                        rules: [{
                            required: true, message: 'Please input your old password!'
                        }]
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="New Password"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your new password!',
                        }, {
                            validator: this.checkConfirm
                        }]
                    })(
                        <Input type="password" onBlur={this.handlePasswordBlur}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                    hasFeedback
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your new password!',
                        }, {
                            validator: this.checkPassowrd
                        }]
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
            </Form>
        );
    }
}));


//ModifyPassword
export default class ModifyPasswordDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleOk = ()=> {
        var theForm = this.refs['theForm'];
        var {actions} = this.props;
        theForm.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({loading:true});
                actions.handleSubmitModifyPassword(values,()=>{
                    this.setState({loading:false});
                },'ModifyPassword');
            }
        });
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.toggleDialog("ModifyPassword",false)
    };


    render() {
        var {visible} = this.props;
        if(!visible){
            return null;
        }

        return (
            <Modal
                visible={visible}
                title="Modify Password"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>OK </Button>
                    ]}>
                <TheForm ref="theForm"></TheForm>
            </Modal>
        );
    }

}
