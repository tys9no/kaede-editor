export interface SaveFileStrategy {
  execute(content: string): Promise<void>;
}
