import React, {Component, PropTypes} from 'react'
import {Modal} from 'react-bootstrap'
import {connect} from 'react-redux'

import {FormString, FormDropDown, FormComment} from '../common/Forms'

import {displayModal} from '../../actionCreators/common'
import {submitForm} from '../../actionCreators/common'

class NewNodeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hostname: "",
            username: "",
            password: "",
            type: "",
            environment: "",
            environmentclass: "",
            zone: ""
        }
    }


    resetLocalState() {
        this.setState({
            hostname: "",
            username: "",
            password: "",
            type: "",
            environment: "",
            environmentclass: "",
            zone: ""
        })
    }

    handleChange(field, value) {
        this.setState({[field]: value})
    }

    handleSubmitForm() {
        const {dispatch} = this.props
        const {hostname, username, password, type, environment, environmentclass, comment} = this.state
        const form = {
            hostname,
            username,
            password: {value: password},
            type,
            environment,
            environmentclass,
        }
        if (!(environmentclass === 'u')) {
            form["zone"] = this.state.zone
        }
        dispatch(submitForm(form.hostname, form, comment, "newNode"))
    }

    closeForm() {
        const {dispatch} = this.props
        this.resetLocalState()
        dispatch(displayModal("node", false))
    }

    showSubmitButton() {
        const {hostname, username, password, type, environmentclass, environment, zone} = this.state
        if (hostname && username && password && type && environmentclass && environment) {
            if ((zone) || (environmentclass === 'u')) {
                return (
                    <button type="submit"
                            className="btn btn-primary pull-right"
                            onClick={this.handleSubmitForm.bind(this, true)}>Submit
                    </button>
                )
            }
        }
        return <button type="submit" className="btn btn-primary pull-right disabled">Submit</button>

    }

    render() {
        const {environmentClasses, showNewNodeForm, nodeTypes} = this.props
        return (
            <Modal show={showNewNodeForm} onHide={this.closeForm.bind(this)}>
                <Modal.Header>
                    <Modal.Title>New node
                        <button type="reset" className="btn btn-link pull-right"
                                onClick={this.closeForm.bind(this)}><strong>X</strong>
                        </button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormString
                        label="hostname"
                        editMode={true}
                        value={this.state.hostname}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormString
                        label="username"
                        editMode={true}
                        value={this.state.username}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormString
                        label="password"
                        editMode={true}
                        value={this.state.password}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <FormDropDown
                        label="type"
                        editMode={true}
                        value={this.state.type}
                        handleChange={this.handleChange.bind(this)}
                        options={nodeTypes}
                    />
                    <FormDropDown
                        label="environmentclass"
                        editMode={true}
                        value={this.state.environmentclass}
                        handleChange={this.handleChange.bind(this)}
                        options={environmentClasses}
                    />
                    {this.environmentSelector()}
                    {this.zoneSelector()}
                    <div className="col-xs-12" style={{height: 15 + 'px'}}></div>
                </Modal.Body>
                <Modal.Footer>
                    <FormComment
                        value={this.state.comment}
                        handleChange={this.handleChange.bind(this)}
                    />
                    <br />
                    <div className="row">
                        <div className="row col-lg-10 col-lg-offset-2">
                            {this.showSubmitButton()}
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }

    environmentSelector() {
        const {environments} = this.props
        const {environmentclass} = this.state
        if (environmentclass) {
            const filteredEnvironments = environments.filter((env) => {
                if (!environmentclass) {
                    return true
                } else {
                    return env.environmentclass === environmentclass
                }
            })
            return (
                <FormDropDown
                    label="environment"
                    editMode={true}
                    value={this.state.environment}
                    handleChange={this.handleChange.bind(this)}
                    options={filteredEnvironments.map((env) => env.name)}
                />)
        }
    }

    zoneSelector() {
        const {zones} = this.props
        const {environmentclass} = this.state
        if (environmentclass && environmentclass !== 'u') {
            return (
                <FormDropDown
                    label="zone"
                    editMode={true}
                    value={this.state.zone}
                    handleChange={this.handleChange.bind(this)}
                    options={zones}
                />)
        }
    }

}
NewNodeForm.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        showNewNodeForm: state.nodes.showNewNodeForm,
        nodeTypes: state.nodes.nodeTypes,
        environmentClasses: state.environments.environmentClasses,
        environments: state.environments.environments,
        zones: state.environments.zones
    }
}

export default connect(mapStateToProps)(NewNodeForm)
