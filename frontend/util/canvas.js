// import {fabric} from './fabric';

export const addShape = (selectedShape, canvas) => {
  let color = $(`#shape-color`).val();
  let opacity = parseFloat($(`#shape-opacity`).val());
  switch (selectedShape) {
    case "circle":
      let circle = new fabric.Circle({
        left: 50,
        top: 50,
        radius: 20,
        fill: color,
        opacity
      });
      canvas.add(circle);
      break;
    case "rect":
      let square = new fabric.Rect({
        left: 50,
        top: 50,
        width: 25,
        height: 25,
        fill: color,
        opacity
      });
      canvas.add(square);
      break;
    case "line":
      let line = new fabric.Line([50, 50, 150, 50], {
        left: 50,
        top: 50,
        stroke: color,
        opacity
      });
      canvas.add(line);
      break;
    default:
    return false;
  }
};

export const addText = (canvas) => {
  let style = $(`#text-style`).val();
  let size = parseInt($(`#text-size`).val());
  let color = $(`#text-color`).val();
  let text = new fabric.IText("Happy birthday", {
    left: 50,
    top: 50,
    fontFamily: style,
    fontSize: size,
    fill: color
  });
  canvas.add(text);
};

export const deleteItem = (canvas) => {
  let activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') photoNum--;
  canvas.remove(activeObject);
  activeObject = canvas.getActiveObject();
};

let photoNum = 0;

export const addPhoto = (url, canvas) => {
    let activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      changeImage(url, canvas, activeObject);
    } else {
      let img = new Image();
      img.src = url;
      img.setAttribute('crossorigin', 'anonymous');
      img.onload = function() {
        let image = new fabric.Image(img);
        image.set({
          left: 0 + 50 * photoNum,
          top: 0 + 50 * photoNum,
        }).scale(0.5);
        canvas.add(image);
        photoNum++;
      };
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
  
  fabric.Image.fromURL(`app/assets/images/${selectedDialog}.png`, (img)=>{
    const dialog = img.set({
      // height: 100,
      // width: 100,
    }).scale(0.3);

    let text = new fabric.IText('Comment Here', {
      fontSize: 14,
      height: dialog.height * 0.3,
      width: dialog.width * 0.3,
      left: dialog.width * 0.3 / 2,
      top: dialog.height * 0.3 / 2,
      originX: 'center',
      originY: 'center',
    });

    let group = new fabric.Group([dialog, text], {
      left: 100,
      top: 100,
    });

    canvas.add(group);
  });

};


export const resetCanvas = (canvas) => {
  canvas.clear();
  photoNum = 0;
  const container = document.querySelector('.container')
  canvas.setHeight(container.offsetHeight);
  canvas.setWidth(container.offsetWidth - 50);
  canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
};

export const changeText = () => {

}

export const changeColor = (canvas, activeObject, color) => {
  if (color) {
    if (activeObject.type==='i-text') {
      activeObject.setColor(color);
    } else {
      activeObject.set('fill', color);
    }
    canvas.renderAll();
  }
}

// export const changeColor = (event) => {
//   let eventId = event.currentTarget.id;
//   let color = $(`#${eventId}`).val();
//   $(`#${eventId}`).next(`.selected-color`).css(`background-color`, `${color}`);
//   if (eventId === `background-color`) {
//     changeBackground(color);
//   }
// };

  // Events
  // $("#addText").click(addText);
  // $("#addShape").click(addShape);
  // $("#changeBackground").click(changeBackground);
  // $("#deleteItem").click(deleteItem);

  // $("#downloadTemplate").click(downloadTemplate);
  // $("#saveTemplate").click(saveTemplate);
  // $(`#searchButton`).click(searchTemplates);
  // $("#templates-list").on("click", ".template-image", setTemplate);
  // $("#images-list").on("click", ".preview-image", changeImage);

  // $("#addPhoto").change(addPhoto);
  // $("#uploadTemplate").change(uploadTemplate);
  // $(`#shape-color`).change(changeColor);
  // $(`#text-color`).change(changeColor);
  // $(`#background-color`).change(changeColor);

  // $("#addButton").click(function(){
  //   $("#addPhoto").click();
  // });
  // $("#uploadButton").click(function(){
  //   $("#uploadTemplate").click();
  // });
