import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Search from '../common/Search'
import {logOut, getUser} from '../../actionCreators/authentication'


class TopNav extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.dispatch(getUser())
    }

    handleLogout(e) {
        e.preventDefault()
        this.props.dispatch(logOut())
    }


    showLogin() {
        if (!this.props.user.authenticated)
            return <button type="button" className="btn btn-sm btn-info pull-right" style={{margin: 10 + "px"}}><i
                className="fa fa-unlock-alt"></i>&nbsp;Log in</button>
        return (
            <div>
                <li className="userName"><i className="fa fa-user"></i>&nbsp;{this.props.user.displayname}</li>
                <li className="log-button"><span className="log-button" onClick={this.handleLogout.bind(this)}><i
                    className="fa fa-sign-out"></i>&nbsp;Log out</span></li>
            </div>
        )
    }


    render() {
        const {searchString, location} = this.props
        if (location.pathname.split('/').length > 2 || !searchString) {
            return (
                <div className="row topnav">
                    <div className="col-md-1 hidden-sm hidden-xs">
                        <div className="topnav-brand">Fasit</div>
                    </div>
                {this.showLogin()}
            </div>)

        }
        return (
            <div className="row topnav topnav-active">
                <div className="col-sm-1 hidden-xs">
                    <div className="topnav-brand-logo-container">
                        <img src="images/fasit-stempel.png" className="topnav-brand-logo"/>
                    </div>
                    </div>
                <div className="col-md-1 hidden-sm hidden-xs">
                    <div className="topnav-brand-active">Fasit</div>
                </div>
                <div className="col-xs-7 col-sm-6 col-md-4" >
                    <Search />
                </div>
                {this.showLogin()}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        location: state.routing.locationBeforeTransitions,
        searchString: state.search.searchString

    }
}

export default connect(mapStateToProps)(TopNav)
