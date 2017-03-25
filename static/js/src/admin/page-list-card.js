import React from 'react';

const PageListCard = (props) => {
    return (
        <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="pagelist-inner">
                <h3>{props.data.title}</h3>
                <div className="pagelist-main">
                    Page desc of some kind?
                </div>
                <div className="pagelist-links">
                    <a onClick={() => props.openModal(props.data)}>Edit Page Basics</a>
                    <a href={"pages/" + props.data.page_id}>Edit Page Content</a>
                </div>
            </div>
        </div>
    );
}

export default PageListCard;