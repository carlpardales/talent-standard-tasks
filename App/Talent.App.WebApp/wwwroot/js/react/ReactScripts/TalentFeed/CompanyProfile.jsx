import React, { Fragment } from 'react';
import { Loader } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let name = this.props.companyData ? this.props.companyData.name : ""
        let email = this.props.companyData ? this.props.companyData.email : ""
        let phone = this.props.companyData ? this.props.companyData.phone : ""
        let location = { city: '', country: '' }
        if (this.props.companyData && this.props.companyData.location) {
            location = Object.assign({}, this.props.companyData.location);
        }

        return (
            <div className="ui card employer-card">
                <div className="content">
                    <div className="center aligned">
                        <img className="ui mini circular image" src="https://react.semantic-ui.com/images/wireframe/square-image.png" />
                    </div>
                    <div className="center aligned header">{name}</div>
                    <div className="center aligned meta">
                        <i aria-hidden="true" className="marker icon"></i>
                        {location.city}{", "}{location.country}
                        </div>
                    <div className="center aligned description">
                        We currently do not have specific skills that we desire.
                        </div>
                </div>
                <div className="extra content">
                    <div className="row">
                        <i aria-hidden="true" className="phone icon"></i>
                        : {phone}
                        </div>
                    <div className="row">
                        <i aria-hidden="true" className="mail icon"></i>
                        : {email}
                        </div>
                </div>
            </div>
        );
    }
}