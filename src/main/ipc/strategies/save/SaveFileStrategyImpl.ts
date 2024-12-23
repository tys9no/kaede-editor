import { SaveFileStrategy } from './SaveFileStrategy';
import * as fs from 'fs';

export class SaveFileStrategyImpl implements SaveFileStrategy {
  constructor(private outputFilePath: string) { }

  async execute(fileContent: string): Promise<void> {
    if (!this.outputFilePath) {
      throw new Error('No file path unavailable.');
    }
    await fs.promises.writeFile(this.outputFilePath, fileContent, 'utf-8');
  }
}
