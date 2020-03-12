import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 400,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadCompanyDetails = this.loadCompanyDetails.bind(this);
        this.loadFeed = this.loadFeed.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.renderTalents = this.renderTalents.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    loadData() {
        this.loadCompanyDetails();
        this.loadFeed();
        this.init()
    }

    loadCompanyDetails() {
        var cookies = Cookies.get('talentAuthToken');

        const localUrl = 'http://localhost:60290/profile/profile/getEmployerProfile';
        const azureUrl = 'https://standardtasktalentservicesprofile.azurewebsites.net/profile/profile/getEmployerProfile';

        $.ajax({
            url: azureUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let companyDetails = null;
                if (res.employer) {
                    companyDetails = res.employer.companyContact
                }
                this.updateWithoutSave(companyDetails)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        });
    }

    loadFeed() {
        var cookies = Cookies.get('talentAuthToken');

        const localUrl = 'http://localhost:60290/profile/profile/getTalent';
        const azureUrl = 'https://standardtasktalentservicesprofile.azurewebsites.net/profile/profile/getTalent';

        $.ajax({
            url: azureUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: { position: this.state.loadPosition, number: this.state.loadNumber},
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let newFeedData = this.state.feedData;
                let newLoadPosition = this.state.loadPosition;

                if (res.data) {
                    //talentFeed = res.f
                    //console.log("employerData", res.employer)
                    newFeedData = newFeedData.concat(res.data);
                    newLoadPosition += this.state.loadNumber;
                    console.log(newFeedData);
                    console.log(newLoadPosition);
                }
                console.log(res);
                this.setState({
                    feedData: newFeedData,
                    loadPosition: newLoadPosition
                });
                //this.updateWithoutSave(companyDetails)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    updateWithoutSave(newData) {
        let newCD = Object.assign({}, this.state.companyDetails, newData)
        this.setState({
            companyDetails: newCD
        })
    }

    componentDidMount() {
        this.loadData()
        window.addEventListener('scroll', this.handleScroll);
    };

    handleScroll() {
        const win = $(window);
        if ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1) {
            $("#load-more-loading").show();
            //load ajax and update states
            this.loadFeed();
            //call state and update state;
        }
        $("#load-more-loading").hide();
    };


    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="ui sixteen wide column">
                        <div className="ui grid">
                            <div className='ui row'>
                                <div className="ui four wide column">
                                    <CompanyProfile companyData={this.state.companyDetails} />
                                </div>
                                <div className="ui eight wide column">
                                    {this.renderTalents()}
                                    <p id="load-more-loading">
                                        <img src="/images/rolling.gif" alt="Loading…" />
                                    </p>
                                </div>
                                <div className="ui four wide column">
                                    <div className="ui card">
                                        <FollowingSuggestion />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }

    renderTalents() {
        const { feedData } = this.state;

        const talentList = feedData.map(talent =>
            <TalentCard key={talent.id} id={talent.id} talentData={talent} />);

        return (talentList && talentList.length > 0)
            ? talentList
            : <b>There are no talents found for your recruitment company</b>
    }
}