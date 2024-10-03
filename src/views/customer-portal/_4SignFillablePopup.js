import React, { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import Utils from "../../utils";
import {
  getCustomerSignDocumentPages,
  updateCustomerSignOnDocument,
  declineCustomerSignDocument
} from "../../services/CommonService";
import TermsConditions from "../guest-portal/pages/TermsConditions";

function SignFillablePopup({
  setLoading,
  handleSignFillableRequest,
  signFillRequest,
  signatureDocumentData,
  formObj,
  setSignDocumentList
}) {
  const clsFormButtonRef = useRef();
  const containerRef = useRef();
  const autoFillEditModeRef = useRef();

  const canvasSignRef = useRef(null);
  const signpadBackgroundTextRef = useRef(null);

  const yourNameRef = useRef(null);
  const offCanvasBodyRef = useRef(null);
  const inputFileImageRef = useRef(null);

  const [showSignModal, setShowSignModal] = useState(false);
  const [signDocId, setSignDocId] = useState(0);
  const [signDocMode, setSignDocMode] = useState(1);

  const [canvas, setCanvas] = useState("");
  const [imageList, setImageList] = useState([]);
  const [recipients, setRecipients] = useState([]);

  const [activeTab, setActiveTab] = useState("type");
  const [signText, setSignText] = useState("");
  const [signFont, setSignFont] = useState("");
  // eslint-disable-next-line
  const [fonts, setFonts] = useState([
    "Great Vibes",
    "Playball",
    "Sacramento",
    "Sarina",
    "Dr Sugiyama",
    "Princess Sofia",
  ]);

  const [uploadImageBase64, setUploadImageBase64] = useState("");

  const [getStarted, setGetStarted] = useState(false);
  const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineTextareaValue, setDeclineTextareaValue] = useState("");
  const [requestFieldLeft, setRequestFieldLeft] = useState(0);
  const [titleOfSignInitialPopup, setTitleOfSignInitialPopup] = useState("");
  
  const [showTermsModal, setShowTermsModal] = useState(false);


  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "#0c5460";
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.cornerSize = 5;

  function clearLocalStorage() {
    localStorage.removeItem("pagesPosition");
    localStorage.removeItem("placeholders");
    localStorage.removeItem("nextObjects");
    localStorage.removeItem("localSign");
    localStorage.removeItem("localInitial");
  }

  function clearForm(e) {
    e.preventDefault();
    setImageList([]);
    handleSignFillableRequest(); //Update the flag of popup handle
    clearLocalStorage();
    resetSignPad();
    canvas.clear();
    console.log("Clear...");
  }

  // const pdfWidth = 794;
  // const pdfHeight = 1123;

  const pdfWidth = 595;
  const pdfHeight = 842;

  const initCanvas = () =>
    new fabric.Canvas("canv", {
      height: window.innerHeight,
      width: pdfWidth
    });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);
  

  useEffect(() => {
    
    var width = pdfWidth;
    var height = pdfHeight;
    
    var dynamicHeight = imageList.length * (height + 25); 
    const handleScroll = () => {
      canvas.setDimensions({ width: width, height: dynamicHeight });
      canvas.renderAll();

      /*
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
      }*/
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
      
      canvas.setDimensions({ width: pdfWidth });
      var imgWidth = pdfWidth;
      var imgHeight = pdfHeight;

      let countImg = 1;
      for (var i = 0; i < imageList.length; i++) {
        var topMultiplier = countImg++ * 20;
        var top = ((i * imgHeight) + topMultiplier);

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
          position: { left: 0, top: top, width: pdfWidth, height: pdfHeight },
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
    }
  }, [signFillRequest, imageList, canvas]);

  useEffect(() => {
    renderImageOnCanvas();
  }, [renderImageOnCanvas]);

  const fillImageList = useCallback(async () => {

    if (signatureDocumentData?.id) {
      setSignDocMode(parseInt(signatureDocumentData.mode));

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
          setImageList(response.data.data);
        })
        .catch((err) => {});
    }
  }, [signatureDocumentData, formObj]);

  useEffect(
    function () {
      if (signFillRequest === true) {
        fillImageList();
        setUploadImageBase64('');
      }
    },
    [signFillRequest, fillImageList]
  );


  function resetSignPad(){
    //Sign reset
    setGetStarted(false);
    setAgreeTermsOfService(false);
    setSignText('');
    setSignFont('');
    deletePreviewImage();
    containerRef.current.style.pointerEvents = "none";    
  }

  function handleAutoFillEditMode() {
    var placeholdersArr = [];
    let recObj = [];
    for (let r = 0; r < recipients.length; r++) {
      let recipient_id = recipients[r];
      recObj.push({
        recipient_id: recipient_id,
        type: "",
        value: "",
        font_family: "",
        font_size: "",
      });
    }

    for (var j = 0; j < imageList.length; j++) {
      var placeholderDetailss = imageList[j].placeholder_details;
      var items = placeholderDetailss.items;

      if (items.length > 0) {
        for (let k = 0; k < items.length; k++) {
          let objPlaceholder = items[k];
          if (signDocMode === 2) {
            if (
              objPlaceholder.customer_signature_document_id !== "" &&
              objPlaceholder.value_of_recipient
            ) {
              let recipient_id =
                objPlaceholder.value_of_recipient?.recipient_id;
              let rePrepareRecipient = [];
              for (let m = 0; m < recObj.length; m++) {
                let recObject = recObj[m];
                if (recipient_id === recObject.recipient_id) {
                  let vOfRecipient = objPlaceholder.value_of_recipient;
                  //let vOfRecipient = (signatureDocumentData.status_id !== 1) ? recObject : objPlaceholder.value_of_recipient;
                  rePrepareRecipient.push(vOfRecipient);
                } else {
                  rePrepareRecipient.push(recObject);
                }
              }
              objPlaceholder.recipients = rePrepareRecipient;
            } else {
              objPlaceholder.recipients = recObj;
            }
          } else {
            objPlaceholder.recipients = recObj;
          }

          // Blank on decline
          /*
          if(signatureDocumentData.status_id !== 1){
            objPlaceholder.value_of_recipient = "";
          } 
          */
          

          placeholdersArr.push(objPlaceholder);
        }
      }
    }

    //Set object in local storage
    localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

    for (var i = 0; i < imageList.length; i++) {
      var placeholderDetails = imageList[i].placeholder_details;
      if (placeholderDetails !== null) {
        let items = placeholderDetails.items;
        for (let j = 0; j < items.length; j++) {
          let item = items[j];

          let objId = item.object_id;
          let backgroundColor = item.color_code;
          let topPositionObject = item.position.top;
          let leftPositionObject = item.position.left;
          let widthObject = item.position.width;
          let heightObject = item.position.height;
          let requestRecipient = item.recipients;
          let dateFormat = item.date_format;
          let textContent = item.text_content;
          
          if (objId.indexOf("initial-textbox") > -1 && signDocMode === 2) {
            let label = item?.request_recipient?.label;
            textContent = "Click to Initial ("+getInitial(label)+")";
          }

          if (objId.indexOf("sign") > -1 && signDocMode === 2) {
            let label = item?.request_recipient?.label;
            textContent = "Click to Sign ("+getInitial(label)+")";
          }

          
          let fontSize = item.text_font_size;
          let fontFamily = item.text_font_family;

          //console.log(textContent)

          // Regererate the fabric tool on canvas
          fabricTool(
            backgroundColor,
            topPositionObject,
            leftPositionObject,
            widthObject,
            heightObject,
            objId,
            requestRecipient,
            fontSize,
            fontFamily,
            dateFormat,
            textContent
          );
        }
      }
    }

    setTimeout(function () {
      autoFillOtherRecipientData();
      setLoading(false);
    }, 3000);

    getRequestFieldLeft();

    
  }

  function autoFillOtherRecipientData() {
    var placeholdersUpdatedCheck = localStorage.getItem("placeholders");
    if (placeholdersUpdatedCheck !== null) {
      var placeholdersArr = JSON.parse(placeholdersUpdatedCheck);

      for (let j = 0; j < placeholdersArr.length; j++) {
        let objPlaceholder = placeholdersArr[j];
        let notEmptyRecipientRaw = objPlaceholder.recipients.find(
          (i) => i.value !== ""
        );
        if (notEmptyRecipientRaw) {
          let objId = objPlaceholder.object_id;

          if (notEmptyRecipientRaw.type === "type") {
            typeTextChange(objId, true);
          } else if (
            notEmptyRecipientRaw.type === "draw" ||
            notEmptyRecipientRaw.type === "upload"
          ) {
            typeDrawChange(objId, notEmptyRecipientRaw.value, true);
          }
        }
      }
    }
  }

  function getCurrentRecipientName() {
    return (
      formObj.recipient_detail.first_name +
      " " +
      formObj.recipient_detail.last_name
    );
  }

  function createTextLabel(
    textContent,
    fontSize,
    fontFamily,
    textColor,
    originX,
    originY,
    textLeft,
    textTop
  ) {
    return new fabric.Text(textContent, {
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: textColor,
      originX: originX,
      originY: originY,
      left: textLeft,
      top: textTop,
    });
  }

  function createRectangle(objId, imageWidth, imageHeight, fillColor) {
    // var rectWidth = imageWidth + 76;
    var rectWidth = imageWidth + 46;
    var rectHeight = imageHeight + 26;

    let strokeDashArray = [5, 5];
    if (objId.indexOf("initial-textbox") > -1 || objId.indexOf("sign") > -1) {
      strokeDashArray = [0];
    }

    return new fabric.Rect({
      width: rectWidth,
      height: rectHeight,
      radius: 1,
      objectCaching: false,
      fill: "#FFFFFF",
      stroke: fillColor,
      strokeWidth: 3,
      strokeDashArray: strokeDashArray, // Add dashed border
      hasControls: false,
    });
  }

  function createImage(imageURL) {
    //var imageURL = "/images/sign-tool-icon.png"; // Replace with your image URL
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(imageURL, function (img) {
        if (img) {
          resolve(img);
        } else {
          toast.error("Failed to load the image:");
          reject("Failed to load the image: " + imageURL);
        }
      });
    });
  }

  function createGroup(
    rect,
    img,
    fTextLabel,
    objId,
    leftPositionObject,
    topPositionObject,
    isSelectable
  ) {
    return new fabric.Group([rect, img, fTextLabel], {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true, // Disable horizontal scaling
      lockScalingY: true, // Disable vertical scaling
      selectable: isSelectable,
    });
  }

  const getRequestFieldLeft = useCallback(() => {
    let totalCount = 0;
    var placeholdersUpdated = localStorage.getItem("placeholders");
    if (placeholdersUpdated !== null) {
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      for (var i = 0; i < placeholdersArr.length; i++) {
        let item = placeholdersArr[i];
        let recipients = item.recipients;
        let current_recipient_id = formObj.recipient_detail.id;

        let foundRecipient = "";
        if (signDocMode === 1) {
          foundRecipient = recipients.find(
            (obj) => obj.recipient_id === current_recipient_id
          );
        } else {
          let request_recipient_id = item.request_recipient?.value;
          if (request_recipient_id === current_recipient_id) {
            foundRecipient = recipients.find(
              (obj) => obj.recipient_id === current_recipient_id
            );
          }
        }

        if (foundRecipient) {
          if (foundRecipient.value === "") {
            totalCount += 1;
          }
        }
      }
      setRequestFieldLeft(totalCount);
    }

    return totalCount;
  }, [formObj, signDocMode]); // Add dependencies to the useCallback dependency array

  useEffect(() => {
    getRequestFieldLeft(); // Call getRequestFieldLeft inside useEffect
  }, [getRequestFieldLeft, requestFieldLeft]); // Add getRequestFieldLeft to the dependency array

  

  function fabricTool(
    backgroundColor,
    topPositionObject,
    leftPositionObject,
    widthObject,
    heightObject,
    objId,
    requestRecipient = "",
    fontSize,
    fontFamily,
    dateFormat,
    textContent = ""
  ) {
    var originX = "left";
    var originY = "top";
    var textLeft = 15;
    var textTop = 0;
    var fillColor = "#" + backgroundColor;
    var textColor = "#000000"; //"#0c5460";

    var imageURL = "";
    var textLeftPosition = 12;

    var isSelectable = false;
    if (signDocMode === 1) {
      textContent = getPlaceholderValue(
        objId,
        fontFamily,
        fontSize,
        dateFormat
      );
      if ((objId.indexOf("initial-textbox") > -1) && (textContent === "")) {
        textContent = "Click to Initial";
        isSelectable = true;
      } else if ((objId.indexOf("sign") > -1) && (textContent === "")) {
        textContent = "Click to Sign";
        isSelectable = true;
      } else if (objId.indexOf("static") > -1) {
        textLeftPosition = 15;
        textContent = textContent === "" ? "Add Content" : textContent;
        fillColor = "#d1ecf1";
      }
    } else {
      if (objId.indexOf("initial-textbox") > -1) {
        isSelectable = true;
        //textContent = "Click to "+ textContent;
        //textContent = "Click to Initial (" + getInitial(textContent) + ")";
      } else if (objId.indexOf("sign") > -1) {
        isSelectable = true;
        //let signLabel = textContent.replace("Signature", "Sign");
        //textContent = "Click to "+ signLabel;
      } else if (
        objId.indexOf("recipient-textbox") > -1 ||
        objId.indexOf("system-date-textbox") > -1 ||
        objId.indexOf("email-address-textbox") > -1
      ) {
        textContent = getPlaceholderValue(
          objId,
          fontFamily,
          fontSize,
          dateFormat
        );
      } else if (objId.indexOf("static") > -1) {
        textLeftPosition = 15;
        textContent = textContent === "" ? "Add Content" : textContent;
        fillColor = "#d1ecf1";
      }
    }

    // console.log(textContent);

    // Create the Fabric TextLabel
    var fTextLabel = createTextLabel(
      textContent,
      fontSize,
      fontFamily,
      textColor,
      originX,
      originY,
      textLeft,
      textTop
    );

    createImage(imageURL)
      .then((img) => {

        let fTextLabelWidth = "";
        if(fontFamily === "Arial"){
          fTextLabelWidth = textContent.length * 6;
        }else if(fontFamily === "Great Vibes"){
          fTextLabelWidth = textContent.length * 15;
        }else if(fontFamily === "Sarina" || fontFamily === "Princess Sofia"){
          fTextLabelWidth = textContent.length * 14;
        }else if(fontFamily === "Sacramento"){
          fTextLabelWidth = textContent.length * 25;
        }else{
          fTextLabelWidth = textContent.length * 8;
        }
        

        // Image loaded successfully
        var rect = createRectangle(
          objId,
          fTextLabelWidth,
          fTextLabel.height,
          fillColor
        );

        // Calculate the scale factor to fit the image inside the rectangle
        var scaleFactor = Math.min(20 / img.width, 20 / img.height);

        // Calculate new dimensions for the image
        var newHeight = img.height * scaleFactor;

        // Position the image inside the rectangle
        img.set({
          left: rect.left + 10, // Set image position to the left of the rectangle
          top: 1 + (rect.height - newHeight) / 2, // Center image vertically within the rectangle
          scaleX: scaleFactor, // Set the scale factor for width
          scaleY: scaleFactor, // Set the scale factor for height
          opacity: 0.7, // Set opacity of the image (0.0 to 1.0)
        });

        fTextLabel.set({
          top: (rect.height - fTextLabel.height) / 2,
          left: textLeftPosition,
        });

        var group = createGroup(
          rect,
          img,
          fTextLabel,
          objId,
          leftPositionObject,
          topPositionObject,
          isSelectable
        );

        // Hide rotating
        group.setControlsVisibility({ mtr: false });

        // Set request recipient in tool
        group.set({
          requestRecipient:
            objId.indexOf("static") === -1 ? requestRecipient : "",
          backgroundColor: backgroundColor,
        });

        // Add the group to the canvas
        canvas.add(group);
        //canvas.on("mouse:up", mouseDblClickListener);
        group.on('mousedown', mouseDblClickListener);

        // Render canvas
        canvas.renderAll();

        //Set auto fill sign from local storage
        var placeholdersUpdated = localStorage.getItem("placeholders");
        var placeholdersArr = JSON.parse(placeholdersUpdated);
        const foundObject = placeholdersArr.find(
          (obj) => obj.object_id === objId
        );

        if (foundObject) {
          let recipients = foundObject.recipients;
          let current_recipient_id = formObj.recipient_detail.id;

          var objects = canvas.getObjects();
          var foundObjectInCanvas = objects.find((obj) => obj.id === objId);

          if (signDocMode === 2) {
            let request_recipient_id = foundObject.request_recipient.value;
            if (request_recipient_id !== undefined) {
              if (request_recipient_id !== current_recipient_id) {
                // Selectable false set
                foundObjectInCanvas.set("selectable", false);
                canvas.renderAll();

                let foundOtherRecipient = recipients.find(
                  (obj) => obj.recipient_id === request_recipient_id
                );

                if (foundOtherRecipient.type === "type") {
                  var objectWithKeyOther = findObjectByKey(
                    foundObjectInCanvas._objects,
                    "text"
                  );
                  objectWithKeyOther.set("text", foundOtherRecipient.value);
                  objectWithKeyOther.set(
                    "fontFamily",
                    foundOtherRecipient.font_family
                  );
                  objectWithKeyOther.set(
                    "fontSize",
                    foundOtherRecipient.font_size
                  );
                  canvas.renderAll();
                }
              } else {
                // console.log(foundObject);
              }
            }
          }

          let foundRecipient = recipients.find(
            (obj) => obj.recipient_id === current_recipient_id
          );

          if (foundRecipient) {
            if (foundObjectInCanvas && foundRecipient.type === "type") {
              var objectWithKey = findObjectByKey(
                foundObjectInCanvas._objects,
                "text"
              );

              objectWithKey.set("text", foundRecipient.value);
              objectWithKey.set("fontFamily", foundRecipient.font_family);
              objectWithKey.set("fontSize", foundRecipient.font_size);
              canvas.renderAll();
            } else if (
              (foundObjectInCanvas && foundRecipient.type === "draw") ||
              (foundObjectInCanvas && foundRecipient.type === "upload")
            ) {
              typeDrawChange(objId, foundRecipient.value);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        // Image loading failed
        toast.error("Failed to load the image:");
      });
  }

  // Function to find an object with a specific key
  function findObjectByKey(objects, keyToFind) {
    // Iterate over each object in the array
    for (const obj of objects) {
      // Check if the object has the specified key
      if (obj.hasOwnProperty(keyToFind)) {
        // Return the object if the key is found
        return obj;
      }
    }
    // Return null if the key is not found in any object
    return null;
  }

  function getInitial(name) {
    if (!name) return "";
    const parts = name.split(" ").filter((part) => part.trim()); // Split name by spaces and filter out empty parts
    if (parts.length === 1) {
      return parts[0].slice(0, 2); // If only one part, return first two characters
    } else {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`; // Otherwise, return first character of first part and first character of last part
    }
  }

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
      if (signDocMode === 2) {
        placeholders = placeholders.filter(
          (obj) => obj.request_recipient.value === current_recipient_id
        );
      }

      for (var i = 0; i < placeholders.length; i++) {
        let recipients = placeholders[i].recipients;
        const foundRecipient = recipients.find(
          (obj) => obj.recipient_id === current_recipient_id
        );
        if (foundRecipient.value === "") {
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
      mode: signDocMode,
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

        containerRef.current.style.pointerEvents = "none";
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
    if (activeTab === "type") {
      setSignText("John Doe");
      setSignFont("");
    } else if (activeTab === "draw") {
      clearSignPad();
    } else {
      setUploadImageBase64("");
      inputFileImageRef.current.value = null;
    }
    setShowSignModal(false);
  };

  const clearSignPad = () => {
    if (canvasSignRef.current && signpadBackgroundTextRef.current) {
      const signCanvas = canvasSignRef.current;
      const backgroundText = signpadBackgroundTextRef.current;
      canvasSignRef.current.clear();

      // Re-add the background text
      signCanvas.add(backgroundText);
      signCanvas.sendToBack(backgroundText);
    }
  };

  const storeSignValue = (objId, type = "", value = "", font = "") => {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);
    const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);

    if (foundObject) {
      const foundObjectIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objId
      );
      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;
      let request_recipient_id = foundObject?.request_recipient?.value;

      let foundRecipient = "";

      if (signDocMode === 1) {
        foundRecipient = recipients.find(
          (obj) => obj.recipient_id === current_recipient_id
        );
      } else {
        foundRecipient = recipients.find(
          (obj) => obj.recipient_id === request_recipient_id
        );
      }

      

      if (foundRecipient) {
        let foundRecipientIndex = "";

        if (signDocMode === 1) {
          foundRecipientIndex = recipients.findIndex(
            (obj) => obj.recipient_id === current_recipient_id
          );
        } else {
          foundRecipientIndex = recipients.findIndex(
            (obj) => obj.recipient_id === request_recipient_id
          );
        }

        if (
          objId.indexOf("sign") > -1 ||
          objId.indexOf("initial-textbox") > -1
        ) {
          recipients[foundRecipientIndex].type = type;
          recipients[foundRecipientIndex].value = value;
          recipients[foundRecipientIndex].font_family = font;
          recipients[foundRecipientIndex].font_size =
            parseInt(foundObject.text_font_size) + parseInt(5);
        }

        placeholdersArr[foundObjectIndex].recipients = recipients;
        localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
      }
    }
  };

  const typeTextChange = (objId, isFillMode = false) => {
    var objects = canvas.getObjects();
    var foundObjectInCanvas = objects.find((obj) => obj.id === objId);

    if (foundObjectInCanvas) {

      let fontFamilyForSign = "";
      if(signFont===""){

        if (objId.indexOf("sign") > -1) {
            let localSign = localStorage.getItem("localSign");
            if(localSign !== null){
              localSign = JSON.parse(localSign);
              fontFamilyForSign = fonts[localSign.font];
            }
        }
        if (objId.indexOf("initial-textbox") > -1) {
            let localInitial = localStorage.getItem("localInitial");
            if(localInitial !== null){
              localInitial = JSON.parse(localInitial);
              fontFamilyForSign = fonts[localInitial.font];
            }
        }
      }else{
        fontFamilyForSign = fonts[signFont];
      }

      // Remove object
      canvas.forEachObject(function (obj) {
        //Check if the object's ID matches the ID you're looking for
        if (obj.id === objId) {
          canvas.remove(obj);
        }
      });
      canvas.renderAll();

      if (isFillMode === false) {
        var signInitialData = {
            type: "text",
            font: signFont,
            value: signText
        };

  
        if(signFont === ""){
          
          if (objId.indexOf("sign") > -1) {
              let localSign = localStorage.getItem("localSign");
              if(localSign !== null){
                localSign = JSON.parse(localSign);
                signInitialData = {
                    type: "text",
                    font: localSign.font,
                    value: localSign.value
                };
              }
          }
          if (objId.indexOf("initial-textbox") > -1) {
              let localInitial = localStorage.getItem("localInitial");
              if(localInitial !== null){
                localInitial = JSON.parse(localInitial);
                signInitialData = {
                    type: "text",
                    font: localInitial.font,
                    value: localInitial.value
                };
              }
          }
        }
        
        
        if (objId.indexOf("sign") > -1) {
            // Convert to JSON and store in local storage
            localStorage.setItem("localSign", JSON.stringify(signInitialData));
        }
        
        if (objId.indexOf("initial-textbox") > -1) {
            // Convert to JSON and store in local storage
            localStorage.setItem("localInitial", JSON.stringify(signInitialData));
        }

        if(signFont === ""){
          storeSignValue(objId, "type", signInitialData.value, fontFamilyForSign);
        }else{
          storeSignValue(objId, activeTab, signText, fontFamilyForSign);
        }
      }

      const placeholders = localStorage.getItem("placeholders");
      const placeholdersArr = JSON.parse(placeholders);
      const item = placeholdersArr.find((obj) => obj.object_id === objId);
      
      let backgroundColor = item.color_code;
      let topPositionObject = item.position.top;
      let leftPositionObject = item.position.left;
      let widthObject = item.position.width;
      let heightObject = item.position.height;
      let requestRecipient = item.recipients;
      let dateFormat = item.date_format;

      let foundRecipient = "";
      if (isFillMode === false) {
        let current_recipient_id = formObj.recipient_detail.id;
        foundRecipient = requestRecipient.find(
          (obj) => obj.recipient_id === current_recipient_id
        );
      } else {
        foundRecipient = item.value_of_recipient;
      }


      let textContent = foundRecipient.value;
      let fontSize = foundRecipient.font_size;
      let fontFamily = foundRecipient.font_family;

      // Regererate the fabric tool on canvas
      fabricTool(
        backgroundColor,
        topPositionObject,
        leftPositionObject,
        widthObject,
        heightObject,
        objId,
        requestRecipient,
        fontSize,
        fontFamily,
        dateFormat,
        textContent
      );
      setShowSignModal(false);
    }
  };

  const applySign = () => {
    var activeObject = canvas.getActiveObject();
    if (activeObject == null) {
      toast.error("Please select the specific placeholder.");
      return false;
    }

    var objectId = activeObject.id;
    if (activeTab === "type") {
      if (signText === "") {
        toast.error("Please enter the text.");
      } else if (signFont === "") {
        toast.error("Please choose any one text.");
      } else {
        typeTextChange(objectId);
      }
    } else if (activeTab === "draw") {
      //Sign Draw
      if (!hasDrawingObject()) {
        toast.error("Please draw the signature.");
      } else {
        typeDrawChange(objectId);
      }
    } else {
      if (uploadImageBase64 === "") {
        toast.error("Please upload the signature image.");
      } else {
        typeDrawChange(objectId, uploadImageBase64);
      }
    }

    getRequestFieldLeft();
  };

  const typeDrawChange = (objId, signImg = "", isFillMode = false) => {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    var foundObject = placeholdersArr.find((obj) => obj.object_id === objId);

    const signBase64 = signImg === "" ? convertToBase64() : signImg;
    let objectPosition = foundObject.position;

    // Remove object
    canvas.forEachObject(function (obj) {
      // Check if the object's ID matches the ID you're looking for
      if (obj.id === objId) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();

    var fillColor = "#" + foundObject.color_code;
    var object = new fabric.Rect({
      fill: "#ffffff",
      width: objectPosition.width,
      height: objectPosition.height,
      radius: 1,
      objectCaching: false,
      stroke: fillColor,
      strokeWidth: 3,
      hasControls: false,
      clipTo: function (ctx) {
        ctx.rect(this.left, this.top, this.width, this.height);
      },
    });

    var topPositionObject = objectPosition.top;
    var leftPositionObject = objectPosition.left;

    /*
    if (window.innerWidth < 500) {
      topPositionObject = topPositionObject * 0.425;
      leftPositionObject = leftPositionObject * 0.425;
    }
    */

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

      if (isFillMode === true) {
        group.set("selectable", false);
      }

      /*
      if (window.innerWidth < 500) {
        const scaleFactor = 0.425;
        group.scaleX *= scaleFactor;
        group.scaleY *= scaleFactor;
      }
      */

      canvas.add(group);
      group.on('mousedown', mouseDblClickListener);

      if (isFillMode === false) {
        canvas.setActiveObject(group);
      }
      
      canvas.renderAll();
    });

    if (isFillMode === false) {

      var signInitialData = {
          type: "image",
          font: "",
          value: signBase64
      };
    
      if (objId.indexOf("sign") > -1) {
          // Convert to JSON and store in local storage
          localStorage.setItem("localSign", JSON.stringify(signInitialData));
      }
    
      if (objId.indexOf("initial-textbox") > -1) {
          // Convert to JSON and store in local storage
          localStorage.setItem("localInitial", JSON.stringify(signInitialData));
      }

      if(activeTab === "draw" || activeTab === "upload"){
        storeSignValue(objId, activeTab, signBase64);
      }else{
        storeSignValue(objId, "upload", signBase64);
      }
      setShowSignModal(false);
    }
  };

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

  function getPlaceholderValue(objId, fontFamily, fontSize, dateFormat) {
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    const foundObject = placeholdersArr.find((obj) => obj.object_id === objId);
    if (foundObject) {
      const foundObjectIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objId
      );

      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;
      let current_recipient_name = getCurrentRecipientName();
      let short_name = getInitial(current_recipient_name);
      setSignText(short_name);

      let current_recipient_email = formObj.recipient_detail.email;
      let static_text = foundObject.text_content;
      let current_date = Utils.getCurrentDateByFormat(dateFormat);

      if (signDocMode === 1) {
        let foundRecipient = recipients.find(
          (obj) => obj.recipient_id === current_recipient_id
        );

        if (foundRecipient) {
          let foundRecipientIndex = recipients.findIndex(
            (obj) => obj.recipient_id === current_recipient_id
          );

          recipients[foundRecipientIndex].font_family = fontFamily;
          recipients[foundRecipientIndex].font_size = fontSize;

          if (objId.indexOf("recipient-textbox") > -1) {
            recipients[foundRecipientIndex].type = "text";
            recipients[foundRecipientIndex].value = current_recipient_name;
            let short_name = getInitial(current_recipient_name);
            setSignText(short_name);
          } else if (objId.indexOf("system-date-textbox") > -1) {
            recipients[foundRecipientIndex].type = "text";
            recipients[foundRecipientIndex].value = current_date;
          } else if (objId.indexOf("email-address-textbox") > -1) {
            recipients[foundRecipientIndex].type = "text";
            recipients[foundRecipientIndex].value = current_recipient_email;
          } else if (objId.indexOf("static-textbox") > -1) {
            recipients[foundRecipientIndex].type = "text";
            recipients[foundRecipientIndex].value = static_text;
          }

          //Set again
          placeholdersArr[foundObjectIndex].recipients = recipients;
          localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

          return recipients[foundRecipientIndex].value;
        }
      } else {
        let request_recipient_id = foundObject.request_recipient.value;
        let foundRecipient = recipients.find(
          (obj) => obj.recipient_id === request_recipient_id
        );

        if (foundRecipient) {
          let foundRecipientIndex = recipients.findIndex(
            (obj) => obj.recipient_id === request_recipient_id
          );

          // Request recipient & current recipient same
          if (request_recipient_id === current_recipient_id) {
            recipients[foundRecipientIndex].font_family = fontFamily;
            recipients[foundRecipientIndex].font_size = fontSize;

            if (objId.indexOf("recipient-textbox") > -1) {
              recipients[foundRecipientIndex].type = "text";
              recipients[foundRecipientIndex].value = current_recipient_name;
              let short_name = getInitial(current_recipient_name);
              setSignText(short_name);
            } else if (objId.indexOf("system-date-textbox") > -1) {
              recipients[foundRecipientIndex].type = "text";
              recipients[foundRecipientIndex].value = current_date;
            } else if (objId.indexOf("email-address-textbox") > -1) {
              recipients[foundRecipientIndex].type = "text";
              recipients[foundRecipientIndex].value = current_recipient_email;
            }

            //Set again
            placeholdersArr[foundObjectIndex].recipients = recipients;
            localStorage.setItem(
              "placeholders",
              JSON.stringify(placeholdersArr)
            );

            return recipients[foundRecipientIndex].value;
          } else {
            // Other recipient in multiple sign mode
            if (recipients[foundRecipientIndex].value === "") {
              if (objId.indexOf("recipient-textbox") > -1) {
                return (
                  "Recipient Name (" +
                  getInitial(foundObject.request_recipient.label) +
                  ")"
                );
              } else if (objId.indexOf("system-date-textbox") > -1) {
                return (
                  "Date Signed (" +
                  getInitial(foundObject.request_recipient.label) +
                  ")"
                );
              } else if (objId.indexOf("email-address-textbox") > -1) {
                return (
                  "Email Address (" +
                  getInitial(foundObject.request_recipient.label) +
                  ")"
                );
              } else {
                return foundObject.text_content;
              }
            } else {
              return recipients[foundRecipientIndex].value;
            }
          }
        }
      }
    }
  }

  function mouseDblClickListener(ev) {
    let target = ev.target;
    let objId = target.id;
    
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    const foundObject = placeholdersArr.find(
      (obj) => obj.object_id === objId
    );
      
    if(foundObject){
      let recipients = foundObject.recipients;
      let current_recipient_id = formObj.recipient_detail.id;

      if(signDocMode === 2){
        if(current_recipient_id !== foundObject.request_recipient.value){
          return false;
        }
      }

      if ( (objId.indexOf("initial-textbox") > -1) || (objId.indexOf("sign") > -1) ) {
        canvas.forEachObject(function (obj) {
          // Check if the object's ID matches the ID you're looking for
          if (obj.id === objId) {
            // Activate the specific object
            canvas.setActiveObject(obj);
          }
        });
        canvas.renderAll();
      }

      let foundRecipient = recipients.find(
        (obj) => obj.recipient_id === current_recipient_id
      );
      // console.log(foundRecipient);

      if(foundRecipient?.value !== ""){
        openSignPadModal(objId)
      }else{

        if (objId.indexOf("sign") > -1) {
          let localSign = localStorage.getItem("localSign");
          if(localSign !== null){
            localSign = JSON.parse(localSign);
            if(localSign.type === "image"){
              typeDrawChange(objId, localSign.value);
            }else{
              typeTextChange(objId);
            }
          }else{
            openSignPadModal(objId)
          }
        }
    
        if (objId.indexOf("initial-textbox") > -1) {
          let localInitial = localStorage.getItem("localInitial");
          if(localInitial !== null){
            localInitial = JSON.parse(localInitial);

            if(localInitial.type === "image"){
              typeDrawChange(objId, localInitial.value);
            }else{
              typeTextChange(objId);
            }
          
          }else{
            openSignPadModal(objId)
          }
        }
      
      }
    }

    getRequestFieldLeft();
    //openSignPadModal(objId)
    return true;
  }

  function openSignPadModal(objId){
    if (objId.indexOf("sign") > -1 || objId.indexOf("initial") > -1) {
      
      setSignFont(0);
      let current_recipient_name = getCurrentRecipientName();
      if(objId.indexOf("sign") > -1){
        setSignText(current_recipient_name);
        selectSignFont(0);
        setActiveTab('type');
        setTitleOfSignInitialPopup("Add Your Signature")
      }else{
        let short_name = getInitial(current_recipient_name);
        setSignText(short_name);
        selectSignFont(0);
        setActiveTab('type');
        setTitleOfSignInitialPopup("Add Your Initial")
      }


      if (signDocMode === 1) {
        setShowSignModal(true);
      } else {
        var placeholdersUpdated = localStorage.getItem("placeholders");
        var placeholdersArr = JSON.parse(placeholdersUpdated);
        const foundObject = placeholdersArr.find(
          (obj) => obj.object_id === objId
        );
        if (foundObject) {
          var currentRecipient = formObj.recipient_detail.id;
          var requestRecipientValue = foundObject.request_recipient.value;
          if (currentRecipient === requestRecipientValue) {
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

  // Function to scroll to a specific page
  const scrollToPage = (pageNumber) => {
    const scrollableDiv = containerRef.current;

    // Calculate initial height
    var height = (1200 * 115) / 96;

    // Calculate dynamic height based on the number of images
    var dynamicHeight = imageList.length * (height - 75);

    canvas.setDimensions({ height: dynamicHeight });
    canvas.renderAll();

    // Calculate height per page based on dynamic height
    const heightPerPage = dynamicHeight / imageList.length;

    // Set scrollTop to scroll to the desired page
    scrollableDiv.scrollTop = (pageNumber - 1) * heightPerPage;
  };

  const handleGetStarted = () => {
    if (agreeTermsOfService) {
      setGetStarted(true);
      
      setSignText('');
      setSignFont('');
      
      containerRef.current.style.pointerEvents = "auto";
    }
  };

  useEffect(() => {
    if(!agreeTermsOfService){
      setGetStarted(false);
      setAgreeTermsOfService(false);
      setSignText('');
      setSignFont('');
      setUploadImageBase64('');
      containerRef.current.style.pointerEvents = "none";    
    }
  }, [agreeTermsOfService]);


  const handleDeclineModal = () => {
    setDeclineTextareaValue("");
    setShowDeclineModal(true);
  };

  const handleAgreeTerms = () => {
    if (agreeTermsOfService) {
      setAgreeTermsOfService(false);
    } else {
      setAgreeTermsOfService(true);
    }

    localStorage.removeItem("nextObjects");
  };

  const cancelDecline = () => {
    setShowDeclineModal(false);
  };

  const saveDecline = (e) => {
    
    if (declineTextareaValue === "") {
      toast.error(
        "Please enter the decline reason."
      );
      return false;
    }

    
    let current_recipient_id = formObj.recipient_detail.id;
    let obj = {
      envelope_data: formObj,
      signature_document_id: signDocId,
      recipient_id: current_recipient_id,
      decline_reason: declineTextareaValue,
    };
    
    setLoading(true);
    declineCustomerSignDocument(obj).then( (response) => {
      let index = formObj.sign_documents.findIndex(
        (x) => parseInt(x.id) === parseInt(signDocId)
      );
      if (index > -1) {
        formObj.sign_documents[index]["status_id"] = response.data.status_id;
        formObj.sign_documents[index]["status_name"] =
          response.data.status_name;
        formObj.sign_documents[index]["is_edit"] = false;
      }
      clsFormButtonRef.current?.click();
      setShowDeclineModal(false);
      setSignDocumentList(formObj.sign_documents);
      setLoading(false);
      toast.success(response.data.message);
      clearForm(e);
    })
    .catch((err) => {
      clsFormButtonRef.current?.click();
      setShowDeclineModal(false);
      setLoading(false);
      //ßtoast.error(Utils.getErrorMessage(err));
    });
  };

  const handleDeclineTextareaChange = (event) => {
    setDeclineTextareaValue(event.target.value);
  };


  const handleNextSignRequest = () => {

    let nextObjects = localStorage.getItem("nextObjects");
    let nextObjectsArr = JSON.parse(nextObjects);

    if (nextObjectsArr !== null) {
        let totalLength = (nextObjectsArr.length - 1);
        let findCurrentObjectIndex = nextObjectsArr.findIndex((item) => (item.current === true));

        // Old object need to false
        nextObjectsArr[findCurrentObjectIndex]['current'] = false;

        if( parseInt(totalLength) === parseInt(findCurrentObjectIndex)){
          findCurrentObjectIndex = 0;
        }else{
          findCurrentObjectIndex += 1
        }
        
        // New object need to true
        nextObjectsArr[findCurrentObjectIndex]['current'] = true;

        // Store the new data after update the current object
        localStorage.setItem("nextObjects", JSON.stringify(nextObjectsArr));

        // Active Object with Open Modal
        activeObjectWithOpenModal(nextObjectsArr[findCurrentObjectIndex].object_id, nextObjectsArr[findCurrentObjectIndex].page);


    }else{
      let placeholdersUpdated = localStorage.getItem("placeholders");
      let placeholdersArr = JSON.parse(placeholdersUpdated);

      if (placeholdersArr !== null) {

        let signRegex = new RegExp("sign", 'i'); 
        let initialRegex = new RegExp("initial", 'i'); 


        placeholdersArr = placeholdersArr.filter(function(obj) {
          // Check if the name property matches the regex and the age property matches the specified age
          return ( signRegex.test(obj.object_id) || initialRegex.test(obj.object_id) );
        })

        
        let current_recipient_id = formObj.recipient_detail.id;
        let prepareArrayOfNext = [];
        for (let j = 0; j < placeholdersArr.length; j++) {
          let objPlaceholder = placeholdersArr[j];

          let objId = objPlaceholder.object_id;
          let recipients = objPlaceholder.recipients;
          let pageNumber = objPlaceholder.page_object_id;
          pageNumber = pageNumber.match(/\d+/)[0];
        
          let foundRecipient = "";
          if(signDocMode === 1){
            foundRecipient = recipients.find(
              (obj) => obj.recipient_id === current_recipient_id
            );
          }else{
            let request_recipient_id = objPlaceholder.request_recipient.value;
            foundRecipient = (request_recipient_id === current_recipient_id) ? true : false;
          }
          
          if(foundRecipient){
            prepareArrayOfNext.push({ "page":pageNumber, "object_id":objId, "current":false });
          }
        }

        prepareArrayOfNext[0].current = true;

        // Store the initial next object data
        localStorage.setItem("nextObjects", JSON.stringify(prepareArrayOfNext)); 
        
        // Active current object with open the popup
        activeObjectWithOpenModal(prepareArrayOfNext[0].object_id, 1);
      }
    }
  };


  const activeObjectWithOpenModal = (objId, page) => {
    let currentObject = null;
    canvas.forEachObject(function (obj) {
      // Check if the object's ID matches the ID you're looking for
      if (obj.id === objId) {
        currentObject = obj;
        // Activate the specific object
        canvas.setActiveObject(obj);
      }
    });
    canvas.renderAll();

    if (currentObject) {
      // Scroll to the specified page
      scrollToPage(page);

      // Scroll the container to the object's position with an offset
      const scrollableDiv = containerRef.current;
      if (scrollableDiv) {
        scrollableDiv.scrollTop = parseInt(currentObject.top) - 150;
      }
      
      // Sign Popup Modal
      if (objId.indexOf("sign") > -1){
        if(localStorage.getItem("localSign") === null){
          openSignPadModal(currentObject.id);
        }
      }
      // Initial Popup Modal
      if (objId.indexOf("initial-textbox") > -1){
        if(localStorage.getItem("localInitial") === null){
          openSignPadModal(currentObject.id);
        }
      }
    
    } else {
      console.log("Object with ID", objId, "not found");
    }
  }

  const viewTermsOfService = () => {
    return (
      <div className="agree-terms-service">
        <input
          onChange={() => {}}
          onClick={() => handleAgreeTerms()}
          type="checkbox"
          id="agreeCheckbox"
          checked={agreeTermsOfService}
        />
        <span onClick={() => handleAgreeTerms()} style={{ cursor: "pointer" }}>
          {" "}
          I agree to be legally bound by this document and the Docutick Sign{" "}
          <button className="cu-btn-link" onClick={() => openTermsModal()}>Terms of Service</button>
        </span>
      </div>
    );
  };

  const openTermsModal = () => {
    setShowTermsModal(true);
  }

  const deletePreviewImage = () => {
    inputFileImageRef.current.value = ""; // Clear the value of the input field
    setUploadImageBase64("");
  };

  const getClassNamePdfRender = () => {
    return (window.innerWidth < 500) ? 'col-12' : 'col-10';
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 100; // Adjust the scroll amount as needed
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 100; // Adjust the scroll amount as needed
    }
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
            Review & Sign
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

        <div className="request-field-left">
          <span>Request field left : </span>{" "}
          <span className="text-danger">{requestFieldLeft}</span>
        </div>

        <div
          className="d-none"
          onClick={handleAutoFillEditMode}
          ref={autoFillEditModeRef}
        ></div>
        <div
          className="offcanvas-body p-0 "
          ref={offCanvasBodyRef}
          style={{ overflowX: "hidden", overflowY: "hidden" }}
        >
          <div className="mx-3 mt-4 mb-3">
            <div className="row">
              <div className="col-1 tools-wrapper"></div>

              <div className={getClassNamePdfRender()}>
                <div className="view-wrapper">
                  <div
                    className="card rounded dt-bg-silver m-card-scroll handle"
                    ref={containerRef}
                    style={{ pointerEvents: "none" }}
                  >
                    
                    <div
                      className="page-wrapper"
                      style={{ position: "relative", display:"flex", justifyContent:"center", left: (window.innerWidth < 500) ? "0px" : "-55px" }}
                    >
                      <canvas id="canv" style={{ border: "none"}} />
                    </div>


                  </div>
                </div>
                {/* {(window.innerWidth < 500 && agreeTermsOfService) &&
                  <div className="text-center mt-4 canvas-ho-scroll">
                    <button onClick={handleScrollLeft} className="m-1"><i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i></button>
                    <button onClick={handleScrollRight} className="m-1"><i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i></button>
                  </div>
                } */}
              </div>
              <div className="col-1 tools-wrapper"></div>
              
            </div>
          </div>

          {agreeTermsOfService && (
            <div className="modal-footer mt-3 mb-0 ">
              {!getStarted ? viewTermsOfService() : ""}
              <button
                ref={clsFormButtonRef}
                type="button"
                data-bs-dismiss="offcanvas"
                onClick={clearForm}
                className="btn grey_btn_outline"
              >
                Cancel
              </button>

              {requestFieldLeft === 0 ? (
                <button
                  type="button"
                  onClick={saveForm}
                  className="btn modal_btn"
                >
                  Finish
                </button>
              ) : (
                <div>
                  {getStarted ? (
                    <button
                      type="button"
                      onClick={handleNextSignRequest}
                      className="btn modal_btn"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetStarted}
                      className="btn modal_btn"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!agreeTermsOfService && (
            <div className="modal-footer mt-3 mb-0 ">
              {viewTermsOfService()}
              <button
                type="button"
                onClick={handleDeclineModal}
                className="btn grey_btn_outline"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleGetStarted}
                className={"bulk_btn"}
                disabled={true}
              >
                Get Started
              </button>
            </div>
          )}

          <div
            className={`modal fade ${showSignModal ? "show" : ""}`}
            id="signModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="signModalLabel"
            aria-hidden={!showSignModal}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="signModalLabel">
                    {titleOfSignInitialPopup}
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowSignModal(false)}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="tab-container">
                    <div className="tab-links d-flex">
                      <div>
                        <button
                          onClick={() => handleTabClick("type")}
                          className={
                            activeTab === "type"
                              ? "active tab-button"
                              : "tab-button"
                          }
                        >
                          Font
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => handleTabClick("draw")}
                          className={
                            activeTab === "draw"
                              ? "active tab-button"
                              : "tab-button"
                          }
                        >
                          Draw
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => handleTabClick("upload")}
                          className={
                            activeTab === "upload"
                              ? "active tab-button"
                              : "tab-button"
                          }
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                    <div className="tab-content">
                      <div
                        className={
                          activeTab === "type" ? "type-box" : "type-box d-none"
                        }
                      >
                        <div className="mt-4 d-flex justify-content-between">
                          <span>
                            <b>Select Style</b>
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
                            <div
                              key={index}
                              className="col-6 d-flex"
                              onClick={() => selectSignFont(index)}
                            >
                              <div
                                className={`p-2 border-1 border border-muted  d-flex justify-content-center align-items-center w-100 ${
                                  index === signFont ? `active` : ``
                                }`}
                              >
                                <span className={`sign-font-type-${index}`}>
                                  {signText === "" ? "John Doe" : signText}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 note-signpad">
                          <span>
                            This document can be signed electronically. Please
                            type your signature in the box and select a font
                            then click sign. You can also draw or upload your
                            signature as alternative ways to sign.
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          activeTab === "draw" ? "draw-box" : "draw-box d-none"
                        }
                      >
                        <div className="signpad-container">
                          <div className="mt-4 d-flex justify-content-between">
                            <span>
                              <b>Draw Your Signature</b>
                            </span>
                            <span
                              onClick={() => clearSignPad()}
                              className="text-black cursor-pointer"
                            >
                              <b>Clear</b>
                            </span>
                          </div>
                          <div className="signpad-canvas-wrapper">
                            <canvas
                              ref={canvasSignRef}
                              id="signatureCanvas"
                              width={
                                window.innerWidth < 500
                                  ? (window.innerWidth * 80) / 100
                                  : 450
                              }
                              height={
                                window.innerWidth < 500
                                  ? (window.innerWidth * 50) / 100
                                  : 190
                              }
                            ></canvas>
                          </div>
                        </div>

                        <div className="mt-3 note-signpad">
                          <span>
                            This document can be signed electronically. Please
                            draw your signature in the box and click sign. You
                            can also type or upload your signature as
                            alternative ways to sign.
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          activeTab === "upload"
                            ? "upload-box"
                            : "upload-box d-none"
                        }
                      >
                        <div className="mt-4 d-flex justify-content-between">
                          <span>
                            <b>Preview</b>
                          </span>
                          <span
                            onClick={() => deletePreviewImage()}
                            className="text-black cursor-pointer"
                          >
                            <b>Delete</b>
                          </span>
                        </div>

                        <div className="upload-wrapper my-3">
                          <div className="drag-area">
                            <label htmlFor="document_file">
                              <div className="icon">
                                <i
                                  className="fa fa-cloud-upload"
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <h5>
                                Drag &amp; Drop to Upload File here or click to
                                upload
                              </h5>
                              {/* <small>
                                Max file size: 3MB, Best size is 400x145 pixels
                              </small> */}
                            </label>
                            <input
                              ref={inputFileImageRef}
                              onChange={handleUploadImage}
                              type="file"
                              id="image"
                              name="image"
                              accept="image/png, image/jpeg"
                            />
                          </div>

                          {uploadImageBase64 && (
                            <div className="mt-2">
                              <h2>Uploaded Image:</h2>
                              <img src={uploadImageBase64} alt="Uploaded" />
                            </div>
                          )}
                        </div>

                        <div className="mt-3 note-signpad">
                          <span>
                            This document can be signed electronically. Please
                            upload your signature and click sign. You can also
                            draw or type your signature as alternative ways to
                            sign. (Note: the ideal size of the image is
                            400x145px as the uploaded image will be resized to
                            these dimensions)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => clearSignValue()}
                    className="btn btn-secondary px-3"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => applySign()}
                    className="btn btn-primary px-4"
                  >
                    Sign
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal fade ${showDeclineModal ? "show" : ""}`}
            id="declineModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="declineModalLabel"
            aria-hidden={!showDeclineModal}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="declineModalLabel">
                    Decline to sign this document
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowDeclineModal(false)}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div>
                    <span className="span-text">
                      Declining this document will clear anything you have
                      entered and notify the sender.
                    </span>
                  </div>
                  <div className="mt-4 mb-1">
                    <label>
                      Reason for declining{" "}
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div>
                    <span className="span-text">
                      This information will only be shared with the sender.
                    </span>
                  </div>
                  <div className="mt-1">
                    <textarea
                      cols={50}
                      row={10}
                      value={declineTextareaValue}
                      onChange={handleDeclineTextareaChange}
                      className="decline-textarea"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => cancelDecline()}
                    className="btn btn-secondary px-3"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => saveDecline()}
                    className="btn btn-primary px-4"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          
          <div
            className={`modal fade ${showTermsModal ? "show" : ""}`}
            id="termsModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="termsModalLabel"
            aria-hidden={!showTermsModal}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="termsModalLabel">
                    Terms & Condition
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(false)}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                    <TermsConditions isUpdateMeta={false}></TermsConditions>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(false)}
                    className="btn btn-secondary px-3"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
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
