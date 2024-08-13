import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";

import { SCAlE_FACTOR } from "./constants";

import { makeBackground } from "./utils";
import { makePlayer } from "./player";

// 创建画布
const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true, // 缩放同时保持宽高比
  global: false, // 函数不能全局调用，只能从 k 中调用，让代码保持干净
  scale: 2, //缩放两倍
});

// 加载资源--障碍物背景和云彩
k.loadSprite("kriby", "./kriby.png");
k.loadSprite("obstacles", "./obstacles.png");
k.loadSprite("clouds", "./clouds.png");
k.loadSprite("background", "./background.png");

// 加载声音
k.loadSound("jump", "./jump.wav");
k.loadSound("confirm", "./confirm.wav");
k.loadSound("hurt", "./hurt.wav");

// F11 全屏
addEventListener("keydown", async (event) => {
  if (event.code === "F11") {
    if (await appWindow.isFullScreen()) {
      await appWindow.setFullScreen(false);
      return;
    }

    appWindow.setFullScreen(true);
  }
});

// 游戏场景
k.scene("start", async () => {
  makeBackground(k);

  const map = k.add([
    k.sprite("background"),
    k.pos(0, 0),
    k.scale(SCAlE_FACTOR),
  ]);

  // 有很多个云，不只是一张云的图片,这就是为什么是云的游戏对象，而不是每个单独的云作为游戏对象
  const clouds = map.add([
    k.sprite("clouds"),
    k.pos(),
    {
      speed: 5,
    },
  ]);

  // 用 onUpdate：每帧运行一次(每秒60次)此函数，让云平滑移动
  clouds.onUpdate(() => {
    // move：移动函数，允许以一定的速度沿着 X 坐标或者 Y 坐标向左或向右移动，以下代表沿着 X 坐标向右移动
    clouds.move(clouds.speed, 0);

    // 如果云的 x 坐标大于 700，则将其 x 坐标重置为 -500,这样 云 就会往左移动，有无限的云
    if (clouds.pos.x > 700) {
      clouds.pos.x = -500;
    }
  });

  // 添加障碍物
  map.add([k.sprite("obstacles"), k.pos()]);

  // 添加播放器
  const player = k.add(makePlayer(k));
  player.pos = k.vec2(k.center().x - 350, k.center().y + 50);

  // 开始按钮
  const playBtn = k.add([
    k.rect(200, 50, { radius: 3 }),
    k.color(k.Color.fromHex("#14638e")),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x + 30, k.center().y + 60),
  ]);

  playBtn.add([
    k.text("Play", { size: 24 }),
    k.color(k.Color.fromHex("#d7f2f7")),
    k.area(),
    k.anchor("center"),
  ]);

  const goToGame = () => {
    k.play("confirm"); // 播放确认音效
    k.go("main");
  };
  playBtn.onClick(goToGame);
  k.onKeyPress("space", goToGame);
  k.onGamepadButtonDown("south", goToGame);
});

k.scene("main", async () => {});

k.go("start");
