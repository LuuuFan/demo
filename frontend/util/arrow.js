// import {fabric} from './fabric';

// Extended fabric line class
fabric.LineArrow = fabric.util.createClass(fabric.Line, {

  type: 'lineArrow',

  initialize: function(element, options) {
    options || (options = {});
    this.callSuper('initialize', element, options);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'));
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);

    // do not render if width/height are zeros or object is not visible
    if (this.width === 0 || this.height === 0 || !this.visible) return;

    ctx.save();

    var xDiff = this.x2 - this.x1;
    var yDiff = this.y2 - this.y1;
    var angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    ctx.moveTo(10, 0);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-20, -15);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();

    ctx.restore();
  }
});

fabric.LineArrow.fromObject = function(object, callback) {
  callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
};

fabric.LineArrow.async = true;

class Arrow {
	constructor(canvas, fill){
		this.canvas = canvas;
		this.className = 'Arrow';
		this.isDrawing = false;
    this.bindEvents();
    this.fill = fill;
	}

	bindEvents(){
		const inst = this;
		inst.canvas.on('mouse:down', (o)=>{
			inst.onMouseDown(o);
		});
		inst.canvas.on('mouse:move', (o) => {
      inst.onMouseMove(o);
    });
    inst.canvas.on('mouse:up', (o) => {
      inst.onMouseUp(o);
    });
    inst.canvas.on('object:moving', (o) => {
      inst.disable();
      inst.canvas.off('mouse:down');
    })		
	}

	onMouseUp(){
    this.disable();
	}

	onMouseMove(o){
		const inst = this;
    if (!inst.isEnable()) {
      return;
    }

    const pointer = inst.canvas.getPointer(o.e);
    const activeObj = inst.canvas.getActiveObject();
    if (activeObj) {
	    activeObj.set({
	      x2: pointer.x,
	      y2: pointer.y
	    });
	    activeObj.setCoords();
	    inst.canvas.renderAll();
    }
	}


	onMouseDown(o){
		const inst = this;
    inst.enable();
    const pointer = inst.canvas.getPointer(o.e);

    const points = [pointer.x, pointer.y, pointer.x, pointer.y];
    const line = new fabric.LineArrow(points, {
      strokeWidth: 5,
      fill: this.fill,
      stroke: this.fill,
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false
    });

    inst.canvas.add(line).setActiveObject(line);
	}

	isEnable(o){
		return this.isDrawing;
	}

	enable(){
		this.isDrawing = true;
	}

	disable(){
		this.isDrawing = false;
	}
}

export default Arrow;