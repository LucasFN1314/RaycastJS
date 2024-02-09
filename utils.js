function degreeToRadians(deg) {
  return (deg * Math.PI) / 180;
}

function drawPixel(x, y, color) {
  let offset = 4 * (Math.floor(x) + Math.floor(y) * data.projection.width);
  if (!color) return;
  data.projection.buffer[offset] = color.r;
  data.projection.buffer[offset + 1] = color.g;
  data.projection.buffer[offset + 2] = color.b;
  data.projection.buffer[offset + 3] = color.a;
}

function drawLine(x1, y1, y2, color) {
  for (let y = y1; y < y2; y++) {
    drawPixel(x1, y, color);
  }
}

function clearScreen() {
  // screenContext.clearRect(0, 0, data.projection.width, data.projection.height);
  const black = { r: 0, g: 0, b: 0, a: 255 };
  for (let i = 0; i < data.projection.buffer.length; i += 4) {
    data.projection.buffer[i] = black.r;
    data.projection.buffer[i + 1] = black.g;
    data.projection.buffer[i + 2] = black.b;
    data.projection.buffer[i + 3] = black.a;
  }
  data.projection.imageData.data.set(data.projection.buffer);
}
