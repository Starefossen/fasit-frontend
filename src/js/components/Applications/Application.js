import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {checkAuthentication} from '../../utils/'
import {fetchFasitData} from '../../actionCreators/application'
import {submitForm} from '../../actionCreators/common'
import classString from 'react-classset'
import ApplicationInstances from './ApplicationInstances'
import {DeleteElementForm} from '../common/'

import {
    CollapsibleMenu,
    CollapsibleMenuItem,
    FormString,
    Lifecycle,
    RevisionsView,
    SubmitForm
} from '../common/'

class Application extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displaySubmitForm: false,
            displayDeleteForm: false,
            editMode: false,
            comment: ""
        }
    }

    componentDidMount() {
        const {dispatch, name, revision} = this.props
        dispatch(fetchFasitData(name, revision))
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, name, query} = this.props
        this.setState({
            name: nextProps.fasit.data.name,
            artifactid: nextProps.fasit.data.artifactid,
            groupid: nextProps.fasit.data.groupid,
            portoffset: nextProps.fasit.data.portoffset,
            comment: ""
        })
        if (nextProps.query.revision != query.revision) {
            dispatch(fetchFasitData(name, nextProps.query.revision))
        }
    }

    handleSubmitForm(key, form, comment, component) {
        const {dispatch} = this.props
        if (component == "application") {
            this.toggleComponentDisplay("displaySubmitForm")
            this.toggleComponentDisplay("editMode")
        } else if (component === "deleteApplication"){
            this.toggleComponentDisplay("displayDeleteForm")
            this.setState({comment:""})
        }
        dispatch(submitForm(key, form, comment, component))
    }

    resetLocalState() {
        const {fasit} = this.props
        this.setState({
            name: fasit.data.name,
            artifactid: fasit.data.artifactid,
            groupid: fasit.data.groupid,
            portoffset: fasit.data.portoffset
        })
    }

    toggleComponentDisplay(component) {
        this.setState({[component]: !this.state[component]})
        if (component === "editMode" && this.state.editMode)
            this.resetLocalState()

    }

    handleChange(field, value) {
        this.setState({[field]: value})
    }

    buttonClasses(authenticated, edit) {
        return classString({
            "btn": true,
            "btn-link": true,
            "topnav-button": true,
            "topnav-button-active": this.state.editMode && edit,
            "disabled": !authenticated
        })
    }

    render() {
        const {name, fasit, user, dispatch, query} = this.props
        const {comment} = this.state
        let authenticated = false
        let lifecycle = {}
        if (Object.keys(fasit.data).length > 0) {
            authenticated = checkAuthentication(user, fasit.data.accesscontrol)
            lifecycle = fasit.data.lifecycle
        }
        return (
            <div className="row">
                <div className="col-xs-12 row main-data-container">

                    {/*Heading*/}
                    <div className="col-sm-1 hidden-xs main-data-title">
                        <span className="fa-stack fa-lg">
                            <i className="fa fa-circle fa-stack-2x"/>
                            <i className="fa fa-cube fa-stack-1x fa-inverse"/>
                        </span>
                    </div>
                    <div className="col-sm-3 hidden-xs FormLabel main-data-title text-overflow">
                        {this.oldRevision() ?
                            <strong className="disabled-text-color">Revision #{query.revision}</strong> :
                            <strong>{name}</strong>
                        }
                    </div>
                    {this.oldRevision() ? null :
                        <div className="col-sm-2 nopadding">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <button type="button"
                                            className={this.buttonClasses(authenticated, "edit")}
                                            onClick={authenticated ? () => this.toggleComponentDisplay("editMode") : () => {
                                                }}
                                    >
                                        <i className="fa fa-wrench fa-2x"/>
                                    </button>
                                </li>
                                <li>
                                    <button type="button"
                                            className={this.buttonClasses(authenticated)}
                                            onClick={authenticated ? () => this.toggleComponentDisplay("displayDeleteForm") : () => {
                                                }}
                                    >
                                        <i className="fa fa-trash fa-2x"/>
                                    </button>
                                </li>
                            </ul>
                        </div>}
                </div>

                {/*Form*/}
                <div className={this.oldRevision() ? "col-md-6 disabled-text-color" : "col-md-6"}>
                    <FormString
                        label="name"
                        editMode={this.state.editMode}
                        value={this.state.name}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormString
                        label="artifactid"
                        editMode={this.state.editMode}
                        value={this.state.artifactid}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormString
                        label="groupid"
                        editMode={this.state.editMode}
                        value={this.state.groupid}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormString
                        label="portoffset"
                        editMode={this.state.editMode}
                        value={this.state.portoffset}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <br />

                    {/*Submit / Cancel buttons*/}
                    {this.state.editMode ?
                        <div className="btn-block">
                            <button type="submit" className="btn btn-sm btn-primary pull-right"
                                    onClick={() => this.toggleComponentDisplay("displaySubmitForm")}>Submit
                            </button>
                            <button type="reset" className="btn btn-sm btn-default btn-space pull-right"
                                    onClick={() => this.toggleComponentDisplay("editMode")}>Cancel
                            </button>
                        </div>
                        : ""
                    }

                    {/*Lifecycle*/}
                    <div className="row">
                        <Lifecycle lifecycle={lifecycle}
                                   rescueAction={() => dispatch(rescueApplication(name))}/>
                    </div>
                    <ApplicationInstances name={name}/>

                </div>
                {/*Side menu*/}

                <CollapsibleMenu>
                    <CollapsibleMenuItem label="History">
                        <RevisionsView id={name} component="application"/>
                    </CollapsibleMenuItem>
                </CollapsibleMenu>

                {/* Misc. modals*/}
                <SubmitForm
                    display={this.state.displaySubmitForm}
                    onSubmit={(key, form, comment, component) => this.handleSubmitForm(key, form, comment, component)}
                    onClose={() => this.toggleComponentDisplay("displaySubmitForm")}
                    component="application"
                    newValues={{
                        name: this.state.name,
                        groupid: this.state.groupid,
                        artifactid: this.state.artifactid,
                        portoffset: this.state.portoffset,

                    }}
                    originalValues={{
                        name: fasit.data.name,
                        groupid: fasit.data.groupid,
                        artifactid: fasit.data.artifactid,
                        portoffset: fasit.data.portoffset,
                    }}
                    additionalValues={{}}
                />
                <DeleteElementForm
                    displayDeleteForm={this.state.displayDeleteForm}
                    onClose={() => this.toggleComponentDisplay("displayDeleteForm")}
                    onSubmit={() => this.handleSubmitForm(name, null, comment, "deleteApplication")}
                    id={name}
                    handleChange={this.handleChange.bind(this)}
                    comment={comment}
                />
            </div>
        )
    }

    oldRevision() {
        const {revisions, query} = this.props
        if (!query.revision) {
            return false
        } else if (revisions.data[0]) {
            if (revisions.data[0].revision != query.revision) {
                return true
            }
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        fasit: state.application_fasit,
        user: state.user,
        name: ownProps.name,
        config: state.configuration,
        revisions: state.revisions,
        query: state.routing.locationBeforeTransitions.query
    }
}

export default connect(mapStateToProps)(Application)
