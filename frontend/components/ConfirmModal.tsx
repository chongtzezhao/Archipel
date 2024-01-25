import React, {SyntheticEvent} from 'react';

interface asyncFunc {
  (SyntheticEvent): Promise<void>;
}

export default function ConfirmModal(props: { action: string, confirm: asyncFunc, cancel: ()=>void}) {
  return (
    <div className="modal" id="confirmModal" aria-labelledby="confirmModalLabel" aria-hidden="false" style={{display: "block"}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmModalLabel">Confirm {props.action}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.cancel}></button>
          </div>
          <div className="modal-body">
            Are you sure you want to {props.action}?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.cancel}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={props.confirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}