import { ChildProcess, exec } from "child_process";

class ProcessManager {
  private static instance: ProcessManager;
  private processes: Set<ChildProcess> = new Set();

  private constructor() {}

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
    const terminationPromises = Array.from(this.processes).map((process) =>
      new Promise<void>((resolve, reject) => {
        let isExited = false;

        // プロセス終了時の処理
        process.on("exit", () => {
          isExited = true;
          console.log(`Process with PID ${process.pid} exited.`);
          resolve();
        });

        // プロセスエラー時の処理
        process.on("error", (err) => {
          if (!isExited) {
            console.error(`Error in process with PID ${process.pid}:`, err);
            reject(err);
          }
        });

        // 優先的にSIGTERMで停止を試みる
        console.log(`Sending SIGTERM to process with PID ${process.pid}`);
        process.kill("SIGTERM");

        // タイムアウト処理（5秒経過後にSIGKILLで強制終了）
        const timeout = setTimeout(() => {
          if (!isExited) {
            console.warn(
              `Process with PID ${process.pid} did not exit in time. Sending SIGKILL.`
            );
            process.kill("SIGKILL"); // 強制終了
            resolve();
          }
        }, 5000);

        // プロセス終了時にタイムアウトをクリア
        process.on("exit", () => clearTimeout(timeout));
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
