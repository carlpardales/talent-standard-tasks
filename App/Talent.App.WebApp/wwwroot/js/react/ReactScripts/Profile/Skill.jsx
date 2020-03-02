/* Skill section */
import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie';

const levels = [
    { key: '0', value: 'Beginner', title: 'Beginner' },
    { key: '1', value: 'Intermediate', title: 'Intermediate' },
    { key: '2', value: 'Expert', title: 'Expert' },
];

export default class Skill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAdd: false
        }

        this.addSkillToProfile = this.addSkillToProfile.bind(this);
        this.toggleAdd = this.toggleAdd.bind(this);
        this.updateSkillInProfile = this.updateSkillInProfile.bind(this);
        this.deleteSkillFromProfile = this.deleteSkillFromProfile.bind(this);
        this.validateSkill = this.validateSkill.bind(this);
    }

    render() {
        const skillRows = this.props.skillData.map((skill, index) =>
            <SkillRow key={index} skill={skill} update={this.updateSkillInProfile} delete={this.deleteSkillFromProfile} />
        );
        return (
            <Fragment>
                {this.state.showAdd
                    ? <AddOrUpdateSkillForm
                        isNew={true}
                        toggle={this.toggleAdd}
                        add={this.addSkillToProfile} />
                    : null
                }
                <div className="ui sixteen wide column">
                    <div className="ui grid">
                        <div className="ui row">
                            < div className='ui sixteen wide column' >
                                <table className="ui fixed table">
                                    <SkillTableHeader addSkill={this.toggleAdd} />
                                    <tbody className="">{skillRows}</tbody>
                                </table>
                            </div>
                        </div >
                    </div>
                </div>
            </Fragment>
        );
    }

    addSkillToProfile(skill) {

        //this.validateSkill(skill, this.props.skillData);
        this.props.updateProfileData({
            skills: [...this.props.skillData, skill]
        });
        this.toggleAdd()
    }

    toggleAdd() {
        this.setState(prevState => ({
            showAdd: !prevState.showAdd
        }));
    }

    updateSkillInProfile(data) {
        let newSkillData = this.props.skillData;
        const index = newSkillData.findIndex(skill => skill.id === data.id);
        (index > -1) ? newSkillData[index] = data : null; // update skill if found

        this.props.updateProfileData({
            skills: newSkillData
        });
    }

    deleteSkillFromProfile(data) {
        this.props.updateProfileData({
            skills: this.props.skillData.filter(skill => {
                return (skill.id !== data.id);
            })
        });
    }

    validateSkill(item, list) {
        const found = list.find(skill => item.name === skill.name);
        found
            ? TalentUtil.notification.show("Skill already exists. Please enter a new one.", "error", null, null)
            : null;

        console.log(found);
    }
}

const SkillTableHeader = (props) => (
    <thead className="">
        <tr className="">
            <th className="">Skill</th>
            <th className="">Level</th>
            <th className="">
                <button
                    type="button"
                    className="ui right floated teal button"
                    onClick={props.addSkill}
                >
                    + Add New
                </button>
            </th>
        </tr>
    </thead>
);

class SkillRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplay: true
        }

        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { id, name, level } = this.props.skill;
        return (
            <Fragment>
                {this.state.isDisplay
                    ? <tr className="" key={id}>
                        <td className="">{name}</td>
                        <td className="">{level}</td>
                        <td className="right aligned">
                            <i aria-hidden="true" className="pencil alternate icon" onClick={this.toggleDisplay}></i>
                            <i aria-hidden="true" className="ui right floated delete icon" onClick={() => this.props.delete(this.props.skill)}></i>
                        </td>
                    </tr>
                    : <tr className="" key={id} >
                        <td colSpan="3">
                            <div className="ui grid">
                                <AddOrUpdateSkillForm
                                    isNew={false}
                                    skill={this.props.skill}
                                    toggle={this.toggleDisplay}
                                    update={this.handleUpdate} />
                            </div>
                        </td>
                    </tr>
                }
            </Fragment>
        );
    }

    toggleDisplay() {
        this.setState(prevState => ({
            isDisplay: !prevState.isDisplay
        }));
    }

    handleUpdate(data) {
        this.props.update(data);
        this.toggleDisplay();
    }
}

class AddOrUpdateSkillForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            skill: {
                id: "",
                level: "",
                name: ""
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.renderActionButtons = this.renderActionButtons.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateAndSubmitForm = this.validateAndSubmitForm.bind(this);
    }

    render() {
        var levelOptions = levels.map(x => <option key={x.key} value={x.value}> {x.title} </option>);

        return (
            <div className="ui row">
                <div className="ui five wide column">
                    <input
                        type="text"
                        name="name"
                        placeholder="Add skill"
                        onChange={this.handleChange}
                        value={this.state.skill.name}
                    />
                </div>
                <div className="ui five wide column">
                    <select
                        className="ui dropdown"
                        name="level"
                        placeholder="Level"
                        onChange={this.handleChange}
                        value={this.state.skill.level}>
                        <option value=""> Skill Level </option>
                        {levelOptions}
                    </select>
                </div>
                {this.renderActionButtons()}
            </div>
        );
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.skill)
        data[event.target.name] = event.target.value
        this.setState({
            skill: data
        })
    }

    renderActionButtons() {
        return (
            <Fragment>
                {
                    this.props.isNew ?
                        <Fragment> { /*Render SAVE buttons*/}
                            <button type="button" className="ui teal button" onClick={this.handleSubmit}>Add</button>
                            <button type="button" className="ui button" onClick={this.props.toggle}>Cancel</button>
                        </Fragment>
                        :
                        <Fragment> { /* Render UPDATE buttons */}
                            <button type="button" className="ui blue basic button" onClick={this.handleSubmit}>Update</button>
                            <button type="button" className="ui red basic button" onClick={this.props.toggle}>Cancel</button>
                        </Fragment>
                }
            </Fragment >
        );
    }

    handleSubmit() {
        this.validateAndSubmitForm();
    }

    validateAndSubmitForm() {
        const { name, level } = this.state.skill;
        if (name === "" || level === "") {   // Validate fields
            TalentUtil.notification.show("Please enter skill and level", "error", null, null)
        }
        else {  // Submit if form is valid
            this.props.isNew
                ? this.props.add(this.state.skill)
                : this.props.update(this.state.skill);
        }
    }

    componentDidMount() {
        //Initialise form fields
        this.props.skill ? this.setState({ skill: this.props.skill }) : null;
    }
}

