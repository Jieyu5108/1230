let player1, player2;
let background;
let sprites = {
  // 第一個角色的精靈圖
  player1: {
    idle: {
      img: null,
      width: 58,
      height: 112,
      frames: 1
    },
    walk: {
      img: null,
      width: 115,
      height: 47,
      frames: 1
    },
    attack: {
      img: null,
      width: 84,
      height: 112,
      frames: 1
    }
  },
  // 第二個角色的精靈圖
  player2: {
    idle: {
      img: null,
      width: 40,
      height: 92,
      frames: 1
    },
    walk: {
      img: null,
      width: 109,
      height: 111,
      frames: 1
    },
    attack: {
      img: null,
      width: 69,
      height: 90,
      frames: 1
    }
  }
}

function preload() {
  // 載入所有圖片
  sprites.player1.idle.img = loadImage('player1_idle.png');
  sprites.player1.walk.img = loadImage('player1_walk.png');
  sprites.player1.attack.img = loadImage('player1_attack.png');
  
  sprites.player2.idle.img = loadImage('player2_idle.png');
  sprites.player2.walk.img = loadImage('player2_walk.png');
  sprites.player2.attack.img = loadImage('player2_attack.png');
  backgroundImg = loadImage('285739.png', () => {
    console.log("背景圖片載入成功");
  }, () => {
    console.error("背景圖片載入失敗");
  });
}   

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色1
  player1 = {
    x: 200,
    y: 400,
    vx: 0,
    vy: 0,
    speed: 5,
    jumpForce: -15,
    state: 'idle',
    frame: 1,
    direction: 1,
    isGrounded: true,
    health: 100,
    attackCooldown: 0
  };
  
  // 初始化角色2
  player2 = {
    x: 1400,
    y: 400,
    vx: 0,
    vy: 0,
    speed: 5,
    jumpForce: -15,
    state: 'idle',
    frame: 1,
    direction: -1,
    isGrounded: true,
    health: 100,
    attackCooldown: 0
  };
}

function draw() {
    if (backgroundImg) {
        image(backgroundImg, 0, 0, width, height); // 將背景圖片繪製到畫布上，並適配到整個螢幕
      } else {
        background(220); // 如果背景圖片尚未載入，使用灰色背景
      }
  
    // 檢查遊戲是否結束
    if (player1.health <= 0) {
      displayWinner("玩家二勝利!");
      noLoop(); // 停止 draw 函式的循環
      return;
    } else if (player2.health <= 0) {
      displayWinner("玩家一勝利!");
      noLoop(); // 停止 draw 函式的循環
      return;
    }
  
    // 更新和繪製角色
    updatePlayer(player1, 'player1');
    updatePlayer(player2, 'player2');
  
    // 顯示血量條，血量條會固定在角色上方
    drawHealth(player1, 50);
    drawHealth(player2, width - 250);
  }
  
  function displayWinner(message) {
    // 顯示勝利訊息
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(0, 255, 0);
    text(message, width / 2, height / 2);
    textSize(30)
    fill(255,0,0)
    text("按下R鍵可以重新遊玩!",width/2 ,height/2+150)
  }
  
  
  // 更新和繪製角色
  updatePlayer(player1, 'player1');
  updatePlayer(player2, 'player2');
  
  // 顯示血量條，血量條會固定在角色上方
  drawHealth(player1);
  drawHealth(player2);

function updatePlayer(player, type) {
    // 重力
    if (!player.isGrounded) {
      player.vy += 0.8;
    }
    
    // 更新位置
    player.x += player.vx;
    player.y += player.vy;
    
    // 地面碰撞
    if (player.y > height - 50) {
      player.y = height - 50;
      player.vy = 0;
      player.isGrounded = true;
    }
    
    // 更新動畫幀
    if (frameCount % 6 === 0) {
      player.frame = (player.frame + 1) % sprites[type][player.state].frames;
    }
    
    // 減少攻擊冷卻時間
    if (player.attackCooldown > 0) {
      player.attackCooldown--;
    } else if (player.state === 'attack') {
      // 如果攻擊冷卻時間結束，狀態回到 idle
      player.state = 'idle';
    }
    
    // 繪製角色
    drawPlayer(player, type);
  }

  function resetGame() {
    // 重置角色1
    player1.x = 200;
    player1.y = 400;
    player1.vx = 0;
    player1.vy = 0;
    player1.state = 'idle';
    player1.frame = 1;
    player1.direction = 1;
    player1.isGrounded = true;
    player1.health = 100;
    player1.attackCooldown = 0;
  
    // 重置角色2
    player2.x = 1400;
    player2.y = 400;
    player2.vx = 0;
    player2.vy = 0;
    player2.state = 'idle';
    player2.frame = 1;
    player2.direction = -1;
    player2.isGrounded = true;
    player2.health = 100;
    player2.attackCooldown = 0;
  
    // 重新開始遊戲的主迴圈
    loop();
  }
  
  function drawPlayer(player, type) {
  push();
  translate(player.x, player.y);
  scale(player.direction, 1);
  
  let sprite = sprites[type][player.state];
  
  image(sprite.img,
    -sprite.width/2, -sprite.height/2,
    sprite.width, sprite.height,
    player.frame * sprite.width, 0,
    sprite.width, sprite.height
  );
  
  pop();
}

function drawHealth(player) {
    const healthBarWidth = 100; // 血量條寬度
    const healthBarHeight = 10; // 血量條高度
    const offsetY = 70; // 血量條在角色上方的偏移量
  
    // 背景條
    fill(0); // 黑色背景條
    rect(player.x - healthBarWidth / 2, player.y - offsetY, healthBarWidth, healthBarHeight);
  
    // 血量條
    fill(255, 0, 0); // 紅色血量條
    let healthWidth = (player.health / 100) * healthBarWidth;
    rect(player.x - healthBarWidth / 2, player.y - offsetY, healthWidth, healthBarHeight);
  
    // 繪製血量數字
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(`${player.health}`, player.x, player.y - offsetY - 10); // 顯示數字在血量條上方
  }
  

function keyPressed() {
  // 角色1控制
  if (key === 'f' && player1.attackCooldown === 0) {
    player1.state = 'attack';
    player1.attackCooldown = 20;  // 設定攻擊冷卻時間
    checkMeleeAttack(player1, player2);
  }
  
  if (keyCode === 68) {
    player1.vx = player1.speed;
    player1.direction = 1;
    player1.state = 'walk';
  } else if (keyCode === 65) {
    player1.vx = -player1.speed;
    player1.direction = -1;
    player1.state = 'walk';
  }
  
  // 角色2控制
  if (keyCode === UP_ARROW && player2.attackCooldown === 0) {
    player2.state = 'attack';
    player2.attackCooldown = 20;  // 設定攻擊冷卻時間
    checkMeleeAttack(player2, player1);
  }

  if (keyCode === RIGHT_ARROW) { // 'D' 右
    player2.vx = player2.speed;
    player2.direction = 1;
    player2.state = 'walk';
  } else if (keyCode === LEFT_ARROW) { // 'A' 左
    player2.vx = -player2.speed;
    player2.direction = -1;
    player2.state = 'walk';
  }
  if (key === 'r' || key === 'R') {
    resetGame();
  }
}

function keyReleased() {
  if (keyCode === 68 || keyCode === 65) {
    player1.vx = 0;
    player1.state = 'idle';
  }

  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player2.vx = 0;
    player2.state = 'idle';
  }
}

// 近戰攻擊檢查
function checkMeleeAttack(attacker, defender) {
  // 檢查是否在攻擊範圍內
  if (dist(attacker.x, attacker.y, defender.x, defender.y) < 75) {
    // 造成傷害
    defender.health = max(0, defender.health - 10);
  }
}
