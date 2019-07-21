import React, { Component, PropTypes } from "react"
import { Modal } from "react-bootstrap"
import { connect } from "react-redux"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import {
  MaterialDropDown,
  MaterialTextArea,
  MaterialTextBox
} from "../common/Forms"
import {
  colors,
  icons,
  styles,
  styleSet
} from "../../commonStyles/commonInlineStyles"
import { capitalize } from "../../utils"
import { displayModal, submitForm } from "../../actionCreators/common"
import { getResourceTypeName, resourceTypes } from "../../utils/resourceTypes"
import Chip from "material-ui/Chip"
import Scope from "./Scope"

class NewResourceForm extends Component {
  constructor(props) {
    super(props)
    this.initialState()
  }

  initialState() {
    this.state = {
      alias: "",
      type: "",
      properties: {},
      scope: {
        environmentclass: "u",
        environment: null,
        zone: null,
        application: null
      },
      currentFiles: {},
      currentSecrets: {},
      validationErrors: null,
      comment: ""
    }
  }

  componentWillReceiveProps(next) {
    const { resource } = this.props
    const { alias, type, properties, scope, files } = resource.data
    if (next.mode === "edit") {
        this.setState({
            alias,
            type,
            properties,
            scope,
            files,
            currentSecrets: next.currentSecrets
        })
    }
    else if (next.mode === "copy") {
        this.setState({
            alias,
            type,
            properties,
            scope,
            files
        })
    }

    else {
      this.resetLocalState()
    }
  }

  resetLocalState() {
    this.setState({
      alias: "",
      properties: {},
      files: {},
      currentSecrets: {},
      currentFiles: {},
      comment: "",
      validationErrors: null
    })
  }

  handleChange(field, newValue, parent) {
    if (field === "type" && this.state.type !== newValue) {
      this.resetLocalState()
    }

    if (parent) {
      const parentState = this.state[parent]
      parentState[field] = newValue
      this.setState({ parent: parentState })
    } else {
      this.setState({ [field]: newValue })
    }
  }

  removeEmpty(obj) {
    const cleanObj = { ...obj }
    Object.keys(cleanObj).forEach(key => {
      if (!cleanObj[key]) {
        delete cleanObj[key]
      }
    })
    return cleanObj
  }

  handleSubmitForm() {
    const { dispatch, resource, mode } = this.props
    const {
      alias,
      type,
      properties,
      files,
      comment,
      currentSecrets,
      currentFiles
    } = this.state

    if (!this.isValid()) {
      this.setState({ validationErrors: true })
    } else {
      const scope = this.removeEmpty(this.state.scope)
      const form = {
        alias: alias.trim(),
        type,
        properties,
        scope
      }

      if (Object.keys(currentSecrets).length > 0) {
        form.secrets = currentSecrets;
      }

      if (Object.keys(currentFiles).length > 0) {
        form.files = {}
        Object.keys(currentFiles).forEach(k => {
          form.files[k] = {
            filename: currentFiles[k].name,
            filecontent: currentFiles[k].data
          }
        })
      }
      if (mode === "edit") {
        dispatch(submitForm(resource.data.id, form, comment, "resource"))
      } else {
        dispatch(submitForm(form.alias, form, comment, "newResource"))
        //this.initialState()
      }
    }
  }

  handleFileUpload(field, event) {
    const FILE = event.target.files[0]
    const reader = new FileReader()
    reader.onload = upload => {
      const base64 = upload.target.result
      const files = {}
      files[field] = { name: FILE.name, data: base64 }
      this.setState({ currentFiles: files })
    }

    reader.readAsDataURL(FILE)
  }

  closeForm() {
    this.initialState()
    this.props.dispatch(displayModal("resource", false))
  }

  displayValidationError(prop, isRequired) {
    const { validationErrors } = this.state

    return validationErrors && isRequired && (!prop || prop === "")
  }

  renderProperty(property) {
    const key = property.name
    const label = `${property.displayName}${
      property.required === true ? " *" : ""
    }`
    const { properties, currentSecrets, currentFiles } = this.state

    switch (property.type) {
      case "textbox":
        return (
          <MaterialTextBox
            key={key}
            field={key}
            errorText={
              this.displayValidationError(properties[key], property.required)
                ? "Required property "
                : null
            }
            hintText={property.hint}
            value={this.state.properties[key]}
            label={label}
            onChange={(field, newValue) =>
              this.handleChange(field, newValue, "properties")
            }
          />
        )
      case "textarea":
      case "link":
        return (
          <MaterialTextArea
            key={key}
            field={key}
            errorText={
              this.displayValidationError(properties[key], property.required)
                ? "Required property "
                : null
            }
            value={this.state.properties[key]}
            label={label}
            onChange={(field, newValue) =>
              this.handleChange(field, newValue, "properties")
            }
          />
        )
      case "dropdown":
        return (
          <MaterialDropDown
            key={key}
            field={key}
            value={this.state.properties[key]}
            label={label}
            options={property.options}
            onChange={(field, newValue) =>
              this.handleChange(field, newValue, "properties")
            }
          />
        )
      case "vaultPath":
        return (
            <MaterialTextArea
                key={key}
                field={key}
                errorText={
                  this.displayValidationError(properties[key], property.required)
                      ? "Required property "
                      : null
                }
                value={this.state.currentSecrets[key] != null ? this.state.currentSecrets[key].vaultpath : ''}
                label={label}
                onChange={(field, newValue) =>
                    this.handleChange(field, { vaultpath: newValue }, "currentSecrets")
                }
            />
        )
      case "secret":
        return (
          <MaterialTextBox
            key={key}
            field={key}
            errorText={
              this.displayValidationError(
                currentSecrets[key],
                property.required
              )
                ? "Required secret "
                : null
            }
            value={this.state.currentSecrets[key] != null ? this.state.currentSecrets[key].value : ''}
            label={label}
            onChange={(field, newValue) =>
              this.handleChange(field, { value: newValue }, "currentSecrets")
            }
          />
        )
      case "file":
        return (
          <div
            className="row"
            key={key}
            style={{ display: "flex", paddingTop: "10px", marginLeft: "2px" }}
          >
            <RaisedButton
              backgroundColor={colors.avatarBackgroundColor}
              labelColor={colors.white}
              containerElement="label"
              disableTouchRipple={true}
              label={`Upload ${label}`}
              icon={icons.fileUpload}
              onChange={event => this.handleFileUpload(key, event)}
            >
              <input type="file" style={{ display: "none" }} multiple={false} />
            </RaisedButton>
            {this.displayValidationError(
              currentFiles[key],
              property.required
            ) ? (
              <div
                style={styleSet([
                  styles.marginLeft5,
                  styles.red,
                  styles.paddingTop5
                ])}
              >
                Required file
              </div>
            ) : null}
            {this.state.currentFiles[key] && (
              <Chip style={styles.marginLeft5}>
                {icons.fileAvatar}
                {this.state.currentFiles[key].name}
              </Chip>
            )}
          </div>
        )
        break
      case "vaultPath":
        return (
            <MaterialTextBox
                key={key}
                field={key}
                errorText={
                  this.displayValidationError(properties[key], property.required)
                      ? "Required property "
                      : null
                }
                hintText={property.hint}
                value={this.state.properties[key]}
                label={label}
                onChange={(field, newValue) =>
                    this.handleChange(field, newValue, "properties")
                }
            />
        )
      default:
        return (
            <div>Unknown resource type {property.type}</div>
        )
    }
  }

  getResourceType(typeKey) {
    if (!typeKey) {
      return ""
    }
    const key = Object.keys(resourceTypes).filter(
      resourceType => resourceType.toLowerCase() === typeKey.toLowerCase()
    )[0]

    return resourceTypes[key]
  }

  renderProperties() {
    const resourceType = this.getResourceType(this.state.type)
    if (resourceType !== "") {
      const properties = resourceType.properties
      return (
        <div>
          <MaterialTextBox
            field="alias"
            value={this.state.alias}
            errorText={
              this.state.validationErrors && !this.state.alias
                ? "Required property "
                : null
            }
            label="Alias*"
            onChange={this.handleChange.bind(this)}
          />
          {properties.map(property => this.renderProperty(property))}
        </div>
      )
    }
  }

  isValid() {
    function keys(prop) {
      return Object.keys(prop)
    }

    if (!this.state.alias) {
      return false
    }

    const resourceType = this.getResourceType(this.state.type)
    const requiredProperties = resourceType.properties
      .filter(p => p.required)
      .map(p => p.name)
    const currentProperties = keys(this.state.properties)
      .concat(
        keys(this.state.currentSecrets).concat(keys(this.state.currentFiles))
      )
      .filter(
        prop =>
          requiredProperties.includes(prop) &&
          this.state.properties[prop] !== ""
      )

    return requiredProperties.length === currentProperties.length
  }

  loginWarning(authenticated) {
    if (!authenticated) {
      return (
        <div className="alert alert-info">
          You need to log in before creating a resource
        </div>
      )
    }
  }

  render() {
    const { showNewResourceForm, types, user, mode, resource } = this.props
    let authenticated = user.authenticated
    const resourceType = getResourceTypeName(this.state.type)

    return (
      <Modal
        show={showNewResourceForm}
        animation={false}
        keyboard={true}
        onHide={this.closeForm.bind(this)}
        dialogClassName="wideModal"
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <div>
              {icons.resourceAvator} &emsp;{mode &&
                `${capitalize(mode)} resource ${
                  mode !== "new" ? resource.data.id : ""
                }`}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.loginWarning(authenticated)}
          <MaterialDropDown
            field="type"
            value={resourceType}
            label="Type"
            options={types}
            onChange={this.handleChange.bind(this)}
            fullWidth={false}
          />

          {this.renderProperties()}
          <br />
          <Scope
            editMode={true}
            scope={this.state.scope}
            handleChange={this.handleChange.bind(this)}
          />
          <MaterialTextBox
            field="comment"
            value={this.state.comment}
            label={"Comment"}
            onChange={this.handleChange.bind(this)}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="row col-md-12">
            <RaisedButton
              backgroundColor={colors.avatarBackgroundColor}
              labelColor={colors.white}
              disableTouchRipple={true}
              disabled={!this.state.type || this.state.type === ""}
              label="submit"
              onTouchTap={this.handleSubmitForm.bind(this, true)}
            />

            <FlatButton
              disableTouchRipple={true}
              label="cancel"
              onTouchTap={this.closeForm.bind(this)}
            />
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
NewResourceForm.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    showNewResourceForm: state.resources.showNewResourceForm,
    environmentClasses: state.environments.environmentClasses,
    currentSecrets: state.resource_fasit.currentSecrets,
    applications: state.applications.applicationNames,
    types: Object.keys(resourceTypes).sort(),
    environments: state.environments.environments,
    zones: state.environments.zones,
    user: state.user,
    resource: state.resource_fasit,
    mode: state.resources.mode
  }
}

export default connect(mapStateToProps)(NewResourceForm)
