/* Experience section */
import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class Experience extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false,
            experience: {},
            isNew: true
        }

        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addExperienceToProfile = this.addExperienceToProfile.bind(this);
        this.updateExperienceInProfile = this.updateExperienceInProfile.bind(this);
        this.deleteExperienceFromProfile = this.deleteExperienceFromProfile.bind(this);
        this.validateExperience = this.validateExperience.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    render() {
        const { experienceData } = this.props;
        let experienceRows = [];

        if (experienceData) {
            experienceRows = this.props.experienceData.map((experience, index) =>
                <ExperienceRow
                    key={index}
                    experience={experience}
                    update={this.handleUpdate}
                    delete={this.deleteExperienceFromProfile} />
            );
        }

        return (
            <Fragment>
                {this.state.showForm
                    ? <AddOrUpdateExperienceForm
                        isNew={this.state.isNew}
                        toggle={this.toggleForm}
                        experience={this.state.experience}
                        handleChange={this.handleChange}
                        add={this.addExperienceToProfile}
                        update={this.updateExperienceInProfile}
                    />
                    : null
                }
                <div className="ui sixteen wide column">
                    <div className="ui grid">
                        <div className="ui row">
                            < div className='ui sixteen wide column' >
                                <table className="ui fixed table">
                                    <ExperienceTableHeader addExperience={this.handleAdd} />
                                    <tbody className="">{experienceRows}</tbody>
                                </table>
                            </div>
                        </div >
                    </div>
                </div>
            </Fragment>
        );
    }

    handleAdd() {
        const newExperience = {
            id: "",
            company: "",
            position: "",
            responsibilities: "",
            start: moment(),
            end: moment()
        }

        const newState = Object.assign(
            {},
            this.state,
            { isNew: true },
            {
                experience: newExperience
            },
            { showForm: true });

        this.setState(newState);
    }

    handleUpdate(data) {
        const newState = Object.assign(
            {},
            this.state,
            { isNew: false },
            { experience: data },
            { showForm: true });

        this.setState(newState);
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.experience)

        data[event.target.name] = event.target.value
        this.setState({
            experience: data
        })
    }

    addExperienceToProfile() {

        //this.validateExperience(work, this.props.experienceData);
        this.props.updateProfileData({
            experience: [...this.props.experienceData, this.state.experience]
        });
        this.toggleForm();
    }

    updateExperienceInProfile() {
        const { experience } = this.state;
        let newExperienceData = this.props.experienceData;

        const index = newExperienceData.findIndex(work => work.id === experience.id);
        (index > -1) ? newExperienceData[index] = experience : null; // update experience if found

        this.props.updateProfileData({
            experience: newExperienceData
        });

        this.toggleForm();
    }

    deleteExperienceFromProfile() {
        const { experience } = this.state;
        this.props.updateProfileData({
            experience: this.props.experienceData.filter(work => {
                return (work.id !== experience.id);
            })
        });
    }

    toggleForm() {
        this.setState(prevState => ({
            showForm: !prevState.showForm
        }));
    }

    validateExperience(item, list) {
        const found = list.find(work => item.name === work.name);
        found
            ? TalentUtil.notification.show("Experience already exists. Please enter a new one.", "error", null, null)
            : null;

        console.log(found);
    }
}

const ExperienceTableHeader = (props) => (
    <thead className="">
        <tr className="">
            <th className="">Company</th>
            <th className="">Position</th>
            <th className="">Responsibilities</th>
            <th className="">Start</th>
            <th className="">End</th>
            <th className="">
                <button
                    type="button"
                    className="ui right floated teal button"
                    onClick={props.addExperience}
                >
                    + Add New
                </button>
            </th>
        </tr>
    </thead>
);

class ExperienceRow extends Component {
    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { id, company, position, responsibilities, start, end } = this.props.experience;
        return (
            <Fragment>
                <tr className="" key={id}>
                    <td className="">{company}</td>
                    <td className="">{position}</td>
                    <td className="">{responsibilities}</td>
                    <td className="">{moment(start).format("Do MMM, YYYY")}</td>
                    <td className="">{moment(end).format("Do MMM, YYYY")}</td>
                    <td className="right aligned">
                        <i aria-hidden="true" className="pencil alternate icon" onClick={() => this.props.update(this.props.experience)}></i>
                        <i aria-hidden="true" className="ui right floated delete icon" onClick={() => this.props.delete()}></i>
                    </td>
                </tr>
            </Fragment>
        );
    }

    handleUpdate(data) {
        this.props.update(data);
        this.toggleDisplay();
    }
}

class AddOrUpdateExperienceForm extends Component {
    constructor(props) {
        super(props);
        this.renderActionButtons = this.renderActionButtons.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAndSubmitForm = this.validateAndSubmitForm.bind(this);
    }

    render() {
        const { company, position, start, end, responsibilities } = this.props.experience;
        return (
            <Fragment>
                <div className="ui row">
                    <div className="ui eight wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Company"
                            name="company"
                            value={company}
                            controlFunc={this.props.handleChange}
                            maxLength={80}
                            placeholder="Company"
                            errorMessage="Please enter a valid company"
                        />
                    </div>
                    <div className="ui eight wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Position"
                            name="position"
                            value={position}
                            controlFunc={this.props.handleChange}
                            maxLength={80}
                            placeholder="Position"
                            errorMessage="Please enter a valid position"
                        />
                    </div>
                </div>
                <div className="ui row">
                    <div className="ui eight wide column">
                        <div className="field">
                            <label>Start Date</label>
                            <input
                                name='start'
                                type='date'
                                onChange={this.props.handleChange}
                                value={moment(start).format(moment.HTML5_FMT.DATE)}
                                max={moment(end).format(moment.HTML5_FMT.DATE)}
                            />
                        </div>
                    </div>
                    <div className="ui eight wide column">
                        <div className="field">
                            <label>End Date</label>
                            <input
                                name='end'
                                type='date'
                                onChange={this.props.handleChange}
                                value={moment(end).format(moment.HTML5_FMT.DATE)}
                                max={moment(end).format(moment.HTML5_FMT.DATE)}
                            />
                        </div>
                    </div>
                </div>
                <div className="ui row">
                    <div className="ui sixteen wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Responsibilities"
                            name="responsibilities"
                            value={responsibilities}
                            controlFunc={this.props.handleChange}
                            maxLength={150}
                            placeholder="Responsibilities"
                            errorMessage="Please enter a valid responsibilities"
                        />
                    </div>
                </div>
                <div className="ui row">
                    <div className="ui sixteen wide column">
                        {this.renderActionButtons()}
                    </div>
                </div>
            </Fragment >
        );
    }

    renderActionButtons() {
        const action = this.props.isNew ? "Add" : "Update";
        return (
            <Fragment>
                <button type="button" className="ui teal button" onClick={this.handleSubmit}>{action}</button>
                <button type="button" className="ui button" onClick={this.props.toggle}>Cancel</button>
            </Fragment >
        );
    }

    handleSubmit() {
        this.validateAndSubmitForm();
    }

    validateAndSubmitForm() {
        const { company, position, responsibilities } = this.props.experience;
        if (company === "" || position === "" || responsibilities === "") {   // Validate fields
            TalentUtil.notification.show("Please enter company, position and responsibilities", "error", null, null)
        }
        else {  // Submit if form is valid
            this.props.isNew
                ? this.props.add()
                : this.props.update();
        }
    }
}

