import React, { useEffect, useState } from "react";
import { manageFiles } from "../../../../../services/CommonService";

const truncateName = (name, length) => {
    return name.length > length ? `${name.substring(0, length)}...` : name;
};

const renderIcon = (fileType) => {
    switch (fileType) {
        case 'pdf':
            return '/images/pdf.png';
        case 'ppt':
            return '/images/ppt.png';
        case 'word':
            return '/images/word.png';
        case 'png':
        case 'jpeg':
        case 'jpg':
            return '/images/img.png';
        default:
            return '/images/default.png'; // Default icon
    }
};

const EnvFiles = () => {
    const [folders, setFolders] = useState({});
    const [activeFolder, setActiveFolder] = useState(null);
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);      // State to handle errors

    useEffect(() => {
        const loadFolders = async () => {
            try {
                setLoading(true);  // Start loading
                const response = await manageFiles();  // API call without data payload
                setFolders(response.data.data);  // Setting the folder data dynamically
            } catch (err) {
                console.error("Error fetching folder data: ", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);  // End loading
            }
        };

        loadFolders();  // Call the function on component mount
    }, []);

    // Initialize Bootstrap Tooltip
    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);
    
    const handleFolderClick = (folderName) => {
        setActiveFolder(folderName);
    };

    const handleBackClick = () => {
        setActiveFolder(null);
    };

    return (
        <div className="tab-pane fade" id="EnvFiles" role="tabpanel" aria-labelledby="EnvFiles-tab">
            <style>
                {`
                .folders-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                }
                .folder {
                    padding: 5px;
                    width: 100px;
                    text-align: center;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    margin: 5px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .folder:hover {
                    background-color: #f0f0f0;
                }
                .folder-icon {
                    width: 35px;
                    height: auto;
                    margin-bottom: 5px;
                }
                .files-list {
                    display: flex;
                    flex-direction: column;       
                    align-items: flex-start;      
                }
                .files-list ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    display: flex;                
                    flex-wrap: wrap;              
                }
                .files-list li {
                    padding: 5px;
                    display: flex;
                    flex-direction: column;       
                    align-items: center;          
                    margin-right: 20px;           
                    text-align: center;           
                }
                .files-list li img {
                    width: 50px;                  
                    height: auto;
                    margin-bottom: 5px;           
                    cursor: pointer;              
                }
                h3 {
                    font-size: 14px;
                    margin: 0;
                }
                .back-button {
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 22px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .back-button:hover {
                    background-color: #e9e9e9; /* Darker background on hover */
                }

                .back-button img {
                    width: 12px;
                    height: auto;
                    margin-right: 8px;
                }

                .documents-header {
                    margin: 10px 0;
                    font-size: 17px;             
                }
                .documents-container {
                    display: flex;               
                    flex-wrap: wrap;             
                    margin-top: 10px;            
                }
                .search_input {
                    margin:0; 
                    width: 100%; /* Full width for search input */
                    display: flex; /* Flexbox for alignment */
                    justify-content: flex-end; /* Align to the right */
                }
                .input-group {
                    width: 250px; /* Adjust width as needed */
                }
                .main-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 20px; /* Add space from the top */
                }

                .left-content {
                    flex: 1;
                    padding-top: 10px; /* Space added to avoid touching the top */
                }

                .right-content {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 10px; /* Space added to avoid touching the top */
                }
                .icon {
                    width: 25px;
                    height: auto;
                    margin-right: 8px;
                }
                .ifont {
                    color:gray;
                    font-size:13px;
                }
                `}
            </style>
            
            <div className="main-container d-flex align-items-center justify-content-between mb-4">
                <div className="left-content">
                    <h2 className="main_title">Users Documents</h2>
                </div>

                <div className="right-content search_input">
                    <div className="input-group position-relative me-2">
                        <input 
                            className="form-control border-end-0 border rounded-pill" 
                            type="text"
                            placeholder="Search"
                        />
                        <span className="input-group-append position-absolute">
                            <i className="fa fa-search"/>
                        </span>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p> 
            ) : error ? (
                <p>{error}</p>
            ) : activeFolder === null ? (
                Object.keys(folders).length === 0 ? (
                    <p>No files uploaded.</p>
                ) : (
                    <div className="folders-container">
                        {Object.entries(folders).map(([folderName]) => (
                            <div className="folder" key={folderName} onClick={() => handleFolderClick(folderName)}>
                                <img src="/images/folder.png" alt="Folder Icon" className="folder-icon" />
                                <h3>{folderName}</h3>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="files-list">
                    <div className="back-button" onClick={handleBackClick}>
                        <img src="/images/back-button (1).png" alt="Back" />
                        <span>Back</span>
                    </div><br></br>
                    
                    <h5 className="documents-header">{activeFolder}'s Documents</h5><br></br>
                    
                    <div className="documents-container">
                        <ul>
                            <li>
                                <img 
                                    src={renderIcon('pdf')} 
                                    alt="PDF Icon" 
                                    data-bs-toggle="tooltip" 
                                    title="document1.pdf" style={{ width: '29px', height: 'auto', marginRight: '8px' }}
                                />
                                <a href="/upload/pdf_file.pdf" target="_blank" rel="noopener noreferrer" className="ifont">
                                    {truncateName("document1.pdf", 10)} 
                                </a>
                            </li>
                            <li>
                                <img 
                                    src={renderIcon('ppt')} 
                                    alt="PPT Icon" 
                                    data-bs-toggle="tooltip" 
                                    title="presentation1.ppt" style={{ width: '29px', height: 'auto', marginRight: '8px' }}
                                />
                                <a href="/upload/ppt_file.pptx" target="_blank" rel="noopener noreferrer" className="ifont">
                                    {truncateName("presentation1.ppt", 10)} 
                                </a>
                            </li>
                            <li>
                                <img 
                                    src={renderIcon('word')} 
                                    alt="Word Icon" 
                                    data-bs-toggle="tooltip" 
                                    title="report.docx" style={{ width: '29px', height: 'auto', marginRight: '8px' }}
                                />
                                <a href="/upload/word_file.docx" target="_blank" rel="noopener noreferrer" className="ifont">
                                    {truncateName("report.docx", 10)} 
                                </a>
                            </li>
                            <li>
                                <img 
                                    src={renderIcon('png')} 
                                    alt="PNG Icon" 
                                    data-bs-toggle="tooltip" 
                                    title="image1.png" style={{ width: '29px', height: 'auto', marginRight: '8px' }}
                                />
                                <a href="/upload/image1.png" target="_blank" rel="noopener noreferrer" className="ifont">
                                    {truncateName("image1.png", 10)} 
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnvFiles;





// import React, { useEffect, useState } from "react";
// import {manageFiles} from "../../../../../services/CommonService";

// const EnvFiles = () => {
//     const [folders, setFolders] = useState({});
//     const [activeFolder, setActiveFolder] = useState(null);
//     const [loading, setLoading] = useState(true);  // State to handle loading
//     const [error, setError] = useState(null);      // State to handle errors

//     useEffect(() => {
//         const loadFolders = async () => {
//             try {
//                 setLoading(true);  // Start loading
//                 const response = await manageFiles();  // API call without data payload
//                 setFolders(response.data.data);  // Setting the folder data dynamically
//             } catch (err) {
//                 console.error("Error fetching folder data: ", err);
//                 setError("Failed to load data. Please try again later.");
//             } finally {
//                 setLoading(false);  // End loading
//             }
//         };

//         loadFolders();  // Call the function on component mount
//     }, []);

//     const handleFolderClick = (folderName) => {
//         setActiveFolder(folderName);
//     };

//     const handleBackClick = () => {
//         setActiveFolder(null);
//     };

//     return (
//         <div className="tab-pane fade" id="EnvFiles" role="tabpanel" aria-labelledby="EnvFiles-tab">
//             <style>
//                 {`
//                 .folders-container {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: flex-start;
//                 }
//                 .folder {
//                     padding: 5px;
//                     width: 150px;
//                     text-align: center;
//                     cursor: pointer;
//                     transition: background-color 0.3s;
//                     margin: 5px;
//                     border: 1px solid #ddd;
//                     border-radius: 5px;
//                 }
//                 .folder:hover {
//                     background-color: #f0f0f0;
//                 }
//                 .folder-icon {
//                     width: 50px;
//                     height: auto;
//                     margin-bottom: 5px;
//                 }
//                 .files-list ul {
//                     list-style-type: none;
//                     padding: 0;
//                 }
//                 .files-list li {
//                     padding: 5px;
//                     border-bottom: 1px solid #eee;
//                     display: flex;
//                     align-items: center;
//                 }
//                 .files-list li img {
//                     width: 20px;
//                     height: auto;
//                     margin-right: 10px;
//                 }
//                 h3 {
//                     font-size: 14px;
//                     margin: 0;
//                 }
//                 .back-button {
//                     margin-bottom: 15px;
//                     cursor: pointer;
//                     display: flex;
//                     align-items: center;
//                 }
//                 .back-button img {
//                     width: 20px;
//                     height: auto;
//                     margin-right: 8px;
//                 }
//                 `}
//             </style>

//             <h2 className="main_title mb-4">Users Documents</h2>

//             {loading ? (
//                 <p>Loading...</p> 
//             ) : error ? (
//                 <p>{error}</p>
//             ) : activeFolder === null ? (
//                 Object.keys(folders).length === 0 ? (
//                     <p>No files uploaded.</p>
//                 ) : (
//                     <div className="folders-container">
//                         {Object.entries(folders).map(([folderName]) => (
//                             <div className="folder" key={folderName} onClick={() => handleFolderClick(folderName)}>
//                                 <img src="/images/folder.png" alt="Folder Icon" className="folder-icon" />
//                                 <h3>{folderName}</h3>
//                             </div>
//                         ))}
//                     </div>
//                 )
//             ) : (
//                 <div className="files-list">
//                     <div className="back-button" onClick={handleBackClick}>
//                         <img src="/images/back-button1.png" alt="Back" />
//                         <span>Back</span>
//                     </div><br></br>
//                     <h5>{activeFolder}'s Documents</h5><br></br>
//                     <ul>
//                         {folders[activeFolder].map((file) => (
//                             <li key={file.id} style={{ display: 'flex', alignItems: 'center' }}>
//                                 <img src="/images/pdf.png" alt="PDF Icon" style={{ width: '25px', height: 'auto', marginRight: '8px' }} />
//                                 {file.name} (Date: {file.uploadDate})
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EnvFiles;
