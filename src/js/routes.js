import React from "react";
import { Route, Switch } from "react-router-dom";

// Routes
//import App from "./components/Root/App"
import Search from "./components/Search/Search";
import Applications from "./components/Applications/Applications";
import Application from "./components/Applications/Application";
//import Nodes from "./components/Nodes/Nodes"
import Environments from "./components/Environments/Environments";
import Environment from "./components/Environments/Environment";
import EnvironmentCluster from "./components/Environments/EnvironmentCluster";
//import Resources from "./components/Resources/Resources"
//import Instances from "./components/Instances/Instances"
import NotFound from "./components/NotFound";

export const Routes = () => {
  return (
    <Switch>
      {<Route exact path="/" component={Search} />}
      {<Route path="/search/:query?" component={Search} />}
      {/*<Route path="/nodes(/:node)" component={Nodes} />*/}
      <Route
        path="/environments/:environment/clusters/:clusterName?"
        component={EnvironmentCluster}
      />
      <Route exact path="/environments/" component={Environments} />
      <Route path="/environments/:environment?" component={Environment} />
      <Route exact path="/applications/" component={Applications} />
      <Route path="/applications/:application?" component={Application} />
      {/*<Route path="/resources(/:resource)" component={Resources} />
<Route path="/instances(/:instance)" component={Instances} />*/}
      <Route path="*" component={NotFound} />*
    </Switch>
  );
};
