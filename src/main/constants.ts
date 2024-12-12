import * as path from "path";
import * as os from "os";

// 開発環境かどうかを示すフラグ
export const IS_DEV = process.env.NODE_ENV === "development";

// OSがMacかどうかを判定
export const IS_MAC = process.platform === "darwin";

// 一時ディレクトリのパス（"kaede-pu"というプロジェクト用ディレクトリ）
export const TEMP_DIR = path.join(os.tmpdir(), "kaede-pu");

// ウィンドウのデフォルト設定
export const DEFAULT_WINDOW_WIDTH = 1440;
export const DEFAULT_WINDOW_HEIGHT = 810;

// ファイルフィルタ（Markdownファイル用）
export const FILE_FILTERS = [
  { name: "Markdown Files", extensions: ["md"] }
];

// HTML保存用フィルタ
export const HTML_FILTERS = [
  { name: "HTML Files", extensions: ["html"] }
];

// PlantUML用のリソースパス設定
export const PLANTUML_PATH = IS_DEV
  ? path.join(__dirname, "resources", "plantuml.jar")
  : path.join(path.dirname(process.execPath), "resources", "plantuml.jar");

// アプリケーション全体で使用するディレクトリ設定
export const TEMPLATE_DIR = path.join(__dirname, "templates");
export const MERMAID_JS_PATH = path.join(TEMPLATE_DIR, "mermaid.min.js");
export const INDEX_TEMPLATE_PATH = path.join(TEMPLATE_DIR, "index.ejs");

// ログファイルのパス
export const LOG_FILE = path.join(os.homedir(), "kaede-pu", "app.log");
