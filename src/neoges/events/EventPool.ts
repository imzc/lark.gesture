/**
 * Created by zc on 15-1-28.
 */
module neoges
{
    /**事件的对象池，避免重复创建对象*/
    export class EventPool
    {
        private _collection:lark.TouchEvent[];

        public constructor() {
            this._collection = [];
        }

        public clone(e:lark.TouchEvent):lark.TouchEvent {
            var evt: lark.TouchEvent = this._collection.pop();
            evt = new lark.TouchEvent(e.type, e.bubbles, e.cancelable, e.stageX, e.stageY, e.touchPointID);
            
            return evt;
        }
        public setProperties(e:lark.TouchEvent,resultEvent:lark.TouchEvent):lark.TouchEvent {
            for (var key in e) {
                resultEvent[key] = e[key];
            }
            return resultEvent;
        }

        public reclaim(e:lark.TouchEvent):void {
            if(this._collection.indexOf(e) != -1)
                return;
            this._collection.push(e);
        }
        public reclaimAll(arr:lark.TouchEvent[]):void {
            while(arr.length > 0) {
                this.reclaim(arr[0]);
                arr.shift();
            }
        }

    }
}