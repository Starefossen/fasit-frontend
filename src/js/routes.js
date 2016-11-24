import React from 'react'
import {Route, IndexRoute} from 'react-router'

// Routes
import App from './components/Root/App'
import Search from './components/Search/Search'
import Applications from './components/Applications/Applications'
import Nodes from './components/Nodes/Nodes'
import Environments from './components/Environments/Environments'
import Resources from './components/Resources/Resources'
import Instances from './components/Instances/Instances'
import NotFound from './components/Navigation/NotFound'

export default () => {
    return (
        <Route path="/" component={App}>
            <IndexRoute component={Search}/>
            <Route path="/nodes(/:node)" component={Nodes}/>
            <Route path="/environments(/:environment)" component={Environments}/>
            <Route path="/applications(/:application)" component={Applications}/>
            <Route path="/resources(/:resource)" component={Resources}/>
            <Route path="/instances(/:instance)" component={Instances}/>
            <Route path="*" component={NotFound}/>
        </Route>
    )
}
