function movementKeyboard() {
  document.addEventListener("keydown", (event) => {
    let keyCode = event.code;
    if (keyCode === data.key.up) data.player.movement.y = 1;
    else if (keyCode === data.key.down) data.player.movement.y = -1;

    if (keyCode === data.key.left) data.player.movement.x = -1;
    else if (keyCode === data.key.right) data.player.movement.x = 1;
  });

  document.addEventListener("keyup", (event) => {
    let keyCode = event.code;
    if (keyCode === data.key.up || keyCode === data.key.down)
      data.player.movement.y = 0;

    if (keyCode === data.key.left || keyCode === data.key.right)
      data.player.movement.x = 0;
  });
}

function movementPlayer() {
  let playerCos = getMovementCos();
  let playerSin = getMovementSin();

  let variation = data.player.movement.y;
  let variationX = data.player.movement.x;

  if (variation === 0 && variationX === 0) return;

  let newX = data.player.x + playerCos * variation;
  let newY = data.player.y + playerSin * variation;

  let checkX = Math.floor(newX + playerCos * variation * data.player.radius);
  let checkY = Math.floor(newY + playerSin * variation * data.player.radius);

  if (collisionCheckY(checkY)) data.player.y = newY;
  if (collisionCheckX(checkX)) data.player.x = newX;

  if (variationX !== 0)
    data.player.angle += variationX * data.player.speed.rotation;
}

function getMovementCos() {
  return (
    Math.cos(degreeToRadians(data.player.angle)) * data.player.speed.movement
  );
}

function getMovementSin() {
  return (
    Math.sin(degreeToRadians(data.player.angle)) * data.player.speed.movement
  );
}

function collisionCheck(newX, newY) {
  if (data.map[Math.floor(newY)][Math.floor(newX)] === 0) return true;
  return false;
}

function collisionCheckY(checkY) {
  if (data.map[checkY][Math.floor(data.player.x)] === 0) return true;
  return false;
}

function collisionCheckX(checkX) {
  if (data.map[Math.floor(data.player.y)][checkX] === 0) return true;
  return false;
}
