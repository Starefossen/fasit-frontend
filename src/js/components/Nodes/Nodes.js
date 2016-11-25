import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import ElementPaging from '../common/ElementPaging'
import ElementList from '../common/ElementList'
import SearchResults from '../Search/SearchResults'
import Filters from '../Search/Filters'

import {submitSearchString, changePage} from '../../actionCreators/element_lists'

class Nodes extends Component {
    constructor(props) {
        super(props)
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        //dispatch(clearNodesList())
    }

    componentDidMount() {
        const {dispatch, search} = this.props
        dispatch(submitSearchString("nodes", search.searchString))
        //dispatch(changePage(0))
        //dispatch(fetchElementList(filters, currentPage, "nodes"))
    }


    render() {
        const {nodes, dispatch, search} = this.props
        const total_count = nodes.headers.total_count
        const lastPage = Math.floor(total_count / 10) ? Math.floor(total_count / 10) : "?"
        const toFirstPage = ()=>dispatch(changePage(0))
        const toLastPage = ()=>dispatch(changePage(lastPage))
        const toNextPage = ()=>dispatch(changePage(search.activePage + 1, lastPage))
        const toPrevPage = ()=>dispatch(changePage(search.activePage - 1))
        if (this.props.params.node)
            return <div>{this.props.params.node}</div>//<Node hostname={this.props.params.node} />
        return (
            <div className="main-content-container">
                <Filters />
                <div className="col-sm-10">
                    <div className="row element-list-container">
                        <h4>{nodes.headers.total_count} nodes</h4>
                        <ElementList type="nodes" data={nodes}/>
                    </div>
                </div>
            </div>
        )

    }
}


const mapStateToProps = (state) => {
    return {
        nodes: state.nodes,
        search: state.search
    }
}

export default connect(mapStateToProps)(Nodes)