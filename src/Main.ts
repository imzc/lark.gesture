class Main extends swan.Group {

    public constructor() {
        super();
        this.width = 400;
        this.height = 400;
        this.showIcon();
    }

    icon: lark.Bitmap;
    startScaleValue: number;
    startRotationValue: number;
    startPoint: lark.Point;

    public showIcon() {
        var bitmap = new swan.Image('http://img.lark.egret.com/lark.png');
        var text = new lark.TextField("Hello Lark");
        text.y = bitmap.height + 10;
        bitmap.x = (text.width-bitmap.width)*0.5;
        var stage = this.stage;
        bitmap.horizontalCenter = 0;
        bitmap.verticalCenter = 0;
        this.addChild(bitmap);
        this.icon = bitmap;
        
        //Tap(点一下)
        var tap: neoges.TapGesture = new neoges.TapGesture(this.icon);
        tap.on(neoges.GestureEvent.ENDED, this.onTap, this); 

        //Double Tap (双击)
        var tap2: neoges.DoubleTapGesture = new neoges.DoubleTapGesture(this.icon);
        tap2.on(neoges.GestureEvent.ENDED, this.onDoubleTap, this);

        //Pinch(二指往內或往外拨动，平时经常用到的缩放)
        var tap3: neoges.PinchGesture = new neoges.PinchGesture(this.icon);
        tap3.on(neoges.GestureEvent.BEGAN, this.onPinchBegan, this);
        tap3.on(neoges.GestureEvent.UPDATE, this.onPinchUpdate, this);
        tap3.on(neoges.GestureEvent.ENDED, this.onPinchEnd, this);

        //Rotation(旋转)
        var tap4: neoges.RotationGesture = new neoges.RotationGesture(this.icon);
        tap4.on(neoges.GestureEvent.BEGAN, this.onRotationBegan, this);
        tap4.on(neoges.GestureEvent.UPDATE, this.onRotationUpdate, this);
        tap4.on(neoges.GestureEvent.ENDED, this.onRotationEnd, this);

        //Swipe(滑动，快速移动)
        var tap5: neoges.SwipeGesture = new neoges.SwipeGesture(this.icon);
        tap5.on(neoges.GestureEvent.ENDED, this.onSwipeEnd, this);

        //Pan (拖移，慢速移动)
        var tap6: neoges.PanGesture = new neoges.PanGesture(this.icon);
        tap6.on(neoges.GestureEvent.BEGAN, this.onPanBegan, this);
        tap6.on(neoges.GestureEvent.UPDATE, this.onPanUpdate, this);
        tap6.on(neoges.GestureEvent.ENDED, this.onPanEnd, this);
        //LongPress(长按)
        var tap7: neoges.LongPressGesture = new neoges.LongPressGesture(this.icon);
        tap7.on(neoges.GestureEvent.ENDED, this.onLongPressEnd, this);
    }
    /**on tap*/
    private onTap(event: neoges.GestureEvent): void {
        this.showMsg("tap on " + event.host.name);
    }
    /**on double tap*/
    private onDoubleTap(event: neoges.GestureEvent): void {
        this.showMsg("double tap on " + event.host.name);
    }
    /**swipe*/
    private onSwipeEnd(event: neoges.GestureEvent): void {
        this.showMsg("swipe " + event.offsetX + "," + event.offsetY);
    }
    /**long press*/
    private onLongPressEnd(event: neoges.GestureEvent): void {
        this.showMsg("long press on " + event.host.name);
    }

    /**pinch*/
    private onPinchBegan(event: neoges.GestureEvent): void {
        //console.log("pinch began on "+event.host.name);
        this.startScaleValue = this.icon.scaleX;
    }
    /**pinch*/
    private onPinchUpdate(event: neoges.GestureEvent): void {
        //console.log("pinch update "+event.value);
        this.icon.scaleX = this.startScaleValue * event.value;
        this.icon.scaleY = this.icon.scaleX;
    }
    /**pinch*/
    private onPinchEnd(event: neoges.GestureEvent): void {
        this.showMsg("pinch end on " + event.host.name);
    }
    /**rotation*/
    private onRotationBegan(event: neoges.GestureEvent): void {
        //console.log("rotation began on "+event.host.name);
        this.startRotationValue = this.icon.rotation;
    }
    /**rotation*/
    private onRotationUpdate(event: neoges.GestureEvent): void {
        //console.log("rotation update ",event.value);
        this.icon.rotation = this.startRotationValue + event.value;
    }
    /**rotation*/
    private onRotationEnd(event: neoges.GestureEvent): void {
        this.showMsg("rotation end on " + event.host.name);
    }
    /**pan*/
    private onPanBegan(event: neoges.GestureEvent): void {
        //console.log("pan began on "+event.host.name);
        this.startPoint = new lark.Point(event.host.x, event.host.y);
    }
    /**pan*/
    private onPanUpdate(event: neoges.GestureEvent): void {
        //console.log("rotation update ",event.value);
        event.host.x = this.startPoint.x + event.offsetX;
        event.host.y = this.startPoint.y + event.offsetY;
    }
    /**pan*/
    private onPanEnd(event: neoges.GestureEvent): void {
        this.showMsg("pan end on " + event.host.name);
    }
    /**不需要手势的时候，可以清理手势*/
    private clearGesture(gestureInstance: neoges.IGesture): void {
        gestureInstance.dispose();
    }
    /**显示信息*/
    private showMsg(value: string): void {
        lark.log(value);
    }
}


