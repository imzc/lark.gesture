/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**横扫*/
    export class SwipeGesture extends neoges.AbstractGesture
    {
        public static SWIPE_DISTANCE:number = 200;

        private isBegan:boolean = false;
        private callID:number;
        private _startPoint:lark.Point;
        private _endPoint:lark.Point;
        private disX:number;
        private disY:number;
        /**构造方法*/
        public constructor(host:lark.DisplayObject=null) {
            super(host);
            this._useMultiPoints = false;
        }
        /**收到事件*/
        public onTouch(eventCollection:lark.TouchEvent[]):void {
            if(eventCollection.length>1)
                return;
            var evt:lark.TouchEvent = eventCollection[0];
            if(evt.type == lark.TouchEvent.TOUCH_BEGIN){
                this.isBegan = true;
                this.gestureBegan();
                this._startPoint = new lark.Point(evt.stageX,evt.stageY);
                clearTimeout(this.callID);
                this.callID = setTimeout(() => this.checkSwipeHandler(),500);
            }
            else if(evt.type == lark.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                this._endPoint = new lark.Point(evt.stageX,evt.stageY);
                this.disX = Math.abs(this._endPoint.x-this._startPoint.x);
                this.disY = Math.abs(this._endPoint.y-this._startPoint.y);
                if((this.disX>neoges.SwipeGesture.SWIPE_DISTANCE || this.disY>neoges.SwipeGesture.SWIPE_DISTANCE) && this._stats==1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        }
        /**触点更新*/
        public gestureEnded():void {
            this._stats = 3;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.ENDED);
            var directX:number = 0;
            var directY:number = 0;
            if(this.disX>neoges.SwipeGesture.SWIPE_DISTANCE) {
                directX = this._endPoint.x>this._startPoint.x?1:-1;
            }
            if(this.disY>neoges.SwipeGesture.SWIPE_DISTANCE) {
                directY = this._endPoint.y>this._startPoint.y?1:-1;
            }
            evt.offsetX = directX;
            evt.offsetY = directY;
            evt.host = this.target;
            this.emit(evt);
            this._stats = -1;
        }
        /**检测超时*/
        private checkSwipeHandler():void {
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}