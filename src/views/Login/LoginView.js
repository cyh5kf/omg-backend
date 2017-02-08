import React from 'react';
import LoginAuthCodeDialog from './LoginAuthCodeDialog';
import './LoginView.less';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

export default Form.create()(React.createClass({

    setInputMessage(theForm,fieldName,values,msg){

        var obj = {};
        obj[fieldName] = {
            value:values[fieldName],
            errors:[
                {field:fieldName, message : msg}
            ]
        };

        theForm.setFields(obj);
    },

    handleSubmit(e) {
        e.preventDefault();
        var actions = this.props.actions;
        var theForm = this.props.form;
        theForm.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                actions.doLogin(values,(message,model,status)=>{
                    if(status===3){
                        this.setInputMessage(theForm,'password',values,"Your account has been blocked since login fails too many times. Please try again 30 minutes later.");
                    }else {
                        this.setInputMessage(theForm,'password',values,"Invalid ID or password.");
                    }
                });
            }
        });
    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const {isLoading} = this.props.store;
        return (
            <div className="login-view">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <div className="login-title">Internal Data Analysis System</div>
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [{required: true, message: 'Please input your login email.'}],
                        })(
                            <Input addonBefore={<Icon type="user" />} placeholder="Email"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input your password.'}],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password"/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </FormItem>
                </Form>

                <LoginAuthCodeDialog actions={this.props.actions} store={this.props.store}/>
            </div>
        );
    },
}));
