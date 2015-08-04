/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**长按*/
    export class LongPressGesture extends neoges.AbstractGesture
    {
        private isBegan:boolean = false;
        private callID:number;
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
            if(evt.type == lark.TouchEvent.TOUCH_BEGIN) {
                this.isBegan = true;
                this.gestureBegan();
                clearTimeout(this.callID);
                this.callID = setTimeout(() => this.checkTimeHandler(),2000);
            }
            else if(evt.type == lark.TouchEvent.TOUCH_END && this.isBegan) {
                clearTimeout(this.callID);
                this.isBegan = false;
                this.gestureFailed();
            }
        }
        /**手势结束*/
        public gestureEnded():void {
            clearTimeout(this.callID);
            this.isBegan = false;
            super.gestureEnded();
        }
        /**检测超时*/
        private checkTimeHandler():void {
            this.gestureEnded();
        }
    }
}