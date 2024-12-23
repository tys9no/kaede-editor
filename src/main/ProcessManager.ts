import { ChildProcess} from "child_process";

class ProcessManager {
  private static instance: ProcessManager;
  private processes: Set<ChildProcess> = new Set();

  private constructor() {}

  public static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }

  public add(process: ChildProcess): void {
    this.processes.add(process);

    process.on("exit", () => {
      this.processes.delete(process);
      console.log("Process exited and removed from manager.");
    });
  }

  public async terminateAll(): Promise<void> {
    const terminationPromises = Array.from(this.processes).map((process) =>
      new Promise<void>((resolve, reject) => {
        let isExited = false;

        process.on("exit", () => {
          isExited = true;
          console.log(`Process with PID ${process.pid} exited.`);
          resolve();
        });

        process.on("error", (err) => {
          if (!isExited) {
            console.error(`Error in process with PID ${process.pid}:`, err);
            reject(err);
          }
        });

        console.log(`Sending SIGTERM to process with PID ${process.pid}`);
        process.kill("SIGTERM");

        const timeout = setTimeout(() => {
          if (!isExited) {
            console.warn(
              `Process with PID ${process.pid} did not exit in time. Sending SIGKILL.`
            );
            process.kill("SIGKILL"); // 強制終了
            resolve();
          }
        }, 5000);

        process.on("exit", () => clearTimeout(timeout));
      })
    );

    await Promise.all(terminationPromises);
    console.log("All processes have been terminated.");
  }

  public getProcessCount(): number {
    return this.processes.size;
  }
}

export default ProcessManager;
