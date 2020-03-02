import React, { Fragment } from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';

const visaTypes = [
    { key: '0', value: 'Citizen', title: 'Citizen' },
    { key: '1', value: 'Permanent Resident', title: 'Permanent Resident' },
    { key: '2', value: 'Work Visa', title: 'Work Visa' },
    { key: '3', value: 'Student Visa', title: 'Student Visa' }
];

const residencyTypes = ["Citizen", "Permanent Resident"];

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        this.renderVisaExpiry = this.renderVisaExpiry.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.isResidentStatus = this.isResidentStatus.bind(this);
        this.saveVisaExpiry = this.saveVisaExpiry.bind(this);
    }

    render() {
        const { visaStatus } = this.props;
        var visaOptions = visaTypes.map(x => <option key={x.key} value={x.value}> {x.title} </option>);

        return (
            <div className='ui sixteen wide column'>
                <div className="ui grid">
                    <div className='ui row'>
                        <div className="ui five wide column">
                            <div className="field">
                                <label>Visa type</label>
                                <select
                                    className="ui dropdown"
                                    name="visaStatus"
                                    placeholder="Visa status"
                                    onChange={this.handleChange}
                                    value={visaStatus}>
                                    <option value=""> Select Visa </option>
                                    {visaOptions}
                                </select>
                            </div>
                        </div>
                        {this.isResidentStatus(visaStatus) ? null : this.renderVisaExpiry()}
                    </div>
                </div>
            </div>
        );

    }

    renderVisaExpiry() {
        return (
            <Fragment>
                <div className="ui five wide column">
                    <div className="field">
                        <label>Visa expiry date</label>
                        <SingleInput
                            inputType="date"
                            errorMessage="Please enter a valid date"
                            name="visaExpiryDate"
                            controlFunc={this.handleChange}
                            content={moment(this.props.visaExpiryDate).format(moment.HTML5_FMT.DATE)}
                            placeholder="Visa expiry date"
                            isError={false}
                        />
                    </div>
                </div>
                <div className="ui five wide column"> {/*Button shoud be inline with expiry data field*/}
                    <div className="ui grid">
                        <div className='ui row'>
                        </div>
                        <div className='ui row'>
                            <button type="button" className="ui teal button" onClick={this.saveVisaExpiry}>Save</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    handleChange(event) {
        const { name, value } = event.target;
        const data = { [name]: value }

        if (name === 'visaStatus') {
            if (this.isResidentStatus(value)) {
                data.visaExpiryDate = ""; // remove expiration
                this.props.saveProfileData(data);
            }
            else {
                data.visaExpiryDate = new Date();
                this.props.updateProfileData(data);
            }
        }
        else {
            this.props.updateProfileData(data);
        }
    }

    isResidentStatus(visa) {
        return residencyTypes.includes(visa);
    }

    saveVisaExpiry() {
        //Since handleChange() function already updated profile data without saving,
        //we do not need to pass any data now. 
        this.props.saveProfileData();
    }
}