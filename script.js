let style = require("./_slider.sass");
class Slider{
    constructor(option) {
        this._parentEl = document.getElementById(option.id)
        this._parentEl.className= "custSlider"
        this._plase = document.createElement('div')
        this._plase.className = "custSlider__plase"
        this._parentEl.append(this._plase)

        this._startPoint = document.createElement('div')
        this._startPoint.className = "custSlider__startPoint"

        this._endPoint = document.createElement('div')
        this._endPoint.className = "custSlider__endPoint"

        this._shtrihPlace = document.createElement('div')
        this._shtrihPlace.className = "custSlider__shtrihPlace"

        this._plase.append(this._startPoint, this._endPoint, this._shtrihPlace)

        this.startPointMove = false
        this.endPointMove = false

        this.startPointTouch = 0
        this.endPointTouch = 0

        this.countMin = 1080

        this._startPoint.addEventListener("mousedown", this.checkStartPoint.bind(this),true)
        this._startPoint.addEventListener("touchstart", this.toushSStartPoint.bind(this), true)

        this._endPoint.addEventListener("mousedown", this.checkEndPoint.bind(this),true)
        this._endPoint.addEventListener("touchstart", this.toushSEndPoint.bind(this),true)

        document.addEventListener("mousemove", this.mouseMovePoint.bind(this))
        document.addEventListener("touchmove", this.touchMovePoint.bind(this))

        document.addEventListener("mouseup", this.mouseUpPoint.bind(this))
        document.addEventListener("touchend", this.mouseUpPoint.bind(this))
    }

    toushSStartPoint(e){
        this.startPointMove = true
        this.startPointTouch = e.changedTouches[0].clientX - this._startPoint.getBoundingClientRect().x
    }

    toushSEndPoint(e){
        this.endPointMove =  true
        this.endPointTouch = e.changedTouches[0].clientX - this._endPoint.getBoundingClientRect().x
    }

    touchMovePoint(e){
        let { clientX } = e.changedTouches[0]
        let plase = this._plase.getBoundingClientRect()
        let endPoint = this._endPoint.getBoundingClientRect()
        let startPoint = this._startPoint.getBoundingClientRect()
        if (this.startPointMove){
            let letfBorder = clientX - plase.x - this.startPointTouch >= 0
            let rightBorder = (endPoint.x - clientX - (startPoint.width - this.startPointTouch)) >= 0
            let newPoint = clientX - plase.x - this.startPointTouch
            if ( letfBorder && rightBorder ) { this._startPoint.style.left = newPoint +"px" }
            if ( !rightBorder )              { this._startPoint.style.left = endPoint.x - plase.x - startPoint.width + "px"  }
            if ( !letfBorder )               { this._startPoint.style.left = "0px" }
        }
        if(this.endPointMove){
            let letfBorder = clientX - startPoint.x - this.endPointTouch - startPoint.width > 0
            let rightBorder = plase.width + plase.x - clientX - (endPoint.width - this.endPointTouch) > 0
            let newPoint = plase.width - (clientX - plase.x ) - endPoint.width + this.endPointTouch
            if ( letfBorder && rightBorder ){ this._endPoint.style.right = newPoint + "px" }
            if ( !letfBorder)               { this._endPoint.style.right = plase.width - (startPoint.x - plase.x + startPoint.width) - endPoint.width + "px" }
            if ( !rightBorder)              { this._endPoint.style.right = "0px"}


        }
        if (this.endPointMove || this.startPointMove){ this.changeShtrih(); this.returnEvent() }
    }

    checkStartPoint(e){
        this.startPointMove = true
        this.startPointTouch = e.clientX - this._startPoint.getBoundingClientRect().x
    }

    checkEndPoint(e){
        this.endPointMove =  true
        this.endPointTouch = e.clientX - this._endPoint.getBoundingClientRect().x
    }

    mouseMovePoint(e){
        let { clientX } = e.changedTouches[0];
        let plase = this._plase.getBoundingClientRect();
        let endPoint = this._endPoint.getBoundingClientRect();
        let startPoint = this._startPoint.getBoundingClientRect();
        if (this.startPointMove){
            let xEnd = endPoint.x - plase.x - startPoint.width;
            if (clientX-plase.x >= this.startPointTouch && clientX-plase.x <= xEnd){ this._startPoint.style.left = clientX-plase.x-this.startPointTouch+"px" };
            if (clientX-plase.x < 0){ this._startPoint.style.left = "0px" };
            if (clientX-plase.x > xEnd){ this._startPoint.style.left = xEnd+"px" };
        }
        if (this.endPointMove){
            let letfBorder = xEnd - clientX + endPoint.width - this.endPointTouch > 0;
            let rightBorder = clientX-(endPoint.width - this.endPointTouch) > startPoint.x+startPoint.width;
            let plaseEnd = plase.x + plase.width;
            let xEnd = plaseEnd - this._endPoint.clientWidth;
            if (letfBorder && rightBorder){ this._endPoint.style.right = plaseEnd - clientX - this.endPointTouch + "px" };
            if (!letfBorder){ this._endPoint.style.right = "0px" };
            if (!rightBorder) { this._endPoint.style.right = xEnd - startPoint.x-startPoint.width+"px" };
        }
        if (this.endPointMove || this.startPointMove){ this.changeShtrih();  this.returnEvent()};
    }

    mouseUpPoint(){
        this.startPointMove = false
        this.endPointMove = false
    }

    changeShtrih(){
        this._shtrihPlace.style.left = this._startPoint.style.left;
        this._shtrihPlace.style.width = this._endPoint.getBoundingClientRect().x - this._startPoint.getBoundingClientRect().x +"px";
    }

    returnEvent(opt){
        let pizInMin = (this._plase.getBoundingClientRect().width-this._endPoint.getBoundingClientRect().width)/this.countMin;
        let startTime = (this._startPoint.getBoundingClientRect().x -  this._plase.getBoundingClientRect().x)/pizInMin;
        let endTime = (this._endPoint.getBoundingClientRect().x - this._plase.getBoundingClientRect().x)/pizInMin;
        let bhour = !opt? Math.floor(Math.floor(startTime)/60)+6: opt.start.hour;
        let bminut = !opt? Math.floor(Math.floor(startTime)%60):opt.start.minut;
        let fhour = !opt? Math.floor(endTime/60)+6 : opt.end.hour;
        let fminut = !opt? Math.round(endTime%60)  : opt.end.minut;
        let det = {
            start: {
                hour: bhour,
                minut: bminut
            },
            end: {
                hour: fminut >= 60 ? fhour+1 : fhour,
                minut: fminut >= 60 ? 60-fminut : fminut
            }
        };
        this._parentEl.dispatchEvent(new CustomEvent("changeTime", {
            detail: det}));
    }

    onChange(callback){
        this._parentEl.addEventListener("changeTime", (e)=> {
            callback(e.detail)
        }, true)
    }

    onInit(callback){
        let delare = setInterval(()=> {
            if (document.getElementsByClassName('custSlider__plase').length>0){
                callback(true)
                clearInterval(delare)
            }
        }, 400)
    }

    setTime(stH, stM, endH, endM){
        let pizInMin = (this._plase.getBoundingClientRect().width-this._endPoint.getBoundingClientRect().width)/this.countMin;
        this._startPoint.style.left = ((stH-6)*60+stM)*pizInMin + "px"
        this._endPoint.style.right = (this._plase.getBoundingClientRect().width - ((endH-6)*60+endM)*pizInMin - this._endPoint.getBoundingClientRect().width) + "px"
        this.changeShtrih()
        this.returnEvent({
            start: {
                hour: stH,
                minut: stM
            },
            end: {
                hour: endH,
                minut: endM
            }
        })
    }
};
export default Slider;