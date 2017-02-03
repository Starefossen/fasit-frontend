import React, {Component, PropTypes} from "react"
import {connect} from "react-redux"
import {checkAuthentication} from '../../utils/'
import {CollapsibleMenu, CollapsibleMenuItem, RevisionsView, Lifecycle, FormString} from "../common/"
import {
    fetchEnvironment
} from "../../actionCreators/environment"

class Environment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displayClusters: true,
            displayNodes: false,
            displayInstances: false
        }
    }

    componentDidMount() {
        const {dispatch, id, revision} = this.props
        dispatch(fetchEnvironment(id, revision))
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, id, query} = this.props
        if (nextProps.query.revision != query.revision) {
            dispatch(fetchEnvironment(id, nextProps.query.revision))
        }
    }

    render() {
        const {environment, user} = this.props
        let lifecycle = {}
        let authenticated = false
        if (Object.keys(environment).length > 0) {
            authenticated = checkAuthentication(user, environment.accesscontrol)
            lifecycle = environment.lifecycle
        }
        return (
            <div className="row">
                <div className="col-xs-12" style={{height: 30 + "px"}}></div>

                {/*Form*/}
                <div className={this.oldRevision() ? "col-md-6 disabled-text-color" : "col-md-6"}>
                    <FormString
                        label="name"
                        value={environment.name}
                    />
                    <FormString
                        label="environment class"
                        value={environment.environmentclass}
                    />
                    {/*Lifecycle*/}
                    <div className="col-xs-12" style={{height: 30 + "px"}}></div>

                    <div className="row">
                        <Lifecycle lifecycle={lifecycle}
                                   rescueAction={() => dispatch(rescueNode(hostname))}/>
                    </div>
                </div>

                {/*Side menu*/}
                <CollapsibleMenu>
                    <CollapsibleMenuItem label="History">
                        <RevisionsView id={environment.name} component="environment"/>
                    </CollapsibleMenuItem>
                </CollapsibleMenu>

                {/*Content view*/}
                <div className="col-xs-12" style={{height: 20 + "px"}}></div>
                <div className="col-xs-12">
                    <ul className="nav nav-tabs">
                        <li className={this.state.displayClusters ? "active" : ""}><a
                            onClick={() => this.selectTab("clusters")}>Clusters</a></li>
                        <li className={this.state.displayNodes ? "active" : ""}><a
                            onClick={() => this.selectTab("nodes")}>Nodes</a></li>
                        <li className={this.state.displayInstances ? "active" : ""}><a
                            onClick={() => this.selectTab("instances")}>Instances</a>
                        </li>
                    </ul>
                </div>
                <div className="col-xs-12">
                    <div className="col-xs-12" style={{height: 20 + "px"}}></div>
                    {this.state.displayClusters ? '' : ''}
                    {this.state.displayNodes ? '' : ''}
                    {this.state.displayInstances ? '' : ''}
                </div>
            </div>
        )
    }

    selectTab(tab) {
        switch (tab) {
            case "clusters":
                this.setState({
                        displayClusters: true,
                        displayNodes: false,
                        displayInstances: false
                    }
                )
                return
            case "nodes":
                return this.setState({
                        displayClusters: false,
                        displayNodes: true,
                        displayInstances: false
                    }
                )
            case "instances":
                return this.setState({
                        displayClusters: false,
                        displayNodes: false,
                        displayInstances: true
                    }
                )
        }
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
        user: state.user,
        id: ownProps.name,
        environment: state.environment_fasit.data,
        revisions: state.revisions,
        query: state.routing.locationBeforeTransitions.query
    }
}

export default connect(mapStateToProps)(Environment)
