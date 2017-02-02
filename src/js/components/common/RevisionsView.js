import React, {Component, PropTypes} from 'react'
import {Link, browserHistory} from 'react-router'
import moment from 'moment'
import {connect} from 'react-redux'
import {fetchRevisions, fetchRevision} from '../../actionCreators/common'
import {Popover, OverlayTrigger, Tooltip} from 'react-bootstrap'

class RevisionsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayAllRevisions: false
        }
    }

    componentDidMount() {
        const {dispatch, id, component} = this.props
        dispatch(fetchRevisions(component, id))
    }

    componentWillReceiveProps(next) {
        const {dispatch, id, component} = this.props
        if (id != next.id && next.id)
            dispatch(fetchRevisions(component, next.id))
    }

    handleFetchRevision(component, key, revision) {
        const {dispatch} = this.props
        dispatch(fetchRevision(component, key, revision))
    }


    createPopover(author, component) {
        const {revisions} = this.props
        if (revisions.activeRevisionIsFetching || !revisions.activeRevisionData)
            return <Popover id="Revision" className="popover-size"><i
                className="fa fa-spinner fa-pulse fa-2x"></i></Popover>
        else if (revisions.activeRevisionRequestFailed) {
            return (
                <Popover id="Revision" className="popover-size" title="Something went wrong...">
                    <div>Retrieving revision failed with the following message:
                        <br />
                        <pre><i>{revisions.activeRevisionRequestFailed}</i></pre>
                    </div>
                </Popover>
            )
        }
        else {
            const revision = revisions.activeRevisionData
            if (component === "node") {
                return (
                    <Popover
                        className="popover-size"
                        id="Revision"
                        title={"Revision #" + revision.revision + " by " + author}
                    >
                        <b>hostname:</b> <span className="text-right">{revision.hostname + '\n'}</span><br />
                        <b>env. class:</b> <span
                        className="text-right">{revision.environmentclass + '\n'}</span><br />
                        <b>environment:</b> <span className="text-right">{revision.environment + '\n'}</span><br />
                        <b>type:</b> <span className="text-right">{revision.type + '\n'}</span><br />
                        <b>username:</b> <span className="text-right">{revision.username + '\n'}</span><br />
                        <b>cluster:</b> <span className="text-right">{revision.cluster.name + '\n'}</span><br />
                        <b>applications:</b> <span
                        className="text-right">{revision.applications + '\n'}</span><br />
                    </Popover>
                )
            } else if (component === "application") {
                return (
                    <Popover
                        className="popover-size"
                        id="Revision"
                        title={"Revision #" + revision.revision + " by " + author}
                    ><br />
                        <b>Name:</b> <span className="text-right">{revision.name + '\n'}</span><br />
                        <b>Group Id:</b> <span className="text-right">{revision.groupid + '\n'}</span><br />
                        <b>Artifact Id:</b> <span className="text-right">{revision.artifactid + '\n'}</span><br />
                        <b>Port offset:</b> <span className="text-right">{revision.portoffset + '\n'}</span><br />
                    </Popover>
                )
            } else if (component === "instance") {
                return (
                    <Popover
                        className="popover-size"
                        id="Revision"
                        title={"Revision #" + revision.revision + " by " + author}
                    ><br />
                        <b>Application:</b> <span className="text-right">{revision.application + '\n'}</span><br />
                        <b>Version:</b> <span className="text-right">{revision.version + '\n'}</span><br />
                        <b>Environment:</b> <span className="text-right">{revision.environment + '\n'}</span><br />
                        <b>Cluster:</b> <span className="text-right">{revision.cluster.name + '\n'}</span><br />
                    </Popover>
                )
            } else {
                return <Popover>I don't have a Popover for this component type yet</Popover>

            }

        }
    }

    showRevisionsContent() {
        const {revisions, component, id, routing} = this.props

        if (revisions.isFetching)
            return <i className="fa fa-spinner fa-pulse fa-2x"></i>

        else if (revisions.requestFailed)
            return <div>Retrieving revisions failed with the following message:
                <br />
                <pre><i>{revisions.requestFailed}</i></pre>
            </div>

        let displayRevisions = revisions.data
        if (!this.state.displayAllRevisions)
            displayRevisions = revisions.data.slice(0, 5)
        return (
            <table className="table table-hover">
                <tbody>
                {displayRevisions.map(rev => {
                    return <tr
                        id={rev.revision}
                        key={rev.revision}
                        onClick={() => browserHistory.push(routing.pathname + "?revision=" + rev.revision)}
                        className={(rev.revision == routing.query.revision) ? "cursor-pointer info" : "cursor-pointer"}
                    >
                        {rev.message ?
                            <OverlayTrigger
                                placement="left"
                                overlay={this.tooltip(rev.message)}
                            >
                                <td>
                                    <i className="fa fa-comment fa-flip-horizontal"/>
                                </td>
                            </OverlayTrigger>
                            : <td></td>}
                        <td>{rev.revisiontype === "mod" ? "Modified" : "Created"} by {rev.author}</td>
                        <td>{moment(rev.timestamp).fromNow()}</td>
                        <OverlayTrigger
                            trigger={["hover", "focus"]}
                            rootClose={true}
                            placement="bottom"
                            onEnter={() => this.handleFetchRevision(component, id, rev.revision)}
                            overlay={this.createPopover(rev.author, component)}
                        >
                            <td className="cursor-pointer"><i
                                className="fa fa-search"/></td>
                        </OverlayTrigger>


                    </tr>
                })}
                </tbody>
            </table>
        )
    }

    tooltip(message) {
        return (
            <Tooltip id="tooltip">{message}</Tooltip>
        )
    }

    showRevisionsFooter() {
        const {revisions} = this.props
        if (revisions.data.length > 5 && !this.state.displayAllRevisions) {
            return (
                <div className="information-box-footer">
                    Showing 5 of {revisions.data.length} revisions.
                    <a className="text-right arrow cursor-pointer"
                       onClick={() => this.setState({displayAllRevisions: true})}>Show All <i
                        className="fa fa-angle-double-down"/></a>
                </div>
            )
        }
        if (revisions.data.length > 5 && this.state.displayAllRevisions) {
            return (
                <div className="information-box-footer">
                    Showing all revisions.
                    <a className="text-right arrow cursor-pointer"
                       onClick={() => this.setState({displayAllRevisions: false})}>Hide <i
                        className="fa fa-angle-double-up"/></a>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className="node-information-box">
                    {this.showRevisionsContent()}
                </div>
                {this.showRevisionsFooter()}

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    id: ownProps.id,
    revisions: state.revisions,
    component: ownProps.component,
    routing: state.routing.locationBeforeTransitions
})

export default connect(mapStateToProps)(RevisionsView)
