import GraphicalMenuItem from './graphical-menu-item';

export default class VerticalMenu {
    constructor() {
        console.log('in vert menu constructor:', window.location);

        //this becomes data from db.  get it using a promise?  then map it below
        const testData = [
            {order: 1, title: "item 1"},
            {order: 2, title: "item 2"},
            {order: 3, title: "item 3"},
            {order: 4, title: "item 4"}
        ];

        this.menuItemArray = testData.map(item => {
            return GraphicalMenuItem(item);
        });
    }

    returnMenu() {
        return this.menuItemArray;
    }
}