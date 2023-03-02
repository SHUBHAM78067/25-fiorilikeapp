sap.ui.define([
    'com/emc/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function (BaseController, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("com.emc.fin.ap.controller.View2", {
        onInit: function () {

        },
        onBack: function () {
            this.getView().getParent().to("idView1");
        },
        onSave: function () {

            var oResourceModel = this.getView().getModel("i18n");
            var oBundle = oResourceModel.getResourceBundle()
            var msgSuccess = oBundle.getText('msgSuccess', ["858585"]);
            var msgError = oBundle.getText('msgError');

            MessageBox.confirm("Do you want to save?", {
                title: 'Confirmation',
                onClose: function (status) {
                    if (status === "OK") {
                        MessageToast.show(msgSuccess);
                    } else {
                        MessageBox.error(msgError);
                    }
                }
            });
        },

        // PBO--
        // ALV - avoid creating ALV again and again
        // IF lo_alv IS NOT BOUND. CREATE OBJECT lo_alv
        // This is our remote control for the supplier popup
        oPopupSupplier: null,
        oCityPopup: null,
        oField: null,
        onFilter: function () {
            //Because we cannot access this variable as controller object
            //inside callbacks/ promises, so we creeate a copy
            var that = this;
            if (!this.oPopupSupplier) {
                Fragment.load({
                    name: 'com.emc.fin.ap.fragments.popup',
                    id: 'supplier',
                    controller: this
                }).then(function (oFragment) {
                    //inside promise and call back functions, we cannot access this pointer
                    //controller object, so we need to create a local variable for controller object
                    //outside promise/callback var that = this;
                    that.oPopupSupplier = oFragment;
                    that.oPopupSupplier.setTitle("Supplier");
                    //Grant the access to the fragment from the view to the model
                    that.getView().addDependent(that.oPopupSupplier);
                    //4th binding syntax agg binding
                    that.oPopupSupplier.bindAggregation("items",{
                        path : '/suppliers',
                        template: new sap.m.ObjectListItem({
                            title: '{name}',
                            intro: '{sinceWhen}',
                            number: '{contactNo}'
                        })
                    });
                    //check sdk functios for select dialog
                    that.oPopupSupplier.open();
                });
            } else {
                this.oPopupSupplier.open();
            }

            //MessageBox.alert("This functionality is under construction 😊");

        },
        onF4Help: function (oEvent) {
            this.oField = oEvent.getSource();
            //Because we cannot access this variable as controller object
            //inside callbacks/ promises, so we creeate a copy
            var that = this;
            if (!this.oCityPopup) {
                Fragment.load({
                    name: 'com.emc.fin.ap.fragments.popup',
                    id: 'city',
                    controller: this
                }).then(function (oFragment) {
                    //inside promise and call back functions, we cannot access this pointer
                    //controller object, so we need to create a local variable for controller object
                    //outside promise/callback var that = this;
                    that.oCityPopup = oFragment;
                    that.oCityPopup.setTitle("Supplier");
                    //Grant the access to the fragment from the view to the model
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setMultiSelect(false);
                    //4th binding syntax agg binding
                    that.oCityPopup.bindAggregation("items",{
                        path : '/cities',
                        template: new sap.m.ObjectListItem({
                            title: '{name}',
                            intro: '{famousFor}',
                            number: '{otherName}'
                        })
                    });
                    //check sdk functios for select dialog
                    that.oCityPopup.open();
                });
            } else {
                this.oCityPopup.open();
            }

        },
        onConfirmPopup: function(oEvent){
            var sId = oEvent.getSource().getId();

            if(sId.indexOf("city") != -1){
                //Get the selected item object from event confirm
                var oSelectedItemObject = oEvent.getParameter("selectedItem");
                //Extract the data from the item
                var sText = oSelectedItemObject.getTitle();
                //Set to the input field
                this.oField.setValue(sText);
            }else{
                //TODO: Exercise for all of you
                //User Selects Multiple Suppliers, Set them on the UI
            }
            
        },
        onCancel: function () {

        }
    });
});