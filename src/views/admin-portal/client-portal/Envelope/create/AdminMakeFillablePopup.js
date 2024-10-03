import React, { useRef, useState, useEffect, useCallback } from "react";
import {useParams} from "react-router-dom";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Utils from "../../../../../utils";
import {
    adminGetEnvelopeRequestSignDocumentPages,
    adminSignPlaceholdersUpdate,
} from "../../../../../services/AdminService";

import { EVERY_ONE_OBJECT, FONT_FAMILY_LIST, FONT_SIZE_LIST, DATEFORMAT_LIST } from "../../../../../configs/AppConfig";

function AdminMakeFillablePopup({
  makeFillable,
  signatureDocumentData,
  setLoading,
  formObj,
  setFormObj,
  handleMakeFillable,
}) {
  let {client} = useParams();
  const animatedComponents = makeAnimated();

  const [signDocId, setSignDocId] = useState(0);
  const [signDocMode, setSignDocMode] = useState(1);
  const [canvas, setCanvas] = useState("");
  const [imageList, setImageList] = useState([]);
  const [docRecipients, setDocRecipients] = useState([]);
  const [requestSign, setRequestSign] = useState([]);
  const [assignToRecipient, setAssignToRecipient] = useState([]);
  const [tempRecipient, setTempRecipient] = useState(""); // use in multiple sign mode


  const canvasRef = useRef();
  const clsFormButtonRef = useRef();
  const containerRef = useRef();
  const autoFillEditModeRef = useRef();

  const [draggedItemType, setDraggedItemType] = useState(null);

  const [noFieldSelectionFlag, setNoFieldSelectionFlag] = useState(true);
  const [signerSelectedBackgroundColor, setSignerSelectedBackgroundColor] =
    useState("d1ecf1");

  const [selectedFont, setSelectedFont] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("");
  const [selectedDateFormat, setSelectedDateFormat] = useState("");
  const [selectedTextContent, setSelectedTextContent] = useState("");

  const [visibleFabricTools, setVisibleFabricTools] = useState(false);
  const [visibleDateFormatDropdown, setVisibleDateFormatDropdown] = useState(false);
  const [visibleTextContentTextarea, setVisibleTextContentTextarea] = useState(false);
  const [visibleAssignToDropdown, setVisibleAssignToDropdown] = useState(false);

  const [previewButtonText, setPreviewButtonText] = useState("Preview");
  const [fontLoaded, setFontLoaded] = useState(false);
  const debounceTimeout = useRef(null);

  const handleDragStart = (e, type) => {
    console.log("drag start " + type);
    setDraggedItemType(type);
  };

  const handleDragStop = (e) => {
    console.log("drag stop");

    var mousePosition = localStorage.getItem("mousePosition");
    mousePosition = JSON.parse(mousePosition);

    if (mousePosition !== null) {
      let backgroundColor = signerSelectedBackgroundColor;
      let leftPositionObject = mousePosition.x - 75;
      let topPositionObject = mousePosition.y - 25;

      const widthObject = 150;
      const heightObject = 50;
      const objId = generateId(draggedItemType);
      const requestRecipient = tempRecipient;
      const fontSize = "14";
      const fontFamily = "Arial";
      const textContent = "";
      const reRenderRightSidebar = true;

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
        textContent,
        reRenderRightSidebar
      );
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #ccc",
      borderRadius: "0px",
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
      padding: "0px 8px",
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

  //Delete fabric object comman code.
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
    cornerSize: 25,
  });

  let errorsObj = {
    recipients: "",
  };

  const [errors, setErrors] = useState(errorsObj);

  /*
  const initCanvas = () =>
    new fabric.Canvas("canv", {
      height: window.innerHeight,
      width:794
    });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);
  */


  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (signatureDocumentData) {
      /*
      let incPercentage = 25;
      let { width, height } = signatureDocumentData?.dimensions;
      let incWidth = Math.round(width * incPercentage / 100);
      let incHeight = Math.round(height * incPercentage / 100);
      width = Math.round(width + incWidth);
      height = Math.round(height + incHeight);
      */
      let { width, height } = signatureDocumentData?.dimensions;
      setPdfDimensions({ width, height });
    }
  }, [signatureDocumentData]);

  useEffect(() => {
    if (!canvas && pdfDimensions.width && pdfDimensions.height) {
      const initCanvas = new fabric.Canvas('canv', {
        height: pdfDimensions.height,
        width: pdfDimensions.width,
      });
      setCanvas(initCanvas);
    } else if (canvas) {
      canvas.setDimensions({
        width: pdfDimensions.width,
        height: pdfDimensions.height,
      });
      canvas.renderAll();
    }
  }, [pdfDimensions, canvas]);


  useEffect(() => {
      const font = new FontFace('Playball', `url(${process.env.PUBLIC_URL}/fonts/Playball-Regular.ttf)`);
      font.load().then(() => {
          document.fonts.add(font);
          setFontLoaded(true);
      }).catch(error => {
          console.error('Font failed to load:', error);
      });
  }, []);

  function storeMousePosition(x, y) {
    let position = {
      x: x,
      y: y,
    };
    localStorage.setItem("mousePosition", JSON.stringify(position));
  }

  /*
  useEffect(() => {
    const { width, height } = pdfDimensions;
    const dynamicHeight = imageList.length * (height + 25);   
    const handleScroll = () => {
      canvas.setDimensions({ width: width, height: dynamicHeight });
      canvas.renderAll();
    };

    const scrollableDiv = containerRef.current;
    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
    };
  }, [canvas, imageList, pdfDimensions]);
  */
  
  useEffect(() => {
    const { width, height } = pdfDimensions;
    const dynamicHeight = imageList.length * (height + 25);

    const handleScroll = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const scrollableDiv = containerRef.current;
        const scrollTop = scrollableDiv.scrollTop;
        const windowHeight = scrollableDiv.clientHeight;
        const scrollHeight = scrollableDiv.scrollHeight;

        // Add a threshold to detect near-bottom scrolling
        const threshold = 100; // You can adjust this value as needed

        if (windowHeight + scrollTop >= scrollHeight - threshold) {
          console.log('User is near the bottom, loading more content');

          // Calculate new canvas height
          const newCanvasHeight = Math.min(dynamicHeight, scrollHeight + height);

          // Set new dimensions and render the canvas
          canvas.setDimensions({ width: width, height: newCanvasHeight });
          canvas.renderAll();
        }
      }, 200); // 200 ms debounce delay, adjust as needed
    };

    const scrollableDiv = containerRef.current;
    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [canvas, imageList, pdfDimensions, containerRef]);
  


  const renderImageOnCanvas = useCallback(async () => {
    if (makeFillable === true && imageList.length > 0) {
      canvas.clear().renderAll();
      var pagePositionArr = [];
    
      var pdfWidth = pdfDimensions.width;
      var pdfHeight = pdfDimensions.height;
      canvas.setDimensions({ width: pdfWidth, height: pdfHeight });

      // var imgWidth = pdfWidth;
      var imgHeight = pdfHeight;

      let countImg = 1;
      for (var i = 0; i < imageList.length; i++) {
        var topMultiplier = countImg++ * 20;
        var top = ((i * imgHeight) + topMultiplier);
      
        var imageUrl = imageList[i].file_path;
        fabric.Image.fromURL(
          imageUrl,
          function (img) {
            
            /*
            img.scaleToWidth(imgWidth);
            img.scaleToHeight(imgHeight);
            */

            
            const scaleX = pdfWidth / img.width;
            const scaleY = pdfHeight / img.height;
            const scale = Math.min(scaleX, scaleY);

            img.scale(scale);

            const imgWidth = img.width * scale;
            const left = (pdfWidth - imgWidth) / 2;
            
            img.set({
              left: left,
              hasControls: false,
              selectable: false,
              hoverCursor: "default",
              objectCaching: true,
            });
            
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
            objectCaching: true,
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

      //dragging cordinate store in localStorage
      canvas.on("dragover", function (options) {
        // Get pointer coordinates
        const pointer = canvas.getPointer(options.e);
        const x = pointer.x;
        const y = pointer.y;

        storeMousePosition(x, y);
      });
    }
  }, [makeFillable, imageList, canvas, pdfDimensions]);


  useEffect(() => {
    renderImageOnCanvas();
  }, [renderImageOnCanvas, pdfDimensions]);

  

  useEffect(() => {
    //Set mode
    let row = formObj.sign_documents.find(
      (x) => parseInt(x.id) === parseInt(signDocId)
    );

    if (row !== undefined) {
      let mode = row ? parseInt(row.mode) : 1;
    
      let recipients = "";
      if(mode === 1){
        let recipientObj = EVERY_ONE_OBJECT;
        let backgoundColorEveryOne = "d1ecf1";
        recipientObj.image = generateOptionImage(backgoundColorEveryOne, "Everyone");
        recipientObj.color_code = backgoundColorEveryOne;
        recipients = [recipientObj];
      }else{
        recipients = [];
      }

    
      //let bg = generateRandomColors(formObj.recipient_List.length);
      for (let i = 0; i < formObj.recipient_List.length; i++) {
        let fullName = formObj.recipient_List[i]["first_name"] +" " +formObj.recipient_List[i]["last_name"];
        let bg = generateColorCode(fullName, 0.5); 

        recipients.push({
          value: formObj.recipient_List[i]["id"],
          label: fullName,
          image : generateOptionImage(bg, formObj.recipient_List[i]["first_name"]),
          color_code : bg
        });
      }

      setDocRecipients(recipients);
    }
  }, [formObj, signDocId]);


  const fillImageList = useCallback(async () => {
    if (signatureDocumentData?.id) {
      
      setSignDocMode(parseInt(signatureDocumentData?.mode));
      
      // Update the sign mode wise request sign
      if (parseInt(signatureDocumentData?.mode) === 2) {
        setRequestSign([]);
      }

      let obj = {
        client_id: client,
        signature_document_id: signatureDocumentData?.id,
      };

      adminGetEnvelopeRequestSignDocumentPages(obj)
        .then((response) => {
          setSignDocId(signatureDocumentData?.id);
          setImageList(response.data.data);
          
          // Fill recipients on single sign mode.
          
          if (
            signatureDocumentData.request_id !== "" &&
            signatureDocumentData.mode === 1
          ) {
            let selectedObj = [];
            let recipients = signatureDocumentData.request_id.split(",");
            for (let i = 0; i < recipients.length; i++) {
              let index = docRecipients.findIndex(
                (x) => parseInt(x.value) === parseInt(recipients[i])
              );
              if (index > -1) {
                selectedObj.push({
                  value: docRecipients[index]["value"],
                  label: docRecipients[index]["label"],
                });
              }
            }
            setRequestSign(selectedObj);
          }
          
          /*else{
            if(signatureDocumentData.mode === 1){
              setRequestSign([EVERY_ONE_OBJECT]);
            }
          }*/

          
        
        })
        .catch((err) => {});
    }
  }, [signatureDocumentData, docRecipients, client]);

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


  useEffect(function () {
    if(signDocMode === 1){
      setVisibleFabricTools(true);
    }else{
      setVisibleFabricTools(false);
    }
    setNoFieldSelectionFlag(true);
  },[signDocMode]);


  
  function generateColorCode(name, opacity) {
    // DJB2 hashing algorithm
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 33) ^ name.charCodeAt(i);
    }
    const hashCode = (hash >>> 0).toString(16);

    // Use the first 6 characters of the hash code as the color code
    const colorCode = hashCode.slice(0, 6).padStart(6, '0');
    
    // Add opacity to the color
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    const colorWithAlpha = colorCode + alpha; // Append alpha channel to the color code
    
    return colorWithAlpha;
  }


  function generateOptionImage(background, name){
    let firstChar = name.charAt(0).toUpperCase() + name.slice(1);
    return "https://ui-avatars.com/api/?name="+firstChar+"&background="+background+"&color=000&rounded=true&bold=true&uppercase=true&length=2";
  }


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
    let recipientValue = [];
    if (signDocMode === 2) {
      var anyOneRecipientBlank = placeholders.filter(
        (obj) =>
          obj.request_recipient === "" &&
          obj.is_deleted === false &&
          obj.object_id.indexOf("static-textbox") === -1
      );

      if (anyOneRecipientBlank.length !== 0) {
        setLoading(false);
        toast.error("Please select request recipient in placeholder.");
        error = true;
        return false;
      }

      var objPlaceholders = placeholders.filter(
        (obj) =>
          obj.request_recipient !== "" &&
          obj.is_deleted === false &&
          obj.object_id.indexOf("static-textbox") === -1
      );

      if (objPlaceholders.length === 0) {
        setLoading(false);
        toast.error("Please select request recipient in placeholder.");
        error = true;
        return false;
      } else {

        let uniqueValuesMap = new Map();

        for (let i = 0; i < objPlaceholders.length; i++) {
          let requestRecipient = objPlaceholders[i].request_recipient;

          if (requestRecipient !== null) {
            // Convert requestRecipient to a string for comparison
            let requestRecipientString = JSON.stringify(requestRecipient);

            // Check if the requestRecipient is not already in the Map
            if (!uniqueValuesMap.has(requestRecipientString)) {
              // If not, add it to the Map and push the whole object into recipientValue
              uniqueValuesMap.set(requestRecipientString, requestRecipient);
              recipientValue.push(requestRecipient);
            }
          }
        }


        if (recipientValue.length === 0) {
          setLoading(false);
          toast.error("Please select request recipient in placeholder.");
          error = true;
          return false;
        }
      }
    }else{
      recipientValue = requestSign;
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
      client_id: client,
      envelope_id: envelopeFormData.envelope_id,
      mode: signDocMode,
      signature_document_id: signDocId,
      request_form: recipientValue,
      pages_position: pagesPosition,
      items: placeholders,
    };

    
    adminSignPlaceholdersUpdate(obj)
      .then((response) => {
        let requestId = response.data.data.request_id;
        let requestDisplay = [];
        if (requestSign !== 0) {
          let recipients = requestId.split(",");
          for (let i = 0; i < recipients.length; i++) {
            let index = envelopeFormData.recipient_List.findIndex(
              (x) => parseInt(x.id) === parseInt(recipients[i])
            );
            if (index > -1) {
              let firstName =
                envelopeFormData.recipient_List[index]["first_name"];
              let lastName =
                envelopeFormData.recipient_List[index]["last_name"];
              let firstLetter = firstName.charAt(0);
              let lastLetter = lastName.charAt(0);
              requestDisplay.push({
                full_name: firstName + " " + lastName,
                display: firstLetter + lastLetter,
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
        clearForm(e);
        clsFormButtonRef.current?.click();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(Utils.getErrorMessage(err));
      });
  }

  function clearForm(e) {
    e.preventDefault();

    setImageList([]);
    setRequestSign("");
    setVisibleFabricTools(false);
    setNoFieldSelectionFlag(true);

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

  function objectMovedListener(ev) {
    let target = ev.target;
    let object_id = target.id;
    if (object_id.indexOf("sign") > -1 || object_id.indexOf("textbox") > -1) {
      mapObjectInPage(target);
    }
  }

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
      renderRightSidebar();
    }
  }

  function renderRightSidebar() {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      let objectId = activeObject.id;
      
      // Visible date format in right side bar
      if (objectId.indexOf("date") > -1) {
        setVisibleDateFormatDropdown(true);  
      }else{
        setVisibleDateFormatDropdown(false);  
      }

      // Visible date format in right side bar
      if (objectId.indexOf("static") > -1) {
        setVisibleTextContentTextarea(true);  
      }else{
        setVisibleTextContentTextarea(false);  
      }

      //Assign to dropdown hide and show
      if( (signDocMode === 2) && (objectId.indexOf("static") === -1) ){
        setAssignToRecipient(activeObject.requestRecipient);
        setVisibleAssignToDropdown(true);
      }else{
        setVisibleAssignToDropdown(false);
      }



      // get exiting filled value from local storage
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      var dateFormat = placeholdersArr[objIndex].date_format;
      var textContent = placeholdersArr[objIndex].text_content;
      var textFontFamily = placeholdersArr[objIndex].text_font_family;
      var textFontSize = placeholdersArr[objIndex].text_font_size;
      
      var selectedFontFamilyOption = FONT_FAMILY_LIST.find(option => option.value === textFontFamily);
      var selectedFontSizeOption = FONT_SIZE_LIST.find(option => option.value === textFontSize);

      setSelectedFont(selectedFontFamilyOption);
      setSelectedFontSize(selectedFontSizeOption);
      
      if (objectId.indexOf("date") > -1) {
        var selectedDateFormatOption = DATEFORMAT_LIST.find(option => option.value === dateFormat);
        setSelectedDateFormat(selectedDateFormatOption);
      }

      if (objectId.indexOf("static") > -1) {
        setSelectedTextContent(textContent);
      }

      setNoFieldSelectionFlag(false);
    } else {
      setNoFieldSelectionFlag(true);
    }
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
    //console.log("Call object store " + objectId);
    var objBox = target.getBoundingRect();

    //let textContent = "";
    let colorCode = getBackgroundColor(target);
    let textContent = getLabelFromTextBoxPlaceholder(target);
    let requestRecipient = getRequestRecipient(target);

    let dateFormat = "";
    if (objectId.indexOf("date") > -1 ){
      dateFormat = "DD/MM/YYYY";
    }
    
  
    var placeholders = localStorage.getItem("placeholders");
    if (placeholders == null) {
      //Empty
      let placeholdersArr = [];
      let objArr = {
        object_id: objectId,
        mode: signDocMode,
        request_recipient: requestRecipient,
        position: objBox,
        page_object_id: "",
        text_content: textContent,
        text_font_size : "14",
        text_font_family : 'Arial',
        date_format : dateFormat,
        is_deleted: false,
        color_code: colorCode
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
          mode: signDocMode,
          request_recipient: requestRecipient,
          page_object_id: "",
          position: objBox,
          is_deleted: false,
          text_content: textContent,
          text_font_size : "14",
          text_font_family : 'Arial',
          date_format : dateFormat,
          color_code: colorCode
        };
        placeholdersArr.push(objArr);
      } else {
        //Update exiting entry
        placeholdersArr[objIndex].position = objBox;
        placeholdersArr[objIndex].text_content = textContent;
        placeholdersArr[objIndex].request_recipient = requestRecipient;
        placeholdersArr[objIndex].color_code = colorCode;
      }
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
    }
  }

  function getLabelFromTextBoxPlaceholder(target) {
    let groupObjects = target._objects;
    let objectText = findObjectByKey(groupObjects, "text");
    let text = objectText.text;
    return text;
  }

  function getRequestRecipient(target){
    return (target.requestRecipient) ? target.requestRecipient : '';
  }

  function getBackgroundColor(target){
    return (target.backgroundColor) ? target.backgroundColor : '';
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


  function createTextLabel(
    textContent,
    fontSize,
    fontFamily,
    textColor,
    originX,
    originY,
    textLeft,
    textTop,
    previewMode
  ) {

    
    if(fontFamily === "Playball"){
      if (fontLoaded) {
        return new fabric.Text(textContent, {
          fontSize: fontSize,
          fontFamily: fontFamily,
          fill: textColor,
          originX: originX,
          originY: originY,
          left: textLeft,
          top: textTop,
          objectCaching: true,
        });
      }
    }else{
      return new fabric.Text(textContent, {
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: textColor,
        originX: originX,
        originY: originY,
        left: textLeft,
        top: textTop,
        objectCaching: true,
      });
    }
  }

  function createRectangle(objId, imageWidth, imageHeight, fillColor, previewMode) {
    
    // var rectWidth = imageWidth + 76;
    // var rectHeight = imageHeight + 26;
    
    var rectWidth = Math.round(imageWidth + 60);
    var rectHeight = Math.round(imageHeight + 20);
    
    if(previewMode){
      return new fabric.Rect({
        width: rectWidth,
        height: rectHeight,
        radius: 1,
        objectCaching: true,
        fill: "#FFFFFF",
        stroke: fillColor,
        strokeWidth: 3,
        strokeDashArray: [5, 5], // Add dashed border
        hasControls: false,
        selectable: false, // Make it static (not selectable)
      });
    }else{
      return new fabric.Rect({
        width: rectWidth,
        height: rectHeight,
        radius: 1,
        objectCaching: true,
        fill: fillColor,
        stroke: "#ccc",
        strokeWidth: 1,
        hasControls: false,
      });
    } 
  }

  function createGroup(
    rect,
    img,
    fTextLabel,
    objId,
    leftPositionObject,
    topPositionObject,
    previewMode
  ) {
    return new fabric.Group([rect, img, fTextLabel], {
      id: objId,
      left: leftPositionObject,
      top: topPositionObject,
      lockRotation: true,
      preserveObjectStacking: true,
      selectable: (previewMode) ? false : true,
      hoverCursor:(previewMode) ? "pointer" : "all-scroll",
      objectCaching: true,
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
    textContent = "",
    reRenderRightSidebar = true,
    previewMode = false
  ) {
    /*
    var fontSize = 14;
    var fontFamily = "Arial";
    */
    var originX = "left";
    var originY = "top";
    var textLeft = 15;
    var textTop = 0;
    var fillColor = "#"+backgroundColor;
    var textColor = "#000000"; //"#0c5460";

    var imageURL = "";
    var textLeftPosition = 35;

    // Preview mode set true
    if(!previewMode){
      if (objId.indexOf("recipient-textbox") > -1) {
        textContent = "Recipient Name";
        imageURL = "/images/recipient-tool-icon.png";
      } else if (objId.indexOf("system-date-textbox") > -1) {
        textContent = "Date Signed";
        imageURL = "/images/calender-tool-icon.png";
      } else if (objId.indexOf("initial-textbox") > -1) {
        textContent = "Initial";
        imageURL = "/images/initial-tool-icon.png";
      } else if (objId.indexOf("email-address-textbox") > -1) {
        textContent = "Email Address";
        imageURL = "/images/email-tool-icon.png";
      } else if (objId.indexOf("sign") > -1) {
        textContent = "Signature";
        imageURL = "/images/sign-tool-icon.png";
      } else {
        textLeftPosition = 10;
        textContent = (textContent === "") ? "Add Content" : textContent;
        fillColor = "#d1ecf1";
      }

      
      // Add Initial name after label
      if( (requestRecipient !== "") && (objId.indexOf("static") === -1) ){
        textContent = textContent+ " ("+getInitial(requestRecipient.label)+")";
      }
    }else{
      //Need to change the font family on sign & initial
      if ( (objId.indexOf("initial-textbox") > -1) || (objId.indexOf("sign") > -1) ){
        fontFamily = "Playball";
      } else if (objId.indexOf("static") > -1) {
        textLeftPosition = 10;
        textContent = (textContent === "") ? "Add Content" : textContent;
        fillColor = "#d1ecf1";
      }
    }

    // Create the Fabric TextLabel
    var fTextLabel = createTextLabel(
      textContent,
      fontSize,
      fontFamily,
      textColor,
      originX,
      originY,
      textLeft,
      textTop,
      previewMode
    );

    createImage(imageURL)
      .then((img) => {
        // Image loaded successfully
        var rect = createRectangle(
          objId,
          fTextLabel.width,
          fTextLabel.height,
          fillColor,
          previewMode
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
          left: (previewMode) ? 10 : textLeftPosition
        });

        var group = createGroup(
          rect,
          img,
          fTextLabel,
          objId,
          leftPositionObject,
          topPositionObject,
          previewMode
        );

        // Hide rotating
        group.setControlsVisibility({ mtr: false });
        
        // Set request recipient in tool
        group.set({
          requestRecipient : (objId.indexOf("static") === -1) ? requestRecipient : '',
          backgroundColor: backgroundColor,
        });

        canvas.on("object:moving", objectMovedListener);
        canvas.on("mouse:up", mouseUpListener);
        canvas.on("object:added", objectAddedListener);

        
        // Add the group to the canvas
        canvas.add(group);

        if(!previewMode){
          canvas.setActiveObject(group);
        }
    
        // Render canvas
        canvas.renderAll();

        if(reRenderRightSidebar){
          //Render right sidebar as per tool
          setSelectedFont(FONT_FAMILY_LIST[0]);
          setSelectedFontSize(FONT_SIZE_LIST[0]);
          setSelectedDateFormat(DATEFORMAT_LIST[0]);
          setSelectedTextContent('');
          renderRightSidebar();
         
        }

      })
      .catch((error) => {
        console.log(error);
        // Image loading failed
        toast.error("Failed to load the image:");
      });
  }

 
 

  function handelAutoFillEditMode() {
    var placeholdersUpdatedCheck = localStorage.getItem("placeholders");
    if (placeholdersUpdatedCheck === null) {
      for (var i = 0; i < imageList.length; i++) {
        var placeholderDetails = imageList[i].placeholder_details;
        if (placeholderDetails !== null) {
          let items = placeholderDetails.items;
          if (items.length > 0) {
            var placeholdersUpdated = localStorage.getItem("placeholders");
            var placeholdersArr =
              JSON.parse(placeholdersUpdated) == null
                ? []
                : JSON.parse(placeholdersUpdated);
            for (let j = 0; j < items.length; j++) {
              let objPlaceholder = items[j];
              let objectId = objPlaceholder.object_id;

              let foundObject = placeholdersArr.find(
                (obj) => obj.object_id === objectId
              );
              if (foundObject === undefined) {
                placeholdersArr.push(objPlaceholder);
              }
            }
            localStorage.setItem(
              "placeholders",
              JSON.stringify(placeholdersArr)
            );
          }
        }


        //Render fabric object on canvas
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
            let requestRecipient = item.request_recipient;
            let textContent = item.text_content;
            let fontSize = item.text_font_size;
            let fontFamily = item.text_font_family;
            let reRenderRightSidebar = false;
            
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
              textContent,  
              reRenderRightSidebar
            );
          }
        }
        
        
      }
      
      if(signDocMode === 1){
        setVisibleFabricTools(true);
      }else{
        setVisibleFabricTools(false);
      }
    }
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

  function toolFontChange(selectedOption) {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      
      let objectId = activeObject.id;
      setSelectedFont(selectedOption);
      
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      // Update exiting entry
      placeholdersArr[objIndex].text_font_family = selectedOption.value;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
      
      // Update the fabric canvas object
      var objectWithKey = findObjectByKey(activeObject._objects, "text");
      objectWithKey.set("fontFamily", selectedOption.value);
      canvas.renderAll();

    } else {
      toast.error("Please select specific tool.");
    } 
  }

  function toolFontSizeChange(selectedOption) {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      
      let objectId = activeObject.id;
      setSelectedFontSize(selectedOption);
      
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      // Remove active object
      updateDeleteFlagInSignObject(activeObject);
      canvas.remove(activeObject);
      canvas.requestRenderAll();
      
      // Update exiting entry
      placeholdersArr[objIndex].text_font_size = selectedOption.value;
      placeholdersArr[objIndex].is_deleted = false;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
        

      // Re render fabric tool on canvas
      let backgroundColor = placeholdersArr[objIndex].color_code;
      let topPositionObject = placeholdersArr[objIndex].position.top;
      let leftPositionObject = placeholdersArr[objIndex].position.left;
      let widthObject = placeholdersArr[objIndex].position.width;
      let heightObject = placeholdersArr[objIndex].position.height;
      let objId = placeholdersArr[objIndex].object_id;
      let requestRecipient = placeholdersArr[objIndex].request_recipient;
      let fontSize = placeholdersArr[objIndex].text_font_size;
      let fontFamily = placeholdersArr[objIndex].text_font_family;
      let textContent = placeholdersArr[objIndex].text_content;
      let reRenderRightSidebar = false;

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
        textContent,
        reRenderRightSidebar
      );
    } else {
      toast.error("Please select specific tool.");
    } 
  }


  function toolDateFormatChange(selectedOption) {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      
      let objectId = activeObject.id;
      setSelectedDateFormat(selectedOption);
      
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      // Update exiting entry
      placeholdersArr[objIndex].date_format = selectedOption.value;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

    } else {
      toast.error("Please select specific tool.");
    } 
  }

  function toolTextContentChange(event) {
    var textContent = event.target.value;
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      
      let objectId = activeObject.id;
      setSelectedTextContent(textContent);
      
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      // Remove active object
      updateDeleteFlagInSignObject(activeObject);
      canvas.remove(activeObject);
      canvas.requestRenderAll();
      
      // Update exiting entry
      placeholdersArr[objIndex].text_content = textContent;
      placeholdersArr[objIndex].is_deleted = false;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));
        

      // Re render fabric tool on canvas
      let backgroundColor = placeholdersArr[objIndex].color_code;
      let topPositionObject = placeholdersArr[objIndex].position.top;
      let leftPositionObject = placeholdersArr[objIndex].position.left;
      let widthObject = placeholdersArr[objIndex].position.width;
      let heightObject = placeholdersArr[objIndex].position.height;
      let objId = placeholdersArr[objIndex].object_id;
      let requestRecipient = placeholdersArr[objIndex].request_recipient;
      let fontSize = placeholdersArr[objIndex].text_font_size;
      let fontFamily = placeholdersArr[objIndex].text_font_family;
      let reRenderRightSidebar = false;
  

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
        textContent,  
        reRenderRightSidebar
      );

    } else {
      toast.error("Please select specific tool.");
    } 
  }

  

  function changeRecipientOnSingleSignMode(options){
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

  function changeRecipientOnMultiSignMode(options) {
    setRequestSign(options);
    setSignerSelectedBackgroundColor(options.color_code);
    setVisibleFabricTools(true);
    setTempRecipient(options);
  }

  function changeRecipientOnTool(options){
    setAssignToRecipient(options);
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {

      let objectId = activeObject.id;
      var placeholdersUpdated = localStorage.getItem("placeholders");
      var placeholdersArr = JSON.parse(placeholdersUpdated);

      var objIndex = placeholdersArr.findIndex(
        (obj) => obj.object_id === objectId
      );
      
      // Remove active object
      updateDeleteFlagInSignObject(activeObject);
      canvas.remove(activeObject);
      canvas.requestRenderAll();
      
      // Update exiting entry
      placeholdersArr[objIndex].color_code = options.color_code; 
      placeholdersArr[objIndex].request_recipient = options; // Update the selected request recipients
      placeholdersArr[objIndex].is_deleted = false;
      localStorage.setItem("placeholders", JSON.stringify(placeholdersArr));

      // Re render fabric tool on canvas
      let backgroundColor = options.color_code;
      let topPositionObject = placeholdersArr[objIndex].position.top;
      let leftPositionObject = placeholdersArr[objIndex].position.left;
      let widthObject = placeholdersArr[objIndex].position.width;
      let heightObject = placeholdersArr[objIndex].position.height;
      let objId = placeholdersArr[objIndex].object_id;
      let requestRecipient = placeholdersArr[objIndex].request_recipient;
      let textContent = placeholdersArr[objIndex].text_content;
      let fontSize = placeholdersArr[objIndex].text_font_size;
      let fontFamily = placeholdersArr[objIndex].text_font_family;
      let reRenderRightSidebar = false;
  
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
        textContent,  
        reRenderRightSidebar
      );
      
    }
  }
  
  // eslint-disable-next-line
  function togglePreview() {
    // Access all canvas objects
    var items = canvas.getObjects().filter(function (o) {
      return o.id && o.id.indexOf("page") === -1;
    });
    if(items.length === 0){
      toast.error("Please drag the tools on pdf.");
    }else{
      // Access the DOM element using the ref
      const container = containerRef.current;
      if (previewButtonText === "Preview") {
        setPreviewButtonText("Turn Off Preview");

        // Check if the container exists
        if (container) {
          // Add your styles here
          container.style.boxShadow = '0 1rem 3rem rgba(0,0,0,.175)';
        }

        renderPreviewTool(true);
        setNoFieldSelectionFlag(true);

      } else {
        // Check if the container exists
        if (container) {
          // Add your styles here
          container.style.boxShadow = 'none';
        }

        renderPreviewTool(false);
        setPreviewButtonText("Preview");
      }
    }
  }

  function renderPreviewTool(previewMode){
    // Access all canvas objects
    var items = canvas.getObjects().filter(function (o) {
      return o.id && o.id.indexOf("page") === -1;
    });

    // Remove all canvas tool
    items.forEach(function (o) {
      canvas.remove(o);
    });

    // Get canvas object from local machine
    var placeholdersUpdated = localStorage.getItem("placeholders");
    var placeholdersArr = JSON.parse(placeholdersUpdated);

    // Iterate through each element in the array
    placeholdersArr.forEach(function(item) {
      // Perform operations on each item here
      if(item.is_deleted === false){
        
        // Re render fabric tool on canvas
        let objId = item.object_id;
        let backgroundColor = item.color_code;
        let topPositionObject = item.position.top;
        let leftPositionObject = item.position.left;
        let widthObject = item.position.width;
        let heightObject = item.position.height;
        let requestRecipient = item.request_recipient;
        let textContent = item.text_content;
        let fontSize = item.text_font_size;
        let fontFamily = item.text_font_family;
        let dateFormat = item.date_format;
        let reRenderRightSidebar = false;


        let recipientList = formObj.recipient_List;
        let recipientId = "";
        if(signDocMode === 1){
          if(requestSign[0].value === 0){
            // Get first recipient id
            recipientId = recipientList[0].id;
          }else{
            recipientId = requestSign[0].value;
          }
        }else{
          recipientId = requestRecipient.value;
        }

        if(recipientId){
          let recipientObject = recipientList.find(
            (obj) => obj.id === recipientId
          );
          if (objId.indexOf("recipient-textbox") > -1) {
            textContent = recipientObject.first_name+" "+recipientObject.last_name;
          } else if (objId.indexOf("system-date-textbox") > -1) {
            textContent = Utils.getCurrentDateByFormat(dateFormat);
          } else if (objId.indexOf("initial-textbox") > -1) {
            textContent = getInitial(recipientObject.first_name+" "+recipientObject.last_name);
          } else if (objId.indexOf("email-address-textbox") > -1) {
            textContent = recipientObject.email;
          } else if (objId.indexOf("sign") > -1) {
            textContent = recipientObject.first_name+" "+recipientObject.last_name;
          }
        }
      

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
          textContent,  
          reRenderRightSidebar,
          previewMode
        );
      }
    });
  }

  function deleteTool(){
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      updateDeleteFlagInSignObject(activeObject);
      canvas.remove(activeObject);
      canvas.requestRenderAll();
      setNoFieldSelectionFlag(true);
    } else {
      toast.error("Please select specific tool.");
    } 
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
  
  /*
  const Option = (props) => (
    <components.Option
      {...props}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <img
          src={props.data.image}
          alt={props.data.label}
          style={{ marginRight: "7px", width: "30px", height: "30px" }}
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
  */

  const formatOptionLabel = ({ label, image }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={image} alt={label} style={{ width: '30px', height: '30px', marginRight: '10px' }} />
      <span>{label}</span>
    </div>
  );


 

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
                      <div className="header mb-2">
                        <span>Signers</span>
                      </div>

                      <div className=" mb-4 rounded">
                        <Select
                          closeMenuOnSelect={true}
                          value={requestSign}
                          components={animatedComponents}
                          isMulti
                          onChange={changeRecipientOnSingleSignMode}
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

                  {signDocMode === 2 && (
                    <div>
                      <div className="header mb-2">
                        <span>Signers</span>
                      </div>

                      <div className=" mb-4 rounded">
                        <Select
                          closeMenuOnSelect={true}
                          value={requestSign}
                          //components={{ Option }}
                          onChange={changeRecipientOnMultiSignMode}
                          options={docRecipients}
                          styles={selectStyles}
                          formatOptionLabel={formatOptionLabel}
                        />
                        {errors.recipients && (
                          <div className="text-danger mt-2">
                            {errors.recipients}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(visibleFabricTools) &&
                  <div>
                    <div className="header mb-2">
                      <span>Signature Fields</span>
                    </div>
                    <div className=" rounded mb-4">
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, "sign")}
                        onDragEnd={handleDragStop}
                        className="sign-tool"
                        name="rectangle"
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Signature"
                        data-bs-placement="right"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="me-2 icon-box"
                            style={{
                              background: "#" + signerSelectedBackgroundColor,
                            }}
                          >
                            {/* <i className="fa fa-pencil-square-o"></i> */}
                            <img
                              className="tool-icon"
                              src="/images/sign-tool-icon.png"
                              alt="..."
                            />
                          </div>
                          <div>
                            <span className="text">Signature</span>
                          </div>
                        </div>
                      </div>

                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, "initial-textbox")
                        }
                        onDragEnd={handleDragStop}
                        className="sign-tool"
                        name="rectangle"
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Initial"
                        data-bs-placement="right"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="me-2 icon-box"
                            style={{
                              background: "#" + signerSelectedBackgroundColor,
                            }}
                          >
                            {/* <span className="initial">Aa</span> */}
                            <img
                              className="tool-icon"
                              src="/images/initial-tool-icon.png"
                              alt="..."
                            />
                          </div>
                          <div>
                            <span className="text">Initial</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="header mb-2 ">
                      <span>Auto-fill Fields</span>
                    </div>

                    <div className=" rounded mb-4">
                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, "system-date-textbox")
                        }
                        onDragEnd={handleDragStop}
                        className="sign-tool"
                        name="rectangle"
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Date signed"
                        data-bs-placement="right"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="me-2 icon-box"
                            style={{
                              background: "#" + signerSelectedBackgroundColor,
                            }}
                          >
                            {/* <i className="fa fa-calendar"></i> */}
                            <img
                              className="tool-icon"
                              src="/images/calender-tool-icon.png"
                              alt="..."
                            />
                          </div>
                          <div>
                            <span className="text">Date signed</span>
                          </div>
                        </div>
                      </div>

                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, "recipient-textbox")
                        }
                        onDragEnd={handleDragStop}
                        className="sign-tool"
                        name="rectangle"
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Recipient Name"
                        data-bs-placement="right"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="me-2 icon-box"
                            style={{
                              background: "#" + signerSelectedBackgroundColor,
                            }}
                          >
                            {/* <i className="fa fa-user-o"></i> */}
                            <img
                              className="tool-icon"
                              src="/images/recipient-tool-icon.png"
                              alt="..."
                            />
                          </div>
                          <div>
                            <span className="text">Recipient Name</span>
                          </div>
                        </div>
                      </div>

                      <div
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, "email-address-textbox")
                        }
                        onDragEnd={handleDragStop}
                        className="sign-tool"
                        name="rectangle"
                        data-toggle="tooltip"
                        data-placement="right"
                        title=""
                        data-bs-original-title="Recipient Email Address"
                        data-bs-placement="right"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="me-2 icon-box"
                            style={{
                              background: "#" + signerSelectedBackgroundColor,
                            }}
                          >
                            {/* <i className="fa fa-envelope-o"></i> */}
                            <img
                              className="tool-icon"
                              src="/images/email-tool-icon.png"
                              alt="..."
                            />
                          </div>
                          <div>
                            <span className="text">Email Address</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  }

                    <div className="rounded mt-3">
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, "static-textbox")}
                        onDragEnd={handleDragStop}
                        className="sign-tool content-box"
                        name="rectangle"
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

                </div>
              </div>
            </div>

            <div className="col-8">
              <div className="fillable-wrapper">
                <div
                  className="card rounded dt-bg-silver m-card-scroll handle"
                  ref={containerRef}
                >
                  <div id="canvasContainer">
                    <canvas
                      id="canv"
                      ref={canvasRef}
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2 right-side tools-wrapper">
              {noFieldSelectionFlag ? (
                <div className="no-field-selection">
                  <div className="d-flex flex-column align-items-center">
                    <div className="icon-box">
                      <img
                        className="right-pen"
                        src="/images/signpen.png"
                        alt="..."
                      />
                      {/* <i className="fa fa-pencil-square-o" aria-hidden="true"></i> */}
                    </div>
                    {signDocMode === 1 ? (
                      <div>
                        <div className="main-title text-center">
                          <span>No Field Selected</span>
                        </div>
                        <div className="sub-title text-center">
                          <span>Select a field to make changes</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="main-title text-center">
                          <span>No Signer Selected</span>
                        </div>
                        <div className="sub-title text-center">
                          <span>Please choose the signer</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="delete-tool mb-3" onClick={deleteTool}>
                    <span><i className="fa fa-trash-o"></i></span>
                  </div>

                  {(visibleAssignToDropdown) &&
                  <div>
                    <div className="header mb-2">
                      <span>Assigned to</span>
                    </div>
                    <div className="mb-3 rounded">
                      <Select
                        closeMenuOnSelect={true}
                        value={assignToRecipient}
                        onChange={changeRecipientOnTool}
                        options={docRecipients}
                        styles={selectStyles}
                        formatOptionLabel={formatOptionLabel}
                      />
                    </div>
                  </div>
                  }

                  <div>
                    <div className="header mb-2">
                      <span>Select font</span>
                    </div>
                    <div className="mb-3 rounded">
                      <Select
                        closeMenuOnSelect={true}
                        value={selectedFont}
                        components={animatedComponents} // Use custom Option component
                        onChange={toolFontChange}
                        options={FONT_FAMILY_LIST}
                        styles={selectStyles}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="header mb-2">
                      <span>Select font size</span>
                    </div>
                    <div className="mb-3 rounded">
                      <Select
                        closeMenuOnSelect={true}
                        value={selectedFontSize}
                        components={animatedComponents} // Use custom Option component
                        onChange={toolFontSizeChange}
                        options={FONT_SIZE_LIST}
                        styles={selectStyles}
                      />
                    </div>
                  </div>
                  {(visibleDateFormatDropdown) &&
                    <div>
                      <div className="header mb-2">
                        <span>Select Date Format</span>
                      </div>
                      <div className="mb-3 rounded">
                        <Select
                          closeMenuOnSelect={true}
                          value={selectedDateFormat}
                          components={animatedComponents} // Use custom Option component
                          onChange={toolDateFormatChange}
                          options={DATEFORMAT_LIST}
                          styles={selectStyles}
                        />
                      </div>
                    </div>
                  }
  
                  {(visibleTextContentTextarea) &&
                    <div>
                      <div className="header mb-2">
                        <span>Enter Content</span>
                      </div>
                      <div className="mb-3 rounded">
                        <textarea 
                          className="textarea-mak"
                          value={selectedTextContent} 
                          onChange={toolTextContentChange} 
                          rows={5} 
                          cols={24} 
                          placeholder="Enter content here..." 
                        />
                      </div>
                    </div>
                  }

                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer mt-3 mb-0 ">
          <button
            type="button"
            onClick={togglePreview}
            className="toggle_btn_preview"
          >
          <strong><i className="fa fa-eye"></i> {previewButtonText}</strong>
          </button>

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
        
      </div>
    </div>
  );
}

export default AdminMakeFillablePopup;
