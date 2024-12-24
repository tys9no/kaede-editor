import { ExportStrategy } from './ExportStrategy';
import * as fs from 'fs';
import path from 'path';
import ejs from 'ejs';

import logger from '../../../utils/Logger';

export class ExportHtmlStrategyImpl implements ExportStrategy {
  constructor(private outputFilePath: string) {}

  async execute(markdownContent: string): Promise<void> {
    if (!this.outputFilePath) {
      throw new Error('No file path unavailable.');
    }

    const templateFilePath = path.join(__dirname, 'templates', 'index.ejs');
    const mermaidJsFilePath = path.join(__dirname, 'templates', 'mermaid.min.js');

    try {
      const templateContent = await fs.promises.readFile(templateFilePath, 'utf-8');
      const mermaidJsContent = await fs.promises.readFile(mermaidJsFilePath, 'utf-8');
      const exportedHtmlContent = ejs.render(templateContent, {
        htmlContent: markdownContent,
        jsContent: mermaidJsContent,
      });
      await fs.promises.writeFile(this.outputFilePath, exportedHtmlContent, 'utf-8');
    } catch (error) {
      logger.error(error);
    }
  }
}
