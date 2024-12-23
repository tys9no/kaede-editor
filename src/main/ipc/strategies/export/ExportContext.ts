import { ExportStrategy } from './ExportStrategy';

export class ExportContext {
  private strategy: ExportStrategy;

  constructor(strategy: ExportStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ExportStrategy): void {
    this.strategy = strategy;
  }

  async export(content: string): Promise<void> {
    if (!this.strategy) {
      throw new Error('No save strategy is set.');
    }
    await this.strategy.execute(content);
  }
}
