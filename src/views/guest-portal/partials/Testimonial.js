import React from "react";

let reviewList = [
    {
        id: 1,
        message: 'The best thing about software is Interface. It is so simple & easy. really helpful.',
        name: 'Navjot Singh',
        country: 'Australia',
    }, {
        id: 2,
        message: 'This software is fantastic - it is quite intuitive - even for a first time user and priced competitively. will definitely recommend others. Thanks.',
        name: 'Ross Gilbert',
        country: 'Canada',
    }, {
        id: 3,
        message: 'The best part is Template. Create Template once and send envelope to anyone in just 1 minute. Really game changer.',
        name: 'Zhen Wang',
        country: 'Australia',
    }, {
        id: 4,
        message: 'We tried many other software, it was too pricy and never worked properly. DocuTick is so easy & convenient!',
        name: 'Ken Smith',
        country: 'Australia',
    }, {
        id: 5,
        message: 'We were using email for collecting documents, hardly anyone send documents. With DocuTick we are getting documents very fast. Auto Reminder doing everything for us!!',
        name: 'Shane White',
        country: 'USA',
    }
];

function Testimonial() {
    return (
        <>
            <div className="mb-5  counter-main-box gradient-bg-div">
                <div className="custom_container">
                    <div className="row ">
                        <div className="col-lg-4 py-4 py-lg-0">
                            <div className="text-center text-lg-start">
                                <h2 className="text-dark">We are proud of our service</h2>
                                <p className="text-dark">We bring solutions to make life easier for our customers</p>
                            </div>
                        </div>
                        <div className="col-lg-8 py-4 py-lg-0">
                            <div className="row">
                                <div className=" col-sm-4">
                                    <div className="count-box my-3 my-sm-0 ">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div
                                                className=" bg-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{height: '90px', width: '90px'}}>
                                                <img src="/images/product-count-3.svg" alt="..."/>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div>
                                                <h2 className="text-dark counter-count">Thousand </h2>
                                            </div>
                                            <div>
                                                <h2 className="text-dark">+</h2>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-dark">Happy Customers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-sm-4">
                                    <div className="count-box my-3 my-sm-0">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div
                                                className=" bg-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{height: '90px', width: '90px'}}>
                                                <img src="images/product-count-2.svg" alt="..."/>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center ">
                                            <div>
                                                <h2 className="text-dark counter-count">500</h2>
                                            </div>
                                            <div>
                                                <h2 className="text-dark">k</h2>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-dark">Documents Handled</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-sm-4">
                                    <div className="count-box my-3 my-sm-0">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div
                                                className=" bg-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{height: '90px', width: '90px'}}>
                                                <img src="/images/product-count-1.svg" alt="..."/>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center ">
                                            <div>
                                                <h2 className="text-dark counter-count">99</h2>
                                            </div>
                                            <div>
                                                <h2 className="text-dark">%</h2>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-dark">Cost Effective</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="custom_container " style={{marginTop: '-150px'}}>
                <div className="product-service-slider row py-4">
                    {reviewList && reviewList.map((item, index) =>
                        <div key={index} className="col-md-12 mx-2 my-1">
                            <div className="rounded-4 p-4 bg-white" style={{boxShadow: '0px 0px 3px #d0d0d0'}}>
                                <div className="mb-4">
                                    <img src="/images/quotation.svg" alt="..."/>
                                </div>
                                <p className="text-dark mb-4">{item.message}</p>
                                <p className="mb-3"><b className="text-dark">{item.name},</b> {item.country}</p>
                                <div className="product">
                                    <span className="fa fa-star checked-star"/>
                                    <span className="fa fa-star checked-star"/>
                                    <span className="fa fa-star checked-star"/>
                                    <span className="fa fa-star checked-star"/>
                                    <span className="fa fa-star checked-star"/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Testimonial;