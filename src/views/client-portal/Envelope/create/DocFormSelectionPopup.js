import React, { useRef } from "react";
//import { Lang } from "../../../../lang";
function DocFormSelectionPopup(props) {
  const clsFormButtonRef = useRef(null);

  function clearForm(e) {
    e.preventDefault();
  }

  return (
    <div
      className="offcanvas offcanvas-end AddDocument selectionRequestForm"
      data-bs-scroll="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      id="selectionRequestForm"
      aria-labelledby="selectionRequestFormLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="MakeFormLabel">
          Create Sign Request
        </h5>
        <button
          type="button"
          ref={clsFormButtonRef}
          className="btn close_btn text-reset"
          data-bs-dismiss="offcanvas"
          onClick={clearForm}
          aria-label="Close"
        >
          <i className="fa fa-times-circle" aria-hidden="true" />
        </button>
      </div>
      <div className="offcanvas-body p-0 " style={{ overflowX: "hidden" }}>
        <div className=" mb-4  mx-3 mt-5">
          <div className="d-flex">
            <div className="d-flex flex_wrap p-3">
              <div className="text-center card rounded mx-1">
                <div className="card-selection-pdf-sign">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <div>
                  <p className="fz_14">Sign each recipients individual in their own document</p>
                </div>
                <div className="mt-3 mb-4">
                  <button
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#pdfUploadForm"
                    data-toggle="tooltip"
                    className="btn btn-primary btn-sm"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex flex_wrap p-3">
              <div className="text-center card rounded mx-1">
                <div className="card-selection-pdf-sign">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </div>
                <div>
                  <p className="fz_14">Sign multiple recipients together in same documents</p>
                </div>
                <div className="mt-3 mb-4">
                  <button
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#pdfUploadForm"
                    data-toggle="tooltip"
                    className="btn btn-primary btn-sm"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="d-flex flex_wrap">
            <button
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#MakeForm"
              data-toggle="tooltip"
              title={Lang.env_add_question}
              className="btn grey_btn_outline me-3"
            >
              Start form scratch
            </button>
            <button type="button" className="btn modal_btn_outline">
              Fillable form & signature
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DocFormSelectionPopup;
