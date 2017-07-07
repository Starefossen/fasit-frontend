import React, {Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory} from "react-router";
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import {styles, colors, icons}  from '../../commonStyles/commonInlineStyles'
import {capitalize} from '../../utils/'
import {getResourceTypeName, resourceTypeIcon} from '../../utils/resourceTypes'
import {submitSearch, setSearchString} from '../../actionCreators/common'
import PrettyXml from '../common/PrettyXml'
import moment from 'moment'

const APPCONFIG = "appconfig"
const APPLICATION = "application"
const CLUSTER = "cluster"
const ENVIRONMENT = "environment"
const INSTANCE = "instance"
const NODE = "node"
const RESOURCE = "resource"


class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const {dispatch, params, location} = this.props
        if (params.query) {
            dispatch(setSearchString(params.query))
            dispatch(submitSearch(params.query, location.query.type))
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, params} = this.props

        if (nextProps.params.query && params.query != nextProps.params.query) {
            dispatch(submitSearch(nextProps.params.query))
        }
    }

    // eget card element
    cellContents(key, value) {
        const {params} = this.props

        if (Array.isArray(value)) {
            return value.map((v, idx) => (<span key={idx}>{v}<br/></span>))
        }

        switch (key.toLowerCase()) {
            case "appconfig":
                return <PrettyXml xml={value} filter={params.query}/>
            case "applicationproperties":
                return value.split('\n').map((v, idx) => (<span key={idx}>{v}<br/></span>))
            default:
                return value
        }
    }

    additionalCardInfo(searchResult) {
        return (<div className="pull-right">
            <div className="text-muted">Changed {moment(searchResult.lastchange).fromNow()}</div>
            <br/>
        </div>)
    }

    searchResultCard(searchResult, idx) {
        let title
        let avatar

        const detailedInfo = searchResult.detailedinfo
        const hasDetailedInfo = Object.keys(detailedInfo).length > 0

        if (searchResult.type === RESOURCE) {
            title = `${getResourceTypeName(detailedInfo.type)} ${searchResult.name}`
            avatar = resourceTypeIcon(detailedInfo.type)
        } else {
            title = searchResult.name
            let icon = icons[searchResult.type] || searchResult.type.substr(0, 1).toUpperCase()
            avatar = (<Avatar
                backgroundColor={colors.avatarBackgroundColor}
                color={colors.white}>
                {icon}
            </Avatar>)
        }

        return (
            <div style={styles.paddingTop5} key={idx}>
                <Card expandable={hasDetailedInfo} initiallyExpanded={false}>
                    <CardHeader title={title}
                                titleStyle={styles.bold}
                                subtitle={capitalize(searchResult.type)}
                                avatar={avatar}
                                showExpandableButton={false}
                                actAsExpander={true}
                                children={this.additionalCardInfo(searchResult)}/>

                    {hasDetailedInfo ? (
                        <CardText expandable={true} actAsExpander={true}>
                            <Table>
                                <TableBody displayRowCheckbox={false}>
                                    {Object.keys(detailedInfo)
                                        .filter(di => detailedInfo[di] !== null && detailedInfo[di] !== '')
                                        .sort()
                                        .map((di) => {
                                            return (
                                                <TableRow key={di}>
                                                    <TableRowColumn style={styles.tableCellPadding}
                                                                    className={"col-sm-2"}>
                                                        {capitalize(di)}
                                                    </TableRowColumn>
                                                    <TableRowColumn style={styles.tableCellPadding}
                                                                    className="text-overflow">
                                                        {this.cellContents(di, detailedInfo[di])}
                                                    </TableRowColumn>
                                                </TableRow>)
                                        })}

                                </TableBody>
                            </Table>
                        </CardText>) : null}
                    <CardActions actAsExpander={true}>
                        <FlatButton
                            disableTouchRipple={true}
                            label="View"
                            primary={true}
                            labelStyle={styles.bold}
                        />
                    </CardActions>
                </Card>
            </div>)
    }

    filterByType(type) {
        const {searchQuery, dispatch} = this.props
        dispatch(submitSearch(searchQuery, type))
        browserHistory.push(`/search/${searchQuery}?type=${type}`)
    }

    resultTypeFilters() {
        const filter = this.props.searchResults.filter
        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="Filter"/>
                    <FilterButton activeFilter={filter} type={APPCONFIG} onClickHandler={() => this.filterByType(APPCONFIG)}/>
                    <FilterButton activeFilter={filter} type={APPLICATION} onClickHandler={() => this.filterByType(APPLICATION)}/>
                    <FilterButton activeFilter={filter} type={ENVIRONMENT} onClickHandler={() => this.filterByType(ENVIRONMENT)}/>
                    <FilterButton activeFilter={filter} type={CLUSTER} onClickHandler={() => this.filterByType(CLUSTER)} />
                    <FilterButton activeFilter={filter} type={INSTANCE} onClickHandler={() => this.filterByType(INSTANCE)} />
                    <FilterButton activeFilter={filter} type={NODE} onClickHandler={() => this.filterByType(NODE)}/>
                    <FilterButton activeFilter={filter} type={RESOURCE} onClickHandler={() => this.filterByType(RESOURCE)}/>
                </ToolbarGroup>
            </Toolbar>
        )
    }

    render() {
        return (<div className="main-content-container">
            {this.resultTypeFilters()}
            <div className="row">
                <div className="col-sm-12">
                    {this.props.searchResults.data.map((sr, idx) => this.searchResultCard(sr, idx))}
                </div>
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        searchResults: state.search,
        searchQuery: state.navsearch.query
    }
}

function FilterButton(props) {
    const {type, onClickHandler, activeFilter} = props
    return (<FlatButton key={type} primary={activeFilter===type} label={type} disableTouchRipple={true} onTouchTap={onClickHandler}/>)
}

export default connect(mapStateToProps)(Search)