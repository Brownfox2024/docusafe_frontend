import React, { useRef, useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import Utils from "../../../../../utils";
import { toast } from "react-toastify";
import {
    adminGetEnvelopeDocumentCheckStorage,
    adminModifyEnvelopeSignDocument,
} from "../../../../../services/AdminService";

function AdminPdfUploadPopup(props) {
  let {client} = useParams();
  const clsFormButtonRef = useRef(null);

  const [docId, setDocId] = useState(0);
  const [docName, setDocName] = useState("");
  const [docDetail, setDocDetail] = useState("");
  const [documentsList, setDocumentsList] = useState([]);
  const [fileKey, setFileKey] = useState(Date.now);
  const [removeDocIds, setRemoveDocIds] = useState([]);

  const singleMode = useRef(null);
  const [mode, setMode] = useState(1);

  useEffect(() => {
    setDocId(props?.docData?.id);
    setDocName(
      props?.docData?.doc_name === undefined ? "" : props?.docData?.doc_name
    );
    //setDocDetail(props?.docData?.doc_detail);
    setDocDetail(
      props?.docData?.doc_detail === undefined ? "" : props?.docData?.doc_detail
    );
    setDocumentsList(
      props?.docData?.documents === undefined ? [] : props?.docData?.documents
    );
    singleMode.current.checked = true;
  }, [props?.docData, props.formObj]);

  let errorsObj = {
    doc_name: "",
    doc_detail: "",
    doc_file: "",
  };
  const [errors, setErrors] = useState(errorsObj);

  function clearForm(e) {
    e.preventDefault();
  }

  const onDocFile = (e) => {
    if (e.target.files.length > 0) {
      //let files = [...documentsList];
      let files = [];
      for (let i = 0; i < e.target.files.length; i++) {
        let kb = e.target.files[i].size / 1000;
        files.push({
          id: 0,
          name: e.target.files[i].name,
          kb: parseFloat(kb).toFixed(2),
          file: e.target.files[i],
        });
      }
      setDocumentsList(files);
      setFileKey(Date.now);
    }
  };

  const onRemoveDoc = (e, obj) => {
    e.preventDefault();

    setDocumentsList((current) =>
      current.filter((doc) => {
        return doc.name !== obj.name;
      })
    );

    if (obj.id > 0) {
      let data = [...removeDocIds];
      data.push(obj.id);
      setRemoveDocIds(data);
    }
  };

  const handleDownload = async (e, obj) => {
    e.preventDefault();
    props.setLoading(true);
    await Utils.downloadAnyFile(obj.path, obj.name);
    props.setLoading(false);
  };

  function clearDocumentForm() {
    setDocId(0);
    setDocName("");
    setDocDetail("");
    setDocumentsList([]);

    let errorObj = {
      recipients: "",
      doc_name: "",
      doc_detail: "",
      doc_file: "",
    };
    setErrors(errorObj);
  }

  async function onSaveDoc(e) {
    e.preventDefault();

    let error = false;
    const errorObj = { ...errors };
    const envelopeFormData = { ...props.formObj };
    let totalKb = 0;

    if (!docName) {
      errorObj.doc_name = "Document name must be required";
      error = true;
    }

    if (documentsList.length === 0) {
      errorObj.doc_file = "Document file must be required";
      error = true;
    }

    if (documentsList.length > 10) {
      toast.error("Maximum 10 file upload");
      error = true;
    } else if (documentsList.length > 0) {
      for (let i = 0; i < documentsList.length; i++) {
        totalKb += parseFloat(documentsList[i]["kb"]);
      }
      if (totalKb > 0) {
        let totalMb = totalKb / 1000;
        if (totalMb > 8) {
          toast.error("Maximum 8 MB file allowed");
          error = true;
        }
      }
    }

    setErrors(errorObj);

    if (error) return;

    props.setLoading(true);
    const formData = new FormData();
    formData.append('client_id', client);
    formData.append("envelope_id", envelopeFormData.envelope_id);
    formData.append("mode", mode);
    formData.append("doc_id", docId);
    formData.append("name", docName);
    formData.append("detail", docDetail);
    for (let i = 0; i < documentsList.length; i++) {
      formData.append("doc_file", documentsList[i]["file"]);
    }
    if (removeDocIds.length > 0) {
      formData.append("remove_doc_id", JSON.stringify(removeDocIds));
    }

    let isCall = true;

    if (totalKb > 0) {
      isCall = false;
      await adminGetEnvelopeDocumentCheckStorage({ kb: totalKb, client_id:client })
        .then((res) => {
          if (res.data.is_storage_full === false) {
            isCall = true;
          } else {
            toast.error(res.data.message);
            props.setLoading(false);
          }
        })
        .catch((err) => {
          props.setLoading(false);
          toast.error(Utils.getErrorMessage(err));
        });
    }

    if (isCall === true) {
    adminModifyEnvelopeSignDocument(client, formData)
        .then((response) => {
          clsFormButtonRef.current?.click();
          clearDocumentForm();

          let fileName = response.data.data.path.split("/").pop();
          let obj = {
            mode: mode,
            doc_detail: docDetail,
            file_name: fileName,
            id: response.data.data.id,
            name: docName,
            orders: 0,
            path: response.data.data.path,
            request_display: [],
            request_id: null,
            dimensions: response.data.data.dimensions
          };
          envelopeFormData.sign_documents.push(obj);
          props.setFormObj(envelopeFormData);
          //props.setLoading(false);
          
          props.setDirectMakeFillableOpen(true)
          props.setSignatureDocumentData(obj)
          toast.success(response.data.message);
          
        })
        .catch((err) => {
          props.setLoading(false);
          toast.error(Utils.getErrorMessage(err));
        });
    }
  }

  //Mode Change of sign document
  const handleModeChange = (val) => {
    setMode(val);
  };

  return (
    <div
      className="offcanvas offcanvas-end AddDocument pdfUploadForm"
      data-bs-scroll="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      id="pdfUploadForm"
      aria-labelledby="pdfUploadFormLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="MakeFormLabel">
          Upload PDF Document
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
        <div className="row">
          <div className="col-lg-12">
            <div className="d-flex">
              <div className="d-flex flex_wrap p-3">
                <div className="text-center card rounded mx-1">
                  <div className="card-selection-pdf-sign my-4">
                    <input
                      ref={singleMode}
                      onChange={(e) => handleModeChange(e.target.value)}
                      className="form-check-input"
                      type="radio"
                      name="mode"
                      id=""
                      value="1"
                    />
                  </div>
                  <div className="mb-3">
                    <p className="fz_16">
                      Sign each recipients individual in their own document
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex flex_wrap p-3">
                <div className="text-center card rounded mx-1">
                  <div className="card-selection-pdf-sign my-4">
                    <input
                      onChange={(e) => handleModeChange(e.target.value)}
                      className="form-check-input"
                      type="radio"
                      name="mode"
                      id=""
                      value="2"
                    />
                  </div>
                  <div className="mb-3">
                    <p className="fz_16">
                      Sign multiple recipients together in same documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4 rounded mx-3 mt-4">
          <div className="mb-3">
            <label htmlFor="document_name" className="form-label mb-0">
              Documents Details
            </label>
          </div>
          <div className="mb-3">
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                id="document_name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                aria-describedby="emailHelp"
                placeholder="Enter Document Name"
              />
              <i
                className="fa fa-question-circle ms-2"
                aria-hidden="true"
                data-toggle="tooltip"
                data-placement="right"
                title="How Can i help you?"
              />
            </div>
            {errors.doc_name && (
              <div className="text-danger">{errors.doc_name}</div>
            )}
          </div>
          <div className="d-flex">
            <textarea
              className="form-control"
              id="document_detail"
              rows="2"
              value={docDetail}
              onChange={(e) => setDocDetail(e.target.value)}
              placeholder="Enter Document Description"
            />
            <i
              className="fa fa-question-circle ms-2"
              aria-hidden="true"
              data-toggle="tooltip"
              data-placement="right"
              title="How Can i help you?"
            />
          </div>
          {errors.doc_detail && (
            <div className="text-danger">{errors.doc_detail}</div>
          )}
        </div>

        <div className="card mb-4 rounded add_document mx-3">
          <div className="mb-2">
            <label className="form-label mb-0">Upload PDF Document</label>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="mb-3 download_document">
                {documentsList &&
                  documentsList.map((item, index) => (
                    <span key={index} className="download_box">
                      {item.name} ({item.kb} KB)
                      {item.path && (
                        <img
                          className="ms-2"
                          onClick={(e) => handleDownload(e, item)}
                          alt="download"
                          src="/images/download.png"
                        />
                      )}
                      <span
                        onClick={(event) => onRemoveDoc(event, item)}
                        className="close_btn"
                      >
                        <i className="fa fa-times-circle" aria-hidden="true" />
                      </span>
                    </span>
                  ))}
              </div>
              <div className="drag-area">
                <label htmlFor="document_file">
                  <div className="icon">
                    <i className="fa fa-cloud-upload" aria-hidden="true" />
                  </div>
                  <h5>Drag & Drop to upload file here or click to upload</h5>
                </label>
                <input
                  type="file"
                  key={fileKey}
                  id="document_file"
                  onChange={onDocFile}
                  accept="application/pdf"
                />
              </div>
              <div className="mt-1">
                <span className="fz_14">Maximum upload file size: 8 MB.</span>
              </div>

              {errors.doc_file && (
                <div className="text-danger">{errors.doc_file}</div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer mt-3 mb-0 ">
          <button
            type="button"
            ref={clsFormButtonRef}
            data-bs-dismiss="offcanvas"
            onClick={clearDocumentForm}
            className="btn grey_btn_outline"
          >
            Cancel
          </button>
          <button type="button" onClick={onSaveDoc} className="btn modal_btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPdfUploadPopup;
