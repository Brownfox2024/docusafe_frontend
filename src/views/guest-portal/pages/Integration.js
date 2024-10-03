import React from "react";
import {Lang} from "../../../lang";

let integrationList = [
    {
        id: 1,
        name: 'One Drive',
        detail: 'Collect Document in DocuTick and Automatically send your documents to OneDrive.',
        image: 'one-drive.png'
    }, /*{
        id: 2,
        name: 'Share Point',
        detail: 'Collect Document in DocuTick and Automatically send your documents to Share Point.',
        image: 'sharepoint.png'
    }, */{
        id: 3,
        name: 'Google Drive',
        detail: 'Collect Document in DocuTick and Automatically send your documents to Google Drive.',
        image: 'google-drive.png'
    }, {
        id: 4,
        name: 'DropBox',
        detail: 'Collect Document in DocuTick and Automatically send your documents to DropBox.',
        image: 'drop-box.png'
    }, {
        id: 5,
        name: 'Box',
        detail: 'Collect Document in DocuTick and Automatically send your documents to Box.',
        image: 'box.png'
    }/*, {
        id: 6,
        name: 'DocuSign',
        detail: 'Collect Document in DocuTick and Automatically send your documents to DocuSign.',
        image: 'docusign.png'
    }*/
];

function Integration() {

    document.title = Lang.integration_title;
    document.getElementsByTagName("META")[4].content = Lang.integration_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.integration_meta_keyword;

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-dark text-center mb-3">Integration</h1>
                <p className="text-dark text-center">Simplify and automate processes by using DocuTick Integrations.
                    Easily export Documents from DocuTick to other providers.</p>
            </div>
            <div className=" custom_container_portal py-5 px-3">
                <div className="row integration_body">
                    {integrationList.map((item, index) =>
                        <div key={index} className="col-lg-4">
                            <div className="card ">
                                <div className="card-body">
                                    <div className="img_box">
                                        <img src={`/images/integration/${item.image}`} alt={item.name}/>
                                    </div>
                                    <h5 className="text-dark mb-3">{item.name}</h5>
                                    <p>{item.detail}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Integration;