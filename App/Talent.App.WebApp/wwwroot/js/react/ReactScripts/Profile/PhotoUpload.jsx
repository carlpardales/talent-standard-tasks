/* Photo upload section */
import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            profilePhoto: "",
            edited: false
        });

        this.handleImageChange = this.handleImageChange.bind(this);
        this.renderPhoto = this.renderPhoto.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.renderNoImage = this.renderNoImage.bind(this);
        this.renderUploadButton = this.renderUploadButton.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.updateDisplayedPhoto = this.updateDisplayedPhoto.bind(this);
    };


    render() {
        return (
            <div className="ui grid">
                <div className='ui row'>
                    <div className="ui sixteen wide column">
                        {this.renderPhoto()}
                        <input
                            type="file"
                            name="file"
                            id="profilePhoto"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={this.handleImageChange}
                        />
                    </div>
                </div>
                {this.state.edited ? this.renderUploadButton() : null}
            </div>
        );
    }

    handleImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                profilePhoto: URL.createObjectURL(event.target.files[0]),
                edited: true
            });
        }
    }

    renderPhoto() {
        return this.state.profilePhoto ? this.renderImage() : this.renderNoImage();
    }

    renderImage() {
        return (
            <label htmlFor="profilePhoto" className="ui image">
                <img src={this.state.profilePhoto} className="ui medium circular image" />
            </label>
        );
    }

    renderNoImage() {
        return (
            <label htmlFor="profilePhoto" className="ui icon">
                <i className="camera retro circular huge icon"></i>
            </label>
        );
    }

    renderUploadButton() {
        return (
            <div className='ui row'>
                <div className="ui sixteen wide column">
                    <button className="ui upload teal button" onClick={this.updateDisplayedPhoto}>
                        <i aria-hidden="true" className="upload icon"></i>
                        Upload
                    </button>
                </div>
            </div>
        );
    }

    // Temporarilty being called by upload button to pending full implementation of UploadProfiePhoto in the back-end.
    updateDisplayedPhoto(event) {
        event.preventDefault();
        this.setState({
            edited: false
        });
    }

    uploadPhoto(event) {
        event.preventDefault();

        var formData = new FormData();
        formData.append('file', $('#profilePhoto')[0].files[0]);

        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies
            },
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile photo uploaded sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Profile did not upload successfully", "error", null, null)
                }

                this.setState({
                    edited: false
                });

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }
}
