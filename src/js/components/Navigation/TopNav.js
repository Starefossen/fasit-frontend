import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {Popover, OverlayTrigger} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Login, AuraTools, NavSearch} from '../common/'
import ContextMenu from './ContextMenu'
import {logOut, getUser, displayLogin} from '../../actionCreators/authentication'
import {toggleHelp, displayModal} from '../../actionCreators/common'


class TopNav extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.dispatch(getUser())
    }


    showLogin(root) {
        const {user, dispatch} = this.props
        return (
            <ul className="nav navbar-nav navbar-right">
                {/* Nytt element*/}
                {user.authenticated ? (
                        <li>
                            <OverlayTrigger
                                trigger="focus"
                                placement="bottom"
                                id="toolsOverlay"
                                overlay={this.toolsOverlay()}
                            >
                                <button
                                    type="button"
                                    className={root ? "btn btn-sm  btn-link topnav-buttons-inverse" : "btn btn-sm  btn-link topnav-buttons"}
                                    style={{marginTop: 8, marginRight: 10}}>
                                    <span className="fa-stack" style={{marginRight: 5, marginBottom: 3}}><i
                                        className="fa fa-circle fa-stack-2x user-icon"/><i
                                        className="fa fa-plus fa-stack-1x fa-inverse" style={{marginTop: 1}}/></span>
                                    New
                                </button>
                            </OverlayTrigger>
                        </li>
                    ) : null
                }

                {/* Logg inn eller brukermeny*/}
                {!user.authenticated ? (
                        <li>
                            <button
                                type="button"
                                className={root ? "btn btn-sm  btn-link topnav-buttons-inverse" : "btn btn-sm  btn-link topnav-buttons"}
                                onClick={() => dispatch(displayLogin(true))}
                                style={{marginTop: 8, marginRight: 10}}
                            >
                                <span className="fa-stack" style={{marginRight: 5, marginBottom: 3}}><i
                                    className="fa fa-circle fa-stack-2x user-icon"/><i
                                    className="fa fa-unlock-alt fa-stack-1x fa-inverse"/></span>
                                Log in
                            </button>
                        </li>

                    ) : (
                        <li>
                            <OverlayTrigger
                                trigger="click"
                                id="loginInformationOverlay"
                                rootClose={true}
                                placement="bottom"
                                overlay={this.loginInformationOverlay()}
                            >
                                <button type="button"
                                        className={root ? "btn btn-sm  btn-link topnav-buttons-inverse" : "btn btn-sm  btn-link topnav-buttons"}
                                        style={{marginTop: 8}}>
                            <span className="fa-stack" style={{marginRight: 5, marginBottom: 3}}><i
                                className="fa fa-circle fa-stack-2x user-icon"/><i
                                className="fa fa-user fa-stack-1x fa-inverse"/></span>{user.displayname}
                                </button>
                            </OverlayTrigger>
                        </li>
                    )}

                {/* Aurabot */}
                <li>
                    <OverlayTrigger
                        trigger={"click"}
                        rootClose={true}
                        placement="bottom"
                        overlay={AuraTools()}
                    >
                        <img
                            src="/images/aura-ikoner/aurabot.png"
                            style={{width: 30, marginTop: 11, marginRight: 30, marginLeft: 12, cursor: "pointer"}}
                            className="topnavIcon"/>

                    </OverlayTrigger>
                </li>

                {/* Shortcuts */}
                <li>
                    <button type="button"
                            className={root ? "btn btn-sm  btn-link topnav-buttons-inverse" : "btn btn-sm  btn-link topnav-buttons"}
                            onClick={() => dispatch(toggleHelp())}
                            style={{marginTop: 8}}>
                        <i className="fa fa-2x fa-keyboard-o"/>
                    </button>
                </li>
            </ul>
        )
    }

    loginInformationOverlay() {
        const {dispatch, user} = this.props
        return (
            <Popover id="login">
                <h5>Roles</h5>
                <ul className="topnav-menu">
                    {user.roles.map((role, idx) => <li key={idx}>{role.split("ROLE_")[1].toLowerCase()}</li>)}
                </ul>
                <hr />
                <button
                    style={{outline: "none"}}
                    type="button"
                    className="btn btn-info btn-sm"
                    onClick={() => dispatch(logOut())}
                >Log out
                </button>

            </Popover>
        )
    }

    toolsOverlay() {
        const {dispatch} = this.props
        return (
            <Popover id="tools">
                <ul className="topnav-menu topnav-menu-selector">
                    <li onClick={() => dispatch(displayModal("resource", true))}><i
                        className="fa fa-cogs"/> &nbsp;&nbsp; Create resource
                    </li>
                    <li onClick={() => dispatch(displayModal("application", true))}><i
                        className="fa fa-cube"/> &nbsp;&nbsp; Create application
                    </li>
                    <li onClick={() => dispatch(displayModal("environment", true))}><i
                        className="fa fa-sitemap"/> &nbsp;&nbsp; Create environment
                    </li>
                    <li onClick={() => dispatch(displayModal("node", true))}><i
                        className="fa fa-server"/> &nbsp;&nbsp;Create node
                    </li>
                    <li onClick={() => dispatch(displayModal("cluster", true))}><i
                        className="fa fa-braille"/> &nbsp;&nbsp; Create cluster
                    </li>
                </ul>
            </Popover>
        )
    }

    render() {
        const {location, search, dispatch} = this.props
        const pathname = this.props.location.pathname.split('/')[1]
        const context = pathname === "search" ? "anything" : pathname
        return (location.pathname !== "/") ?
            (
                <div>
                    <div className="topnav topnav-active">
                        <div className="col-sm-1 col-md-2 hidden-xs">
                            <div className="topnav-brand-logo-container">
                                <Link to="/">
                                    <img src="/images/aura-ikoner/fasit-white.png" className="topnav-brand-logo"/>
                                </Link>
                            </div>
                        </div>

                        <div className="col-xs-7 col-sm-6 col-md-4">
                            <NavSearch />

                        </div>
                        {this.showLogin()}
                        <Login />
                    </div>
                    <ContextMenu />
                </div>
            ) : (
                <div className="topnav">
                    {this.showLogin("root")}
                    <Login />
                </div>)

    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        location: state.routing.locationBeforeTransitions,
        search: state.search

    }
}

export default connect(mapStateToProps)(TopNav)
