function collisionDetect(rect1, rect2) {
  let x =
    (rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x >=
      rect2.position.x &&
      rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x <=
        rect2.position.x + rect2.width) ||
    (rect1.position.x - rect1.attackBox.offset.x <= rect2.position.x &&
      rect1.position.x + rect1.attackBox.width - rect1.attackBox.offset.x >=
        rect2.position.x + rect2.width) ||
    (rect1.position.x - rect1.attackBox.offset.x >= rect2.position.x &&
      rect1.position.x - rect1.attackBox.offset.x <=
        rect2.position.x + rect2.width);
  let y =
    (rect1.attackBox.position.y >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height) ||
    (rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y + rect1.attackBox.height <=
        rect2.position.y + rect2.height);
  return x && y;
}