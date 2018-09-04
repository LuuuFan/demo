// import {fabric} from './fabric';
// import Arrow from './arrow';

let photoNum = 0;

export const addShape = (selectedShape, canvas) => {
  let color = $(`#shape-color`).val();
  let opacity = parseFloat($(`#shape-opacity`).val());
  let fill = $('#shape-fill input').prop('checked') ? color : 'transparent';
  let hasBorder = $('#shape-fill input').prop('checked') ? false : true;
  switch (selectedShape) {
    case "circle":
      let circle = new fabric.Circle({
        left: 50,
        top: 50,
        radius: 50,
        fill: fill,
        stroke: color,
        strokeWidth: 3,
        opacity
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      break;
    case "rect":
      let square = new fabric.Rect({
        left: 50,
        top: 50,
        width: 25,
        height: 25,
        fill: fill,
        stroke: color,
        strokeWidth: 3,
        opacity
      });
      canvas.add(square);
      canvas.setActiveObject(square);
      break;
    case "line":
      let line = new fabric.Line([50, 50, 150, 50], {
        left: 50,
        top: 50,
        stroke: color,
        opacity
      });
      canvas.add(line);
      canvas.setActiveObject(line);
      break;
    case "polyline":
      // console.log('unperfect arrow function, need refactor');
      // const arrow = new Arrow(canvas, color);
      addArrow(canvas, color, fill, opacity);
      break;
    case "star":
      addStar(canvas, color, fill, opacity);
    default:
      return false;
  }
};

const addArrow = (canvas, color, fill, opacity) => {
  let fromx = 10,
    fromy = 10,
    tox = 50,
    toy = 50;
  const angle = Math.atan2(toy - fromy, tox - fromx);

  const headlen = 15; // arrow head size

  // bring the line end back some to account for arrow head.
  tox = tox - (headlen) * Math.cos(angle);
  toy = toy - (headlen) * Math.sin(angle);

  // calculate the points.
  const points = [{
      x: fromx, // start point
      y: fromy
    },
    {
      x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
      y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    },
    {
      x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
    },
    {
      x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
    },
    {
      x: tox + (headlen) * Math.cos(angle), // tip
      y: toy + (headlen) * Math.sin(angle)
    },
    {
      x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
    },
    {
      x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
      y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
    },
    {
      x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
      y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
    },
    {
      x: fromx,
      y: fromy
    }
  ];

  const pline = new fabric.Polyline(points, {
    fill: fill,
    stroke: color,
    opacity,
    strokeWidth: 2,
    originX: 'left',
    originY: 'top',
    selectable: true,
    name: 'arrow',
    // borderColor: 'blue',
    // cornerColor: 'blue'
  });

  canvas.add(pline);

  canvas.renderAll();
  canvas.setActiveObject(pline);
  canvas.trigger('object:modified');
};

const addStar = (canvas, color, fill, opacity) => {
  const points = starPolygonPoints(5,50,25);
  const star = new fabric.Polygon(points, {
    stroke: color,
    left: 100,
    top: 100,
    strokeWidth: 2,
    storkeLineJoin: 'bevil',
    fill: fill,
    opacity: opacity,
  }, false);
  canvas.add(star);
  canvas.renderAll();
  canvas.setActiveObject(star);
};

const starPolygonPoints = (spikeCount, outerRadius, innerRadius) => {
  let rot = Math.PI / 2 * 3;
  let cx = outerRadius;
  let cy = outerRadius;
  let sweep = Math.PI / spikeCount;
  let points = [];
  let angle = 0;

  for (let i = 0; i < spikeCount; i++) {
    let x = cx + Math.cos(angle) * outerRadius;
    let y = cy + Math.sin(angle) * outerRadius;
    points.push({x: x, y: y});
    angle += sweep;

    x = cx + Math.cos(angle) * innerRadius;
    y = cy + Math.sin(angle) * innerRadius;
    points.push({x: x, y: y});
    angle += sweep
  }
  return (points);
};

export const addText = (canvas, type) => {
  let style, size, top, content;
  let fontWeight = 'normal';
  let left = 50;
  let color = $(`#text-color`).val();
  let underline = false, overline = false, linethrough = false;
  if (type) {
    switch(type){
      case 'heading': 
        style = 'Verdana';
        size = 40;
        top = 50;
        fontWeight = 900;
        content = 'Add heading';
        break;
      case 'subheading':
        style = 'Georgia';
        size = 28;
        top = 100;
        fontWeight = 'bold';
        content = 'Add Subheading'
        break;
      case 'bodytext':
        style = 'Arial';
        size = 20;
        top = 150;
        content = 'Add body text';
        break;
    }
  } else {
    style = $(`#text-style`).val();
    size = parseInt($(`#text-size`).val());
    top = 50;
    content = 'Comment here'
    underline = document.querySelector('#text-decoration-underline').checked;
    overline = document.querySelector('#text-decoration-overline').checked;
    linethrough = document.querySelector('#text-decoration-linethrough').checked;
  }
  let text = new fabric.IText(content, {
    left: left,
    top: top,
    fontFamily: style,
    fontSize: size,
    fill: color,
    fontWeight,
    underline,
    overline,
    linethrough,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
};

export const deleteItem = (canvas) => {
  let activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') photoNum--;
  if (activeObject && (activeObject.type === 'group' || !activeObject._objects)) {
    canvas.remove(activeObject);
  } else if (activeObject && activeObject._objects && activeObject._objects.length){
    activeObject._objects.forEach(obj => canvas.remove(obj));
  }
};

export const addPhoto = (url, canvas) => {
    let activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      changeImage(url, canvas, activeObject);
    } else {
      let img = new Image();
      img.src = url;
      img.crossOrigin = "Anonymous";
      img.setAttribute('crossorigin', 'anonymous');
      img.onload = () => {
        fabric.Image.fromURL(url, (img) => {
          img.set({
            left: 0 + 50 * photoNum,
            top: 0 + 50 * photoNum,
          }).scale(0.5);
          try {
            canvas.add(img);
          } catch(err) {
            alert('Drobox img link expired.')
            debugger;
          }  
          canvas.renderAll();
          photoNum++;
        }, {crossOrigin: 'anonymous'})
      }
      
      // img.onload = function() {
      //   let image = new fabric.Image(img);
      //   image.set({
      //     left: 0 + 50 * photoNum,
      //     top: 0 + 50 * photoNum,
      //   }).scale(0.5);
      //   canvas.add(image);
      //   photoNum++;
      // };
    }
};

export const changeImage = (url, canvas, activeObject) => {
  let left = activeObject.left;
  let top = activeObject.top;
  let tl = activeObject.aCoords.tl;
  let br = activeObject.aCoords.br;
  let width = Math.round(br.x - tl.x);
  let height = Math.round(br.y - tl.y);

  fabric.Image.fromURL(url, function(img){
    img.set({
      scaleX: width / img.width,
      scaleY: height / img.height,
      left: left,
      top: top,
    });
    canvas.remove(activeObject);
    canvas.add(img);
    canvas.renderAll();
  });
};

export const changeBackground = (color, canvas) => {
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
};  

export const addDialog = (selectedDialog, canvas) => {
  fabric.Image.fromURL(`static/assets/images/${selectedDialog}.png`, (img)=>{
    const scale = 150 / img.height;
    const dialog = img.set({
    }).scale(scale);

    const comment = document.querySelector('#dialog textarea').value || 'Add Comment Here';
    const fontSize = comment.length > 10 ? Math.floor(150 / comment.length) : 14;

    let text = new fabric.IText(comment, {
      fontSize: fontSize,
      height: 150,      
      width: 150,
      left: 75,
      top: 75,
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
      selectable: true,
    });

    let group = new fabric.Group([dialog, text], {
      left: 100,
      top: 100,
    });
    $('#dialog textarea').val('');

    canvas.add(group);
    canvas.setActiveObject(group);
  });
};

export const resetCanvas = (canvas) => {
  canvas.clear();
  photoNum = 0;
  const container = document.querySelector('.container')
  // canvas.setHeight(container.offsetHeight);
  canvas.setHeight(650);
  // canvas.setWidth(container.offsetWidth - 50);
  canvas.setWidth(650);
  canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
};

export const changeColor = (canvas, activeObject, color) => {
    if (activeObject.type==='i-text') {
      activeObject.setColor(color);
    } else {
      if (activeObject.fill === 'transparent' || activeObject.type==='line') {
        activeObject.set('stroke', color);
      } else {
        activeObject.set('fill', color);
        activeObject.set('stroke', color);
      }
    }
    canvas.renderAll();
}

export const changeDialog = (canvas, activeObject) => {
  let img, text, group;
  
  activeObject.toActiveSelection();
  // canvas.requestRenderAll();
  let newActiveObjects = canvas.getActiveObject();
  newActiveObjects._objects.forEach(obj => {
    if (obj.type === 'image') {
      img = obj;
    } else {
      text = obj;
    }
  })

  canvas.setActiveObject(text);
  canvas.on('mouse:down', (e)=>{
    let activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === 'image' ) {
      if (img && text) {
        group = new fabric.Group([img, text]);
        canvas.remove(img);
        canvas.remove(text);
        canvas.add(group);
      }
      img = null;
      text = null;
      group = null;
    }
  });
}

export const changeOpacity = (obj, canvas, opacity) => {
  obj.set({opacity: opacity});
  canvas.renderAll();
};

export const changeFill = (obj, canvas, fill) => {
  fill ? obj.set({fill: obj.stroke}) : obj.set({fill: 'transparent'});
  canvas.renderAll();
}

export const changeTextStyle = (obj, canvas, options) => {
  obj.set(options);
  canvas.renderAll();
};



let rectangle;
let disabled = false;
let mouseX, mouseY;
export const cropingImage = (canvas, activeObj) => {
  let mouseDown;
  activeObj.selectable = false;
  const container = document.getElementById(canvas.contextContainer.canvas.id).getBoundingClientRect();
  console.log('~~~~~~~~~~~~~~~~~~~')
  console.log(container.left, container.top)
  rectangle = new fabric.Rect({
    fill: 'rgba(0,0,0,0.3)',
    storke: '#ccc',
    // storkeWidth: 10,
    strokeDashArray: [2, 2],
    left: activeObj.left + 10,
    top: activeObj.top + 10,
    visible: true,
    height: activeObj.height * activeObj.scaleY * 0.8,
    width: activeObj.width * activeObj.scaleX * 0.8,
  });

  canvas.add(rectangle);
  canvas.bringToFront(rectangle);
  canvas.setActiveObject(rectangle);
  // activeObj.hasRotatingPoint = true;
  canvas.renderAll();

  const mouseDownHandler = (event) =>{
    if (!disabled) {
      console.log('~~~~~~~Mouse Down~~~~~~~~~~~~')
      // rectangle.width = 10;
      // rectangle.height = 10;
      rectangle.visible = true;
      mouseX = event.e.pageX;
      mouseY = event.e.pageY;
      rectangle.left = mouseX - container.left;
      rectangle.top = mouseY - container.top;
      // mouseDown = event.e;
      mouseDown = true;
      canvas.bringToFront(rectangle);
    }
  };
  canvas.on('mouse:down', mouseDownHandler);

  const mouseMove = (event)=>{
    if (mouseDown && !disabled) {
      console.log('~~~~~~~Mouse Move~~~~~~~~~~~~')
      if (event.e.pageX - mouseX > 0) {
        rectangle.width = event.e.pageX - mouseX;
      }
      if (event.e.pageY - mouseY > 0) {
        rectangle.height = event.e.pageY - mouseY;
      }
      // canvas.renderAll();
    }
  };
  canvas.on('mouse:move', mouseMove);

  const mouseUp = () => {
    console.log('~~~~~~~~~~Mouse Up~~~~~~~~~~~~~~')
    mouseDown = null;

  };
  canvas.on('mouse:up', mouseUp);
};

const cancelHandler = (canvas) => {
  console.log('~~~~~~~~~~~~');
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
}

export const doneCrop = (canvas, activeObj) => {
    console.log('**************************')
    console.log('rectangle', rectangle.left, rectangle.top)
    console.log('activeObj: image', activeObj.left, activeObj.top)
    let x = rectangle.left - activeObj.left // activeObj.scaleX;
    let y = rectangle.top - activeObj.top // activeObj.scaleY;
    let width = rectangle.width * 1 / activeObj.scaleX;
    let height = rectangle.height * 1 / activeObj.scaleY;
    console.log(x, y, width, height);
    activeObj.clipTo = (ctx) => {
      ctx.rect(x, y, width, height);  
    }
    activeObj.selectable = true;
    disabled = true;
    rectangle.visible = false;
    canvas.renderAll();
    cancelHandler(canvas);
}

export const cancelCrop = (canvas, activeObj) => {
  canvas.remove(rectangle);
  canvas.setActiveObject(activeObj);
  cancelHandler(canvas);
}

export const rotateImg = (canvas, activeObj) => {
  let resetOrigin = false;
  let angle = activeObj.angle + 90;
  if ((activeObj.originX !== 'center' || activeObj.originY !== 'center') && activeObj.centeredRotation) {
    activeObj.setOriginToCenter && activeObj.setOriginToCenter();
    resetOrigin = true;
  }

  angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

  activeObj.set('angle', angle).setCoords();

  if (resetOrigin) {
    activeObj.setCenterToOrigin && activeObj.setCenterToOrigin();
  }

  canvas.renderAll();
}