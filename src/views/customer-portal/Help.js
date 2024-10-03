import React, {useEffect, useState} from "react";
import {getFaqList} from "../../services/CommonService";

const Help = () => {
    const [youtube, setYoutube] = useState('');
    const [faqList, setFaqList] = useState([]);
    useEffect(() => {
        getFaqList().then((response) => {
            setYoutube(response.data.youtube);
            setFaqList(response.data.faqs);
        });
    }, []);

    return (
        <div className="tab-pane fade Faq_tab p-4" id="help" role="tabpanel" aria-labelledby="help-tab">
            {youtube &&
            <iframe width="100%" height={380} src={youtube} style={{borderRadius: 12, marginBottom: 20}}
                    title="..."/>
            }
            <h2 className="main_title ">FAQ</h2>
            <div className="accordion" id="accordionHelp">
                {faqList && faqList.map((item, index) => (
                    <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`help${index}`}>
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target={`#help${index}Message`} aria-expanded="true"
                                    aria-controls={`help${index}Message`}>
                                {item.question}
                            </button>
                        </h2>
                        <div id={`help${index}Message`} className="accordion-collapse collapse"
                             aria-labelledby={`help${index}`} data-bs-parent="#accordionHelp">
                            <div className="accordion-body  chat_box">{item.answer}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;
