import { SaveFileStrategy } from './SaveFileStrategy';

export class SaveFileContext {
  private strategy: SaveFileStrategy;

  constructor(strategy: SaveFileStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SaveFileStrategy): void {
    this.strategy = strategy;
  }

  async save(content: string): Promise<void> {
    if (!this.strategy) {
      throw new Error('No save strategy is set.');
    }
    await this.strategy.execute(content);
  }
}
