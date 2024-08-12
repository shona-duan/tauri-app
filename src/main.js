import { appWindow } from "@tauri-apps/api/window";
import kaplay from "kaplay";

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
