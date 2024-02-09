/*
Define a ray angle in relation of player FOV
Create a ray loop. This loop will iterate the screen width
Get the sin and cos of the ray angle to discover the numbers to increment to follow forward with the ray
Create a loop to check if the position of the ray is an wall. If the position is not a wall, increment with sin and cos values and check again
After find a wall, get the distance between player coordinates and ray coordinates with pythagoras theorem
Discover the wall height reversing the got distance in relation of the half height of the screen using divide operator
draw the "ceiling" line from the top of the screen to the top of the wall height
draw the "wall" line in relation of the wall height obtained
draw the "floor" line from the bottom of the wall height to the bottom of the screen
Repeat this process for every ray (x-axis screen coordinate)
*/

console.log("Definition of variables");
let canvasContainer = document.getElementById("canvas-container");
let data = {
  screen: {
    width: 800,
    height: 600,
    halfWidth: null,
    halfHeight: null,
    scale: 1,
  },
  render: {
    delay: 16.6,
    lastUpdate: null,
    frameInterval: 1000 / 60,
  },
  projection: {
    width: null,
    height: null,
    halfWidth: null,
    halfHeight: null,
    imageData: null,
    buffer: null,
  },
  rayCasting: {
    incrementAngle: null,
    precision: 64,
  },
  player: {
    fov: 60,
    halfFov: null,
    x: 2,
    y: 2,
    angle: 90,
    radius: 10,
    speed: {
      movement: 0.05,
      rotation: 1.5,
    },
    movement: {
      y: 0,
      x: 0,
    },
  },
  key: {
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
  },
  map: [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 1, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ],
  textures: [
    {
      name: "test_floor",
      id: "test_floor",
      width: 16,
      height: 16,
      data: null,
    },
    {
      name: "wall",
      id: "brickwall",
      number: 2,
      width: 16,
      height: 16,
      data: null,
    },
  ],
  floorTextures: [
    {
      name: "test_floor",
      id: "test_floor",
      width: 16,
      height: 16,
      data: null,
    },
  ],
  backgrounds: [
    {
      width: 360,
      height: 60,
      id: "darksky",
      data: null,
    },
  ],
};
let loop = null;

console.log("Calculating values");

data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov / 2;

data.projection.width = data.screen.width / data.screen.scale;
data.projection.height = data.screen.height / data.screen.scale;
data.projection.halfWidth = data.projection.width / 2;
data.projection.halfHeight = data.projection.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.projection.width;

console.log("Creating canvas");

const screen = document.createElement("canvas");

screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = "1px solid black";

canvasContainer.appendChild(screen);
const screenContext = screen.getContext("2d");
screenContext.scale(data.screen.scale, data.screen.scale);
screenContext.translate(0.5, 0.5);
screenContext.imageSmoothingEnabled = false;

data.projection.imageData = screenContext.createImageData(
  data.projection.width,
  data.projection.height
);
data.projection.buffer = data.projection.imageData.data;

function rayCasting() {
  let rayAngle = data.player.angle - data.player.halfFov;
  for (let rayCount = 0; rayCount < data.projection.width; rayCount++) {
    let ray = {
      x: data.player.x,
      y: data.player.y,
    };

    let rayCos =
      Math.cos(degreeToRadians(rayAngle)) / data.rayCasting.precision;
    let raySin =
      Math.sin(degreeToRadians(rayAngle)) / data.rayCasting.precision;

    let wall = 0;
    while (wall === 0) {
      ray.x += rayCos;
      ray.y += raySin;
      wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
    }

    let distance = fishEyeFixRender(data, rayAngle, ray);
    let wallHeight = Math.floor(data.projection.halfHeight / distance);

    let texture = data.textures[wall - 1];

    let texturePositionX = Math.floor(
      (texture.width * (ray.x + ray.y)) % texture.width
    );

    drawSky(rayCount, wallHeight);
    drawTexture(rayCount, wallHeight, texturePositionX, texture);
    drawFloor(rayCount, wallHeight, rayAngle);

    rayAngle += data.rayCasting.incrementAngle;
  }
}

function main() {
  const render = (timestamp) => {
    if (
      !data.render.lastUpdate ||
      timestamp - data.render.lastUpdate > data.render.frameInterval
    ) {
      clearScreen();
      movementPlayer();
      rayCasting();
      renderBuffer();
      data.render.lastUpdate = timestamp;
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

window.onload = () => {
  loadTextures();
  loadBackgrounds();
  movementKeyboard(data);
  main();

  screen.onclick = () => {
    if (!loop) main();
  };

  window.addEventListener("blur", () => {
    clearInterval(loop);
    loop = null;
    renderFocusLost();
  });
};
