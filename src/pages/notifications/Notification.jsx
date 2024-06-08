import React, { Component } from 'react';
import authService from '../../services/authService';
import { Link } from 'react-router-dom';
import NotificationCoordinator from './NotificationCoordinator';
import NotificationGuest from './NotificationGuest';
import NotificationStudent from './NotificationStudent';

export default class Notification extends Component {
    render() {
        const { groups } = authService.getCurrentUser();
        return (
            <>
                {groups.includes('coordinator') && <NotificationCoordinator />}
                {groups.includes('student') && <NotificationStudent />}
                {groups.includes('guest') && <NotificationGuest />}
            </>
        )
    }
}
