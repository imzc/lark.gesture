/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**缩放手势*/
    export class PinchGesture extends neoges.AbstractGesture
    {
        private startLen:number = 0;
        private currentLen:number = 0;

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
            if(ec.length<2) {
                return;
            }
            evt1 = ec[0];
            evt2 = ec[1];
            if(evt2.type == lark.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this.startLen = lark.Point.distance(new lark.Point(evt1.stageX,evt1.stageY),new lark.Point(evt2.stageX,evt2.stageY));
            }
            else if(evt1.type == lark.TouchEvent.TOUCH_END || evt2.type == lark.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
            else if(evt1.type == lark.TouchEvent.TOUCH_MOVE || evt2.type == lark.TouchEvent.TOUCH_MOVE) {
                this.currentLen = lark.Point.distance(new lark.Point(evt1.stageX,evt1.stageY),new lark.Point(evt2.stageX,evt2.stageY));
                this.gestureUpdate();
            }
        }
        /**触点更新*/
        public gestureEnded():void {
            neoges.GestureManager.simulatePoints = [];
            super.gestureEnded();
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.value = this.currentLen/this.startLen;
            evt.host = this.target;
            this.emit(evt);
        }
        /**获取一个事件的映像副本(for test)*/
        private reverseEvent(evt1: lark.TouchEvent): lark.TouchEvent {
            var globalX:number = evt1.stageX;
            var globalY:number = evt1.stageY;
            var t:lark.DisplayObject = this.target;
            var op: lark.Point = t.localToGlobal(0, 0);
            var dix:number = globalX-op.x;
            var diy:number = globalY-op.y;
            var tp: lark.Point = new lark.Point(op.x - dix, op.y - diy);
            var evt2: lark.TouchEvent = new lark.TouchEvent(evt1.type, evt1.bubbles, evt1.cancelable, tp.x, tp.y);
            return evt2;
        }
    }
}