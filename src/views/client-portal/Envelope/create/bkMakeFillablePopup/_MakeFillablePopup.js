//import React, { useRef } from "react";
import React, { useRef, useState, useEffect } from "react";
//import { Lang } from "../../../../lang";
//import Utils from "../../../../utils";
//import { toast } from "react-toastify";
//import { getEnvelopeDocumentCheckStorage, modifyEnvelopeSignDocument } from "../../../../services/CommonService";
//import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { fabric } from 'fabric'; 

function MakeFillablePopup(props) {
  const clsFormButtonRef = useRef(null);
  const [canvas, setCanvas] = useState('');

//   let errorsObj = {
//     doc_name: "",
//     doc_detail: "",
//     doc_file: "",
//   };
  //const [errors, setErrors] = useState(errorsObj);

  function clearForm(e) {
    e.preventDefault();
  }

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const initCanvas = () => (
    // new fabric.Canvas('canvas', {
    //   height: 800,
    //   width: 800,
    //   backgroundColor: 'yellow'
    // })

    new fabric.Image.fromURL('my_image.png', function(oImg) {
        canvas.add(oImg);
      })

  )


//   const { editor, onReady } = useFabricJSEditor()
  
//   const onAddRectangle = () => {
    
//     var rect = new fabric.Rect({
//         left: 100,
//         top: 50,
//         fill: 'yellow',
//         width: 150,
//         height: 50,
//         radius: 2,
//         objectCaching: false,
//         stroke: 'lightgreen',
//         strokeWidth: 2,
//       });
//       editor?.canvas.add(rect);
      
//     //editor?.addRectangle(   )
//   }

 


  return (
    <div
      className="offcanvas offcanvas-end makeFillableForm"
      data-bs-scroll="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      id="makeFillableForm"
      aria-labelledby="makeFillableFormLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="makeFillableFormLabel">
          Request Document
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
      <div className="offcanvas-body p-0 " style={{ overflowX: "hidden", overflowY: "hidden" }}>
        {/* <div className="card mb-4 rounded mx-3 mt-4">
            sss
        </div> */}

        <div className="mx-3 mt-4 mb-3">
            <div className="row">
                <div className="col-2">
                    <div className="card rounded">
                        {/* <h7 className="text-center">Personal Fields</h7> */}

                        <div className="sign-tool"  data-toggle="tooltip" data-placement="right" title="" data-bs-original-title="Signature">
							<div className="d-flex align-items-center">
								<div className="me-2"> 
                                <i className="fa fa-pencil-square-o"></i>
                                </div>
	                			<div>
                                    <span className="text">Signature</span>
                                </div>
							</div>
						</div>

                    </div>
                </div>
                <div className="col-8">
                    <div className="card rounded dt-bg-silver m-card-scroll">
                        
                        {/* <FabricJSCanvas className="sample-canvas" onReady={onReady} /> */}

                        <canvas id="canvas" />


                        <div className="pages-wrapper">
                            <div className="pages-bound">
                                <div className="page-wrapper" data-page="1">
                                    <div className="dropzone dropzone-page-1" data-page="1">
                                        <img src="https://app.fileinvite.com/file/e9a6abeb-8d5d-4e16-b403-e31f5fb87e52/page/1?expires=1700558190&signature=AIjkkbblG7hjgpuOmyGShgAeSyGCnVzjDGYKJR7z9UzMewuJn98MH-WyuVuuMCKxw7rSIP4BBrpHQ1dSgBvSOw" alt="" className="img-fluid shadow form-img-pages  page-1" />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6 text-left">aaorg_sample-1-1</div>
                                        <div className="col-6 text-right">
                                            <span className="pull-right">Page: 1 of 2</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-wrapper" data-page="2">
                                    <div className="dropzone dropzone-page-2" data-page="2">
                                        <img src="https://app.fileinvite.com/file/e9a6abeb-8d5d-4e16-b403-e31f5fb87e52/page/2?expires=1700558190&signature=M8m6IV_ZmPKA9FgS5p06aryIg4t4X4YjY1EOlrPLtcBeqNFvp8GNzm7ls5BYd437Ffvg-I7jWrpDAwuRv7CEEg" alt="" className="img-fluid shadow form-img-pages  page-2" />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6 text-left">aaorg_sample-1-1</div>
                                        <div className="col-6 text-right">
                                            <span className="pull-right">Page: 2 of 2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="col-2">
                    <div className="card rounded">
                        sss
                    </div>
                </div>
            </div>
        </div>

        <div className="modal-footer mt-3 mb-0 ">
          <button
            type="button"
            ref={clsFormButtonRef}
            data-bs-dismiss="offcanvas"
            onClick={clearForm}
            className="btn grey_btn_outline"
          >
            Preview
          </button>
          <button type="button" ref={clsFormButtonRef} onClick={clearForm} className="btn modal_btn">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default MakeFillablePopup;
