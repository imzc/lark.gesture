/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**手势的接口*/
    export interface IGesture extends lark.IEventEmitter
    {
        /**手势监听的显示对象*/
        target:lark.DisplayObject;
        /**手势是否需要多点判断*/
        _useMultiPoints:boolean;
        /**状态*/
        _stats:number;
        /**释放*/
        dispose():void;
        /**收到事件*/
        onTouch(ts:lark.TouchEvent[]):void;
        /**手势开始*/
        gestureBegan():void;
        /**触点更新*/
        gestureUpdate():void;
        /**手势结束*/
        gestureEnded():void;
        /**手势失败*/
        gestureFailed():void;
    }
    /**手势的抽象类*/
    export class AbstractGesture extends lark.EventEmitter implements neoges.IGesture
    {
        /**手势监听的显示对象*/
        private _target:lark.DisplayObject;
        /**手势是否需要多点判断*/
        public _useMultiPoints:boolean = false;
        /**状态,1代表手势开始,2代表手势更新,3代表手势结束*/
        public _stats:number = -1;
        /**getter and setter*/
        public get target():lark.DisplayObject {
            return this._target;
        }
        public set target(value:lark.DisplayObject) {
            if(this._target==value)
                return;
            this._stats = -1;
            if(this._target != null)
                this.removeHostFromManager();
            this._target = value;
            if(this._target != null)
                this.addHostToManager();
        }
        /**位置*/
        public _location:lark.Point = new lark.Point();
        public get location():lark.Point {
            return this._location.clone();
        }
        /**构造方法*/
        public constructor(target:lark.DisplayObject=null) {
            super();
            this._target = target;
            if(this._target != null)
                this.addHostToManager();
        }
        /**通知Manager来管理这个显示对象*/
        private addHostToManager():void {
            neoges.GestureManager.addHost(this);
        }
        /**通知Manager删除这个显示对象*/
        private removeHostFromManager():void {
            neoges.GestureManager.removeHost(this);
        }
        /**收到事件*/
        public onTouch(eventCollection:lark.TouchEvent[]):void {
            //console.log(eventCollection);
            //override by subclasses
        }
        /**手势开始*/
        public gestureBegan():void {
            this._stats = 1;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.BEGAN);
            evt.host = this._target;
            this.emit(evt);
        }
        /**触点更新*/
        public gestureUpdate():void {
            this._stats = 2;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.UPDATE);
            evt.host = this._target;
            this.emit(evt);
        }
        /**手势结束*/
        public gestureEnded():void {
            this._stats = 3;
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.ENDED);
            evt.host = this._target;
            this.emit(evt);
            this._stats = -1;
        }
        /**手势失败*/
        public gestureFailed():void {
            var evt:neoges.GestureEvent = new neoges.GestureEvent(neoges.GestureEvent.FAILED);
            evt.host = this._target;
            this.emit(evt);
            this._stats = -1;
        }
        /**实现Flash中Point的subtract方法*/
        public subtract(p1:lark.Point,p2:lark.Point):lark.Point {
            var p:lark.Point = new lark.Point();
            p.x = p1.x-p2.x;
            p.y = p1.y-p2.y;
            return p;
        }
        /**实现Flash中Point的length*/
        public getPointLength(p:lark.Point):number {
            var len:number = 0;
            var p0:lark.Point = new lark.Point(0,0);
            len = lark.Point.distance(p,p0);
            return len;
        }
        /**释放*/
        public dispose():void {
            this._stats = -1;
            neoges.GestureManager.removeHost(this);
            this._target = null;
        }
    }
}