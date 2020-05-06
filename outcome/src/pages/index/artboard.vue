<template>
    <div class="container" ref="container">
        <canvas
            ref="canvas"
            style="width: 100%; height: 100%;"
            :width="stageWidth+'px'"
            :height="stageHeight+'px'"
            @mousedown.passive="handleMouseDown"
            @mousemove.passive="handleMouseMove"
            @mouseup.passive="handleMouseUp"
            @mousewheel.passive="handleMouseWheel"
        ></canvas>
    </div>
</template>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    background: url(./background.png);
    background-size: 25px;
}
</style>

<script>
import store from "/store.js";

const tagHeight = HD(24);

function HD(val) {
    return val * 2;
}

function UNHD(val) {
    return val * 2;
}

function FIX(val) {
    // 修正2倍图坐标偏移
    return val * 2;
}

function UNFIX(val) {
    // 反修正
    return val / 2;
}

function COLOR(){
    switch(store.color){
        case "poe":
            return "#333333";
        case "starrynight":
            return "#2953A6";
        case "enjolras":
            return "#A62929";
        case "sunflower":
            return "#CCA633";
        case "spring":
            return "#85995C";
    }
}

var SCALE = function(val){
    return FIX(val * this.imageScale)
};

var UNSCALE = function(val){
    return UNFIX(val * this.imageScale)
};

var MARKX = function(val){
    return FIX(val * this.imageScale) + this.imageX;
};

var MARKY = function(val){
    return FIX(val * this.imageScale) + this.imageY;
};

export default {
    props: {
        image: String,
        data: Object
    },
    created(){
        SCALE = SCALE.bind(this);
        UNSCALE = SCALE.bind(this);
        MARKX = MARKX.bind(this);
        MARKY = MARKY.bind(this);
    },
    data() {
        return {
            stageWidth: 0,
            stageHeight: 0,

            imageObj: null,
            imageType: "horizontal",
            imageScale: 1,
            imageX: 0,
            imageY: 0,

            mouseDownFlag: false,
            mousePosition: null,

            layerSelected: null,
            layerHovered: null,

            space: HD(1),
        };
    },
    watch: {
        image: {
            handler(url) {
                this.imageObj = new Image();
                this.imageObj.src = url;
                this.imageObj.onload = () => {
                    const image = this.imageObj;

                    if (image.width > image.height) {
                        this.imageType = "horizontal";
                        this.imageScale = (this.stageWidth * 0.8) / image.width;
                    } else {
                        this.imageType = "vertical";
                        this.imageScale =
                            (this.stageHeight * 0.8) / image.height;
                    }
                    if (this.imageScale > 2) {
                        this.imageScale = 2;
                    }

                    let rwidth = image.width * this.imageScale;
                    let rheight = image.height * this.imageScale;

                    this.imageX = this.stageWidth / 2 - rwidth / 2;
                    this.imageY = this.stageHeight / 2 - rheight / 2;

                    this.render();
                };
            },
            immediate: true
        }
    },
    mounted() {
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas);
    },
    methods: {
        resizeCanvas() {
            let container = this.$refs["container"];
            this.stageWidth = container.clientWidth * 2;
            this.stageHeight = container.clientHeight * 2;
            this.$nextTick(() => {
                this.render();
            });
        },
        handleMouseWheel(evt) {
            let delta = evt.delta || evt.deltaY;

            let mouse = this.getRelativeMousePosition(evt);
            let sourceWidth = this.imageObj.width * this.imageScale;
            let sourceHeight = this.imageObj.height * this.imageScale;
            let mouseXPercent = mouse.x / sourceWidth;
            let mouseYPercent = mouse.y / sourceHeight;

            if (delta < 0) {
                this.imageScale += 0.05;
            } else {
                this.imageScale -= 0.05;
            }
            if (this.imageScale < 0.1) {
                this.imageScale = 0.1;
            } else if (this.imageScale > 5) {
                this.imageScale = 5;
            }
            let resizedWidth = this.imageObj.width * this.imageScale;
            let resizedHeight = this.imageObj.height * this.imageScale;

            this.imageX =
                this.imageX - (resizedWidth - sourceWidth) * mouseXPercent;
            this.imageY =
                this.imageY - (resizedWidth - sourceWidth) * mouseYPercent;
            this.render();
        },
        handleMouseDown(evt) {
            this.mouseDownFlag = true;
        },
        handleMouseMove(evt) {
            if (this.mouseDownFlag) {
                if (this.mousePosition === null) {
                    this.mousePosition = {
                        x: evt.offsetX,
                        y: evt.offsetY
                    };
                    return;
                }

                let offsetX = evt.offsetX - this.mousePosition.x;
                let offsetY = evt.offsetY - this.mousePosition.y;
                this.imageX += HD(offsetX);
                this.imageY += HD(offsetY);

                this.mousePosition = {
                    x: evt.offsetX,
                    y: evt.offsetY
                };
            }

            let mouse = this.getRelativeMousePosition(evt);
            let artboard = this.data;

            this.layerHovered = this.hitTestLayer(artboard, mouse);
            if(this.layerHovered === null){
                this.layerHovered = Object.assign({}, artboard, {
                    x: 0,
                    y: 0
                })
            }

            // console.log(artboard);
            // console.log(result);

            this.render(evt);
        },
        handleMouseUp() {
            this.mouseDownFlag = false;
            this.mousePosition = null;

            if(this.layerHovered && this.layerHovered.type != "Artboard"){
                this.layerSelected = this.layerHovered;
            }else{
                this.layerSelected = null;
            }

            this.render();
        },
        hitTestLayer(layer, mouse, parent){
            if(layer.layers.length){
                let result = null;
                for(let i in layer.layers){
                    let sublayer = layer.layers[i];
                    let hit = this.hitTestLayer(sublayer, mouse, layer);
                    if(hit){
                        result = hit;
                    }
                }
                return result;
            }else{
                let c1 = mouse.relativeX > FIX(layer.x);
                let c2 = mouse.relativeX < FIX(layer.x) + FIX(layer.width);
                let c3 = mouse.relativeY > FIX(layer.y);
                let c4 = mouse.relativeY < FIX(layer.y) + FIX(layer.height);

                if(c1 && c2 && c3 && c4){
                    return layer;
                }else{
                    return null;
                }
            }
        },
        getRelativeMousePosition(evt) {
            // 获取鼠标相对于图片的位置
            if(!evt){
                return null;
            }
            let mouseX = evt.offsetX;
            let mouseY = evt.offsetY;

            let x = HD(mouseX) - this.imageX;
            let y = HD(mouseY) - this.imageY;

            let result = {
                x,
                y,
                relativeX: x / this.imageScale,
                relativeY: y / this.imageScale,
            };
            // console.log(result);
            return result;
        },
        drawBox(ctx, layer){
            ctx.lineWidth = HD(2);
            ctx.strokeStyle = COLOR();
            ctx.strokeRect(MARKX(layer.x) - this.space, MARKY(layer.y) - this.space, SCALE(layer.width) + this.space * 2, SCALE(layer.height) + this.space * 2);
        },
        drawTagOnLine(ctx, content, startX, endX, startY, endY){
            let distanceX = (endX - startX)/this.imageScale;
            let distanceY = (endY - startY)/this.imageScale
            let tagWidth = ctx.measureText(content).width + 16;
            let tagX = startX + SCALE(distanceX/4) - (tagWidth/2);
            let tagY = startY + SCALE(distanceY/4) - (tagHeight/2);
            ctx.fillStyle = COLOR();
            ctx.fillRect(tagX, tagY, tagWidth, tagHeight);
            ctx.fillStyle = "white";
            ctx.font = "32px Arial";
            ctx.textBaseline = "top";
            ctx.fillText(content, tagX+8, tagY+4);
        },
        render(evt) {
            const ctx = this.$refs["canvas"].getContext("2d");
            const image = this.imageObj;
            const rwidth = image.width * this.imageScale;
            const rheight = image.height * this.imageScale;
            const mouse = this.getRelativeMousePosition(evt);

            ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

            ctx.fillStyle = "#fff";
            ctx.fillRect(this.imageX, this.imageY, rwidth, rheight);
            // 为透明图片绘制背景色

            ctx.fillStyle = COLOR();

            ctx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                this.imageX,
                this.imageY,
                rwidth,
                rheight
            );

            if(this.layerHovered && this.layerHovered.type != "Artboard"){
                this.drawBox(ctx, this.layerHovered)
            }
            if(this.layerSelected){
                this.drawBox(ctx, this.layerSelected)

                if(mouse && this.layerHovered){
                    let s = this.layerSelected;
                    let h = this.layerHovered;

                    /******* X 轴 *******/

                    if(h.x <= s.x){
                        // 左侧标注线
                        // 指向元素在选中元素的左侧
                        let startX, endX, startY, endY;
                        startY = SCALE(s.y + s.height/2) + this.imageY;
                        endY = startY;

                        ctx.lineWidth = HD(2);
                        ctx.beginPath();
                        if(h.x + h.width > s.x){
                            // 选中元素的左边框在指向元素宽度范围内
                            startX = SCALE(h.x) + (this.imageX);
                            endX = SCALE(s.x) + (this.imageX)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }else{
                            // 选中元素的左边框在指向元素宽度范围外
                            startX = SCALE(h.x + h.width) + (this.imageX);
                            endX = SCALE(s.x) + (this.imageX)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }
                        ctx.stroke();

                        // 绘制辅助线

                        if(h.x != s.x){
                            ctx.beginPath();
                            ctx.setLineDash([10, 10]);
                            ctx.lineWidth = HD(1);
                            let sCenterY = s.y + s.height/2;
                            if(h.y > sCenterY){
                                ctx.moveTo(startX, startY - SCALE(s.height/2));
                                ctx.lineTo(startX, SCALE(h.y) + this.imageY);
                            }else if(h.y + h.height < sCenterY){
                                ctx.moveTo(startX, startY + SCALE(s.height/2));
                                ctx.lineTo(startX, SCALE(h.y) + this.imageY);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        let tag = Math.abs(Math.round((endX - startX)/this.imageScale))+" px"
                        if(tag != "0 px"){
                            this.drawTagOnLine(ctx, tag, startX, endX, startY, endY);
                        }
                    } 
                    
                    if(h.x >= s.x || h.x + h.width >=s.x){
                        // 右侧标注线
                        // 指向元素在选中元素的右侧
                        let startX, endX, startY, endY;
                        startY = SCALE(s.y + s.height/2) + this.imageY;
                        endY = startY;

                        ctx.lineWidth = HD(2);
                        ctx.beginPath();
                        if(s.x + s.width < h.x){
                            // 选中元素的右边框在指向元素宽度范围外
                            startX = SCALE(s.x + s.width) + (this.imageX);
                            endX = SCALE(h.x) + (this.imageX)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }else {
                            // 选中元素的右边框在指向元素宽度范围内
                            startX = SCALE(s.x + s.width) + (this.imageX);
                            endX = SCALE(h.x + h.width) + (this.imageX)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }
                        ctx.stroke();

                        // 绘制辅助线
                        if(h.x + h.width != s.x + s.width){
                            ctx.beginPath();
                            ctx.setLineDash([10, 10]);
                            ctx.lineWidth = HD(1);
                            let sCenterY = s.y + s.height/2;
                            if(h.y > sCenterY){
                                ctx.moveTo(endX, startY - SCALE(s.height/2));
                                ctx.lineTo(endX, SCALE(h.y) + this.imageY);
                            }else if(h.y + h.height < sCenterY){
                                ctx.moveTo(endX, startY + SCALE(s.height/2));
                                ctx.lineTo(endX, SCALE(h.y) + this.imageY);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        let tag = Math.abs(Math.round((endX - startX)/this.imageScale))+" px"
                        if(tag != "0 px"){
                            this.drawTagOnLine(ctx, tag, startX, endX, startY, endY);
                        }
                    }

                    /******* Y 轴 *******/

                    if(h.y <= s.y){
                        // 上侧标注线
                        // 指向元素在选中元素的上侧
                        let startX, endX, startY, endY;
                        startX = SCALE(s.x + s.width/2) + this.imageX;
                        endX = startX;

                        ctx.lineWidth = HD(2);
                        ctx.beginPath();
                        if(h.y + h.height > s.y){
                            // 选中元素的上边框在指向元素高度范围内
                            startY = SCALE(h.y) + (this.imageY);
                            endY = SCALE(s.y) + (this.imageY)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }else{
                            // 选中元素的上边框在指向元素高度范围外
                            startY = SCALE(h.y + h.height) + (this.imageY);
                            endY = SCALE(s.y) + (this.imageY)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }
                        ctx.stroke();

                        // 绘制辅助线

                        if(h.y != s.y){
                            ctx.beginPath();
                            ctx.setLineDash([10, 10]);
                            ctx.lineWidth = HD(1);
                            let sCenterX = s.x + s.width/2;
                            if(h.x > sCenterX){
                                ctx.moveTo(startX - SCALE(s.width/2), startY);
                                ctx.lineTo(SCALE(h.x) + this.imageX, startY);
                            }else if(h.x + h.height < sCenterX){
                                ctx.moveTo(startX + SCALE(s.width/2), startY);
                                ctx.lineTo(SCALE(h.x) + this.imageX, startY);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        let tag = Math.abs(Math.round((endY - startY)/this.imageScale))+" px"
                        if(tag != "0 px"){
                            this.drawTagOnLine(ctx, tag, startX, endX, startY, endY);
                        }
                    } 
                    
                    if(h.y >= s.y || h.y + h.height >=s.y){
                        // 下侧标注线
                        // 指向元素在选中元素的下侧
                        let startX, endX, startY, endY;
                        startX = SCALE(s.x + s.width/2) + this.imageX;
                        endX = startX;

                        ctx.lineWidth = HD(2);
                        ctx.beginPath();
                        if(s.y + s.height < h.y){
                            // 选中元素的下边框在指向元素高度范围外
                            startY = SCALE(s.y + s.height) + (this.imageY);
                            endY = SCALE(h.y) + (this.imageY)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }else {
                            // 选中元素的下边框在指向元素高度范围内
                            startY = SCALE(s.y + s.height) + (this.imageY);
                            endY = SCALE(h.y + h.height) + (this.imageY)
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                        }
                        ctx.stroke();

                        // 绘制辅助线
                        if(h.y + h.height != s.y + s.height){
                            ctx.beginPath();
                            ctx.setLineDash([10, 10]);
                            ctx.lineWidth = HD(1);
                            let sCenterX = s.x + s.width/2;
                            if(h.x > sCenterX){
                                ctx.moveTo(startX - SCALE(s.width/2), endY);
                                ctx.lineTo(SCALE(h.x) + this.imageX, endY);
                            }else if(h.x + h.height < sCenterX){
                                ctx.moveTo(startX + SCALE(s.width/2), endY);
                                ctx.lineTo(SCALE(h.x) + this.imageX, endY);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        let tag = Math.abs(Math.round((endY - startY)/this.imageScale))+" px"
                        if(tag != "0 px"){
                            this.drawTagOnLine(ctx, tag, startX, endX, startY, endY);
                        }
                    }

                }
            }

        }
    }
};
</script>