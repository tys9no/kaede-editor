export interface ExportStrategy {
  execute(content: string): Promise<void>;
}
