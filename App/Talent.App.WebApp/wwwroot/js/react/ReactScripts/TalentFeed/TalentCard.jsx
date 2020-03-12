import React, { Fragment } from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Embed, Popup, Icon } from 'semantic-ui-react'

const availableItems = [
    { key: '0', name: 'video', icon: 'video' },
    { key: '1', name: 'profile', icon: 'user' },
    { key: '2', name: 'cv', icon: 'file pdf outline' },
    { key: '3', name: 'linkedin', icon: 'linkedin' },
    { key: '4', name: 'github', icon: 'github play' }
];

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: "video"
        }

        this.renderHeader = this.renderHeader.bind(this);
        this.renderActiveContent = this.renderActiveContent.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
        this.renderCV = this.renderCV.bind(this);
        this.renderSocialMediaAccount.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.renderSkills = this.renderSkills.bind(this);
    };

    render() {

        return (
            <Fragment>
                <div className="ui fluid card talent-card">
                    {this.renderHeader()}
                    {this.renderActiveContent()}
                    {this.renderMenu()}
                    {this.renderSkills()}
                </div>
                <br />
            </Fragment>
        );
    }

    renderHeader() {
        return (
            <div className="content">
                <div className="header">
                    <i aria-hidden="true" className="favorite right floated icon"></i>
                    {this.props.talentData.name}
                </div>
            </div>
        );
    }

    renderActiveContent() {
        const { activeItem } = this.state;
        let result = null;

        switch (activeItem) {
            case "video":
                result = this.renderVideo();
                break;
            case "profile":
                result = this.renderProfile();
                break;
            case "cv":
                result = this.renderCV();
                break;
            case "linkedin":
                result = this.renderSocialMediaAccount();
            case "github":
                result = this.renderSocialMediaAccount();
        }

        return result;
    }

    renderVideo() {
        return (
            <Embed
                iframe={{
                    allowFullScreen: true,
                    style: {
                        padding: 10,
                    },
                    src:
                        '//www.youtube.com/embed/O6Xo21L0ybE?autohide=true&amp;amp;autoplay=true&amp;amp;color=%23444444&amp;amp;hq=true&amp;amp;jsapi=false&amp;amp;modestbranding=false&amp;amp;rel=1',
                }}
                source='youtube'
            />
        );
    }

    renderProfile() {
        const src = this.props.talentData.photoId
            ? this.props.talentData.photoId
            : "https://react.semantic-ui.com/images/avatar/large/matthew.png";

        return (
            <div className="content">
                <div className="ui two column grid">
                    <div className="column">
                        <img src={src} className="ui medium image-talent" />
                    </div>
                    <div className="column">
                        <div className="content">
                            <div className="ui items">
                                <br />
                                <div className="header"><b>Talent Snapshot</b></div>
                                <br />
                                <div className="description"><strong>CURRENT EMPLOYER</strong></div>
                                <div className="description">{this.props.talentData.currentEmployment}</div>
                                <br />
                                <div className="description"><strong>VISA STATUS</strong></div>
                                <div className="description">{this.props.talentData.visa}</div>
                                <br />
                                <div className="description"><strong>POSITION</strong></div>
                                <div className="description">{this.props.talentData.currentEmployment}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderCV() {
        return (
            <div className="content">
                <div className="ui icon header">
                    <i aria-hidden="true" className="pdf file outline icon"></i>
                    No CV to show for this talent.
                </div>
            </div>
        );
    }

    renderSocialMediaAccount() {
        return (
            <div className="content">
                <div className="ui icon header">
                    <i aria-hidden="true" className="pdf file outline icon"></i>
                    No linked account to show for this talent.
                </div>
            </div>
        );
    }

    renderMenu() {
        const inactiveItems = availableItems.filter(item => item.name !== this.state.activeItem);
        const menuItems = inactiveItems.map(item =>
            <MenuItem
                key={item.key}
                name={item.name}
                icon={item.icon}
                handleClick={this.handleItemClick}
            />);

        return (
            <div className="content">
                <div className="header">
                    <div className="ui fluid four item icon secondary menu">
                        {menuItems}
                    </div>
                </div>
            </div>
        );
    }

    handleItemClick(event, name) {
        this.setState({ activeItem: name });
    }

    renderSkills() {

        const { skills } = this.props.talentData;
        const content = skills.map((aSkill, index) =>
            <a key={index} className="ui blue basic label">{aSkill}</a>
        );

        return (
            <div className="extra content">
                {content}
            </div>
        );
    }
}

const MenuItem = (props) => (
    <a className="item" name={props.name} onClick={(e) => props.handleClick(e, props.name)}>
        <i aria-hidden="true" className={props.icon + " large icon"}></i>
    </a>
);

