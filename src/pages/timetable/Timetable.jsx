import { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axiosInstance'
import authService from '../../services/authService';
import CoordinatorTimetable from './CoordinatorTimetable';
const apiUrl = import.meta.env.VITE_API_URL;
import PublicTimetable from './PublicTimetable';
export default class Timetable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            timetable: [],
        }
    }
    componentDidMount() {
        axios.get(apiUrl + 'timetable/')
            .then(response => {
                this.setState(() => ({ timetable: response.data }))
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        const {groups} = authService.getCurrentUser();
        return (
            <>
                {(groups.includes('coordinator')?(<CoordinatorTimetable />):(<PublicTimetable />))}
            </>
        )
    }
}
