import React, { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import Utils from "../../utils";
import {
  getCustomerSignDocumentPages,
  updateCustomerSignOnDocument,
} from "../../services/CommonService";

function SignFillablePopup({
  setLoading,
  handelSignFillableRequest,
  signFillRequest,
  signatureDocumentData,
  formObj,
  setSignDocumentList,
}) {
  const clsFormButtonRef = useRef();
  const containerRef = useRef();
  const autoFillEditModeRef = useRef();

  const canvasSignRef = useRef(null);
  const signpadBackgroundTextRef = useRef(null);

  const yourNameRef = useRef(null);
  const offCanvasBodyRef = useRef(null);

  const [showSignModal, setShowSignModal] = useState(false);
  const [signDocId, setSignDocId] = useState(0);
  const [signDocMode, setSignDocMode] = useState(1);

  const [canvas, setCanvas] = useState("");
  const [imageList, setImageList] = useState([]);
  const [recipients, setRecipients] = useState([]);
  
  const [activeTab, setActiveTab] = useState("type");
  const [signText, setSignText] = useState("");
  const [signFont, setSignFont] = useState("");
  const [fonts, setFonts] = useState([]);

  const [uploadImageBase64, setUploadImageBase64] = useState('');
  const inputFileImageRef = useRef(null);


  

  function clearLocalStorage() {
    localStorage.removeItem("pagesPosition");
    localStorage.removeItem("placeholders");
  }

 
  function clearForm(e) {
    e.preventDefault();
    setImageList([]);
    handelSignFillableRequest(); //Update the flag of popup handle
    clearLocalStorage();
    canvas.clear();
    console.log("Clear...");
  }

  const initCanvas = () =>
    new fabric.Canvas("canv", {
      height: window.innerHeight,
      width: window.innerWidth,
    });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);


  useEffect(() => {
    var width = (794 * 120) / 96;
    var height = (1200 * 115) / 96;

    var dynamicHeight = imageList.length * (height - 75); //900
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
    if (signFillRequest === true && imageList.length > 0) {
      
      canvas.clear().renderAll();

      var pagePositionArr = [];
      var width = (794 * 120) / 96;
      var height = (1200 * 115) / 96;

      canvas.setDimensions({ width: width });
      var imgWidth = width;
      var imgHeight = height - 100;

      for (var i = 0; i < imageList.length; i++) {
        var topMultiplier = i * 20;
        var top = i === 0 ? i * imgHeight : i * imgHeight + topMultiplier;
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
            top: top,
            hasControls: false,
            selectable: false,
            hoverCursor: "default",
          }
        );

        let objArr = {
          object_id: "page_" + (i + 1),
          position: { left: 0, top: top, width: width, height: height },
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



      // canvas.clear().renderAll();

      // var pagePositionArr = [];
      // canvas.setDimensions({ width: 794, height: 1200 });
      // for (var i = 0; i < imageList.length; i++) {
      //   if (i === 0) {

      //     var imageUrl = imageList[i].file_path;
         

      //     fabric.Image.fromURL(
      //       imageUrl,
      //       function (img) {
      //         img.scaleToWidth(794);
      //         img.scaleToHeight(1123);
      //         canvas.add(img).renderAll();
      //       },
      //       {
      //         id: "page_1",
      //         num: 0,
      //         left: 0,
      //         top: 25,
      //         hasControls: false,
      //         selectable: false,
      //         hoverCursor: "default",
      //         stroke: "#000",
      //         strokeWidth: 1,
      //       }
      //     );
      //   }

      //   let objArr = {
      //     object_id: "page_" + (i + 1),
      //     position: { left: 0, top: 25, width: 1123, height: 794 },
      //   };
      //   pagePositionArr.push(objArr);
      // }

      //Update the page position
      // let pagesPosition = localStorage.getItem("pagesPosition");
      // if (pagesPosition === null) {
      //   localStorage.setItem("pagesPosition", JSON.stringify(pagePositionArr));
      // }

      // setTimeout(function () {
      //   autoFillEditModeRef.current?.click();
      // }, 3000);

    }
  }, [signFillRequest, imageList, canvas]);


  function handelAutoFillEditMode() {

    var placeholdersArr = [];
    let recObj = [];
    for (let r = 0; r < recipients.length; r++) {
      let recipient_id = recipients[r];
      recObj.push({ recipient_id: recipient_id, type:'', value: "", font: "" });
    }

    for (var j = 0; j < imageList.length; j++) {
      var placeholderDetailss = imageList[j].placeholder_details;
      let items = placeholderDetailss.items;
      if (items.length > 0) {
        for (let k = 0; k < items.length; k++) {
          let objPlaceholder = items[k];
          objPlaceholder.recipients = recObj;
          placeholdersArr.push(objPlaceholder);
        }
      }
    }

    //Set object in local storage
    localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
    setLoading(false);

    for (var i = 0; i < imageList.length; i++) {
      var placeholderDetails = imageList[i].placeholder_details;
      //var page = imageList[i].page;
      //First Page Objects
      //if (page === "1") {
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
      //}
    }
    
    setFonts(["Great Vibes", "Playball", "Sacramento", "Sarina", "Dr Sugiyama", "Princess Sofia"])
  }

  useEffect(() => {
    renderImageOnCanvas();
  }, [renderImageOnCanvas]);

  const fillImageList = useCallback(async () => {
    if (signatureDocumentData?.id) {
      let obj = {
        signature_document_id: signatureDocumentData?.id,
      };

      

      let recipient_ids = signatureDocumentData.request_id;
      if (recipient_ids !== 0) {
        //Get all recipients ids
        let envelop_recipients = formObj.recipient_ids;
        recipient_ids = envelop_recipients.split(",");
      } else {
        recipient_ids = recipient_ids.split(",");
      }
      setRecipients(recipient_ids);
      getCustomerSignDocumentPages(obj)
        .then((response) => {
          setSignDocId(signatureDocumentData?.id);
          setSignDocMode(signatureDocumentData.mode)
          setImageList(response.data.data);
        })
        .catch((err) => {});
    }
  }, [signatureDocumentData, formObj]);

 
  useEffect(
    function () {
      if (signFillRequest === true) {
        fillImageList();
      }
    },
    [signFillRequest, fillImageList]
  );

 


  const signObject = (
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    requestRecipient = ""
  ) => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#0c5460";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 5;

   
    var currentRecipient = formObj.recipient_detail.id;
    var requestRecipientValue = "";
    var rectFillColor = "#d1ecf1";
    var rectStroke = "#0c5460";
    if(signDocMode === 2){
      requestRecipientValue = requestRecipient.value;
      if(currentRecipient !== requestRecipientValue){
        rectFillColor = "#d6d6d6";
        rectStroke = "#0c5460";
      }
    }

    var object = new fabric.Rect({
      fill: rectFillColor,
      width: widthObject,
      height: heightObject,
      radius: 2,
      objectCaching: false,
      stroke: rectStroke,
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
      var chooseRecipient = "";
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
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true, // Disable horizontal scaling
      lockScalingY: true, // Disable vertical scaling
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });


    canvas.add(group);
    if(signDocMode === 1){
      canvas.setActiveObject(group);
      canvas.on("mouse:up", mouseDblClickListener);
    }else{
      if(currentRecipient === requestRecipientValue){
        canvas.setActiveObject(group);
        canvas.on("mouse:up", mouseDblClickListener);
      }else{
        group.set('selectable', false);
      }
    }
    canvas.renderAll();
   

    //Set auto fill sign from local storage
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);
    const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);
    if(foundObject){
      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;

      const foundRecipient = recipients.find(
        (obj) => obj.recipient_id === current_recipient_id
      );
      
      if(foundRecipient){
        var objects = canvas.getObjects();
        var foundObjectInCanvas = objects.find((obj) => obj.id === objId);
        if(foundObjectInCanvas && foundRecipient.type === "type"){
          var textObject = foundObjectInCanvas.item(signDocMode); //1 for single, 2 for multiple
          var fontFamily = foundRecipient.font;
          textObject.set("text", foundRecipient.value);
          textObject.set("fontFamily", fontFamily); 
          textObject.set("fontSize", 24); 
          canvas.renderAll();
        }else if( (foundObjectInCanvas && foundRecipient.type === "draw") || (foundObjectInCanvas && foundRecipient.type === "upload") ){
          typeDrawChange(objId, foundRecipient.value);
        }
      }
    }
  };

  

  function saveForm(e) {
    // Get local sign position
    let placeholdersUpdated = localStorage.getItem("placeholders");
    let placeholders = JSON.parse(placeholdersUpdated);

    if (placeholders === null) {
      toast.error("Oops! Something went wrong.");
      return false;
    }

    // Get local page position
    let pagesPosition = localStorage.getItem("pagesPosition");
    pagesPosition = JSON.parse(pagesPosition);
    if (pagesPosition === null) {
      toast.error("The positions of the pages are not being updated.");
      return false;
    }

    // Check sign is exit or not in any of the page in canvas
    let current_recipient_id = formObj.recipient_detail.id;
    if (placeholders !== null) {

      if(signDocMode === 2){
        placeholders = placeholders.filter(
          (obj) => obj.request_recipient.value === current_recipient_id
        );
      }

      for (var i = 0; i < placeholders.length; i++) {
        let recipients = placeholders[i].recipients;
        const foundRecipient = recipients.find(
          (obj) => obj.recipient_id === current_recipient_id
        );
        if(foundRecipient.value === ""){
          toast.error(
            "Please draw a signature or fill in the provided space for text."
          );
          return false;
        }
      }
    }

    

    let obj = {
      envelope_data: formObj,
      signature_document_id: signDocId,
      mode : signDocMode,
      pages_position: pagesPosition,
      recipient_id: current_recipient_id,
      items: placeholders,
    };


    setLoading(true);
    updateCustomerSignOnDocument(obj)
      .then((response) => {
        
        let index = formObj.sign_documents.findIndex(
          (x) => parseInt(x.id) === parseInt(signDocId)
        );

        if (index > -1) {
          formObj.sign_documents[index]["status_id"] = response.data.status_id;
          formObj.sign_documents[index]["status_name"] =
            response.data.status_name;
          formObj.sign_documents[index]["is_edit"] = false;
        }

        setSignDocumentList(formObj.sign_documents);
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

  // Function to handle tab change
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Initialize Fabric.js canvas
    const signCanvas = new fabric.Canvas(canvasSignRef.current, {
      isDrawingMode: true, // Enable drawing mode
    });

    // Set properties for drawing
    signCanvas.freeDrawingBrush.width = 3; // Set brush width
    signCanvas.freeDrawingBrush.strokeWidth = 3; // Adjust stroke width for smoother lines
    signCanvas.freeDrawingBrush.smooth = true; // Enable smooth drawing

    // Disable object selection while drawing
    signCanvas.selection = false;

    // Add background text
    const center = signCanvas.getCenter();
    const backgroundText = new fabric.IText("Your Sign Here", {
      fontSize: 24,
      fill: "gray",
      selectable: false,
      left: center.left,
      top: center.top,
      originX: "center",
      originY: "center",
      fontFamily: "Arial",
      fontWeight: "bold",
      opacity: 0.2,
    });

    signCanvas.add(backgroundText);
    signCanvas.sendToBack(backgroundText); // Send text to the back

    // Save reference to background text for removal later
    canvasSignRef.current = signCanvas;
    signpadBackgroundTextRef.current = backgroundText;

    return () => {
      // Cleanup: remove event listeners and free resources
      signCanvas.dispose();
    };
  }, []);

  const convertToBase64 = () => {
    if (canvasSignRef.current && signpadBackgroundTextRef.current) {
      const signCanvas = canvasSignRef.current;
      const backgroundText = signpadBackgroundTextRef.current;

      signCanvas.remove(backgroundText); // Remove the background text from the canvas

      const dataURL = signCanvas.toDataURL({
        format: "png",
        quality: 1,
      });

      // Re-add the background text
      signCanvas.add(backgroundText);
      signCanvas.sendToBack(backgroundText);

      return dataURL;
    }
  };


  const clearSignValue = () => {
    if(activeTab === "type"){
      setSignText("John Doe");
      setSignFont("");
    }else if(activeTab === "draw"){
      clearSignPad();
    }else{
      setUploadImageBase64('');
      inputFileImageRef.current.value = null;
    }
    setShowSignModal(false)
  }


  
  const clearSignPad = () => {
    if (canvasSignRef.current && signpadBackgroundTextRef.current) {
      const signCanvas = canvasSignRef.current;
      const backgroundText = signpadBackgroundTextRef.current;
      canvasSignRef.current.clear();

      // Re-add the background text
      signCanvas.add(backgroundText);
      signCanvas.sendToBack(backgroundText);

      //Apply clear base64 image
      //applySign(true);
    }
  };


  const storeSignValue = (objId, type="", value="", font="") => {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);
    const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);
    if (foundObject) {
      const foundObjectIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objId
      );
      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;
      const foundRecipient = recipients.find(
        (obj) => obj.recipient_id === current_recipient_id
      );
      if (foundRecipient) {
        let foundRecipientIndex = recipients.findIndex(
          (obj) => obj.recipient_id === current_recipient_id
        );
        if (objId.indexOf("sign") > -1) {
          recipients[foundRecipientIndex].type = type;
          recipients[foundRecipientIndex].value = value;
          recipients[foundRecipientIndex].font = font;
        }

        placeholdersArr[foundObjectIndex].recipients = recipients;
        localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
      }
    }
  }

  const typeTextChange = (objectId) => {
    var objects = canvas.getObjects();
    var foundObjectInCanvas = objects.find((obj) => obj.id === objectId);
    if(foundObjectInCanvas){
      let fontFamily = fonts[signFont];
      let activeObject = canvas.getActiveObject();
      canvas.remove(activeObject);
      canvas.renderAll();
      storeSignValue(objectId, activeTab, signText, fontFamily);

      
      if(signDocMode === 1){
        signObject(foundObjectInCanvas.top,foundObjectInCanvas.left,foundObjectInCanvas.width,foundObjectInCanvas.height - 1, objectId);
      }else{
        const placeholders = localStorage.getItem("placeholders");
        const placeholdersArr = JSON.parse(placeholders);
        const foundObject = placeholdersArr.find((obj) => obj.object_id === objectId);
        
        if(foundObject){
          var requestRecipient = foundObject.request_recipient;
          signObject(foundObjectInCanvas.top,foundObjectInCanvas.left,foundObjectInCanvas.width,foundObjectInCanvas.height - 1, objectId, requestRecipient);
        }
      }

      setShowSignModal(false);
    }
  }

  const applySign = (isClear) => {
    
    var activeObject = canvas.getActiveObject();
    if (activeObject == null) {
      toast.error("Please select the specific placeholder.");
      return false;
    }

    var objectId = activeObject.id;
    if(activeTab === "type"){
      if(signText === ""){
        toast.error("Please enter the text.");
      }else if(signFont === ""){
        toast.error("Please choose any one text.");
      }else{
        typeTextChange(objectId);
      }
    }else if(activeTab === "draw"){
      //Sign Draw
      if(!hasDrawingObject()){
        toast.error("Please draw the signature.");
      }else{
        typeDrawChange(objectId);
      }
  
    }else{
      if(uploadImageBase64 === ""){
        toast.error("Please upload the signature image.");
      }else{
        typeDrawChange(objectId, uploadImageBase64);
      }
    }
  };

  const typeDrawChange = (objId, signImg="") => {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    var foundObject = placeholdersArr.find(
      (obj) => obj.object_id === objId
    );

    const signBase64 = (signImg === "") ? convertToBase64() : signImg;
    let objectPosition = foundObject.position;
    let activeObject = canvas.getActiveObject();
    canvas.remove(activeObject);
    canvas.renderAll();

    //Create rectangle object
    var object = new fabric.Rect({
      fill: "#d1ecf1",
      width: objectPosition.width,
      height: objectPosition.height,
      radius: 2,
      objectCaching: false,
      stroke: "#0c5460",
      strokeWidth: 1,
      hasControls: false,
      clipTo: function (ctx) {
        ctx.rect(this.left, this.top, this.width, this.height);
      },
    });

    var topPositionObject = objectPosition.top;
    var leftPositionObject = objectPosition.left;

    if (window.innerWidth < 500) {
      topPositionObject = topPositionObject * 0.425;
      leftPositionObject = leftPositionObject * 0.425;
    }
    
    // Load an image to be placed inside the rectangle
    fabric.Image.fromURL(signBase64, function (img) {
      img.set({
        left: 0,
        top: 0,
        scaleX: objectPosition.width / img.width,
        scaleY: objectPosition.height / img.height,
      });

      // Create a group with the existing object and the new image
      let group = new fabric.Group([object, img], {
        id: objId,
        left: leftPositionObject,
        top: topPositionObject,
        lockRotation: true,
        preserveObjectStacking: true,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
      });

          //Hide rotating
      group.setControlsVisibility({ mtr: false });
      group.set({
        width: objectPosition.width,
        height: objectPosition.height,
      });
      if (window.innerWidth < 500) {
        const scaleFactor = 0.425;
        group.scaleX *= scaleFactor;
        group.scaleY *= scaleFactor;
      }
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
    });
    

    storeSignValue(objId, activeTab, signBase64);
    setShowSignModal(false);
  }


  // Function to check if there are drawing objects on the canvas
  const hasDrawingObject = () => {
    if (canvasSignRef.current) {
      const signCanvas = canvasSignRef.current;

      // Iterate through all objects on the canvas
      const objects = signCanvas.getObjects();
      for (let i = 0; i < objects.length; i++) {
        // Check if the object is of type associated with drawing operations
        if (
          objects[i].type === "path" ||
          objects[i].type === "line" ||
          objects[i].type === "circle"
        ) {
          // Return true if any drawing object is found
          return true;
        }
      }
    }
    // Return false if no drawing object is found
    return false;
  };



  const textBoxObject = (
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    textLabel = "TextBox",
    requestRecipient = ""
  ) => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#0c5460";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 5;

    var currentRecipient = formObj.recipient_detail.id;
    var requestRecipientValue = "";
    var rectFillColor = "#d1ecf1";
    var rectStroke = "#0c5460";

    if(signDocMode === 2 && (objId.indexOf("static-textbox") === -1) ){
      requestRecipientValue = requestRecipient.value;
      if(currentRecipient !== requestRecipientValue){
        rectFillColor = "#d6d6d6";
        rectStroke = "#0c5460";
      }
    }

    var object = new fabric.Rect({
      fill: rectFillColor,
      width: widthObject,
      height: heightObject,
      radius: 2,
      objectCaching: false,
      stroke: rectStroke,
      strokeWidth: 1,
      hasControls: false,
    });

    if(signDocMode === 1){
      //Update the textLabel
      textLabel = getPlaceholderValue(objId);
    }

    var fontSize = 16;
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
      width: widthObject,
    });


    var groupObjects = [object, text];
    //if(signDocMode === 2){
    if(signDocMode === 2 && (objId.indexOf("static-textbox") === -1) ){
      var chooseRecipient = "";
      if(currentRecipient === requestRecipientValue){
        chooseRecipient = getPlaceholderValue(objId);
      }else{
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
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true, // Disable horizontal scaling
      lockScalingY: true, // Disable vertical scaling
      selectable: false,
    });

    //Hide rotating
    group.setControlsVisibility({ mtr: false });
    canvas.add(group);
    canvas.renderAll();

  };

  function getPlaceholderValue(objId) {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);
    if (foundObject) {
      const foundObjectIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objId
      );

      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;
      let current_recipient_name =
        formObj.recipient_detail.first_name +
        " " +
        formObj.recipient_detail.last_name;

      let current_date_obj = new Date();

      // Format the date string with leading zeros
      let day = current_date_obj.getDate().toString().padStart(2, "0");
      let month = (current_date_obj.getMonth() + 1).toString().padStart(2, "0");
      let year = current_date_obj.getFullYear();
      let current_date = `${day}/${month}/${year}`;

      let static_text = foundObject.text_label;

      const foundRecipient = recipients.find(
        (obj) => obj.recipient_id === current_recipient_id
      );

      if (foundRecipient) {
        let foundRecipientIndex = recipients.findIndex(
          (obj) => obj.recipient_id === current_recipient_id
        );

        if (objId.indexOf("recipient-textbox") > -1) {
          recipients[foundRecipientIndex].type = "text";
          recipients[foundRecipientIndex].value = current_recipient_name;
          let short_name = (current_recipient_name.length > 7) ? current_recipient_name.slice(0, 7) : current_recipient_name;
          setSignText(short_name);
        } else if (objId.indexOf("system-date-textbox") > -1) {
          recipients[foundRecipientIndex].type = "text";
          recipients[foundRecipientIndex].value = current_date;
        } else if (objId.indexOf("static-textbox") > -1) {
          recipients[foundRecipientIndex].type = "text";
          recipients[foundRecipientIndex].value = static_text;
        }

        //Set again
        placeholdersArr[foundObjectIndex].recipients = recipients;
        localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

        //Exact value
        return recipients[foundRecipientIndex].value;
      }
    }
  }

  function mouseDblClickListener(ev) {
    let target = ev.target;
    let objId = target.id;
    if (objId.indexOf("sign") > -1) {
      if(signDocMode === 1){
        setShowSignModal(true);
      }else{
        var placeholdersUpdated = localStorage.getItem("placeholders");
        var placeholdersArr = JSON.parse(placeholdersUpdated);
    
        const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);
        if(foundObject){
          var currentRecipient = formObj.recipient_detail.id;
          var requestRecipientValue = foundObject.request_recipient.value;
          if(currentRecipient === requestRecipientValue){
            setShowSignModal(true);
          }
        }
      }
    }
  }

 

  
  

  const changeName = (newValue) => {
    setSignText(newValue);
  };

  const selectSignFont = (index) => {
    setSignFont(index);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // Convert the image to base64 and update state
      setUploadImageBase64(reader.result);
    };
    // Read the file as Data URL
    reader.readAsDataURL(file);
  };



  return (
    <div>
      <div
        className="offcanvas offcanvas-end signFillableForm"
        data-bs-scroll="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        id="signFillableForm"
        aria-labelledby="signFillableFormLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="signFillableFormLabel">
            Sign Document
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
          ref={offCanvasBodyRef}
          style={{ overflowX: "hidden", overflowY: "hidden" }}
        >
          <div className="mx-3 mt-4 mb-3">
            <div className="row">
              
              
              <div className="col-2 tools-wrapper"></div>

              <div className="col-8">
                <div className="view-wrapper">
                  <div
                    className="card rounded dt-bg-silver m-card-scroll handle"
                    ref={containerRef}
                  >
                    <div
                      className="page-wrapper"
                      style={{ position: "relative" }}
                    >
                      <canvas id="canv" style={{ border: "none" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-2 tools-wrapper"></div>
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
            <button type="button" onClick={saveForm} className="btn modal_btn">
              Save
            </button>
          </div>


          <div className={`modal fade ${showSignModal ? 'show' : ''}`} id="signModal" tabIndex="-1" role="dialog" aria-labelledby="signModalLabel" aria-hidden={!showSignModal}>
      
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="signModalLabel">Fill Form</h5>
                  <button type="button" onClick={() => setShowSignModal(false)} className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">

                    <div className="tab-container">
                      <div className="tab-links d-flex justify-content-around">
                        <div>
                          <button
                            onClick={() => handleTabClick("type")}
                            className={activeTab === "type" ? "active tab-button" : "tab-button"}
                          >
                            Type
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => handleTabClick("draw")}
                            className={activeTab === "draw" ? "active tab-button" : "tab-button"}
                          >
                            Draw
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => handleTabClick("upload")}
                            className={activeTab === "upload" ? "active tab-button" : "tab-button"}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                      <div className="tab-content">
                        <div className={activeTab === "type" ? "type-box" : "type-box d-none"}>

                          <div className="mt-3 note-signpad">
                            <span>
                            This document can be signed electronically. Please type your signature in the box and select a font then click sign. You can also draw or upload your signature as alternative ways to sign.
                            </span>
                          </div>

                          <div className="your-name-wrapper d-flex align-items-center my-3 p-2">
                            <div>
                              <span>Your Name</span>
                            </div>
                            <div className="flex-fill">
                              <input
                                ref={yourNameRef}
                                type="text"
                                placeholder="Your Name"
                                value={signText}
                                onInput={(e) => changeName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="row g-2 font-box-wrapper">
                            
                            {[...Array(6)].map((_, index) => (
                            <div key={index} className="col-6 d-flex" onClick={() => selectSignFont(index)}>
                              <div className={`p-2 border-1 border border-muted  d-flex justify-content-center align-items-center w-100 ${(index === signFont) ? `active`: ``}`}><span className={`sign-font-type-${index}`}>{(signText === "") ? 'John Doe' : signText}</span></div>
                            </div>
                            ))}
                           
                          </div>

                        </div>
                        <div className={activeTab === "draw" ? "draw-box" : "draw-box d-none"}>
                              
                          <div className="signpad-container">
                            <div className="signpad-canvas-wrapper">
                              <canvas
                                ref={canvasSignRef}
                                id="signatureCanvas"
                                width={(window.innerWidth < 500) ? (window.innerWidth * 80 / 100) : 450}
                                height={(window.innerWidth < 500) ? (window.innerWidth * 50 / 100) : 250}
                              ></canvas>
                            </div>
                          </div>

                          <div className="mt-3 note-signpad">
                            <span>
                              This document can be signed electronically. Please draw your signature in the box and click sign. You can also type or upload your signature as alternative ways to sign.
                            </span>
                          </div>

                        </div>
                        <div className={activeTab === "upload" ? "upload-box" : "upload-box d-none"}>
                          
                          <div className="mt-3 note-signpad">
                            <span>
                              This document can be signed electronically. Please upload your signature and click sign. You can also draw or type your signature as alternative ways to sign. (Note: the ideal size of the image is 700x200px as the uploaded image will be resized to these dimensions)
                            </span>
                          </div>

                          <div className="upload-wrapper my-3">
                            <div className="drag-area">
                                <label htmlFor="document_file">
                                  <div className="icon">
                                    <i className="fa fa-cloud-upload" aria-hidden="true"></i>
                                  </div>
                                  <h5>Drag &amp; Drop to Upload File here or click to upload</h5>
                                </label>
                                <input ref={inputFileImageRef} onChange={handleUploadImage} type="file" id="image" name="image" accept="image/png, image/jpeg" />
                            </div>

                            {uploadImageBase64 && (
                              <div className="mt-2">
                                <h2>Uploaded Image:</h2>
                                <img src={uploadImageBase64} alt="Uploaded" />
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" onClick={() => clearSignValue()} className="btn btn-secondary px-3" data-dismiss="modal">Close</button>
                    <button type="button" onClick={() => applySign()} className="btn btn-primary px-4">Sign</button>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
}

export default SignFillablePopup;
