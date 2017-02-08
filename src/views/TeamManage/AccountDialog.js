import React from 'react';
import {Modal, Button} from 'antd';
import LoginStore from '../../stores/LoginStore';
import EditAccountForm from './EditAccountForm';
import AddAccountForm from './AddAccountForm';

export default class AccountDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    //添加账户保存
    handleAddOk() {
        var addEditForm = this.refs['addForm'];
        var {actions} = this.props;
        addEditForm.validateFields((err, values) => {

            const loginUserInfo = LoginStore.getLoginUserInfo() || {};
            const countrycode = loginUserInfo.countrycode || "";
            var phoneNumber = countrycode + values.phoneNumber;
            values.phoneNumber = phoneNumber;

            if (!err) {
                actions.openSaveLoading();
                actions.submitAddAccount(values);
            }
        });
    };

    //编辑账户保存
    handleEditOk() {
        var addEditForm = this.refs['editForm'];
        var {actions} = this.props;
        addEditForm.validateFields((err, values) => {

            const loginUserInfo = LoginStore.getLoginUserInfo() || {};
            const countrycode = loginUserInfo.countrycode || "";
            var phoneNumber = countrycode + values.phoneNumber;
            values.phoneNumber = phoneNumber;

            if (!err) {
                actions.openSaveLoading();
                actions.submitEditAccount(values);
            }
        });
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleCancelDialog();
    };


    render() {
        var {actions, store} = this.props;
        var {isOpenAccountDialog, isAddOrEdit, saveLoading} = store;

        return (
            <Modal
                visible={isOpenAccountDialog}
                title={isAddOrEdit === 'Add'? 'Add Account': 'Edit Account'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={saveLoading} onClick={isAddOrEdit === 'Add'? this.handleAddOk.bind(this):this.handleEditOk.bind(this)}>Save</Button>
                ]}>
                {
                    isAddOrEdit === 'Add'?
                        (
                            <AddAccountForm actions={actions} store={store} ref="addForm"></AddAccountForm>
                        ):
                        (
                            <EditAccountForm actions={actions} store={store} ref="editForm"></EditAccountForm>
                        )
                }

            </Modal>
        );
    }

}