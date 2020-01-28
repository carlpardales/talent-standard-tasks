/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends Component {
    constructor(props) {
        super(props);

        this.saveIntroduction = this.saveIntroduction.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event) {
        const data = {
            summary: this.props.summary,
            description: this.props.description
        }
        data[event.target.name] = event.target.value
        this.props.updateWithoutSave(data);
    }

    saveIntroduction() {
        const data = {
            summary: this.props.summary,
            description: this.props.description
        }
        console.log(data)
        this.props.updateProfileData(data)
    }

    render() {
        return (
            <div className='ui row'>
                <div className="ui four wide column">
                    <h3>Description</h3>
                </div>
                <div className="ui twelve wide column">
                    <div className="ui row">
                        <div className="field">
                            <input
                                type="text"
                                name="summary"
                                defaultValue={this.props.summary}
                                placeholder="Please provide a short summary about yourself."
                                maxLength={150}
                                onChange={this.handleChange}
                            />
                        </div>
                        <p>Summary must be no more than 150 characters.</p>
                    </div>
                    <div className="ui row">
                        <div className="field">
                            <textarea
                                name="description"
                                placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add."
                                value={this.props.description}
                                onChange={this.handleChange}
                            >
                            </textarea>
                        </div>
                        <p>Description must be between 150-600 characters.</p>
                    </div>
                    <button type="button" className="ui right floated teal button" onClick={this.saveIntroduction}>Save</button>
                </div>
            </div>
        );

    }
}



