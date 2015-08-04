/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**变换(缩放+旋转)手势
     **/
    export class TransformGesture extends neoges.AbstractGesture
    {
        public slop:number = Math.round(20 / 252 * 240);
        private _transformVector:lark.Point;
        private _offsetX:number = 0;
        private _offsetY:number = 0;
        private _rotation:number = 0;
        private _scale:number = 1;
        private distance:number = 0;
        private startScale:number = 1;

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
            var pR:lark.Point;
            var dy:number;
            var dx:number;
            if(evt2.type == lark.TouchEvent.TOUCH_BEGIN){
                this.gestureBegan();
                this._transformVector = this.subtract(p2,p1);
                this.updateLocation(p1,p2);
                this.distance = lark.Point.distance(p2,p1);
                this.startScale = this.target.scaleX;
            }
            else if(evt1.type == lark.TouchEvent.TOUCH_MOVE || evt2.type == lark.TouchEvent.TOUCH_MOVE) {
                var prevLocation:lark.Point = this._location.clone();
                this.updateLocation(p1,p2);
                var currTransformVector:lark.Point;
                currTransformVector = this.subtract(p2,p1);
                this._offsetX = this._location.x - prevLocation.x;
                this._offsetY = this._location.y - prevLocation.y;
                this._rotation = Math.atan2(currTransformVector.y, currTransformVector.x) - Math.atan2(this._transformVector.y, this._transformVector.x);
                //this._scale = this.getPointLength(currTransformVector) / this.getPointLength(this._transformVector);
                var currentDistance:number = lark.Point.distance(p2,p1);
                this._scale = this.startScale*(currentDistance/this.distance);
                this._transformVector = this.subtract(p2,p1);
                this.gestureUpdate();
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
            evt.rotation = this._rotation;
            evt.scale = this._scale;
            evt.offsetX = this._offsetX;
            evt.offsetY = this._offsetY;
            evt.host = this.target;
            this.emit(evt);
        }
        /**计算中心点*/
        private updateLocation(p1:lark.Point,p2:lark.Point):void {
            var p:lark.Point = new lark.Point();
            p.x = (p1.x+p2.x)/2;
            p.y = (p1.y+p2.y)/2;
            this._location = p;
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