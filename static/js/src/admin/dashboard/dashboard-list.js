import React, { Component } from 'react';

import Slideout from '../../menu/slideout';
import Backdrop from '../../utilities/backdrop';
import MainMenu from '../../menu/menu';
import { utilities } from '../utilities';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.openSlideout = this.openSlideout.bind(this);
        this.closeSlideout = this.closeSlideout.bind(this);

        this.state = {
            slideoutDisplay: false
        };
    }

    componentDidMount() {
        utilities.setMenuOffset();
    }

    openSlideout() {
        this.setState({ slideoutDisplay: true });
    }

    closeSlideout() {
        this.setState({ slideoutDisplay: false });
    }

    render() {
        return (
            <div>
                <Slideout closeSlideout={this.closeSlideout} display={this.state.slideoutDisplay} />
                <MainMenu openSlideout={this.openSlideout} />
                <div className="row admin-main-dash">
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">
                            <div>Welcome Back, Name to go here</div>
                            <div className="flex-card-main">
                                <i className="fa fa-user-o fa-4x"></i>
                                <span>My Profile</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">Latest Site Updates</div>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">Latest Nord Updates</div>
                    </div>
                </div>
                <div className="row admin-main-dash">
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">Hit Count Chart</div>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">Chart 2</div>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <div className="card flex-card">Chart 3</div>
                    </div>
                </div>
                <div className="row admin-footer">Admin footer links</div>
                <Backdrop display={this.state.slideoutDisplay} closeSlideout={this.closeSlideout} />
            </div>
        );
    }
}