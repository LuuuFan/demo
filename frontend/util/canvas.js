import {fabric} from './fabric';

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
    case "square":
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
  canvas.remove(activeObject);
};

export const addPhoto = (e, canvas) => {
  let reader = new FileReader();
  reader.onload = function(event) {
    let img = new Image();
    img.src = event.target.result;
    img.onload = function() {
      let image = new fabric.Image(img);
      image.set({
        left: 0,
        top: 0
      }).scale(0.1);
      canvas.add(image);
    };
  };
  reader.readAsDataURL(e.target.files[0]);
};

export const changeImage = (event) => {
  event.preventDefault();

  let parseUrl = (url) => {
    let regex = /http:/gi;
    let result;
    let indicies = [];
    while ( (result = regex.exec(url)) ) {
      indicies.push(result.index);
    }
    let last = indicies[indicies.length - 1];
    return url.slice(last);
  };

  let imageUrl = parseUrl(event.currentTarget.src);

  let activeObject = canvas.getActiveObject();

  if (!activeObject) {
    alert("Please select an image you want to replace.");
    return false;
  }

  let left = activeObject.left;
  let top = activeObject.top;
  let tl = activeObject.aCoords.tl;
  let br = activeObject.aCoords.br;
  let width = Math.round(br.x - tl.x);
  let height = Math.round(br.y - tl.y);

  fabric.Image.fromURL(imageUrl, function(img){
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

  return false;
};

export const changeBackground = (color, canvas) => {
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
};  

export const addDialog = (selectedDialog, canvas) => {
  let img = new fabric.Image.fromURL(`app/assets/images/${selectedDialog}.png`);
  debugger
  img.setWidth(100);
  img.Height(100);

  let text = new fabric.Text('Comment Here', {
    fontSize: 14,
  });

  text.set('top' (img.getBoundingRectHeight() / 2) - (text.height / 2));
  text.set('top' (img.getBoundingRectWidth() / 2) - (text.width / 2));

  let group = new fabric.Group([img, text], {
    left: 100,
    top: 25,
  });

  canvas.add(group);
};

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
