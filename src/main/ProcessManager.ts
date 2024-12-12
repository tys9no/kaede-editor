import { ChildProcess, exec } from "child_process";

class ProcessManager {
  private static instance: ProcessManager;
  private processes: Set<ChildProcess> = new Set();

  private constructor() { }

  // シングルトンパターン
  public static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }

  // プロセスを追加して監視
  public add(process: ChildProcess): void {

    this.processes.add(process);

    // プロセス終了時に自動で削除
    process.on("exit", () => {
      this.processes.delete(process);
      console.log("Process exited and removed from manager.");
    });
  }

  // すべてのプロセスを停止
  public async terminateAll(): Promise<void> {
    const terminationPromises = Array.from(this.processes).map(
      (process) =>
        new Promise<void>((resolve) => {
          process.on("exit", () => resolve());
          process.kill("SIGINT");
        })
    );

    await Promise.all(terminationPromises);
    console.log("All processes have been terminated.");
  }

  // 現在のプロセス数を取得
  public getProcessCount(): number {
    return this.processes.size;
  }
}

export default ProcessManager;
