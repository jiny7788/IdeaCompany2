import React from 'react';

function AlarmList({ alarm_list, searchAlarmList }) {
    return (
        <div>
            <table width="100%" border="1px solid #bcbcbc">
                <caption>Alarm List</caption>
                <thead>
                    <tr>
                    <th>alarmSeq</th>
                    <th>alarmRuleNo</th>
                    <th>alarmRuleName</th>
                    <th>occurred</th>
                    </tr>
                </thead>
                <tbody>
                    {alarm_list.map(alarm => (
                        <tr key={alarm.alarmSeq}>
                            <td>{alarm.alarmSeq}</td>
                            <td>{alarm.alarmRuleNo}</td>
                            <td>{alarm.alarmRuleName}</td>
                            <td>{alarm.occurred}</td>
                        </tr>        
                    ))}
                </tbody>
            </table>
            <button onClick={()=>searchAlarmList()}>검색</button>
        </div>  
    );
};


export default AlarmList;