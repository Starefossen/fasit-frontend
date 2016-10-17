import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetchRevisions, fetchRevision, showAllRevisions } from '../../actionCreators/node_revisions'
import { Popover, OverlayTrigger } from 'react-bootstrap'


class NodeRevisionsView extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount(){
        const { dispatch, hostname } = this.props
        dispatch(fetchRevisions(hostname))
    }

    componentWillReceiveProps(next) {
        const {dispatch, hostname} = this.props
        if (hostname != next.hostname && next.hostname)
            dispatch(fetchRevisions(next.hostname))
    }

    handleFetchRevision(url) {
        const { dispatch } = this.props
        dispatch(fetchRevision(url.split("/").slice(6).join("/")))
    }

    handleShowAllRevisions(value) {
        const { dispatch } = this.props
        console.log("revisions", this.props)
        dispatch(showAllRevisions(value))
    }

    createPopover() {
        const {revisions} = this.props
        if (revisions.activeRevisionIsFetching || !revisions.activeRevisionData)
            return <Popover id="Revision" className="popover-size"><i className="fa fa-spinner fa-pulse fa-2x"></i></Popover>
        else if (revisions.activeRevisionRequestFailed) {
            return (
                <Popover id="Revision" className="popover-size" title="Something went wrong..." >
                    <div>Retrieving revision failed with the following message:
                        <br />
                        <pre><i>{revisions.activeRevisionRequestFailed}</i></pre>
                    </div>
                </Popover>
            )
        }
        else {
            const revision = revisions.activeRevisionData

        return (
            <Popover
                className="popover-size"
                id="Revision"
                title={"Revision #"+ revision.id}
            >
                <b>hostname:</b> <span className="text-right">{revision.hostname +'\n'}</span><br />
                <b>env. class:</b> <span className="text-right">{revision.environmentclass+'\n'}</span><br />
                <b>environment:</b> <span className="text-right">{revision.environment+'\n'}</span><br />
                <b>type:</b> <span className="text-right">{revision.type+'\n'}</span><br />
                <b>username:</b> <span className="text-right">{revision.username+'\n'}</span><br />
                <b>cluster:</b> <span className="text-right">{revision.cluster.name+'\n'}</span><br />
                <b>applications:</b> <span className="text-right">{revision.applications+'\n'}</span><br />
            </Popover>
        )}
    }

    showRevisionsContent() {
        const {revisions} = this.props
        if (revisions.isFetching || !revisions.data.length > 0)
            return <i className="fa fa-spinner fa-pulse fa-2x"></i>

        else if (revisions.requestFailed)
            return <div>Retrieving revisions failed with the following message:
                <br />
                <pre><i>{revisions.requestFailed}</i></pre>
            </div>

        let displayRevisions = revisions.data
        if (!revisions.showAllRevisions)
            displayRevisions = revisions.data.slice(0,5)

        return (
            <table className="table table-hover">
                <tbody>
                {displayRevisions.map(rev => {
                    return <tr key={rev.revision}>
                        <OverlayTrigger
                            trigger="click"
                            rootClose={true}
                            placement="left"
                            overlay={this.createPopover()}
                        >
                            <td onClick={this.handleFetchRevision.bind(this, rev.links.entity)}><i
                                className="fa fa-search"/></td>
                        </OverlayTrigger>
                        <td><i className="fa fa-user"/>{'   ' + rev.author}</td>
                        <td>{rev.revisiontype}</td>
                        <td>{moment(rev.timestamp).format('ll, HH:mm')}</td>


                    </tr>
                })}
                </tbody>
            </table>
        )
    }

    showRevisionsFooter() {
        const { revisions } = this.props
        if (revisions.data.length > 5 && !revisions.showAllRevisions) {
            return (
                <div className="information-box-footer">
                    Showing 5 of {revisions.data.length} revisions.
                    <a className="text-right arrow cursor-pointer" onClick={this.handleShowAllRevisions.bind(this, true)}>Show All <i className="fa fa-angle-double-down"/></a>
                </div>
            )
        }
        if (revisions.data.length > 5 && revisions.showAllRevisions) {
            return (
                <div className="information-box-footer">
                    Showing all revisions.
                    <a className="text-right arrow cursor-pointer" onClick={this.handleShowAllRevisions.bind(this, false)}>Hide <i
                        className="fa fa-angle-double-up"/></a>
                </div>
            )
        }
    }
    render() {
        return (
            <div className="col-lg-8 col-lg-offset-4 col-md-12">
                <div className="information-box">
                    <div className="information-box-header">
                        <div className="information-box-title">
                            <span><i className="fa fa-history"></i>&nbsp;&nbsp;Revisions</span>
                        </div>
                    </div>
                    <div className="information-box-body">
                        {this.showRevisionsContent()}
                    </div>
                    {this.showRevisionsFooter()}

                </div>
            </div>
        )
    }
}

Node.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
    hostname: ownProps.hostname,
    revisions: state.node_revisions,
})

export default connect(mapStateToProps)(NodeRevisionsView)
