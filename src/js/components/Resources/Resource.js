import React, { Component } from "react"
import { connect } from "react-redux"
import { List, ListItem } from "material-ui/List"
import { Link } from "react-router"
import { validAuthorization } from "../../utils"
import { fetchFasitData } from "../../actionCreators/resource"
import { displayModal, rescueElement, submitForm } from "../../actionCreators/common"
import { getResourceTypeName, resourceTypeIcon, resourceTypes } from "../../utils/resourceTypes"
import { ResourceInstances } from "./ResourceInstances"
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card"
import { styles } from "../../commonStyles/commonInlineStyles"
import NotFound from "../NotFound"
import WebsphereManagementConsole from "../common/WebsphereManagementConsole"
import {
  AccessControl,
  CurrentRevision,
  DeleteElementForm,
  History,
  Lifecycle,
  RescueElementForm,
  SecretToggle,
  Security,
  ToolButtons,
  Spinner
} from "../common/"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const initialState = {
  secretVisible: false,
  displayDeleteForm: false,
  displayRescueForm: false,
  adgroups: [],
  comment: ""
}

function vaultUrl(vaultPath) {
  const baseUrl = 'https://vault.adeo.no/ui/vault/secrets/';
  const replaced = vaultPath.replace(/^([\w-]+)\/data\/(.*)\/[\w-]+$/, '$1/show/$2');
  return baseUrl + replaced;
}

class Resource extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentDidMount() {
    const { dispatch, id, query } = this.props
    if (query) {
      dispatch(fetchFasitData(id, query.revision))
    } else {
      dispatch(fetchFasitData(id))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, id, query } = this.props

    if (nextProps.id != id) {
      this.resetState(initialState)
      dispatch(fetchFasitData(nextProps.id))
    }

    if (nextProps.query.revision != query.revision) {
      dispatch(fetchFasitData(id, nextProps.query.revision))
    }
  }

  resetState() {
    this.setState(initialState)
  }

  buildFormData() {
    const { resource } = this.props
    const form = {
      alias: resource.alias,
      type: resource.type,
      properties: resource.properties,
      scope: resource.scope
    }

    if (Object.keys(this.props.currentSecrets).length > 0) {
      form.secrets = {}
      Object.keys(this.props.currentSecrets).forEach(k => {
        form.secrets[k] = { value: this.props.currentSecrets[k] }
      })
    }

    if (Object.keys(resource.files).length > 0) {
      form.files = files
    }

    return form
  }

  rescueResource() {
    const { dispatch } = this.props
    this.toggleComponentDisplay("displayRescueForm")
    dispatch(rescueElement(this.props.id, "resource"))
  }

  deleteResource(key) {
    const { dispatch } = this.props
    this.toggleComponentDisplay("displayDeleteForm")
    dispatch(submitForm(key, null, null, "deleteResource"))
  }

  updateAccessControl() {
    const { dispatch } = this.props
    const comment = "Changed accesscontrol rules"
    const form = this.buildFormData()
    form.accesscontrol = { adgroups: this.state.adgroups }
    this.toggleComponentDisplay("displayAccessControlForm")
    dispatch(submitForm(this.props.id, form, comment, "resource"))
  }

  toggleComponentDisplay(component) {
    this.setState({ [component]: !this.state[component] })
  }

  toggleDisplaySecret() {
    this.setState({ secretVisible: !this.state.secretVisible })
  }

  handleChange(field, value, parent) {
    if (parent) {
      const parentState = this.state[parent]
      parentState[field] = value
      this.setState({ parent: parentState })
    } else {
      this.setState({ [field]: value })
    }
  }

  renderResourceProperties() {
    const { resource } = this.props
    const type = this.getResourceType(resource.type)
    return <List>{type.properties.map((p, key) => this.renderProperty(p, resource))}</List>
  }

  renderProperty(property, resource) {
    const { user, dispatch } = this.props
    const { secretVisible } = this.state
    const propertyName = property.displayName
    const key = property.name
    const { properties, files } = resource

    switch (property.type) {
      case "textbox":
      case "dropdown":
        return (
          <ListItem
            key={key}
            style={{ paddingTop: "0px", paddingBottom: "14px" }}
            disabled={true}
            primaryText={properties[key]}
            secondaryText={propertyName}
          />
        )
      case "link":
        return (
          <ListItem
            key={key}
            style={{ paddingTop: "0px", paddingBottom: "14px" }}
            disabled={true}
            primaryText={
              <Link to={properties[key]} target="new">
                {property.linkTitle || properties[key]}
              </Link>
            }
            secondaryText={propertyName}
          />
        )
      case "textarea":
        return (
          <ListItem
            key={key}
            style={{ paddingTop: "0px", paddingBottom: "14px" }}
            disabled={true}
            className="text-overflow"
            primaryText={
              <pre>
                <code>{properties[key]}</code>
              </pre>
            }
            secondaryText={propertyName}
          />
        )
      case "secret":
        const secret = resource.secrets[key]
        if (secret.vaultpath != null) {
          return (
            <ListItem
                key={key}
                style={{ paddingTop: "0px", paddingBottom: "14px" }}
                disabled={true}
                className="text-overflow"
                primaryText={
                  <span>
                  <a href={vaultUrl(secret.vaultpath)}>
                    Stored in Vault
                  </a>{": "}
                  {secret.vaultpath}
                  </span>
                }
                secondaryText={propertyName}
            />
          )
        } else {
          const secretText = this.props.currentSecrets[key]
              ? this.props.currentSecrets[key]
              : "No secret stored for this revision"

          return (
            <ListItem
              key={key}
              style={{ paddingTop: "0px", paddingBottom: "14px" }}
              disabled={true}
              className="text-overflow"
              primaryText={
                <div>
                  {secretVisible ? secretText : "*********"}
                  <SecretToggle
                    user={user}
                    accesscontrol={resource.accesscontrol}
                    secretVisible={secretVisible}
                    toggleHandler={() => this.toggleDisplaySecret()}
                    dispatch={dispatch}
                  />
                </div>
              }
              secondaryText={propertyName}
            />
          )
        }
      case "file":
        return (
          <ListItem
            key={key}
            style={{ paddingTop: "0px", paddingBottom: "14px" }}
            disabled={true}
            className="text-overflow"
            primaryText={
              <Link to={files[key].ref} target="new">
                <FontAwesomeIcon className="file" fixedWidth />
                {files[key].filename}
              </Link>
            }
            secondaryText={propertyName}
          />
        )
    }
  }

  exposedByApplication() {
    const exposedBy = this.props.fasit.data.exposedby
    if (exposedBy) {
      const displayString = `${exposedBy.application} (${exposedBy.version}) in ${
        exposedBy.environment
      }`
      return (
        <ListItem
          key={exposedBy.id}
          style={{ paddingTop: "0px", paddingBottom: "14px" }}
          disabled={true}
          className="text-overflow"
          primaryText={<Link to={`/instances/${exposedBy.id}`}>{displayString}</Link>}
          secondaryText="Exposed by"
        />
      )
    }
  }

  scopeDisplayString(scope) {
    const envClass = scope.environmentclass || "-"
    const environment = scope.environment || "-"
    const zone = scope.zone || "-"
    const application = scope.application || "-"

    return `${envClass} | ${zone} | ${environment} | ${application}`
  }

  showModal(mode) {
    const { dispatch } = this.props
    dispatch(displayModal("resource", true, mode))
  }

  render() {
    // Fikse resource types slik at vi slipper å håndtere casing. For eksempel lage felt for display name
    // Sortere miljøer riktig i utils
    // sortere resource types i filter på ressurser
    // I resources element list hvis ressurstypen med riktig casing
    // håndtere error i fetch secrets
    const { id, fasit, user, query, revisions, resource, resourceModalVisible } = this.props
    let authorized = false
    let lifecycle = {}

    if (fasit.requestFailed) {
      if (fasit.requestFailed.startsWith("404")) {
        return <NotFound />
      }
      return (
        <div>
          Retrieving resource {id} failed with the following message:
          <br />
          <pre>
            <i>{fasit.requestFailed}</i>
          </pre>
        </div>
      )
    }

    if (fasit.isFetching || Object.keys(resource).length === 0) {
      return <Spinner />
    }

    if (Object.keys(resource).length > 0) {
      authorized = validAuthorization(user, fasit.data.accesscontrol)
      lifecycle = fasit.data.lifecycle
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-8" style={styles.cardPadding}>
            {<CurrentRevision revisionId={query.revision} revisions={revisions} />}
            <Card>
              <CardHeader
                avatar={resourceTypeIcon(resource.type)}
                titleStyle={styles.bold}
                title={`${getResourceTypeName(resource.type)} ${resource.alias}`}
                subtitle={this.scopeDisplayString(resource.scope)}
              />
              <CardText>
                {this.renderResourceProperties(resource.properties)}
                {this.exposedByApplication()}
                {resource.type.toLowerCase() === "deploymentmanager" && (
                  <WebsphereManagementConsole hostname={resource.properties.hostname} />
                )}
              </CardText>
              <CardActions>
                <ToolButtons
                  disabled={!authorized || resourceModalVisible}
                  onEditClick={() => this.showModal("edit")}
                  onDeleteClick={() => this.toggleComponentDisplay("displayDeleteForm")}
                  onCopyClick={() => this.showModal("copy")}
                  editMode={this.state.editMode}
                />
              </CardActions>
            </Card>
            <Lifecycle
              lifecycle={lifecycle}
              rescueAction={() => this.toggleComponentDisplay("displayRescueForm")}
              authorized={authorized}
            />
          </div>

          <div className="col-md-4">
            <History id={id} currentRevision={query.revision} component="resource" />
            <Security
              accesscontrol={fasit.data.accesscontrol}
              displayAccessControlForm={() =>
                this.toggleComponentDisplay("displayAccessControlForm")
              }
            />
          </div>
        </div>

        <div className="row col-md-8">
          <ResourceInstances instances={fasit.data.usedbyapplications} />
        </div>

        <RescueElementForm
          displayRescueForm={this.state.displayRescueForm}
          onClose={() => this.toggleComponentDisplay("displayRescueForm")}
          onSubmit={() => this.rescueResource()}
          id={id}
          handleChange={this.handleChange.bind(this)}
        />

        <AccessControl
          displayAccessControlForm={this.state.displayAccessControlForm}
          onClose={() => this.toggleComponentDisplay("displayAccessControlForm")}
          onSubmit={() => this.updateAccessControl()}
          id={id}
          value={this.state.adgroups}
          handleChange={this.handleChange.bind(this)}
        />

        <DeleteElementForm
          displayDeleteForm={this.state.displayDeleteForm}
          id={id}
          onClose={() => this.toggleComponentDisplay("displayDeleteForm")}
          onSubmit={() => this.deleteResource(id)}
        />
      </div>
    )
  }

  getResourceType(typeKey) {
    const key = Object.keys(resourceTypes).filter(
      resourceType => resourceType.toLowerCase() === typeKey.toLowerCase()
    )[0]
    return resourceTypes[key]
  }
}

const mapStateToProps = state => {
  return {
    fasit: state.resource_fasit,
    resource: state.resource_fasit.data,
    currentSecrets: state.resource_fasit.currentSecrets,
    revisions: state.revisions,
    user: state.user,
    config: state.configuration,
    query: state.routing.locationBeforeTransitions.query,
    revisions: state.revisions,
    resourceModalVisible: state.resources.showNewResourceForm
  }
}

export default connect(mapStateToProps)(Resource)
