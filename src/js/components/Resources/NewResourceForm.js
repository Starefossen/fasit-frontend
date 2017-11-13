import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog"
import { Card, CardHeader, CardTitle, CardText, CardActions } from "material-ui/Card"
import { MaterialDropDown, MaterialTextBox, MaterialTextArea } from "../common/Forms";
import Divider from "material-ui/Divider"
import { colors } from "../../commonStyles/commonInlineStyles";
import { capitalize } from "../../utils";
import { displayModal, submitForm } from "../../actionCreators/common";
import { resourceTypes, getResourceTypeName } from "../../utils/resourceTypes";
import Scope from "./Scope";
import { styles } from "../../commonStyles/commonInlineStyles"

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
                environmentclass: 'u',
                environment: null,
                zone: null,
                application: null

            },
            files: {},
            currentSecrets: {},
            validationErrors: null,
            comment: ""
        }
    }

    componentWillReceiveProps(next) {
        if (next.mode === "edit" || next.mode === "copy") {
            const { resource } = this.props
            const { alias, type, properties, scope, files } = resource.data

            this.setState({
                alias,
                type,
                properties,
                scope,
                files,
                currentSecrets: next.currentSecrets
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
        }
        else {
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
        const { alias, type, properties, files, comment, currentSecrets, validationErrors } = this.state

        if (!this.isValid()) {
            this.setState({ validationErrors: true })
        }

        else {
            const scope = this.removeEmpty(this.state.scope)
            const form = {
                alias,
                type,
                properties,
                scope,
            }

            if (Object.keys(currentSecrets).length > 0) {
                form.secrets = {}
                Object.keys(currentSecrets).forEach(k => {
                    form.secrets[k] = { value: currentSecrets[k] }
                })
            }

            if (Object.keys(files).length > 0) {
                form.files = files
            }
            if (mode === "edit") {
                dispatch(submitForm(resource.data.id, form, comment, "resource"))
            }
            else {
                dispatch(submitForm(form.alias, form, comment, "newResource"))
                this.initialState()
            }
        }
    }

    closeForm() {
        this.initialState()
        this.props.dispatch(displayModal("resource", false))
    }

    renderProperty(property) {
        const key = property.name
        const label = `${property.displayName}${property.required === true ? " *" : ""}`
        const { currentSecrets, validationErrors } = this.state

        switch (property.type) {
            case "textbox":
                return (
                    <MaterialTextBox
                        key={key}
                        field={key}
                        errorText={validationErrors && property.required && !this.state.properties[key] ? "Required property " : null}
                        hintText={property.hint}
                        value={this.state.properties[key]}
                        label={label}
                        onChange={(field, newValue) => this.handleChange(field, newValue, "properties")} />)
            case "textarea":
            case "link":
                return (
                    <MaterialTextArea
                        key={key}
                        field={key}
                        errorText={validationErrors && property.required && !this.state.properties[key] ? "Required property " : null}
                        value={this.state.properties[key]}
                        label={label}
                        onChange={(field, newValue) => this.handleChange(field, newValue, "properties")} />)
            case "dropdown":
                return (
                    <MaterialDropDown
                        key={key}
                        field={key}
                        value={this.state.properties[key]}
                        label={label}
                        options={property.options}
                        onChange={(field, newValue) => this.handleChange(field, newValue, "properties")} />)
            case "secret":
                return (
                    <MaterialTextBox
                        key={key}
                        field={key}
                        errorText={validationErrors && property.required && !this.state.currentSecrets[key] ? "Required secret " : null}
                        value={this.state.currentSecrets[key]}
                        label={label}
                        onChange={(field, newValue) => this.handleChange(field, newValue, "currentSecrets")} />)
            case "file":
                break
            default:
        }
    }

    getResourceType(typeKey) {
        if (!typeKey) {
            return ""
        }
        const key = Object.keys(resourceTypes)
            .filter(resourceType => resourceType.toLowerCase() === typeKey.toLowerCase())[0]

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
                        errorText={this.state.validationErrors && !this.state.alias ? "Required property " : null}
                        label="Alias*"
                        onChange={this.handleChange.bind(this)} />
                    {properties.map((property) => this.renderProperty(property))}
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
        const requiredProperties = resourceType.properties.filter(p => p.required).map(p => p.name)
        const currentProperties = keys(this.state.properties)
            .concat(keys(this.state.currentSecrets)
                .concat(keys(this.state.files)))
            .filter(prop => requiredProperties.includes(prop))

        return requiredProperties.length === currentProperties.length
    }

    loginWarning(authenticated) {
        if (!authenticated) {
            return <div className="alert alert-info">You need to log in before creating a resource</div>
        }
    }

    render() {
        const { showNewResourceForm, types, user, mode, resource } = this.props
        let authenticated = user.authenticated
        const resourceType = getResourceTypeName(this.state.type)

        return (

            <Modal show={showNewResourceForm} animation={false} keyboard={true} onHide={this.closeForm.bind(this)} dialogClassName="newResourceForm">
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        <div>
                            <span className="fa-stack fa-lg">
                                <i className="fa fa-circle fa-stack-2x" />
                                <i className="fa fa-cogs fa-stack-1x fa-inverse" />
                            </span> &emsp;{mode && `${capitalize(mode)} resource ${mode !== 'new' ? resource.data.id : ''}`}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {this.loginWarning(authenticated)}
                    <MaterialDropDown field="type" value={resourceType} label="Type" options={types} onChange={this.handleChange.bind(this)} fullWidth={false} />

                    {this.renderProperties()}
                    <br />
                    <Scope editMode={true} scope={this.state.scope} handleChange={this.handleChange.bind(this)} />
                    <MaterialTextBox
                        field="comment"
                        value={this.state.comment}
                        label={"Comment"}
                        onChange={this.handleChange.bind(this)} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="row col-md-12">
                        <RaisedButton
                            backgroundColor={colors.avatarBackgroundColor}
                            labelColor={colors.white}
                            disableTouchRipple={true}
                            disabled={!this.state.type || this.state.type === ""}
                            label="submit"
                            onTouchTap={this.handleSubmitForm.bind(this, true)} />

                        <FlatButton
                            disableTouchRipple={true}
                            label="cancel"
                            onTouchTap={this.closeForm.bind(this)} />
                    </div>
                </Modal.Footer>
            </Modal>)
    }
}
NewResourceForm.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
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