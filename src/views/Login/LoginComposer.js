import React from 'react';
import {message} from 'antd';
import LoginView from './LoginView';
import {loginRequest,emailLoginRequest,resendAuthCodeRequest,authCodeCheckRequest} from '../../api/LoginApi';

export default class LoginComposer extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            isOpenDialog_LoginAuthCodeDialog: false,
            dialogData_LoginAuthCodeDialog:null//{}
        };
    }

    handleToggleDialog = (dialogName, isShow, data)=> {
        var newState = {};
        newState["isOpenDialog_" + dialogName] = isShow;
        newState["dialogData_" + dialogName] = data;
        this.setState(newState);
    };


    //重新发送验证码
    handleResendAuthCodeRequest = ()=>{
        var {preInputValues} = this.state.dialogData_LoginAuthCodeDialog;
        var email = preInputValues.email;
        return resendAuthCodeRequest(email);
    };

    doLogin = (values,onError)=> {
        var router = this.context.router;
        this.setState({isLoading:true});

        //调用此方法后,后台会发送短信验证码
        emailLoginRequest(values).then((d)=>{
            this.setState({isLoading:false});

            const {message,model,status} = d.data || {};
            if(status===0){
                const {phone} = model;
                this.handleToggleDialog("LoginAuthCodeDialog",true,{
                    timeOfResend:60,
                    phone:phone,
                    preInputValues:values
                });
            }
            else {
                onError(message,model,status);
            }

            //setTimeout(()=>{
            //    if (d.status == 200) {
            //        router.push('/main/home');
            //        message.success('Logged in successfully.');
            //    }else {
            //        message.error("Incorrect email or password , please try again.");
            //    }
            //},10)
        },()=>{
            message.error("Login error , Please retry.");
            this.setState({isLoading:false});
        });
    };


    handleSubmitVerification=(values,finished)=>{
        var {preInputValues} = this.state.dialogData_LoginAuthCodeDialog;
        var email = preInputValues.email;
        var authCode = values['verificationCode'];
        var router = this.context.router;
        authCodeCheckRequest(email,authCode).then((d)=>{
            var data = d.data||{};
            var {status} = data;
            if (status ===0){

                setTimeout(()=>{
                    router.push('/main/home');
                    message.success('Logged in successfully.');
                },10);

            }
            finished(data);
        })
    };

    render() {
        return (
            <LoginView actions={this} store={this.state}/>
        );
    }
}
