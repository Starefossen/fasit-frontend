import React from 'react'
import {Modal} from 'react-bootstrap'
import {FormComment} from '../common'

export default function DeleteElement(props){
    const { displayDeleteForm, id, onClose, onSubmit, comment, handleChange} = props
    return (
        <Modal show={displayDeleteForm} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Delete {id}
                    <button type="reset" id="close" className="btn btn-link pull-right"
                            onClick={onClose}><strong>X</strong>
                    </button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Going to delete {id}
                <br />
                Are you sure?

            </Modal.Body>
            <Modal.Footer>
                <FormComment
                    value={comment}
                    handleChange={handleChange}
                />
                <br />
                <div className="row">
                    <div className="col-lg-10 col-lg-offset-2">
                        <button type="submit" id="submit" className="btn btn-danger pull-right"
                                onClick={onSubmit}>Delete
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
