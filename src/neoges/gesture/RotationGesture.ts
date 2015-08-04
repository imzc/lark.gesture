/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**旋转手势
     * TODO:目前实现的很简陋，并非真正的两点判断，算法还需要继续优化
     **/
    export class RotationGesture extends neoges.AbstractGesture
    {
        private _transformVector:lark.Point;
        private _rotationStart:number = 0;
        private _rotation:number = 0;

        /**构造方法*/
        public constructor(host:lark.DisplayObject=null) {
            super(host);
            this._useMultiPoints = true;
        }
        /**收到事件*/
        public onTouch(eventCollection:lark.TouchEvent[]):void {
            var ec:lark.TouchEvent[] = eventCollection;
            var evt1:lark.TouchEvent;
            var evt2:lark.TouchEvent;
            if(neoges.GestureManager.simulateMultitouch) {
                evt1 = eventCollection[0];
                evt2 = this.reverseEvent(evt1);
                neoges.GestureManager.simulatePoints = [evt2];
                ec = [evt1,evt2];
            }
            if(ec.length<2)
                return;
            evt1 = ec[0];
            evt2 = ec[1];
            var p1:lark.Point = new lark.Point(evt1.stageX,evt1.stageY);
            var p2:lark.Point = new lark.Point(evt2.stageX,evt2.stageY);
            var dy:number;
            var dx:number;
            if(evt2.type == lark.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this._transformVector = this.getCenterPoint(p1,p2);
                dy = p2.x - this._transformVector.x;
                dx = p2.y - this._transformVector.y;
                this._rotationStart = Math.atan2(dy, dx) * 180 / Math.PI;
            }
            else if(evt1.type == lark.TouchEvent.TOUCH_MOVE || evt2.type == lark.TouchEvent.TOUCH_MOVE) {
                if(this._stats != -1) {
                    dy = p2.x - this._transformVector.x;
                    dx = p2.y - this._transformVector.y;
                    this._rotation = this._rotationStart-Math.atan2(dy, dx) * 180 / Math.PI;
                    this.gestureUpdate();
                }
            }
            else if(evt1.type == lark.TouchEvent.TOUCH_END || evt2.type == lark.TouchEvent.TOUCH_END) {
                neoges.GestureManager.simulatePoints = [];
                this.gestureEnded();
            }
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this._rotation;
            evt.host = this.target;
            this.emit(evt);
        }
        /**实现Flash中Point的subtract方法*/
        private getCenterPoint(p1:lark.Point,p2:lark.Point):lark.Point {
            var p:lark.Point = new lark.Point();
            p.x = p1.x+(p2.x-p1.x)/2;
            p.y = p1.y+(p2.y-p1.y)/2;
            return p;
        }
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1: lark.TouchEvent): lark.TouchEvent {
            var globalX: number = evt1.stageX;
            var globalY: number = evt1.stageY;
            var t: lark.DisplayObject = this.target;
            var op: lark.Point = t.localToGlobal(0, 0);
            var dix: number = globalX - op.x;
            var diy: number = globalY - op.y;
            var tp: lark.Point = new lark.Point(op.x - dix, op.y - diy);
            var evt2: lark.TouchEvent = new lark.TouchEvent(evt1.type, evt1.bubbles, evt1.cancelable, tp.x, tp.y);
            return evt2;
        }
    }
}