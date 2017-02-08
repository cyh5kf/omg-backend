import React from 'react';
import {Modal,Button,Form,Input} from 'antd';
const FormItem = Form.Item;
import LoginStore from '../../stores/LoginStore';
import './AddLiUserDialog.less';


const AddLiUserForm = Form.create()(React.createClass({
    getInitialState() {

        const loginUserInfo = LoginStore.getLoginUserInfo() || {};
        const countryCode = loginUserInfo.countrycode;

        const recordData = this.props['recordData'] || {};
        var monitor_uid = ''+(recordData['monitor_uid'] || '');

        var initPhoneNumber =  monitor_uid.replace(new RegExp(`^${countryCode}`), '');

        return {
            countryCode:countryCode,
            initPhoneNumber:initPhoneNumber || "",
            initRemark:recordData['remark']||""
        };
    },


    checkPhoneNumber(rule, value, callback){
        var reg =  /^\d+$/;
        if (value && !reg.test(value)) {
            callback('The phone number that you entered is incorrect !');
        } else {
            callback();
        }
    },

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };

        const {countryCode,initPhoneNumber,initRemark} = this.state;

        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="Phone Number"
                    hasFeedback
                >
                    {getFieldDecorator('phoneNumber', {
                        initialValue:initPhoneNumber,
                        rules: [
                            {required: true, message: 'Please input the phone number!'},
                            {validator: this.checkPhoneNumber}
                        ]
                    })(<Input addonBefore={"+"+countryCode} />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Remark"
                    hasFeedback
                >
                    {getFieldDecorator('remark', {
                        initialValue:initRemark,
                        rules: []
                    })(<Input />)}
                </FormItem>
            </Form>
        );
    }
}));


export default class AddLiUserDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleOk = ()=> {
        var addLiUserForm = this.refs['addLiUserForm'];
        var {actions} = this.props;
        addLiUserForm.validateFields((err, values) => {

            const loginUserInfo = LoginStore.getLoginUserInfo() || {};
            const countrycode = loginUserInfo.countrycode || "";
            var phoneNumber = countrycode + values.phoneNumber;
            values.phoneNumber = phoneNumber;

            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({loading:true});
                actions.handleSubmitLiUser(values,()=>{
                    this.setState({loading:false});
                });
            }
        });
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleCancelLiUser();
    };


    render() {
        var {visible,dialogData} = this.props;

        if(!visible){
            return null;
        }

        var {title,record} = dialogData || {};

        return (
            <Modal
                visible={visible}
                title={title ||  "Add LI User"}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>OK </Button>
                    ]}>
                <AddLiUserForm ref="addLiUserForm" recordData={record}></AddLiUserForm>
            </Modal>
        );
    }

}
