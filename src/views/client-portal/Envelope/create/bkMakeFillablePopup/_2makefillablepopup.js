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
import { EVERY_ONE_OBJECT } from "../../../../configs/AppConfig";

function MakeFillablePopup({
  makeFillable,
  signatureDocumentData,
  setLoading,
  formObj,
  setFormObj,
  handleMakeFillable,
}) {
  const animatedComponents = makeAnimated();

  const [signDocId, setSignDocId] = useState(0);
  const [signDocMode, setSignDocMode] = useState(1);
  const [canvas, setCanvas] = useState("");
  const [imageList, setImageList] = useState([]);
  const [docRecipients, setDocRecipients] = useState([]);
  const [requestSign, setRequestSign] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [textInputModal, setTextInputModal] = useState(false);
  const [recipientSelectModal, setRecipientSelectModal] = useState(false);
  const [tempRecipient, setTempRecipient] = useState('');

  const clsFormButtonRef = useRef();
  const containerRef = useRef();
  const autoFillEditModeRef = useRef();
  const inputRef = useRef();

  
  
  const [draggedItemType, setDraggedItemType] = useState(null);

  const handleDragStart = (e, type) => {
    console.log("drag start "+ type);
    setDraggedItemType(type);
  };

  const handleDragStop = (e) => {
    console.log("drag stop");
    
    var mousePosition = localStorage.getItem("mousePosition");
    mousePosition = JSON.parse(mousePosition);
    if (mousePosition !== null) {
      //let leftPositionObject = (mousePosition.x - 50);
      let leftPositionObject = (mousePosition.x - 75);
      let topPositionObject = (mousePosition.y - 25);
     
      console.log("Mouse coordinates x "+leftPositionObject +", y "+topPositionObject);
      
      const widthObject = 150;
      const heightObject = 50;
      const objId = generateId(draggedItemType);

      if(draggedItemType === "sign"){
        signObject(
          topPositionObject,
          leftPositionObject,
          widthObject,
          heightObject,
          objId
        );
      }else{
        textBoxObject(
          topPositionObject,
          leftPositionObject,
          widthObject,
          heightObject,
          objId
        );
      }
    }
  };
  

 


  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #ccc",
      borderRadius : '0px',
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #ccc",
      },
    }),
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
      //backgroundColor: "#d1ecf1",
      height: window.innerHeight,
    });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  



  function removeObjectsByFilter(filterCondition) {
    const objectsToRemove = canvas.getObjects().filter(filterCondition);

    for (let i = 0, n = objectsToRemove.length; i < n; i++) {
      const objToRemove = objectsToRemove[i];
      canvas.remove(objToRemove);
    }
    canvas.renderAll();
  }


  function storeMousePosition(x, y){
    let position = {
      x : x,
      y : y
    }
    localStorage.setItem("mousePosition", JSON.stringify(position));
  }

  
  const handleImageClick = (index) => {
    setLoading(true);
    // Remove active object
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  
    // Remove page objects
    removeObjectsByFilter((o) => o.id.indexOf("page") !== 0);
  
    setActiveIndex(index);
  
    const page = "page_" + (index + 1);
    canvas.setDimensions({ width: 794, height: 1200 });
  
    var imageUrl = imageList[index].file_path;
    fabric.Image.fromURL(
      imageUrl,
      function (img) {
        img.scaleToWidth(794);
        img.scaleToHeight(1123);
        canvas.add(img)
        .renderAll();
      },
      {
        id: page,
        num: index,
        left: 0,
        top: 25,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
        stroke: "#000",
        strokeWidth: 1,
      }
    );

    setTimeout(() => {
      const placeholders = localStorage.getItem("placeholders");
      const placeholdersArr = JSON.parse(placeholders);
     
      const items = (placeholders !== null) ? placeholdersArr.filter((item) => item.page_object_id === page) : [];
      if (items.length > 0) {
        for (let j = 0; j < items.length; j++) {
          const objPlaceholder = items[j];
          const objectId = objPlaceholder.object_id;
          
          if (objectId.indexOf("sign") > -1) {
            signObject(
              objPlaceholder.position.top,
              objPlaceholder.position.left,
              objPlaceholder.position.width,
              objPlaceholder.position.height - 1,
              objPlaceholder.object_id,
              objPlaceholder.request_recipient
            );
          }
  
          if (objectId.indexOf("textbox") > -1) {
            textBoxObject(
              objPlaceholder.position.top,
              objPlaceholder.position.left,
              objPlaceholder.position.width,
              objPlaceholder.position.height - 1,
              objPlaceholder.object_id,
              objPlaceholder.text_label,
              objPlaceholder.request_recipient
            );
          }
        }
      }
  
      setLoading(false);
    }, 250);
  
  };


  


  const _renderImageOnCanvas = useCallback(async () => {
    if (makeFillable === true && imageList.length > 0) {

      canvas.clear().renderAll();

      var pagePositionArr = [];
      //canvas.setDimensions({ width: 794, height: 1200 }); //96 DPI Default
      //canvas.setDimensions({ width: 1240, height: 1754 });
      
      var width = (794 * 120) / 96;
      var height = (1200 * 115) / 96;

      console.log(width+" "+height);

      canvas.setDimensions({ width: width, height: height });

      for (var i = 0; i < imageList.length; i++) {
        if(i === 0){
          setActiveIndex(0);
          var imageUrl = imageList[i].file_path;
          fabric.Image.fromURL(
            imageUrl,
            function (img) {
              //img.scaleToWidth(794);
              //img.scaleToHeight(1123);
              img.scaleToWidth(width);
              img.scaleToHeight(height - 100);
              canvas.add(img).renderAll();
            },
            {
              id: "page_1",
              num: 0,
              left: 0,
              //top: 25,
              top: 0,
              hasControls: false,
              selectable: false,
              hoverCursor: "default",
              //stroke: "#000",
              //strokeWidth: 1,
            }
          );
        }
        
        let objArr = {
          object_id: "page_"+(i + 1),
          position: {left:0, top:0, width:1123, height:794},
          //position: {left:0, top:25, width:1123, height:794},
        };
        pagePositionArr.push(objArr);        
      }

      //Update the page position
      let pagesPosition = localStorage.getItem("pagesPosition");
      if (pagesPosition === null) {
        localStorage.setItem("pagesPosition", JSON.stringify(pagePositionArr));
      }
      

      setTimeout(function () {
        autoFillEditModeRef.current?.click();
      }, 3000);

      //dragging cordinate store in localStorage
      canvas.on("dragover", function(options) {
          // Get pointer coordinates
          const pointer = canvas.getPointer(options.e);
          const x = pointer.x;
          const y = pointer.y;

          storeMousePosition(x, y);
      });
      
      
    }
  }, [makeFillable, imageList, canvas]);


  useEffect(() => {

    var width = (794 * 120) / 96;
    var height = (1200 * 115) / 96;

    var dynamicHeight = imageList.length * height; //900
    const handleScroll = () => {
      const scrollableDiv = containerRef.current;
      const scrollTop = scrollableDiv.scrollTop;
      const windowHeight = scrollableDiv.clientHeight;
      const scrollHeight = scrollableDiv.scrollHeight;
      if (windowHeight + scrollTop === scrollHeight) {
        const newCanvasHeight = (windowHeight + scrollTop) * 2;
        if (dynamicHeight > newCanvasHeight) {
          canvas.setDimensions({ width: width, height: newCanvasHeight });
          canvas.renderAll();
        } else {
          canvas.setDimensions({ width: width, height: dynamicHeight });
          canvas.renderAll();
        }
      }
    };

    const scrollableDiv = containerRef.current;
    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
    };
  }, [canvas, imageList]);

  const renderImageOnCanvas = useCallback(async () => {
    if (makeFillable === true && imageList.length > 0) {

      canvas.clear().renderAll();

      var pagePositionArr = [];
      //canvas.setDimensions({ width: 794, height: 1200 }); //96 DPI Default
      //canvas.setDimensions({ width: 1240, height: 1754 });
      
      var width = (794 * 120) / 96;
      var height = (1200 * 115) / 96;

      console.log(width+" "+height);

      //canvas.setDimensions({ width: width, height: height });
      canvas.setDimensions({ width: width });
      var imgWidth = width;
      var imgHeight = (height - 100);

      for (var i = 0; i < imageList.length; i++) {
        // if(i === 0){
          //setActiveIndex(0);
          var topMultiplier = (i * 20);
          var top = (i === 0) ? i * imgHeight : (i * imgHeight + topMultiplier);
          console.log(top);

          var imageUrl = imageList[i].file_path;
          fabric.Image.fromURL(
            imageUrl,
            function (img) {
              img.scaleToWidth(imgWidth);
              img.scaleToHeight(imgHeight);
              canvas.add(img).renderAll();
            },
            {
              id: "page_" + (i + 1),
              num: 0,
              left: 0,
              //top: 25,
              top: top,
              hasControls: false,
              selectable: false,
              hoverCursor: "default",
            }
          );
        // }
        
        // let objArr = {
        //   object_id: "page_"+(i + 1),
        //   position: {left:0, top:0, width:1123, height:794},
        // };
        // pagePositionArr.push(objArr);        
      }

      //Update the page position
      let pagesPosition = localStorage.getItem("pagesPosition");
      if (pagesPosition === null) {
        localStorage.setItem("pagesPosition", JSON.stringify(pagePositionArr));
      }
      

      setTimeout(function () {
        autoFillEditModeRef.current?.click();
      }, 3000);

      //dragging cordinate store in localStorage
      
      /*
      canvas.on("dragover", function(options) {
          // Get pointer coordinates
          const pointer = canvas.getPointer(options.e);
          const x = pointer.x;
          const y = pointer.y;

          storeMousePosition(x, y);
      });
      */
      
    }
  }, [makeFillable, imageList, canvas]);


  useEffect(() => {
    renderImageOnCanvas();
  }, [renderImageOnCanvas]);



  useEffect(() => {
    //Set mode
    let row = formObj.sign_documents.find(
      (x) => parseInt(x.id) === parseInt(signDocId)
    );

    if(row !== undefined){
      let mode = row ? parseInt(row.mode) : 1;
      setSignDocMode(mode);

      let recipientObj = EVERY_ONE_OBJECT;
      let recipients = (mode === 1) ? [recipientObj] : [];
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
  }, [formObj, signDocId]);


  const fillImageList = useCallback(async () => {
    if (signatureDocumentData?.id) {
      let obj = {
        signature_document_id: signatureDocumentData?.id,
      };

      getEnvelopeRequestSignDocumentPages(obj)
        .then((response) => {
          
          setSignDocId(signatureDocumentData?.id);
          setImageList(response.data.data);
          
          // Fill recipients on single sign mode.
          if (signatureDocumentData.request_id !== "" && signatureDocumentData.mode === 1) {
            let selectedObj = [];
            let recipients = signatureDocumentData.request_id.split(',');
            for (let i = 0; i < recipients.length; i++) {
                let index = docRecipients.findIndex(x => parseInt(x.value) === parseInt(recipients[i]));
                if (index > -1) {
                    selectedObj.push({
                        value: docRecipients[index]['value'],
                        label: docRecipients[index]['label'],
                    });
                }
            }
            setRequestSign(selectedObj);
          }

          if(signatureDocumentData.mode === 2){
            setRequestSign([]);
          }

        })
        .catch((err) => {});
    }
  }, [signatureDocumentData, docRecipients]);

  
  useEffect(
    function () {
      if (makeFillable === true) {
        setRequestSign([EVERY_ONE_OBJECT]);
        fillImageList();
        setTimeout(function () {
          setLoading(false);
        }, 3000);
      }
    },
    [makeFillable, setLoading, fillImageList]
  );

  

  function saveForm(e) {
    e.preventDefault();
    setErrors(errorsObj);
    setLoading(true);

    let error = false;
    const errorObj = { ...errors };
    const envelopeFormData = formObj;

    
    if (requestSign === "" && signDocMode === 1) {
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

    
    // Validation of recipient request in multiple signer mode
    if(signDocMode === 2){
      var anyOneRecipientBlank = placeholders.filter(
        (obj) => (obj.request_recipient === "" && obj.is_deleted === false && (obj.object_id.indexOf("static-textbox") === -1) )
      );

      
      if(anyOneRecipientBlank.length !== 0){
        setLoading(false);
        toast.error("Please select request recipient in placeholder.");
        error = true;
        return false;
      }


      var objPlaceholders = placeholders.filter(
        (obj) => (obj.request_recipient !== "" && obj.is_deleted === false && (obj.object_id.indexOf("static-textbox") === -1)  )
      );
      if(objPlaceholders.length === 0){
        setLoading(false);
        toast.error("Please select request recipient in placeholder.");
        error = true;
        return false;
      }else{
        setRequestSign([]); //initial set empty
        for (let i = 0; i < objPlaceholders.length; i++) {
          let requestRecipient = objPlaceholders[i].request_recipient;
          let recipientFound = requestSign.find((obj) => obj.value === requestRecipient.value);
          if(recipientFound === undefined){
            requestSign.push(requestRecipient)
          }
        }
      }

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
      mode : signDocMode,
      signature_document_id: signDocId,
      request_form: requestSign,
      pages_position: pagesPosition,
      items: placeholders,
    };

    signPlaceholdersUpdate(obj)
      .then((response) => {

        let requestId = response.data.data.request_id;
        let requestDisplay = [];
        if (requestSign !== 0) {
            let recipients = requestId.split(',');
            for (let i = 0; i < recipients.length; i++) {
                let index = envelopeFormData.recipient_List.findIndex(x => parseInt(x.id) === parseInt(recipients[i]));
                if (index > -1) {
                    let firstName = envelopeFormData.recipient_List[index]['first_name'];
                    let lastName = envelopeFormData.recipient_List[index]['last_name'];
                    let firstLetter = firstName.charAt(0);
                    let lastLetter = lastName.charAt(0);
                    requestDisplay.push({
                        full_name: firstName + ' ' + lastName,
                        display: firstLetter + lastLetter
                    });
                }
            }
        }


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

    handleMakeFillable(); //Update the flag of popup handle

    clearLocalStorage();
    canvas.clear();
    console.log("Clear...");
  }

  function clearLocalStorage() {
    localStorage.removeItem("mousePosition");
    localStorage.removeItem("pagesPosition");
    localStorage.removeItem("placeholders");
  }

  /*
  function objectMovedListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      mapObjectInPage(target);
    }
  }
  */


  function mapObjectInPage(target) {

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
        localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
      }
    }
  }

  function mouseUpListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      storeObjectInLocal(target);
    }
    //objectDropListener(ev);
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

    let textLabel = "";
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
        mode : signDocMode,
        request_recipient : "",
        position: objBox,
        page_object_id: "",
        text_label: textLabel,
        is_deleted: false,
      };
      placeholdersArr.push(objArr);
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
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
          mode : signDocMode,
          request_recipient : "",
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
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
    }
  }

  function getLabelFromTextBoxPlaceholder(target) {
    let groupObjects = target._objects;
    let text = groupObjects[1].text;
    return text;
  }

  /*
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
  */


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

    //Check mode - Multisign mode
    // if(signDocMode === 2){
    //   var recipient = placeholdersArr[objIndex].recipient;
    //   var recipient_value = recipient.value;
    //   alert(recipient_value);
    // }



    localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
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

  /*
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
  */

  function handleRequestRecipient(options) {
    let checkEveryone = options.findIndex((x) => parseFloat(x.value) === 0);
    if (checkEveryone > -1) {
      setRequestSign([EVERY_ONE_OBJECT]);
    } else {
      if (formObj.recipient_List.length === options.length) {
        setRequestSign([EVERY_ONE_OBJECT]);
      } else {
        setRequestSign(options);
      }
    }
  }


  function signObject(
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    requestRecipient=""
  ) {
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

    // Calculate the font size based on the box dimensions
    var fontSizeWidth = widthObject * 1; // Adjust the multiplier as needed
    var fontSizeHeight = heightObject * 0.3; // Adjust the multiplier as needed

    // Use the smaller value between fontSizeWidth and fontSizeHeight
    var fontSize = Math.min(fontSizeWidth, fontSizeHeight);

    // Multiple signer
    var fontWeight = "bold";
    var originX = "center";
    var originY = "center";
    var textLeft = (0.5 * widthObject);
    var textTop = (0.5 * heightObject);


    if(signDocMode === 2){
      fontWeight = "light";
      originX = "left";
      originY = "top";
      textLeft = 11.2;
      textTop = 6;
    }

    var signText = new fabric.Text("Signature", {
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontFamily: "Arial",
      fill: "#0c5460",
      originX: originX,
      originY: originY,
      left: textLeft,
      top: textTop,
    });      

    var groupObjects = [object, signText];
    if(signDocMode === 2){

      var chooseRecipient = "Choose Recipient";
      if(requestRecipient !== ""){
        chooseRecipient = requestRecipient.label;
      }

      var recipientText = new fabric.Text(chooseRecipient, {
        fontSize: fontSize,
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "#0c5460",
        originX: originX,
        originY: originY,
        left: 10,
        top: 25,
      });
      groupObjects = [object, signText, recipientText];
    }

    var group = new fabric.Group(groupObjects, {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });

    //canvas.on("object:moving", objectMovedListener);
    canvas.on("mouse:up", mouseUpListener);
    canvas.on("object:added", objectAddedListener);

    if(signDocMode === 2){
      canvas.on("mouse:dblclick", mouseDblClickListener);
    }

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  }

  const textBoxObject = (
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    textLabel = "ADD CONTENT",
    requestRecipient = ""
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


    if (objId.indexOf("recipient-textbox") > -1) {
      textLabel = "Recipient Name";
    } else if (objId.indexOf("system-date-textbox") > -1) {
      textLabel = "Date Signed";
    }
     
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

    // Calculate the font size based on the box dimensions
    var fontSizeWidth = widthObject * 1; // Adjust the multiplier as needed
    var fontSizeHeight = heightObject * 0.3; // Adjust the multiplier as needed
 
    // Use the smaller value between fontSizeWidth and fontSizeHeight
    var fontSize = Math.min(fontSizeWidth, fontSizeHeight);

    var fontWeight = "bold";
    var originX = "center";
    var originY = "center";
    var textLeft = (0.5 * widthObject);
    var textTop = (0.5 * heightObject);
    var textAlign = "center";
    var verticalAlign = "middle";

    if(signDocMode === 2 && (objId.indexOf("static-textbox") === -1) ){
      fontWeight = "light";
      originX = "left";
      originY = "top";
      textLeft = 11.2;
      textTop = 6;
      textAlign = "";
      verticalAlign = "";
      widthObject = (widthObject - 11);
      fontSize = (fontSize - 2.5)
    }

    
    var text = new fabric.Textbox(textLabel, {
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontFamily: "Arial",
      fill: "#0c5460",
      originX: originX,
      originY: originY,
      left: textLeft,
      top: textTop,
      textAlign: textAlign,
      verticalAlign: verticalAlign,
      editable: true,
      width: widthObject,
    });

    var groupObjects = [object, text];
    if(signDocMode === 2 && (objId.indexOf("static-textbox") === -1) ){

      var chooseRecipient = "Choose Recipient";
      if(requestRecipient !== ""){
        chooseRecipient = requestRecipient.label;
      }

      var recipientText = new fabric.Text(chooseRecipient, {
        fontSize: fontSize,
        fontWeight: "bold",
        fontFamily: "Arial",
        fill: "#0c5460",
        originX: originX,
        originY: originY,
        left: 10,
        top: 25,
      });
      groupObjects = [object, text, recipientText];
    }

    var group = new fabric.Group(groupObjects, {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });

    //canvas.on("object:moving", objectMovedListener);
    canvas.on("mouse:up", mouseUpListener);
    canvas.on("object:added", objectAddedListener);
    canvas.on("mouse:dblclick", mouseDblClickListener);

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };
  

  
  function handelAutoFillEditMode() {
    for (var i = 0; i < imageList.length; i++) {
      var placeholderDetails = imageList[i].placeholder_details;
      var page = imageList[i].page;

      
      
      if (placeholderDetails !== null) {
        let items = placeholderDetails.items;
        if(items.length > 0){
          var placeholdersUpdated = localStorage.getItem("placeholders");
          var placeholdersArr = (JSON.parse(placeholdersUpdated) == null) ? [] : JSON.parse(placeholdersUpdated);
          for (let j = 0; j < items.length; j++) {
            let objPlaceholder = items[j];
            let objectId = objPlaceholder.object_id;

            let foundObject = placeholdersArr.find((obj) => obj.object_id === objectId);
            if(foundObject === undefined){
              placeholdersArr.push(objPlaceholder);
            }
          }
          localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
        }

        //var placeholdersUpdated = localStorage.getItem("placeholders");
        //var placeholdersArr = (JSON.parse(placeholdersUpdated) == null) ? [] : JSON.parse(placeholdersUpdated);
        //console.log(placeholdersArr);

        // if(placeholdersArr.length === 0){
        //   placeholdersArr = [];
        // }

        // if(items.length > 0){
        //   for (let j = 0; j < items.length; j++) {
        //     let objPlaceholder = items[j];
        //     placeholdersArr.push(objPlaceholder);
        //   }
        //   localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
        // }
      }
      
      
      //First Page Objects
      if(page === "1"){
        if (placeholderDetails !== null) {
          let items = placeholderDetails.items;
          for (let j = 0; j < items.length; j++) {
            let objPlaceholder = items[j];
            let objectId = objPlaceholder.object_id;

            //Sign
            if (objectId.indexOf("sign") > -1) {
              signObject(
                objPlaceholder.position.top,
                objPlaceholder.position.left,
                objPlaceholder.position.width,
                objPlaceholder.position.height,
                objPlaceholder.object_id,
                objPlaceholder.request_recipient
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
                objPlaceholder.text_label,
                objPlaceholder.request_recipient
              );
            }
            
          }
        }
      }

    }
  }
  

  /*
  function addTextBoxPlaceholder(type) {
    const el = containerRef.current.children[0];
    const top = el.getBoundingClientRect().top; //95

    const topPositionObject = Math.abs(top - 200);
    const leftPositionObject = 75;
    const widthObject = 150;
    const heightObject = 50;
    const objId = generateId(type);

    textBoxObject(
      topPositionObject,
      leftPositionObject,
      widthObject,
      heightObject,
      objId
    );
  }
  */


  function mouseDblClickListener(ev) {
    let target = ev.target;
    let object_id = target.id;

    if (object_id.indexOf("static-textbox") > -1) {
      let groupObjects = target._objects;
      let text = groupObjects[1].text;
      inputRef.current.value = text;
      inputRef.current.setAttribute("data-object", object_id);
      inputRef.current.focus();
      setTextInputModal(true);
    }else{
      if(signDocMode === 2){
        setTempRecipient([]);
        setRecipientSelectModal(true);
      }
    }
  }

  function applyStaticText(){
    var objectId = inputRef.current.getAttribute("data-object");
    var objects = canvas.getObjects();
    var foundObject = objects.find((obj) => obj.id === objectId);
    if(foundObject){
      var textObject = foundObject.item(1);
      var textLabel = inputRef.current.value;
      textLabel = textLabel.trim();
      textObject.set("text", textLabel);
      //textObject.set("fontSize", 10)
      
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      placeholdersArr[objIndex].text_label = textLabel;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

      inputRef.current.setAttribute("data-object", "");
      canvas.renderAll();
      setTextInputModal(false);
    }
  }


  function saveChooseRecipient(){
    if(tempRecipient.length === 0){
      toast.error("Please select request recipient");
      return false;
    }else{
      
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        let objectId = activeObject.id;

        var placeholdersUpdated = localStorage.getItem("placeholders");
        var placeholdersArr = JSON.parse(placeholdersUpdated);

        const foundObjectIndex = placeholdersArr.findIndex((obj) => obj.object_id === objectId);
        placeholdersArr[foundObjectIndex].request_recipient = tempRecipient;
        localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
        
        // Remove the active object from the canvas
        canvas.remove(activeObject);
        let objPlaceholder = placeholdersArr[foundObjectIndex];
        if (objectId.indexOf("sign") > -1) {
          signObject(
            objPlaceholder.position.top,
            objPlaceholder.position.left,
            objPlaceholder.position.width,
            objPlaceholder.position.height - 1,
            objPlaceholder.object_id,
            tempRecipient
          );
        }

        if (objectId.indexOf("textbox") > -1) {
          textBoxObject(
            objPlaceholder.position.top,
            objPlaceholder.position.left,
            objPlaceholder.position.width,
            objPlaceholder.position.height - 1,
            objPlaceholder.object_id,
            objPlaceholder.text_label,
            tempRecipient
          );
        }
      }

      setRecipientSelectModal(false);
    }
  }


  function multiSignChooseRecipient(options) {
    setTempRecipient(options);
    let everyoneRecipientFound = requestSign.find((obj) => obj.value === 0);
    if(everyoneRecipientFound){
      setRequestSign([])
    }
  }

  const handleScroll = (event) => {
    // const target = event.target;
    // if(target.scrollTop + target.clientHeight >= target.scrollHeight){
    //   var incIndex = (activeIndex + 1);
    //   if(imageList.length > incIndex){
    //     target.scrollTop = (target.scrollTop - 200);
    //     handleImageClick(incIndex)
    //   }
    // }

    // if(target.scrollTop === 0) {
    //   if(activeIndex !== 0){
    //     var decIndex = (activeIndex - 1);
    //     target.scrollTop = 200;
    //     handleImageClick(decIndex)
    //   }
    // }
  };

  


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
              <div className="row">
                
                <div className="col-md-12">
                  
                  {signDocMode === 1 && (
                  <div>
                    <div className="header mb-3">
                      <span>Signers</span>
                    </div>

                    <div className=" mb-4 rounded">
                      <Select
                        closeMenuOnSelect={true}
                        value={requestSign}
                        components={animatedComponents}
                        isMulti
                        onChange={handleRequestRecipient}
                        options={docRecipients}
                        styles={selectStyles}
                      />
                      {errors.recipients && (
                        <div className="text-danger mt-2">
                          {errors.recipients}
                        </div>
                      )}
                    </div>
                  </div>
                  )}


                  <div className="header mb-3">
                    <span>Signature Fields</span>
                  </div>
                  <div className=" rounded mb-4">

                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "sign")}
                      onDragEnd={handleDragStop}
                      className="sign-tool"
                      name="rectangle"
                      //onClick={addSignPlaceholder}
                      data-toggle="tooltip"
                      data-placement="right"
                      title=""
                      data-bs-original-title="Signature"
                      data-bs-placement="right"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2 icon-box">
                          <i className="fa fa-pencil-square-o"></i>
                        </div>
                        <div>
                          <span className="text">Signature</span>
                        </div>
                      </div>
                    </div>
                  
                  </div>
                  
                  <div className="header mb-3 ">
                    <span>Auto-fill Fields</span>
                  </div>
                  
                  <div className=" rounded mb-4">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "recipient-textbox")}
                      onDragEnd={handleDragStop}
                      className="sign-tool"
                      name="rectangle"
                      //onClick={() => addTextBoxPlaceholder("recipient-textbox")}
                      data-toggle="tooltip"
                      data-placement="right"
                      title=""
                      data-bs-original-title="Recipient Name"
                      data-bs-placement="right"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2 icon-box">
                          <i className="fa fa-user-o"></i>
                        </div>
                        <div>
                          <span className="text">Recipient Name</span>
                        </div>
                      </div>
                    </div>

                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "system-date-textbox")}
                      onDragEnd={handleDragStop}
                      className="sign-tool"
                      name="rectangle"
                      //onClick={() => addTextBoxPlaceholder("system-date-textbox")}
                      data-toggle="tooltip"
                      data-placement="right"
                      title=""
                      data-bs-original-title="Date signed"
                      data-bs-placement="right"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2 icon-box">
                          <i className="fa fa-calendar"></i>
                        </div>
                        <div>
                          <span className="text">Date signed</span>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  
                  <div className="rounded mt-3">

                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, "static-textbox")}
                        onDragEnd={handleDragStop}
                        className="sign-tool content-box"
                        name="rectangle"
                        //onClick={() => addTextBoxPlaceholder("static-textbox")}
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Add Content"
                        data-bs-placement="right"
                      >
                        <div className="d-flex justify-content-center">
                          <div className="p-3">
                            <span className="text">ADD CONTENT</span>
                          </div>
                        </div>
                      </div>

                  </div>
                  {/* <div className="header mb-2 mt-4">
                    <span>Form Fields</span>
                  </div>
                  <div className="card rounded">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "static-textbox")}
                      onDragEnd={handleDragStop}
                      
                      className="sign-tool"
                      name="rectangle"
                      //onClick={() => addTextBoxPlaceholder("static-textbox")}
                      data-toggle="tooltip"
                      data-placement="right"
                      title=""
                      data-bs-original-title="ADD TEXT"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2 icon-box">
                          <i className="fa fa-i-cursor"></i>
                        </div>
                        <div>
                          <span className="text">ADD Text</span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  
                  
                  
                </div>
              </div>
            </div>

            <div className="col-8">
              <div className="fillable-wrapper">
                <div
                  className="card rounded dt-bg-silver m-card-scroll handle"
                  ref={containerRef}
                  onScroll={handleScroll}
                >
                  <div id="canvasContainer">
                    <canvas id="canv" style={{ border: "none" }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-2 tools-wrapper ">
              <div className="header mb-3">
                <span>Pages</span>
              </div>
              <div className="card rounded total-pages-wrapper">
                {imageList.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`page-thumb-box ${
                        index === activeIndex ? "active" : ""
                      }`}
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        data-page={item.page}
                        alt={index}
                        src={item.file_path}
                      ></img>
                      <div className="page-number">
                        Page {index + 1} of {imageList.length}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="modal-footer mt-3 mb-0 ">
          <button
            ref={clsFormButtonRef}
            type="button"
            data-bs-dismiss="offcanvas"
            onClick={clearForm}
            className="btn grey_btn_outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveForm}
            className="btn modal_btn"
          >
            Save
          </button>
        </div>

        
        <div className={`modal fade ${textInputModal ? 'show' : ''}`} id="textInputModal" tabIndex="-1" role="dialog" aria-labelledby="textInputModalLabel" aria-hidden={!textInputModal}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="textInputModalLabel">Add Text</h5>
                <button onClick={() => setTextInputModal(false)} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                  <div className="textbox-wrapper">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Enter Text"
                    />
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setTextInputModal(false)}>Close</button>
                <button onClick={() => applyStaticText()} type="button" className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>


        <div className={`modal fade ${recipientSelectModal ? 'show' : ''}`} id="recipientSelectModal" tabIndex="-1" role="dialog" aria-labelledby="recipientSelectModalLabel" aria-hidden={!recipientSelectModal}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="recipientSelectModalLabel">Recipients</h5>
                <button onClick={() => setRecipientSelectModal(false)} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                  <div className="recipient-choose-wrapper mt-2">
                      <Select
                          closeMenuOnSelect={true}
                          value={tempRecipient} // Set value to null to unset the selection
                          components={animatedComponents}
                          onChange={multiSignChooseRecipient}
                          //options={docRecipients.slice(1)}
                          options={docRecipients}
                          styles={selectStyles}
                      />
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setRecipientSelectModal(false)}>Close</button>
                <button onClick={() => saveChooseRecipient()} type="button" className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default MakeFillablePopup;
