import React, { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Utils from "../../../../utils";
import {
  getEnvelopeRequestSignDocumentPages,
  signPlaceholdersUpdate,
} from "../../../../services/CommonService";

function MakeFillablePopup({
  makeFillable,
  docData,
  signatureDocumentData,
  setLoading,
  formObj,
  setFormObj,
  handelMakeFillable,
}) {
  const animatedComponents = makeAnimated();

  const [signDocId, setSignDocId] = useState(0);
  const [canvas, setCanvas] = useState("");
  const [imageList, setImageList] = useState([]);
  const [docRecipients, setDocRecipients] = useState([]);
  const [requestSign, setRequestSign] = useState("");

  const clsFormButtonRef = useRef();
  const containerRef = useRef();
  const autoFillEditModeRef = useRef();
  const inputRef = useRef(null);

  const selectStyles = {
    valueContainer: (base) => ({
      ...base,
      fontSize: "16px",
      marginLeft: "4px",
      overflow: "visible",
    }),
    placeholder: (base) => ({
      ...base,
      position: "absolute",
    }),
  };

  let deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  let img = document.createElement("img");
  img.src = deleteIcon;

  let errorsObj = {
    recipients: "",
  };

  const [errors, setErrors] = useState(errorsObj);

  const initCanvas = () =>
    new fabric.Canvas("canv", {
      backgroundColor: "#eee",
      height: window.innerHeight,
    });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  useEffect(() => {
    var dynamicHeight = imageList.length * 1200; //900
    const handleScroll = () => {
      const scrollableDiv = containerRef.current;
      const scrollTop = scrollableDiv.scrollTop;
      const windowHeight = scrollableDiv.clientHeight;
      //const scrollHeight = scrollableDiv.scrollHeight;
      //if (windowHeight + scrollTop === scrollHeight) {
        const newCanvasHeight = (windowHeight + scrollTop) * 2;
        if (dynamicHeight > newCanvasHeight) {
          canvas.setDimensions({ width: 794, height: newCanvasHeight });
          canvas.renderAll();
        } else {
          canvas.setDimensions({ width: 794, height: dynamicHeight });
          canvas.renderAll();
        }
      //}
    };

    const scrollableDiv = containerRef.current;
    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
    };
  }, [canvas, imageList]);

  const renderImageOnCanvas = useCallback(async () => {
    if (makeFillable === true && imageList.length > 0) {
      clearLocalStorage();
      canvas.setDimensions({ width: 794 });
      for (var i = 0; i < imageList.length; i++) {
        var imageUrl = imageList[i].file_path;
        var top = i * 1200; //900
        fabric.Image.fromURL(
          imageUrl,
          function (img) {
            img.scaleToWidth(794);
            img.scaleToHeight(1123);
            canvas.add(img).renderAll();
          },
          {
            id: "page_" + (i + 1),
            num: i,
            left: 0,
            top: top,
            hasControls: false,
            selectable: false,
            hoverCursor: "default",
            stroke: "#000",
            strokeWidth: 1,
          }
        );
      }

      setTimeout(function () {
        autoFillEditModeRef.current?.click();
      }, 3000);
    }
  }, [makeFillable, imageList, canvas]);

  useEffect(() => {
    renderImageOnCanvas();
  }, [renderImageOnCanvas]);

  useEffect(() => {
    if (docData?.length !== 0) {
      let recipients = [];
      for (let i = 0; i < formObj.recipient_List.length; i++) {
        recipients.push({
          value: formObj.recipient_List[i]["id"],
          label:
            formObj.recipient_List[i]["first_name"] +
            " " +
            formObj.recipient_List[i]["last_name"],
        });
      }
      setDocRecipients(recipients);
    }
  }, [docData, formObj]);

  const fillImageList = useCallback(async () => {
    if (signatureDocumentData?.id) {
      let obj = {
        signature_document_id: signatureDocumentData?.id,
      };

      getEnvelopeRequestSignDocumentPages(obj)
        .then((response) => {
          setSignDocId(signatureDocumentData?.id);
          setImageList(response.data.data);
          if (signatureDocumentData.request_id !== "") {
            let selectedObj = {
              value: signatureDocumentData.request_id,
              label: signatureDocumentData.request_display[0].full_name,
            };
            setRequestSign(selectedObj);
          }
        })
        .catch((err) => {});
    }
  }, [signatureDocumentData]);

  const pagesPositionStore = useCallback(async () => {
    var items = canvas.getObjects().filter(function (o) {
      return o.id.indexOf("page") > -1;
    });

    var pagePositionArr = [];
    for (var i = 0, n = items.length; i < n; i++) {
      var m = items[i];
      var object_id = m.id;

      if (object_id.indexOf("page") > -1) {
        //Page Object
        let objBox = m.getBoundingRect();
        let objArr = {
          object_id: object_id,
          position: objBox,
        };
        pagePositionArr.push(objArr);
      }
    }

    let pagesPosition = localStorage.getItem("pagesPosition");
    if (pagesPosition === null) {
      console.log("Pages Position Inserted");
      localStorage.setItem("pagesPosition", JSON.stringify(pagePositionArr));
    }
  }, [canvas]);

  useEffect(
    function () {
      if (makeFillable === true) {
        fillImageList();
        setTimeout(function () {
          pagesPositionStore();
          setLoading(false);
        }, 3000);
      }
    },
    [makeFillable, setLoading, fillImageList, pagesPositionStore]
  );

  /*
  function previewBtn(e) {
    e.preventDefault();
    containerRef.current.classList.toggle("m-card-shadow");
  }
  */

  function saveForm(e) {
    e.preventDefault();
    setErrors(errorsObj);
    setLoading(true);

    let error = false;
    const errorObj = { ...errors };
    const envelopeFormData = formObj;

    if (requestSign === "") {
      setLoading(false);
      errorObj.recipients = "Please select request recipient";
      error = true;
      setErrors(errorObj);
      return false;
    }

    // Get local sign position
    let placeholdersUpdated = localStorage.getItem("placeholders");
    let placeholders = JSON.parse(placeholdersUpdated);

    if (placeholders === null) {
      setLoading(false);
      toast.error("Please add placeholder on the page.");
      error = true;
    }

    // Get local page position
    let pagesPosition = localStorage.getItem("pagesPosition");
    pagesPosition = JSON.parse(pagesPosition);
    if (pagesPosition === null) {
      setLoading(false);
      toast.error("Pages position is not updated.");
      error = true;
    }

    if (error) return;

    let obj = {
      envelope_id: envelopeFormData.envelope_id,
      signature_document_id: signDocId,
      request_form: requestSign,
      pages_position: pagesPosition,
      items: placeholders,
    };

    signPlaceholdersUpdate(obj)
      .then((response) => {
        let requestId = response.data.data.request_id;
        let objRec = envelopeFormData.recipient_List.find(
          (o) => o.id === requestId
        );

        let requestDisplay = [];
        let firstName = objRec.first_name;
        let lastName = objRec.last_name;
        let firstLetter = firstName.charAt(0);
        let lastLetter = lastName.charAt(0);
        requestDisplay.push({
          full_name: firstName + " " + lastName,
          display: firstLetter + lastLetter,
        });

        let index = envelopeFormData.sign_documents.findIndex(
          (x) => parseInt(x.id) === parseInt(signDocId)
        );
        if (index > -1) {
          envelopeFormData.sign_documents[index]["request_id"] = requestId;
          envelopeFormData.sign_documents[index]["request_display"] =
            requestDisplay;
        }

        setFormObj(envelopeFormData);
        setLoading(false);
        toast.success(response.data.message);
        clsFormButtonRef.current?.click();
        clearForm(e);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(Utils.getErrorMessage(err));
      });
  }

  function clearForm(e) {
    e.preventDefault();

    //setCanvasIsLoaded(false);
    setImageList([]);
    setRequestSign("");

    handelMakeFillable(); //Update the flag of popup handle

    clearLocalStorage();
    canvas.clear();
    console.log("Clear...");
  }

  function clearLocalStorage() {
    localStorage.removeItem("pagesPosition");
    localStorage.removeItem("placeholders");
  }

  function objectMovedListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      mapObjectInPage(target);
    }
  }

  function mapObjectInPage(target) {
    
    console.log(target);

    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    if (placeholdersArr != null) {
      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === target.id
      );
    }

    var items = canvas.getObjects().filter(function (o) {
      return o.id.indexOf("page") > -1;
    });

    var intersectPageObjectId = "";
    for (var i = 0, n = items.length; i < n; i++) {
      var m = items[i];

      if (target.intersectsWithObject(m)) {
        intersectPageObjectId = m.id;
      }
    }

    //Update the page object id in sign object array
    if (placeholdersArr != null) {
      if (intersectPageObjectId !== "" && objIndex >= 0) {
        placeholdersArr[objIndex].page_object_id = intersectPageObjectId;
        localStorage.setItem(
          "placeholders",
          JSON.stringify(placeholdersArr)
        );
      }
    }
  }

  function mouseUpListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      storeObjectInLocal(target);
    }
    objectDropListener(ev);
  }

  function objectAddedListener(ev) {
    //Call on every new object added by user
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      storeObjectInLocal(ev.target);
      mapObjectInPage(ev.target);
    }
  }

  function storeObjectInLocal(target) {
    var objectId = target.id;
    console.log("Call object store " + objectId);
    var objBox = target.getBoundingRect();
    
    let textLabel = '';
    if (objectId.indexOf("textbox") > -1) {
      textLabel = getLabelFromTextBoxPlaceholder(target);
      //textLabel = (textLabel === "TextBox") ? '' : textLabel;
    }

    
    var placeholders = localStorage.getItem("placeholders");
    if (placeholders == null) {
      //Empty
      let placeholdersArr = [];
      let objArr = {
        object_id: objectId,
        position: objBox,
        page_object_id: "",
        text_label: textLabel,
        is_deleted: false,
      };
      placeholdersArr.push(objArr);
      localStorage.setItem(
        "placeholders",
        JSON.stringify(placeholdersArr)
      );
    } else {
      //Not Empty
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      if (objIndex < 0) {
        //New Entry
        let objArr = {
          object_id: objectId,
          page_object_id: "",
          text_label: "",
          position: objBox,
          is_deleted: false,
        };
        placeholdersArr.push(objArr);
      } else {
        //Update exiting entry
        placeholdersArr[objIndex].position = objBox;
        placeholdersArr[objIndex].text_label = textLabel;
      }
      localStorage.setItem(
        "placeholders",
        JSON.stringify(placeholdersArr)
      );
    }
  }


  function getLabelFromTextBoxPlaceholder(target){
    let groupObjects = target._objects;
    let text = groupObjects[1].text;
    return text;
  }
  

  function objectDropListener(ev) {
    var targ = ev.target;
    targ.setCoords();

    var items = canvas.getObjects().filter(function (o) {
      return targ !== o;
    });

    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      var removeObjectFlag = true;
      for (var ik = 0, nk = items.length; ik < nk; ik++) {
        var mk = items[ik];
        var obj_id = mk.id;
        if (obj_id.indexOf("page") > -1) {
          if (activeObject.intersectsWithObject(mk)) {
            removeObjectFlag = false;
            console.log("Object is inside the page.");
          }
        }
      }

      if (removeObjectFlag) {
        updateDeleteFlagInSignObject(activeObject);
        canvas.remove(activeObject);
      }
    }
  }

  function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    updateDeleteFlagInSignObject(target);
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  function updateDeleteFlagInSignObject(target) {
    var objectId = target.id;
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    var objIndex = placeholdersArr.findIndex(
      (obj) => obj.object_id === objectId
    );
    placeholdersArr[objIndex].is_deleted = true;
    placeholdersArr[objIndex].page_object_id = "";

    localStorage.setItem(
      "placeholders",
      JSON.stringify(placeholdersArr)
    );
  }

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function generateId(type) {
    return `${type}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function addSignPlaceholder(e) {
    const el = containerRef.current.children[0];
    const top = el.getBoundingClientRect().top; //95

    const topPositionObject = Math.abs(top - 200);
    const leftPositionObject = 75;
    const widthObject = 150;
    const heightObject = 50;
    const objId = generateId("sign");

    signObject(
      topPositionObject,
      leftPositionObject,
      widthObject,
      heightObject,
      objId
    );
  }

  const handleRequestRecipient = (options) => {
    setRequestSign(options);
  };

  const signObject = (
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId
  ) => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#0c5460";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 5;

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 0,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 20,
    });

    var object = new fabric.Rect({
      fill: "#d1ecf1",
      width: widthObject,
      height: heightObject,
      radius: 2,
      objectCaching: false,
      stroke: "#0c5460",
      strokeWidth: 1,
      hasControls: false,
    });

    var textTopPosition = 12;
    var centerPoint = heightObject / 3; //15.66
    if (centerPoint > textTopPosition) {
      var inCenterPoint = (centerPoint - textTopPosition) / 2;
      textTopPosition = centerPoint + inCenterPoint - 2;
    }

    // Calculate the font size based on the box dimensions
    var fontSizeWidth = widthObject * 1; // Adjust the multiplier as needed
    var fontSizeHeight = heightObject * 0.3; // Adjust the multiplier as needed

    // Use the smaller value between fontSizeWidth and fontSizeHeight
    var fontSize = Math.min(fontSizeWidth, fontSizeHeight);

    var text = new fabric.Text("Signature", {
      //top: textTopPosition,
      //left: 32,
      //fontSize: 14,
      fontSize: fontSize,
      fontWeight: "bold",
      fontFamily: "Arial",
      fill: "#0c5460",
      originX: "center",
      originY: "center",
      left: 0.5 * widthObject,
      top: 0.5 * heightObject,
    });

    var group = new fabric.Group([object, text], {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });

    canvas.on("object:moving", objectMovedListener);
    canvas.on("mouse:up", mouseUpListener);
    canvas.on("object:added", objectAddedListener);

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  const handelAutoFillEditMode = () => {
    for (var i = 0; i < imageList.length; i++) {
      var placeholderDetails = imageList[i].placeholder_details;
      if (placeholderDetails != null) {
        var items = placeholderDetails.items;
        for (var j = 0; j < items.length; j++) {
          var objPlaceholder = items[j];
          var objectId = objPlaceholder.object_id;

          //Sign 
          if (objectId.indexOf("sign") > -1) {
            signObject(
              objPlaceholder.position.top,
              objPlaceholder.position.left,
              objPlaceholder.position.width,
              objPlaceholder.position.height,
              objPlaceholder.object_id
            );
          }
          //Text
          if (objectId.indexOf("textbox") > -1) {
            textBoxObject(
              objPlaceholder.position.top,
              objPlaceholder.position.left,
              objPlaceholder.position.width,
              objPlaceholder.position.height,
              objPlaceholder.object_id,
              objPlaceholder.text_label
            );
          }

        }
      }
    }
  };

  function addTextBoxPlaceholder(e) {
    const el = containerRef.current.children[0];
    const top = el.getBoundingClientRect().top; //95

    const topPositionObject = Math.abs(top - 200);
    const leftPositionObject = 75;
    const widthObject = 150;
    const heightObject = 50;
    const objId = generateId("textbox");

    textBoxObject(
      topPositionObject,
      leftPositionObject,
      widthObject,
      heightObject,
      objId
    );
  }

  const textBoxObject = (
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    textLabel="TextBox",
  ) => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#0c5460";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 5;

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 0,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 20,
    });

    var object = new fabric.Rect({
      fill: "#d1ecf1",
      width: widthObject,
      height: heightObject,
      radius: 2,
      objectCaching: false,
      stroke: "#0c5460",
      strokeWidth: 1,
      hasControls: false,
    });

    var text = new fabric.Textbox(textLabel, {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "Arial",
      fill: "#0c5460",
      originX: "center",
      originY: "center",
      left: 0.5 * widthObject,
      top: 0.5 * heightObject,
      textAlign: "center",
      verticalAlign: "middle",
      editable: true,
      width: widthObject,
    });

    var group = new fabric.Group([object, text], {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });
    
    canvas.on("object:moving", objectMovedListener);
    canvas.on("mouse:up", mouseUpListener);
    canvas.on("object:added", objectAddedListener);
    canvas.on("mouse:dblclick", mouseDblClickListener);

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();

    //Get the text and put the text in object
    inputRef.current.addEventListener("blur", function () {
      var objectId = inputRef.current.getAttribute("data-object");
      var objects = canvas.getObjects();
      var foundObject = objects.find((obj) => obj.id === objectId);
      if (foundObject) {
        var textObject = foundObject.item(1);
        var textLabel = inputRef.current.value;
        textLabel = textLabel.trim();
        textObject.set("text", textLabel);

        //Update the text in local storage
        var placeholdersUpdated = localStorage.getItem("placeholders");
        var placeholdersArr = JSON.parse(placeholdersUpdated);

        var objIndex = placeholdersArr.findIndex(
          (obj) => obj.object_id === objectId
        );
        placeholdersArr[objIndex].text_label = textLabel;

        localStorage.setItem(
          "placeholders",
          JSON.stringify(placeholdersArr)
        );
        //end

      }
      inputRef.current.style.display = "none";
      inputRef.current.setAttribute("data-object", "");
      canvas.renderAll();
    });
  };

  function mouseDblClickListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("textbox") > -1) {
      let groupObjects = target._objects; // Access child objects of the group
      let text = groupObjects[1].text;

      var objBox = target.getBoundingRect();
      inputRef.current.style.left = objBox.left + 20 + "px";
      inputRef.current.style.top = objBox.top + 20 + "px";
      inputRef.current.value = text;
      inputRef.current.style.display = "block";
      inputRef.current.style.width = objBox.width - 10 + "px";
      inputRef.current.style.height = objBox.height - 10 + "px";
      inputRef.current.style.textAlign = "center";
      inputRef.current.style.background = "#d1ecf1";
      inputRef.current.style.color = "#0c5460";
      inputRef.current.style.border = "none";
      inputRef.current.style.fontFamily = "arial";
      inputRef.current.style.fontWeight = "600";
      inputRef.current.style.borderRadius = "0px";
      inputRef.current.setAttribute("data-object", object_id);
      inputRef.current.focus();
    }
  }

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
      <div
        className="d-none"
        onClick={handelAutoFillEditMode}
        ref={autoFillEditModeRef}
      ></div>
      <div
        className="offcanvas-body p-0 "
        style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
        <div className="mx-3 mt-4 mb-3">
          <div className="row">
            <div className="col-2 tools-wrapper">
              <div className="card rounded">
                <div
                  className="sign-tool"
                  name="rectangle"
                  onClick={addSignPlaceholder}
                  data-toggle="tooltip"
                  data-placement="right"
                  title=""
                  data-bs-original-title="Signature"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <i className="fa fa-pencil-square-o"></i>
                    </div>
                    <div>
                      <span className="text">Signature</span>
                    </div>
                  </div>
                </div>

                <div
                  className="sign-tool"
                  name="rectangle"
                  onClick={addTextBoxPlaceholder}
                  data-toggle="tooltip"
                  data-placement="right"
                  title=""
                  data-bs-original-title="TextBox"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <i className="fa fa-i-cursor"></i>
                    </div>
                    <div>
                      <span className="text">TextBox</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-7 fillable-wrapper">
              <div
                className="card rounded dt-bg-silver m-card-scroll handle"
                ref={containerRef}
              >
                <div
                  style={{
                    paddingTop: "15px",
                    paddingLeft: "15px",
                    position: "relative",
                  }}
                >
                  <canvas id="canv" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="TextBox"
                    style={{ position: "absolute", display: "none" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-3 receipt-wrapper">
              {/* <div className="card rounded">sss</div> */}

              <div className="card mb-4 rounded mx-3">
                <label htmlFor="request_from" className="form-label mb-3">
                  Sign Request Recipient{" "}
                  <i
                    className="fa fa-question-circle ms-2"
                    aria-hidden="true"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="How Can i help you?"
                  />
                </label>
                <Select
                  closeMenuOnSelect={true}
                  value={requestSign}
                  components={animatedComponents}
                  //isMulti
                  onChange={handleRequestRecipient}
                  options={docRecipients}
                  styles={selectStyles}
                />
                {errors.recipients && (
                  <div className="text-danger mt-2">{errors.recipients}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer mt-3 mb-0 ">
          <button
            ref={clsFormButtonRef}
            type="button"
            //onClick={previewBtn}
            data-bs-dismiss="offcanvas"
            onClick={clearForm}
            className="btn grey_btn_outline"
          >
            Cancel
          </button>
          <button
            type="button"
            //ref={clsFormButtonRef}
            onClick={saveForm}
            className="btn modal_btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default MakeFillablePopup;
