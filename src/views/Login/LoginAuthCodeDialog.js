import React from 'react';
import {Modal,Button,Form,Input,message} from 'antd';
const FormItem = Form.Item;
import LoginStore from '../../stores/LoginStore';
import './LoginAuthCodeDialog.less';

var timeOfResendTimeInterval = null;
const TheForm = Form.create()(React.createClass({
    getInitialState() {
        var props = this.props;
        var timeOfResend = props.dialogData.timeOfResend;
        return {
            resendLoading:false,
            timeOfResend:timeOfResend
        };
    },

    componentDidMount(){

        //自动聚焦验证码输入框
        setTimeout(()=>{
            var verificationCodeInput = document.getElementsByClassName('verificationCodeInput')[0];
            verificationCodeInput.focus();
        },10);


        if (timeOfResendTimeInterval) {
            clearInterval(timeOfResendTimeInterval);
        }

        timeOfResendTimeInterval = setInterval(()=> {

            var timeOfResend = this.state.timeOfResend;
            timeOfResend = timeOfResend - 1;
            if (timeOfResend < 0) {
                timeOfResend = 0;
                clearInterval(timeOfResendTimeInterval);
                timeOfResendTimeInterval = null;
            }

            this.setState({
                timeOfResend: timeOfResend
            });

        }, 1000);

    },


    componentWillUnmount(){
        if (timeOfResendTimeInterval) {
            clearInterval(timeOfResendTimeInterval);
        }
    },


    handleResendAuthCodeRequest(){
        var {actions} = this.props;
        var resendLoading = this.state.resendLoading;
        if(resendLoading){
            return;
        }

        this.setState({resendLoading: true});
        actions.handleResendAuthCodeRequest().then(()=> {
            this.setState({
                resendLoading: false,
                timeOfResend: 60
            });

            message.success('Sent successfully .');

        }, ()=> {
            this.setState({resendLoading: false});
        });

    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };

        const props = this.props;
        const phoneNumber = props.dialogData.phone;
        const {timeOfResend,resendLoading} = this.state;
        return (
            <Form horizontal className="theForm">
                <FormItem
                    {...formItemLayout}
                    label="Phone Number"
                >
                    <div className="phoneNumberDiv">
                            <span>{ ("+" + phoneNumber)}</span>
                            <Button loading={resendLoading} onClick={this.handleResendAuthCodeRequest} className="ResendButton" type="primary" disabled={timeOfResend>0} >
                                Resend {timeOfResend>0?` ( ${timeOfResend} ) `:''}
                            </Button>
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Verification Code"
                    hasFeedback
                >
                    {getFieldDecorator('verificationCode', {
                        rules: [
                            { required: true, message: 'Please input verification Code' }
                        ]
                    })(<Input className="verificationCodeInput" />)}
                </FormItem>
            </Form>
        );
    }
}));


export default class LoginAuthCodeDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }


    setVerificationCodeMes(values,msg){
        var theForm = this.refs['theForm'];
        //验证码错误
        theForm.setFields({
            verificationCode:{
                value:values['verificationCode'],
                errors:[
                    {field:"verificationCode", message : msg}
                ]
            }
        });
    }

    handleOk = ()=> {
        var that = this;
        var theForm = this.refs['theForm'];
        var {actions} = this.props;

        theForm.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({loading: true});
                actions.handleSubmitVerification(values, ({status,message,model})=> {
                    this.setState({loading: false});

                    if (status ===0){
                        //OK
                    }
                    else if (status === 6) {
                        //验证码不正确
                        that.setVerificationCodeMes(values, "Incorrect verification code");
                    }

                    else if (status === 1000) {
                        //TODO 验证码过期
                        that.setVerificationCodeMes(values, "Invalid verification code");
                    }

                    else {
                        that.setVerificationCodeMes(values, "Invalid verification code");
                    }

                });
            }
        });

        window.theForm = theForm;
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("LoginAuthCodeDialog",false,null);
    };


    render() {

        var {store,actions} = this.props;
        var visible = store.isOpenDialog_LoginAuthCodeDialog;
        if(!visible){
            return null;
        }

        var dialogData = store.dialogData_LoginAuthCodeDialog;

        return (
            <Modal
                className="LoginAuthCodeDialog"
                visible={visible}
                title="Verify Identification"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>Enter </Button>
                    ]}>
                <TheForm ref="theForm" dialogData={dialogData} actions={actions} store={store}></TheForm>
            </Modal>
        );
    }

}
