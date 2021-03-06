/**
* DevExtreme (ui/draggable.d.ts)
* Version: 19.2.4
* Build date: Tue Nov 19 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxDraggable(): JQuery;
    dxDraggable(options: "instance"): DevExpress.ui.dxDraggable;
    dxDraggable(options: string): any;
    dxDraggable(options: string, ...params: any[]): any;
    dxDraggable(options: DevExpress.ui.dxDraggableOptions): JQuery;
}
}
export default DevExpress.ui.dxDraggable;
export type Options = DevExpress.ui.dxDraggableOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxDraggableOptions;