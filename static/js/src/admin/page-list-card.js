import React from 'react';
import moment from 'moment';

const PageListCard = (props) => {
    return (
        <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="pagelist-inner">
                <h3>
                    {props.data.title}
                    <em><small>
                        {props.data.home_page === 'y' ? '  [Homepage]' : ''}
                    </small></em>
                </h3>
                <div className="pagelist-main">
                    <div className="pagelist-main_row">
                        <div>Require Password</div>
                        <div>
                            <i className={"fa " + (props.data.require_auth === 'y' ? 'fa-check' : 'fa-ban')} aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="pagelist-main_row">
                        <div>Page Admin</div>
                        <div>
                            {(props.data.admin_user && props.data.admin_user !== '0') ? props.data.admin_user : 'None Assigned'}
                        </div>
                    </div>
                    <div className="pagelist-main_row">
                        <div>Include Table of Contents</div>
                        <div>
                            <i className={"fa " + (props.data.incl_toc === 'y' ? 'fa-check' : 'fa-ban')} aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="pagelist-main_row">
                        <div>Last Updated By </div>
                        <div>{props.data.updt_user}</div>
                    </div>
                    <div className="pagelist-main_row">
                        <div>Last Updated On</div>
                        <div>{moment(props.data.updt_dttm).format('MMMM Do YYYY')}</div>
                    </div>
                </div>
                <div className="pagelist-links">
                    <a className="btn btn-primary btn-sm" onClick={() => props.openModal('edit', props.data)}>
                        Edit Basics
                    </a>
                    <a className="btn btn-primary btn-sm" href={"pages/" + props.data.page_id}>
                        Edit Content
                    </a>
                </div>
            </div>
        </div>
    );
}

export default PageListCard;