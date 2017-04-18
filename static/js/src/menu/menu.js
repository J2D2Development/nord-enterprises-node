import React from 'react';

const MainMenu = (props) => {
    console.log('menu props:', props);
    return (
        <div className="row menu-row" id="top-menu">
            <div className="container-fluid">
                <nav className="navbar navbar-default">
                    <div className="container-fluid header-flex-wrapper">
                        <div style={{display:"none"}} className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>

                        <div className="collapse navbar-collapse" style={{flex:1}} id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li>
                                    <a id="dashboard-link" href="admin">Dashboard</a>
                                    <div id="dashboard-arrow" className="arrow-down"></div>
                                </li>
                                <li>
                                    <a id="general-link" href="general">General</a>
                                    <div id="general-arrow" className="arrow-down"></div>
                                </li>
                                <li>
                                    <a id="users-link" href="users">Users</a>
                                    <div id="users-arrow" className="arrow-down"></div>
                                </li>
                                <li>
                                    <a id="pages-link" href="pages">Pages</a>
                                    <div id="pages-arrow" className="arrow-down"></div>
                                </li>
                                <li>
                                    <a id="features-link" href="features">Features</a>
                                    <div id="features-arrow" className="arrow-down"></div>
                                </li>
                                <li>
                                    <a id="publish-link" href="publish">Publish</a>
                                    <div id="publish-arrow" className="arrow-down"></div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a onClick={props.openSlideout}><i className="fa fa-2x fa-bars"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default MainMenu;