module.exports = {
  preset: 'ts-jest', // TypeScriptを使うための設定
  testEnvironment: 'node', // Electronのメインプロセスをテストする環境
  moduleFileExtensions: ['ts', 'tsx', 'js'], // 対応するファイル拡張子
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  roots: ['<rootDir>/tests'], // テストが格納されているディレクトリ
  testMatch: ['**/?(*.)+(test).ts'], // テストファイルのパターン
  moduleNameMapper: {
    '^electron$': '<rootDir>/tests/mocks/electronMock.js', // Electronのモック設定
  },
};
