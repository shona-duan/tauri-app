import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api";

function makeSaveSystem(saveFileName) {
  // 保存游戏数据
  return {
    data: {},
    async save() {
      await writeTextFile(saveFileName, JSON.stringify(this.data), {
        dir: BaseDirectory.AppLocalData,
      });
    },
    async load() {
      try {
        this.data = JSON.parse(
          await readTextFile(this.saveFileName, {
            dir: BaseDirectory.AppLocalData,
          })
        );
      } catch (e) {
        // 第一次打开游戏时，还没有游戏数据
        this.data = {};
      }
    },
  };
}

export const saveSystem = makeSaveSystem("save.json");
