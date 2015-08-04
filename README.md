﻿# Lark手势识别库

版本:Alpha 0.1
> 目前处于测试阶段，欢迎使用并提出您宝贵的建议，如发现Bug，请提交Bug详情，或者修复后发送Pull Request合并到主库。

简介
-------------------

本库是Egret 手势库的 Lark 实现，源代码来自 [https://github.com/NeoGuo/egret_gesture](https://github.com/NeoGuo/egret_gesture)

目前已实现的手势：

1. Tap(点一下)
2. Double Tap (双击)
3. Pinch(二指往內或往外拨动，平时经常用到的缩放)
4. Rotation(旋转)
5. Swipe(滑动，快速移动)
6. Pan (拖移，慢速移动)
7. LongPress(长按)

演示: [Demo](http://www.tech-mx.com/egret/gesture/)

使用方式
-------------------

使用很简单:

第一步，下载本库，将src下面的源码，拷贝到您的项目的源码目录里面。

第二步，选择你想使用的手势，创建手势对象，然后侦听事件即可。事件有4种：

* BEGAN 手势开始
* UPDATE Touch点处于变化中
* ENDED 手势结束
* FAILED 手势失败

以双击举例，示例代码：

```
var tap:neoges.DoubleTapGesture = new neoges.DoubleTapGesture(this.sky);
tap.addEventListener(neoges.GestureEvent.ENDED,this.onDoubleTap,this);
private onDoubleTap(event:neoges.GestureEvent):void {
    this.showMsg("double tap on "+event.host.name);
}
```

所有手势的使用方式，可以从这里找到：[Main](https://github.com/zcxp/lark.gesture/src/Main.ts)

扩展
-------------------

扩展手势库也很简单，继承neoges.AbstractGesture并重写相关的方法即可。
