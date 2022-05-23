import React from 'react';
import AlarmList from './AlarmList';
import AlarmsApi from '../apis/AlarmApi';
import $ from 'jquery';

class  AlarmListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alarm_list: []
            , detail_title: ''
            , detail_occurred: ''
            , detail_status: ''
            , detail_category: ''
            , detail_risk_level: ''
            , detail_risk_class: ''
            , detail_location: ''
            , detail_clas_code: ''
            , detail_alarm_response_seq: ''
            , clear_count: 0
            , alarm_count: 0
        };

        this.searchAlarmList = this.searchAlarmList.bind(this);
    }

    searchAlarmList() {
        this.setState({
            detail_title: ''
            , detail_occurred: ''
            , detail_status: ''
            , detail_category: ''
            , detail_risk_level: ''
            , detail_risk_class: ''
            , detail_location: ''
            , detail_clas_code: ''
            , detail_alarm_response_seq: ''
            , clear_count: this.state.clear_count + 1
        });

        var bodyFormData = new FormData();

        bodyFormData.append('tenantNo', 0);
        bodyFormData.append('dmnNo', 0);
        bodyFormData.append('buildingId', "");
        bodyFormData.append('floorId', "");
        bodyFormData.append('areaId', "");

        bodyFormData.append('searchTenant', []);
        bodyFormData.append('searchDomain', []);
        bodyFormData.append('searchBuilding', []);
        bodyFormData.append('searchFloor', []);
        bodyFormData.append('searchArea', []);

        bodyFormData.append('searchAssetType', []);
        bodyFormData.append('searchAlarmType', []);
        bodyFormData.append('searchAlarmCategory', []);
        bodyFormData.append('searchAlarmStatus', []);
        bodyFormData.append('analysisResult', "");

        bodyFormData.append('searchRisk', []);
        bodyFormData.append('alarmName', '');
        bodyFormData.append('equipModelName', '');

        bodyFormData.append('pageNum', 1);
        bodyFormData.append('pageCount', 30);

        bodyFormData.append('sortName', "ALARM_SEQ");
        bodyFormData.append('sortOrder', "DESC");

        bodyFormData.append('startDt', '');
        bodyFormData.append('endDt', '');

        bodyFormData.append('searchType', '');
        bodyFormData.append('searchAssignee', "");

        bodyFormData.append('sourceAddress', {});
        bodyFormData.append('destinationAddress', {});

        bodyFormData.append('videoSearchYn', 'N');

        $.ajax({
            url: 'http://api.secudiumiot.com:8200/control/alarms/getAlarmSelectCount',
            method: "POST",
            crossDomain: true,
            dataType: "json",
            processData: false,
            contentType: false,
            data: bodyFormData,
            beforeSend: function (xhr) { },
            //cache: false,
            success: function (data) {
                this.setState({
                    alarm_count: data
                }, () => { this.getAlarmListSub(bodyFormData) });
            }.bind(this),
            error: function (xhr, status, err) {                
                console.log(xhr);
            },
            xhrFields: {
                withCredentials: true
            }
        });

        //console.log(this.state);
    }
   
    // 방법1 : ajax() 호출 방식
    // getAlarmList(param) {
    //     $.ajax({
    //         url: 'http://api.secudiumiot.com:8200/control/alarms/getAlarmList',
    //         method: "POST",
    //         crossDomain: true,
    //         dataType: "json",
    //         processData: false,
    //         contentType: false,
    //         data: param,
    //         beforeSend: function (xhr) { },
    //         //cache: false,
    //         success: function (data) {
    //             console.log(data);
    //             this.setState({
    //                 alarm_list: data
    //             });
    //         }.bind(this),
    //         error: function (xhr, status, err) {
    //             console.log(xhr);
    //         },
    //         xhrFields: {
    //             withCredentials: true
    //         }
    //     });
    // }    

    // 방법 2-1:  fetch() 호출 방식
    getAlarmList(param) {
        AlarmsApi.getAlarmList(param).then(response => {        
            if (response) {    
                console.log(response);
                this.setState({
                    alarm_list : response
                });
            }
        });
    }

    // 방법 2-2:  fetch() 호출 방식
    // getAlarmListSub = async (param) => {
    //     let resp = await AlarmsApi.getAlarmList(param);
    //     //console.log(resp);
    //     //let data = resp.map(item => {
    //     //    return ({...item});
    //     //});
    //     //console.log(data);
    //      this.setState({
    //          alarm_list: resp
    //      });
    // }

    // 방법 3-1: axios api 호출 방식
    // getAlarmList(param) {
    //     AlarmsApi.getAlarmList2(param).then(response => {
    //         if(response) {
    //             this.setState({
    //                 alarm_list: response
    //             });    
    //         }
    //     });
    // }

    // 방법 3-2: axios api 호출 방식
    getAlarmListSub = async (param) => {
        try {
            const resp = await AlarmsApi.getAlarmList2(param);
            //console.log(resp);
            this.setState({
                alarm_list: resp
            });
        } catch (err) {
            console.log(err);
        }        
    }

    render() {
        return (
            <div>
                <AlarmList
                    alarm_list={this.state.alarm_list}
                    searchAlarmList={this.searchAlarmList}
                />
            </div>           
        );
    }
}

export default AlarmListContainer;