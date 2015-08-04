/**
 * Created by zc on 15-08-04.
 */
module neoges
{
    /**手势管理*/
    export class GestureManager
    {
        /*--------------setting-----------------------*/
        /**是否用圆形显示触碰的点(用于测试)*/
        public static showTouchPoint:boolean = false;
        /**是否开启模拟的多点(用于测试)*/
        public static simulateMultitouch:boolean = false;
        /**PC上模拟的点加到这里进行显示*/
        public static simulatePoints: lark.TouchEvent[] = [];


        /**用数组存放N个手势实例*/
        private static hostCollection:neoges.AbstractGesture[] = [];
        /**事件字典,每一个显示对象对应一个数组存储事件*/
        private static eventDict:Object = {};
        /**事件池*/
        private static evtPool:neoges.EventPool = new neoges.EventPool();
        /**用于辅助显示*/
        private static drawLayer: lark.Shape = new lark.Shape();
        /**private*/
        private static currentTouchObject:lark.DisplayObject;
        /**添加一个手势实例*/
        public static addHost(value:neoges.AbstractGesture):void {
            var hc:neoges.AbstractGesture[] = neoges.GestureManager.hostCollection;
            if(hc.indexOf(value) != -1) {
                console.warn("不要重复添加手势实例");
                return;
            }
            neoges.GestureManager.registerEvent(value.target);
            hc.push(value);
            neoges.GestureManager.eventDict[value.target.hashCode] = [];
        }
        /**删除一个手势实例*/
        public static removeHost(value:neoges.AbstractGesture):void {
            var hc:neoges.AbstractGesture[] = neoges.GestureManager.hostCollection;
            var index:number = hc.indexOf(value);
            if(index == -1) {
                console.warn("不存在这个实例");
                return;
            }
            hc.slice(index,1);
            neoges.GestureManager.removeEvent(value.target);
            neoges.GestureManager.eventDict[value.target.hashCode] = null;
        }
        /**注册事件侦听*/
        private static registerEvent(value:lark.DisplayObject):void {
            var hc: neoges.AbstractGesture[] = neoges.GestureManager.hostCollection;
            value.on(lark.TouchEvent.TOUCH_BEGIN, neoges.GestureManager.touchedHandler, value);
        }
        /**删除事件侦听*/
        private static removeEvent(value:lark.DisplayObject):void {
            var hc:neoges.AbstractGesture[] = neoges.GestureManager.hostCollection;
            value.removeListener(lark.TouchEvent.TOUCH_BEGIN, neoges.GestureManager.touchedHandler, value);
        }
        /**事件处理*/
        private static touchedHandler(e:lark.TouchEvent):void {
            //console.log(e.type,e.currentTarget);
            //判断事件类型
            var target: lark.DisplayObject;
            var stage: lark.Stage;
            if(e.type == lark.TouchEvent.TOUCH_BEGIN) {
                target = e.currentTarget;
                stage = target.stage;
                neoges.GestureManager.currentTouchObject = target;
                stage.removeListener(lark.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
                stage.on(lark.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
                stage.removeListener(lark.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
                stage.on(lark.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
            } else {
                target = neoges.GestureManager.currentTouchObject;
            }
            if(neoges.GestureManager.eventDict[target.hashCode] == null) {
                neoges.GestureManager.eventDict[target.hashCode] = [];
            }
            //判断事件对象，如果是多点，则数组的长度大于1
            var ec:lark.TouchEvent[] = neoges.GestureManager.eventDict[target.hashCode];
            var currentEvent:lark.TouchEvent;
            var evtIndex:number = -1;
            if(!neoges.GestureManager.hasTouchEvent(e)) {
                currentEvent = neoges.GestureManager.evtPool.clone(e);
                ec.push(currentEvent);
            } else {
                currentEvent = neoges.GestureManager.getTouchEventByID(e.touchPointID,target);
                neoges.GestureManager.evtPool.setProperties(e,currentEvent);
            }
            //通知手势对象
            var hc:neoges.AbstractGesture[] = neoges.GestureManager.hostCollection;
            var ges:neoges.AbstractGesture;
            for (var i = 0; i < hc.length; i++) {
                ges = hc[i];
                if(ges.target==target)
                    ges.onTouch(ec);
            }
            //清理已经结束的事件
            if (currentEvent.type == lark.TouchEvent.TOUCH_END) {
                neoges.GestureManager.removeAllEvent(currentEvent.target.stage);
            }
            //画圈
            if (neoges.GestureManager.showTouchPoint) {
                neoges.GestureManager.drawTouchPoint(currentEvent.target.stage);
            }
        }
        /**根据TOUCH ID判断是不是已经存在了这个触碰对象*/
        private static hasTouchEvent(e:lark.TouchEvent):boolean {
            var target:lark.DisplayObject = neoges.GestureManager.currentTouchObject;
            var ec:lark.TouchEvent[] = neoges.GestureManager.eventDict[target.hashCode];
            for (var index = 0; index < ec.length; index++) {
                if (ec[index].touchPointID == e.touchPointID) {
                    return true;
                }
            }
            return false;
        }
        /**根据TOUCH ID得到一个对象*/
        private static getTouchEventByID(touchID:number,target:lark.DisplayObject):lark.TouchEvent {
            var ec:lark.TouchEvent[] = neoges.GestureManager.eventDict[target.hashCode];
            for (var index = 0; index < ec.length; index++) {
                if (ec[index].touchPointID == touchID) {
                    return ec[index];
                }
            }
            return null;
        }
        /**移出事件处理*/
        private static leaveStageHandler(e: lark.TouchEvent): void {
            neoges.GestureManager.removeAllEvent(e.target.stage);
        }
        /**remove all*/
        private static removeAllEvent(stage: lark.Stage): void {
            for (var key in neoges.GestureManager.eventDict) {
                var ec:lark.TouchEvent[] = neoges.GestureManager.eventDict[key];
                if(ec != null)
                    neoges.GestureManager.evtPool.reclaimAll(ec);
            }
            stage.removeListener(lark.TouchEvent.TOUCH_MOVE, neoges.GestureManager.touchedHandler, stage);
            stage.removeListener(lark.TouchEvent.TOUCH_END, neoges.GestureManager.touchedHandler, stage);
            neoges.GestureManager.drawTouchPoint(stage);
        }
        /**用圆圈显示点的位置*/
        private static drawTouchPoint(stage: lark.Stage): void {
            if(neoges.GestureManager.currentTouchObject==null)
                return;
            var drawLayer: lark.Shape = neoges.GestureManager.drawLayer;
            if(drawLayer.stage==null)
                stage.addChild(drawLayer);
            var g:lark.Graphics = drawLayer.graphics;
            g.clear();
            g.fillStyle = "#000000";
            var evt: lark.TouchEvent;
            for (var key in neoges.GestureManager.eventDict) {
                if(neoges.GestureManager.currentTouchObject.hashCode != key)
                    continue;
                var ec:lark.TouchEvent[] = neoges.GestureManager.eventDict[key];
                if(ec != null && ec.length>0) {
                    for (var index = 0; index < ec.length; index++) {
                        evt = ec[index];
                        g.beginPath();
                        g.arc(evt.stageX, evt.stageY, 10, 0, Math.PI * 2);
                        g.fill();
                    }
                }
            }
            ec = neoges.GestureManager.simulatePoints;
            for (var index = 0; index < ec.length; index++) {
                evt = ec[index];
                g.beginPath();
                g.arc(evt.stageX, evt.stageY, 10, 0, Math.PI * 2);
                g.fill();
                //console.log("绘制额外点",evt.stageX,evt.stageY);
            }
        }
    }
}