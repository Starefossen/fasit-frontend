import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {fetchEvents} from '../../actionCreators/node_events'

class NodeEventsView extends Component {
    constructor(props) {
        super(props)
    }


    // Trenger sende hele fasitdata til actionCreator for å bygge URL basert på cluster, environment og hostname
    componentWillReceiveProps(nextProps) {
        const { fasit, dispatch } = this.props
        if (fasit.data != nextProps.fasit.data && Object.keys(nextProps.fasit.data).length > 0) {
            dispatch(fetchEvents(nextProps.fasit.data))
        }
    }


    showEvents() {
        const { events, fasit }= this.props

        if (events.isFetching || !events.data || fasit.isFetching || !fasit.data)
            return <i className="fa fa-spinner fa-pulse fa-2x"></i>

        else if (events.requestFailed)
            return (
                <div>Retrieving events failed:
                    <br />
                    <br />
                    <pre><i>No events found.</i></pre>
                </div>
            )

        {
            return this.generateEvent(events.data)
        }
    }

    generateEvent(events) {
        return events.map((event, index)=> {
                if (event.check.handlers) {
                    if (event.check.handlers[0] === "default") {
                        return (
                            <div key={index} className="information-box-content">
                                {this.getStatusIcon(event.check.status)}&nbsp;&nbsp;&nbsp;&nbsp;
                                {event.check.name.split("_").splice(1).join(" ")}
                            </div>
                        )
                    }
                }
            }
        )
    }

    getStatusIcon(status) {
        switch (status) {
            case 0:
                return <i className="fa fa-check event-ok" aria-hidden="true"></i>
            case 1:
                return <i className="fa fa-exclamation event-warning" aria-hidden="true"></i>
            case 2:
                return <i className="fa fa-exclamation-triangle event-error" aria-hidden="true"></i>
            default:
                return <i className="fa fa-question" aria-hidden="true"></i>
        }
    }


    render() {
        return (
            <div className="col-lg-4 col-md-6">
                <div className="information-box">
                    <div className="information-box-header text-overflow">
                        <h4 className="information-box-title"><i className="fa fa-bar-chart-o"></i><span
                            className="hidden-md">&nbsp;&nbsp;Events</span></h4>
                    </div>
                    <div className="information-box-body">
                        {this.showEvents()}
                    </div>

                </div>
            </div>
        )
    }
}

Node.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        events: state.node_events,
        fasit: state.node_fasit
    }
}

export default connect(mapStateToProps)(NodeEventsView)
