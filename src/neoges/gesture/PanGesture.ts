/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**拖动*/
    export class PanGesture extends neoges.AbstractGesture
    {
        private _startPoint:lark.Point;
        private _endPoint:lark.Point;
        /**构造方法*/
        public constructor(host:lark.DisplayObject=null) {
            super(host);
            this._useMultiPoints = false;
        }
        /**收到事件*/
        public onTouch(eventCollection:lark.TouchEvent[]):void {
            if(eventCollection.length>1 || neoges.GestureManager.simulateMultitouch)
                return;
            var evt:lark.TouchEvent = eventCollection[0];
            if(evt.type == lark.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this._startPoint = new lark.Point(evt.stageX,evt.stageY);
            }
            else if(evt.type == lark.TouchEvent.TOUCH_MOVE) {
                this._endPoint = new lark.Point(evt.stageX,evt.stageY);
                this.gestureUpdate();
            }
            else if(evt.type == lark.TouchEvent.TOUCH_END) {
                this.gestureEnded();
            }
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.host = this.target;
            evt.offsetX = this._endPoint.x-this._startPoint.x;
            evt.offsetY = this._endPoint.y - this._startPoint.y;
            this.emit(evt);
        }
    }
}