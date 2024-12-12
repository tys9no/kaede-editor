# PlantUML表記

## シーケンス図
```plantuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
```


## ユースケース図
```plantuml

(First usecase)
(Another usecase) as (UC2)
usecase UC3
usecase (Last\nusecase) as UC4

```

## クラス図
```plantuml
abstract        abstract
abstract class  "abstract class"
annotation      annotation
circle          circle
()              circle_short_form
class           class
class           class_stereo  <<stereotype>>
diamond         diamond
<>              diamond_short_form
entity          entity
enum            enum
exception       exception
interface       interface
metaclass       metaclass
protocol        protocol
stereotype      stereotype
struct          struct
```

## オブジェクト図
```plantuml
object firstObject
object "My Second Object" as o2
```

## アクティビティ図（レガシー構文はこちら）
```plantuml
:Hello world;
:This is defined on
several **lines**;
```

## コンポーネント図
```plantuml

[First component]
[Another component] as Comp2
component Comp3
component [Last\ncomponent] as Comp4

```

## 配置図
```plantuml
actor アクター
actor/ "アクター/"
agent エージェント
artifact アーティファクト
boundary 境界
card カード
circle 円
cloud クラウド
collections コレクション
component コンポーネント
control コントロール
database データベース
entity エンティティ
file ファイル
folder フォルダ
frame フレーム
hexagon 六角形
interface インターフェイス
label ラベル
node ノード
package パッケージ
person 人型
queue キュー
rectangle 四角形
stack スタック
storage ストレージ
usecase ユースケース
usecase/ "ユースケース/"
```

## 状態図
```plantuml

[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]

```

## タイミング図
```plantuml
robust "ウェブブラウザ" as WB
concise "ユーザ" as WU

@0
WU is アイドル
WB is アイドル

@100
WU is 待機
WB is 処理中

@300
WB is 待機
```
