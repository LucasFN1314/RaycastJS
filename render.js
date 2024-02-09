function fishEyeFixRender(data, rayAngle, ray) {
  let distance = Math.sqrt(
    Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2)
  );

  distance = distance * Math.cos(degreeToRadians(rayAngle - data.player.angle));
  return distance;
}

function drawSky(rayCount, wallHeight) {
  // drawLine(
  //   rayCount,
  //   0,
  //   data.projection.halfHeight - wallHeight,
  //   new Color(0, 0, 0, 255)
  // );
  drawBackground(
    rayCount,
    0,
    data.projection.halfHeight - wallHeight,
    data.backgrounds[0]
  );
}

// function drawWall(rayCount, wallHeight, color = "#c3ae6a") {
//   drawLine(
//     rayCount,
//     data.projection.halfHeight - wallHeight,
//     rayCount,
//     data.projection.halfHeight + wallHeight,
//     color
//   );
// }

function drawFloor(x1, wallHeight, rayAngle) {
  let start = data.projection.halfHeight + wallHeight + 1;
  let directionCos = Math.cos(degreeToRadians(rayAngle));
  let directionSin = Math.sin(degreeToRadians(rayAngle));
  for (let y = start; y < data.projection.height; y++) {
    let distance = data.projection.height / (2 * y - data.projection.height);
    distance =
      distance /
      Math.cos(degreeToRadians(data.player.angle) - degreeToRadians(rayAngle));
    let tileX = distance * directionCos + data.player.x;
    let tileY = distance * directionSin + data.player.y;

    let tile = data.map[Math.floor(tileY)][Math.floor(tileX)];
    let texture = data.floorTextures[tile];
    if (!texture) continue;

    let texture_x = Math.floor(tileX * texture.width) % texture.width;
    let texture_y = Math.floor(tileY * texture.height) % texture.height;

    let color = texture.data[texture_x + texture_y * texture.width];
    drawPixel(x1, y, color);
  }
}

function drawTexture(x, wallHeight, texturePositionX, texture) {
  let yIncrementer = (wallHeight * 2) / texture.height;
  let y = data.projection.halfHeight - wallHeight;

  let color = null;
  for (let i = 0; i < texture.height; i++) {
    if (texture.id) {
      color = texture.data[texturePositionX + i * texture.width];
    } else color = texture.colors[texture.bitmap[i][texturePositionX]];

    drawLine(x, y, Math.floor(y + (yIncrementer + 2)), color);
    y += yIncrementer;
  }
}

function drawBackground(x, y1, y2, background) {
  let offset = data.player.angle + x;
  for (let y = y1; y < y2; y++) {
    let textureX = Math.floor(offset % background.width);
    let textureY = Math.floor(y % background.height);
    let color = background.data[textureX + textureY * background.width];
    drawPixel(x, y, color);
  }
}

function loadTextures() {
  for (let i = 0; i < data.textures.length; i++) {
    if (data.textures[i].id) {
      data.textures[i].data = getTextureData(data.textures[i]);
    }
  }

  for (let i = 0; i < data.floorTextures.length; i++) {
    if (data.floorTextures[i].id) {
      data.floorTextures[i].data = getTextureData(data.floorTextures[i]);
    }
  }
}

function loadBackgrounds() {
  for (let i = 0; i < data.backgrounds.length; i++) {
    if (data.backgrounds[i].id) {
      data.backgrounds[i].height =
        (data.backgrounds[i].height * data.projection.height) / 100;
      data.backgrounds[i].data = getTextureData(data.backgrounds[i]);
    }
  }
}

function getTextureData(texture) {
  let image = document.getElementById(texture.id);
  let canvas = document.createElement("canvas");

  canvas.width = texture.width;
  canvas.height = texture.height;

  let context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, texture.width, texture.height);

  let imageData = context.getImageData(
    0,
    0,
    texture.width,
    texture.height
  ).data;
  return parseImageData(imageData);
}

function parseImageData(imageData) {
  let colorArray = [];
  for (let i = 0; i < imageData.length; i += 4) {
    colorArray.push(
      new Color(imageData[i], imageData[i + 1], imageData[i + 2], 255)
    );
  }
  return colorArray;
}

function renderFocusLost() {
  screenContext.fillStyle = "rgba(0,0,0,0.5)";
  screenContext.fillRect(0, 0, data.projection.width, data.projection.height);
  screenContext.fillStyle = "white";
  screenContext.font = "10px Lucida Console";
  screenContext.fillText("CLICK TO FOCUS", 37, data.projection.halfHeight);
}

function renderBuffer() {
  // debug clear buffer
  let canvas = document.createElement("canvas");
  canvas.width = data.projection.width;
  canvas.height = data.projection.height;
  let context = canvas.getContext("2d");

  context.putImageData(data.projection.imageData, 0, 0);
  screenContext.drawImage(canvas, 0, 0);
}
