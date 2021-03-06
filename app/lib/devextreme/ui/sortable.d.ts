/**
* DevExtreme (ui/sortable.d.ts)
* Version: 19.2.4
* Build date: Tue Nov 19 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxSortable(): JQuery;
    dxSortable(options: "instance"): DevExpress.ui.dxSortable;
    dxSortable(options: string): any;
    dxSortable(options: string, ...params: any[]): any;
    dxSortable(options: DevExpress.ui.dxSortableOptions): JQuery;
}
}
export default DevExpress.ui.dxSortable;
export type Options = DevExpress.ui.dxSortableOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxSortableOptions;