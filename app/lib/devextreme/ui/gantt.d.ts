/**
* DevExtreme (ui/gantt.d.ts)
* Version: 19.2.4
* Build date: Tue Nov 19 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxGantt(): JQuery;
    dxGantt(options: "instance"): DevExpress.ui.dxGantt;
    dxGantt(options: string): any;
    dxGantt(options: string, ...params: any[]): any;
    dxGantt(options: DevExpress.ui.dxGanttOptions): JQuery;
}
}
export default DevExpress.ui.dxGantt;
export type Options = DevExpress.ui.dxGanttOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxGanttOptions;