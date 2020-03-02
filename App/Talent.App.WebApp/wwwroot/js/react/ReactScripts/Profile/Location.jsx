import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends Component {
    constructor(props) {
        super(props)

        const addressData = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                number: "",
                street: "",
                suburb: "",
                postCode: "",
                city: "",
                country: ""
            }

        this.state = {
            showEditSection: false,
            newAddress: addressData
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.renderCountriesDropdown = this.renderCountriesDropdown.bind(this)
        this.renderCitiesDropdown = this.renderCitiesDropdown.bind(this)
    }

    openEdit() {
        const addressData = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newAddress: addressData
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newAddress)
        data[event.target.name] = event.target.value
        this.setState({
            newAddress: data
        })
    }

    saveAddress() {
        console.log(this.state.newAddress)
        let data = { address: {} }
        data.address = Object.assign({}, this.state.newAddress)
        this.props.saveProfileData(data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        );
    }

    renderEdit() {
        return (
            <div className="ui sixteen wide column">
                <div className="ui grid">
                    <div className='ui row'>
                        <div className="ui four wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Number"
                                name="number"
                                value={this.state.newAddress.number}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Enter a street number"
                                errorMessage="Please enter a valid street number"
                            />
                        </div>
                        <div className="ui eight wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Street"
                                name="street"
                                value={this.state.newAddress.street}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Enter a street name"
                                errorMessage="Please enter a valid street name"
                            />
                        </div>
                        <div className="ui four wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Suburb"
                                name="suburb"
                                value={this.state.newAddress.suburb}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Enter a suburb"
                                errorMessage="Please enter a valid suburb"
                            />
                        </div>
                    </div>
                    <div className='ui row'>
                        <div className="ui six wide column">
                            {this.renderCountriesDropdown()}
                        </div>
                        <div className="ui six wide column">
                            {this.renderCitiesDropdown()}
                        </div>
                        <div className="ui four wide column">
                            <ChildSingleInput
                                inputType="text"
                                label="Post Code"
                                name="postCode"
                                value={this.state.newAddress.postCode}
                                controlFunc={this.handleChange}
                                maxLength={4}
                                placeholder="Enter a post code"
                                errorMessage="Please enter a valid post code"
                            />
                        </div>
                    </div>

                    <div className="ui sixteen wide column">
                        <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div >
                </div>
            </div>
        )
    }

    renderDisplay() {

        let address = this.props.addressData ? `${this.props.addressData.number}, ${this.props.addressData.street},
            ${this.props.addressData.suburb}, ${this.props.addressData.postCode}` : ""
        let city = this.props.addressData ? this.props.addressData.city : ""
        let country = this.props.addressData ? this.props.addressData.country : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {address}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

    renderCountriesDropdown() {
        let countriesOptions = [];
        const selectedCountry = this.state.newAddress.country;

        countriesOptions = Object.keys(Countries).map((x) =>
            <option key={x} value={x}> {x} </option>
        );

        return (
            <div className="field">
                <label>Country</label>
                <select
                    className="ui dropdown"
                    placeholder="Country"
                    value={selectedCountry}
                    onChange={this.handleChange}
                    name="country">
                    <option value=""> Select a country </option>
                    {countriesOptions}
                </select>
            </div>
        );
    }

    renderCitiesDropdown() {
        let citiesOptions = [];
        const selectedCountry = this.state.newAddress.country;
        const selectedCity = this.state.newAddress.city;

        if (selectedCountry) {
            citiesOptions = Countries[selectedCountry].map(x =>
                <option key={x} value={x}> {x} </option >
            );
        }

        return (
            <div className="field">
                <label>City</label>
                <select
                    className="ui dropdown"
                    placeholder="City"
                    value={selectedCity}
                    onChange={this.handleChange}
                    name="city">
                    <option value=""> Select a town or city </option>
                    {citiesOptions}
                </select>
            </div>
        );
    }

}

export class Nationality extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.saveNationality = this.saveNationality.bind(this)
    }

    handleChange(event) {
        const data = { [event.target.name]: event.target.value }
        this.props.saveProfileData(data);        
    }

    saveNationality() {
        const data = { nationality: this.state.nationality }
        this.props.saveProfileData(data);
    }

    render() {
        let countriesOptions = [];
        const selectedCountry = this.props.nationalityData;

        countriesOptions = Object.keys(Countries).map((x) =>
            <option key={x} value={x}> {x} </option>
        );

        return (
            <div className='ui row'>
                <div className="ui six wide column">
                    <select
                        className="ui dropdown"
                        placeholder="Country"
                        value={selectedCountry}
                        onChange={this.handleChange}
                        name="nationality">
                        <option value=""> Select your nationality </option>
                        {countriesOptions}
                    </select>
                </div>
            </div>
        );
    }
}