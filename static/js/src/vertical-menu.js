import React, { Component } from 'react';
import GraphicalMenuItem from './graphical-menu-item';

export default class VerticalMenu extends Component {
    render() {
        const testData = [
            {order: 1, title: "item 1"},
            {order: 2, title: "item 2"},
            {order: 3, title: "item 3"}
        ];

        const menuItems = testData
            .map(item => {
                return <GraphicalMenuItem key={item.order}
                    title={item.title}
                />
            });
        return(
            <div>{menuItems}</div>
        )
    }
}