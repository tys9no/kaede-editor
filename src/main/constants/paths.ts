import * as path from "path";
import * as os from "os";
import { IS_DEV } from "./env";

export const TEMP_DIR = path.join(os.tmpdir(), "kaede-pu");
export const PLANTUML_PATH = IS_DEV
  ? path.join(__dirname, "resources", "plantuml.jar")
  : path.join(path.dirname(process.execPath), "resources", "plantuml.jar");
export const TEMPLATE_DIR = path.join(__dirname, "templates");
export const MERMAID_JS_PATH = path.join(TEMPLATE_DIR, "mermaid.min.js");
export const INDEX_TEMPLATE_PATH = path.join(TEMPLATE_DIR, "index.ejs");
export const LOG_FILE = path.join(os.homedir(), "kaede-pu", "app.log");
