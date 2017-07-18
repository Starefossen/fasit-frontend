import React, {Component} from "react"
import {connect} from "react-redux"
import {fetchEnvironmentCluster, fetchEnvironmentNodes} from "../../actionCreators/environment"
import {
    DeleteElementForm,
    FormListBox,
    FormString,
    FormDropDown,
    FormLinkDropDown,
    Lifecycle,
    AccessControl,
    Security,
    SubmitForm,
    ToolButtons
} from "../common"
import {validAuthorization} from '../../utils/'
import {submitForm} from '../../actionCreators/common'


class EnvironmentCluster extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displayDeleteForm: false,
            displaySubmitForm: false,
            displayAccessControlForm: false,
            editMode: false,
            comment: "",
            clustername: "",
            zone: "",
            environmentclass: "",
            environment: "",
            loadbalancerurl: "",
            applications: [],
            adgroups: [],
            nodes: []
        }
    }

    componentDidMount() {
        const {dispatch, params, cluster} = this.props
        this.setState({
            clustername: cluster.data.clustername,
            zone: cluster.data.zone,
            environmentclass: cluster.data.environmentclass,
            environment: cluster.data.environment,
            loadbalancerurl: cluster.data.loadbalancerurl,
            applications: this.flatten(cluster.data.applications),
            nodes: this.flatten(cluster.data.nodes),
            comment: ""
        })
        if (params.environment && params.clusterName)
            dispatch(fetchEnvironmentCluster(params.environment, params.clusterName))
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, params} = this.props
        this.setState({
            clustername: nextProps.cluster.data.clustername,
            zone: nextProps.cluster.data.zone,
            environmentclass: nextProps.cluster.data.environmentclass,
            environment: nextProps.cluster.data.environment,
            loadbalancerurl: nextProps.cluster.data.loadbalancerurl,
            applications: this.flatten(nextProps.cluster.data.applications),
            nodes: this.flatten(nextProps.cluster.data.nodes),
            comment: ""
        })
        if ((params.environment != nextProps.params.environment || params.clusterName != nextProps.params.clusterName) && nextProps.params.environment && nextProps.params.clusterName) {
            dispatch(fetchEnvironmentCluster(nextProps.params.environment, nextProps.params.clusterName))
        }
        if (Object.keys(nextProps.cluster.data).length > 0) {
            this.setState({adgroups: nextProps.cluster.data.accesscontrol.adgroups})
        }
    }

    resetLocalState() {
        const {cluster} = this.props
        this.setState({
            clustername: cluster.data.clustername,
            zone: cluster.data.zone,
            environmentclass: cluster.data.environmentclass,
            environment: cluster.data.environment,
            loadbalancerurl: cluster.data.loadbalancerurl,
            applications: this.flatten(cluster.data.applications),
            nodes: this.flatten(cluster.data.nodes),
            adgroups: cluster.data.accesscontrol.adgroups,
            comment: ""

        })
    }

    toggleComponentDisplay(component) {
        const {dispatch, cluster} = this.props
        this.setState({[component]: !this.state[component]})
        if (component === "editMode" && this.state.editMode)
            this.resetLocalState()
        if (component === "editMode" && !this.state.editMode)
            dispatch(fetchEnvironmentNodes(cluster.data.environment))

    }

    render() {
        const {cluster, user, params, environments, applicationNames, environmentNodes} = this.props
        const {editMode, displaySubmitForm, clustername, zone, environmentclass, loadbalancerurl, applications, nodes, adgroups} = this.state
        let nodeNames = (environmentNodes != undefined) ? environmentNodes.map(n => n.hostname) : []
        let authorized = (Object.keys(cluster).length > 0) ? validAuthorization(user, cluster.data.accesscontrol) : false
        let lifecycle = (Object.keys(cluster).length > 0) ? cluster.data.lifecycle : {}
        return (cluster.isFetching) ? <i className="fa fa-spinner fa-pulse fa-2x"> </i> :
            <div>
                <div className="row">
                    {/*Heading*/}
                    <ToolButtons
                        disabled={!authorized}
                        onEditClick={() => this.toggleComponentDisplay("editMode")}
                        onDeleteClick={() => this.setState({displayDeleteForm: !this.state.editMode})}
                        onCopyClick={() => console.log("Copy,copycopy!")}
                    />
                </div>
                {/*Form*/}
                <div className="col-md-6 row">
                    <FormString
                        label="name"
                        editMode={editMode}
                        handleChange={this.handleChange.bind(this)}
                        value={clustername}
                    />
                    <FormString
                        label="loadbalancerurl"
                        editMode={editMode}
                        handleChange={this.handleChange.bind(this)}
                        value={loadbalancerurl}
                    />
                    <FormDropDown
                        label="environmentclass"
                        editMode={editMode}
                        value={environmentclass}
                        handleChange={this.handleChange.bind(this)}
                        options={environments.environmentClasses}
                    />
                    {this.environmentSelector()}
                    {this.zoneSelector()}
                    <FormListBox
                        label="applications"
                        editMode={editMode}
                        value={applications}
                        handleChange={this.handleChange.bind(this)}
                        options={applicationNames}
                    />
                    <FormListBox
                        label="nodes"
                        editMode={editMode}
                        value={nodes}
                        handleChange={this.handleChange.bind(this)}
                        options={nodeNames}
                    />
                    {/*Submit / Cancel buttons*/}
                    <br />
                    {this.state.editMode ?
                        <div className="btn-block">
                            <button type="submit" className="btn btn-sm btn-primary pull-right"
                                    onClick={() => this.setState({displaySubmitForm: !displaySubmitForm})}>Submit
                            </button>
                            <button type="reset" className="btn btn-sm btn-default btn-space pull-right"
                                    onClick={() => this.toggleComponentDisplay("editMode")}>Cancel
                            </button>
                        </div>
                        : ""
                    }

                    {/*Lifecycle*/}
                    <div className="col-xs-12" style={{height: 30 + "px"}}></div>

                    <div className="row">
                        <Lifecycle lifecycle={lifecycle}
                                   rescueAction={() => console.error("you need to do something about this")}
                                   authorized={authorized}/>
                    </div>
                </div>

                {/*Side menu*/}
                <div className="col-md-4">
                    {/* Disabled for now as revisions is not working properly for clusters
                     <History id={clustername} currentRevision={query.revision} component="clusters"/>*/}
                    <Security accesscontrol={cluster.data.accesscontrol}
                              displayAccessControlForm={() => this.toggleComponentDisplay("displayAccessControlForm")}/>
                </div>

                {/*Misc. modals*/}
                <AccessControl
                    displayAccessControlForm={this.state.displayAccessControlForm}
                    onClose={() => this.toggleComponentDisplay("displayAccessControlForm")}
                    onSubmit={() => this.handleSubmitForm(clustername, {
                            clustername: cluster.data.clustername,
                            zone: cluster.data.zone,
                            loadbalancerurl: cluster.data.loadbalancerurl,
                            environmentclass: cluster.data.environmentclass,
                            environment: cluster.data.environment,
                            applications: this.flatten(cluster.data.applications),
                            nodes: this.flatten(cluster.data.nodes),
                            accesscontrol: {adgroups}
                        }
                        , "", "cluster")}
                    id={clustername}
                    value={adgroups}
                    handleChange={this.handleChange.bind(this)}
                />
                <DeleteElementForm
                    displayDeleteForm={this.state.displayDeleteForm}
                    onClose={() => this.setState({displayDeleteForm: false})}
                    onSubmit={() => this.handleSubmitForm(params.clusterName, {env: params.environment}, this.state.comment, "deleteCluster")}
                    id={params.clusterName}
                    handleChange={(comment, value) => this.setState({comment: value})}
                    comment={this.state.comment}
                />
                <SubmitForm
                    display={this.state.displaySubmitForm}
                    component="cluster"
                    onSubmit={(key, form, comment, component) => this.handleSubmitForm(key, form, comment, component)}
                    onClose={() => this.toggleComponentDisplay("displaySubmitForm")}
                    newValues={{
                        clustername: this.state.clustername,
                        zone: this.state.zone,
                        loadbalancerurl: this.state.loadbalancerurl,
                        environmentclass: this.state.environmentclass,
                        environment: this.state.environment,
                        applications: this.state.applications,
                        nodes: this.state.nodes,
                    }}
                    originalValues={{
                        clustername: cluster.data.clustername,
                        zone: cluster.data.zone,
                        loadbalancerurl: cluster.data.loadbalancerurl,
                        environmentclass: cluster.data.environmentclass,
                        environment: cluster.data.environment,
                        applications: this.flatten(cluster.data.applications),
                        nodes: this.flatten(cluster.data.nodes),
                    }}
                />

            </div>
    }

    handleSubmitForm(id, form, comment, component) {
        const {dispatch} = this.props
        if (component == "cluster" && this.state.displaySubmitForm) {
            this.setState({displaySubmitForm: !this.state.displaySubmitForm})
            this.setState({editMode: !this.state.editMode})
        } else if (component === "deleteCluster") {
            this.setState({displayDeleteForm: !this.state.displayDeleteForm})
            this.setState({comment: ""})
        } else if (component === "cluster" && this.state.displayAccessControlForm) {
            this.setState({displayAccessControlForm: !this.state.displayAccessControlForm})
        }
        dispatch(submitForm(id, form, comment, component))
    }

    handleChange(field, value) {
        this.setState({[field]: value})
    }

    environmentSelector() {
        const {environments} = this.props
        const {environmentclass, environment, editMode} = this.state
        if (environmentclass) {
            const filteredEnvironments = environments.environments.filter((env) => {
                if (!environmentclass) {
                    return true
                } else {
                    return env.environmentclass === environmentclass
                }
            })
            return (
                <FormLinkDropDown
                    label="environment"
                    editMode={editMode}
                    value={environment}
                    handleChange={this.handleChange.bind(this)}
                    options={filteredEnvironments.map((env) => env.name)}
                    linkTo={`/environments/${environment}`}
                />)
        }
    }

    zoneSelector() {
        const {environments} = this.props
        const {environmentclass, zone, editMode} = this.state
        if (environmentclass && environmentclass !== 'u') {
            return (
                <FormDropDown
                    label="zone"
                    editMode={editMode}
                    value={zone}
                    handleChange={this.handleChange.bind(this)}
                    options={environments.zones}
                />)
        }
    }

    flatten(listOfObjects) {
        return (listOfObjects != undefined) ? listOfObjects.map(o => o.name) : []
    }
}


const mapStateToProps = (state) => {
    return {
        environments: state.environments,
        cluster: state.environment_cluster_fasit,
        user: state.user,
        applicationNames: state.applications.applicationNames,
        environmentNodes: state.environment_nodes_fasit.data
    }
}

export default connect(mapStateToProps)(EnvironmentCluster)