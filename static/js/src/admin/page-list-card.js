import React from 'react';

export const PageListCard = (props) => {
    console.log('page list card:', props);
    return (
        <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="pagelist-inner">
                <h3>{props.data.title}</h3>
                <div class="pagelist-main">
                    Page desc of some kind?
                </div>
                <div class="pagelist-links">
                    <a onClick={() => props.openModal(props.data)}>Edit Page Basics</a>
                    <a>Edit Page Basics</a>
                    <a href="pages/{props.data.page_id}">Edit Page Content</a>
                </div>
            </div>
        </div>
    );
}