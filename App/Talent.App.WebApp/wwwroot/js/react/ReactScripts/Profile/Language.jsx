/* Language section */
import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie';
import { Select } from '../Form/Select.jsx';

const levels = [
    { key: '0', value: 'Basic', title: 'Basic' },
    { key: '1', value: 'Conversational', title: 'Conversational' },
    { key: '2', value: 'Fluent', title: 'Fluent' },
    { key: '3', value: 'Native/Bilingual', title: 'Native/Bilingual' },
];

export default class Language extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAdd: false
        }

        this.addLanguageToProfile = this.addLanguageToProfile.bind(this);
        this.toggleAdd = this.toggleAdd.bind(this);
        this.updateLanguageInProfile = this.updateLanguageInProfile.bind(this);
        this.deleteLanguageFromProfile = this.deleteLanguageFromProfile.bind(this);
        this.validateLanguage = this.validateLanguage.bind(this);
    }

    render() {
        const { languageData } = this.props;
        let languageRows = [];

        if (languageData) {
            languageRows = this.props.languageData.map((language, index) =>
                <LanguageRow
                    key={index}
                    language={language}
                    update={this.updateLanguageInProfile}
                    delete={this.deleteLanguageFromProfile} />
            );
        }

        return (
            <Fragment>
                {this.state.showAdd
                    ? <AddOrUpdateLanguageForm
                        isNew={true}
                        toggle={this.toggleAdd}
                        add={this.addLanguageToProfile} />
                    : null
                }
                <div className="ui sixteen wide column">
                    <div className="ui grid">
                        <div className="ui row">
                            < div className='ui sixteen wide column' >
                                <table className="ui fixed table">
                                    <LanguageTableHeader addLanguage={this.toggleAdd} />
                                    <tbody className="">{languageRows}</tbody>
                                </table>
                            </div>
                        </div >
                    </div>
                </div>
            </Fragment>
        );
    }

    addLanguageToProfile(language) {

        //this.validateLanguage(language, this.props.languageData);
        this.props.updateProfileData({
            languages: [...this.props.languageData, language]
        });
        this.toggleAdd()
    }

    toggleAdd() {
        this.setState(prevState => ({
            showAdd: !prevState.showAdd
        }));
    }

    updateLanguageInProfile(data) {
        let newLanguageData = this.props.languageData;
        const index = newLanguageData.findIndex(language => language.id === data.id);
        (index > -1) ? newLanguageData[index] = data : null; // update language if found

        this.props.updateProfileData({
            languages: newLanguageData
        });
    }

    deleteLanguageFromProfile(data) {
        this.props.updateProfileData({
            languages: this.props.languageData.filter(language => {
                return (language.id !== data.id);
            })
        });
    }

    validateLanguage(item, list) {
        const found = list.find(language => item.name === language.name);
        found
            ? TalentUtil.notification.show("Language already exists. Please enter a new one.", "error", null, null)
            : null;

        console.log(found);
    }
}

const LanguageTableHeader = (props) => (
    <thead className="">
        <tr className="">
            <th className="">Language</th>
            <th className="">Level</th>
            <th className="">
                <button
                    type="button"
                    className="ui right floated teal button"
                    onClick={props.addLanguage}
                >
                    + Add New
                </button>
            </th>
        </tr>
    </thead>
);

class LanguageRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisplay: true
        }

        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { id, name, level } = this.props.language;
        return (
            <Fragment>
                {this.state.isDisplay
                    ? <tr className="" key={id}>
                        <td className="">{name}</td>
                        <td className="">{level}</td>
                        <td className="right aligned">
                            <i aria-hidden="true" className="pencil alternate icon" onClick={this.toggleDisplay}></i>
                            <i aria-hidden="true" className="ui right floated delete icon" onClick={() => this.props.delete(this.props.language)}></i>
                        </td>
                    </tr>
                    : <tr className="" key={id} >
                        <td colSpan="3">
                            <div className="ui grid">
                                <AddOrUpdateLanguageForm
                                    isNew={false}
                                    language={this.props.language}
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

class AddOrUpdateLanguageForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            language: {
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
                        placeholder="Add language"
                        onChange={this.handleChange}
                        value={this.state.language.name}
                    />
                </div>
                <div className="ui five wide column">
                    <select
                        className="ui dropdown"
                        name="level"
                        placeholder="Level"
                        onChange={this.handleChange}
                        value={this.state.language.level}>
                        <option value=""> Language Level </option>
                        {levelOptions}
                    </select>
                </div>
                {this.renderActionButtons()}
            </div>
        );
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.language)
        data[event.target.name] = event.target.value
        this.setState({
            language: data
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
        const { name, level } = this.state.language;
        if (name === "" || level === "") {   // Validate fields
            TalentUtil.notification.show("Please enter language and level", "error", null, null)
        }
        else {  // Submit if form is valid
            this.props.isNew
                ? this.props.add(this.state.language)
                : this.props.update(this.state.language);
        }
    }

    componentDidMount() {
        //Initialise form fields
        this.props.language ? this.setState({ language: this.props.language }) : null;
    }
}

