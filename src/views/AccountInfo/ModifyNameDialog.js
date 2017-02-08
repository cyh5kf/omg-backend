import React from 'react';
import {Modal,Button,Form,Input} from 'antd';
const FormItem = Form.Item;


const TheForm = Form.create()(React.createClass({
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };
        var name = this.props.name;

        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="New Name"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [
                            {required: true, message: 'Please input new name !'}
                        ]
                    })(<Input />)}
                </FormItem>
            </Form>
        );
    }
}));


//ModifyName
export default class ModifyNameDialog extends React.Component {


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
                actions.handleSubmitModifyName(values,()=>{
                    this.setState({loading:false});
                },'ModifyName');
            }
        });
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.toggleDialog("ModifyName",false)
    };


    render() {
        var {visible, name} = this.props;
        if(!visible){
            return null;
        }

        return (
            <Modal
                visible={visible}
                title="Modify Name"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>OK </Button>
                    ]}>
                <TheForm name={name} ref="theForm"></TheForm>
            </Modal>
        );
    }

}
