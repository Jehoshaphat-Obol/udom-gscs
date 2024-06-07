import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReportStudent from './ReportStudent'
import authService from '../../services/authService'
import ReportCoordinator from './ReportCoordinator'
import ReportGuest from './ReportGuest'
const getReportPage = ()=>{
    const currentUser = authService.getCurrentUser();
    if(!currentUser || !currentUser.groups){
        return <></>
    }

    if(currentUser.groups.includes('coordinator')){
        return <ReportCoordinator />
    }else if(currentUser.groups.includes('student')){
        return <ReportStudent />
    }else if(currentUser.groups.includes('guest')){
        return <ReportGuest />
    }
}

const ReportPage = getReportPage();
export default class Report extends Component {
  render() {
    return (
        <>
            {ReportPage}
        </>
    )
  }
}
