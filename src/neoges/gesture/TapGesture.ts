/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**点一下*/
    export class TapGesture extends neoges.AbstractGesture
    {
        public static TAP_DISTANCE:number = 20;

        private isBegan:boolean = false;
        private callID:number;
        private _startPoint:lark.Point;
        private _endPoint:lark.Point;
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
                this.gestureBegan();
                this.isBegan = true;
                this._startPoint = new lark.Point(evt.stageX,evt.stageY);
                clearTimeout(this.callID);
                this.callID = setTimeout(() => this.checkTimeHandler(),500);
            }
            else if(evt.type == lark.TouchEvent.TOUCH_END && this.isBegan) {
                //判断一下释放点和起始点的距离
                clearTimeout(this.callID);
                this._endPoint = new lark.Point(evt.stageX,evt.stageY);
                var distance:number = lark.Point.distance(this._startPoint,this._endPoint);
                if(distance<neoges.TapGesture.TAP_DISTANCE && this._stats==1)
                    this.gestureEnded();
                else
                    this.gestureFailed();
            }
        }
        /**检测超时*/
        private checkTimeHandler():void {
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}