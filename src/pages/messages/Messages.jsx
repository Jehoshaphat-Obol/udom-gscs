import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import axios from '../../axiosInstance';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import MessagesCoordinator from './MessagesCoordinator'
import MessagesStudent from './MessagesStudent';
import MessagesGuest from './MessagesGuest';

class Messages extends Component {
    render() {
        const {groups} = authService.getCurrentUser()
        return (
            <>
                {groups.includes('coordinator') && <MessagesCoordinator />}
                {groups.includes('student') && <MessagesStudent />}
                {groups.includes('guest') && <MessagesGuest />}
            </>
        );
    }
}

export default Messages;
