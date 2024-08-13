import { SCAlE_FACTOR } from "./constants";

export function makePlayer(k) {
  return k.make([
    k.sprite("kriby"),
    k.area({
      shape: new k.Rect(k.vec2(0, 1.5), 8, 5), // 矩形,高度为 5,宽度为 8，中心点为 (0, 1.5)
    }),
    k.anchor("center"), // 锚点
    k.body({ jumpForce: 600 }), // 允许跳跃,且跳跃力为 600
    k.pos(),
    k.scale(SCAlE_FACTOR), // 缩放因子
    {
      isDead: false,
      speed: 600,
      inputControllers: [], // 键盘控制
      setControls() {
        const jumpLogic = () => {
          k.play("jump"); // 跳跃声音
          this.jump(); // this 指的是 player 对象,引用整个游戏对象
        };

        // 按下空格键，跳跃
        this.inputControllers.push(k.onKeyPress("space", jumpLogic));
        this.inputControllers.push(k.onClick(jumpLogic));
        this.inputControllers.push(k.onGamepadButtonPress("south", jumpLogic)); // 游戏手柄：方向下 键跳跃
      },
      disableControls() {
        // 禁用控制器
        this.inputControllers.forEach((inputController) =>
          inputController.cancel()
        );
      },
    },
  ]);
}
