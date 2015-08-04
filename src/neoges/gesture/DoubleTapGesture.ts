/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**双击*/
    export class DoubleTapGesture extends neoges.AbstractGesture
    {
        private touchCount:number = 0;
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
                if(!this.isBegan) {
                    this.touchCount = 0;
                    this.isBegan = true;
                    this.gestureBegan();
                    clearTimeout(this.callID);
                    this.callID = setTimeout(() => this.checkDoubleTapHandler(),500);
                }
            }
            else if(evt.type == lark.TouchEvent.TOUCH_END && this.isBegan) {
                this.touchCount++;
                if(this.touchCount >= 2) {
                    this.gestureEnded();
                }
            }
        }
        /**手势结束*/
        public gestureEnded():void {
            clearTimeout(this.callID);
            this.touchCount = 0;
            this.isBegan = false;
            super.gestureEnded();
        }
        /**检测超时*/
        private checkDoubleTapHandler():void {
            this.touchCount = 0;
            this.isBegan = false;
            this.gestureFailed();
        }
    }
}