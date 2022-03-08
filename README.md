# Nest-Tutorial

NodeのフレームワークNestで簡単なWebアプリを開発してみた(**ちなみにNest自体はバックエンド開発で使われる。Nodeのフレームワークなので、フロントエンド開発では使えないのでその点に関してはご用心**)

# 実行

```
$ npm run start:dev
```

# コード

`src/main.ts`：Nestアプリのインスタンスを作成するための中核ファイル

```ts
// 開発者サーバを立ち上げる
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

`src/app.service.ts`：Nestアプリのサービスを担う

```ts
// ブラウザ上にHello Worldを表示させる
import { Injectable } from '@nestjs/common';

// ブラウザに文字を表示させる関数
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

`src/app.module.ts`：Nestアプリのモジュール管理

```ts
// モジュール管理
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`src/app.controller.spec.ts`：Nestアプリのユニットテスト(`unittest`)を行う

```ts
// アプリケーション実行環境の管理
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

# セットアップ

まずは、`src`フォルダの中にあるファイルを以下の２つにする。それ以外のファイルはすべて削除。

```
app.module.ts
main.ts
```

`src/app.module.ts`

```ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
})
export class AppModule {}
```

# モジュール設定

## 手動でモジュールを設定する

`src/auth/auth.module.ts`(手動で作成)

```ts
import { Module } from "@nestjs/common";

@Module({
  imports: [],
})
export class AuthModule {}
```

# 余談

Nestはディレクトリや設計思想がAngularにそっくりである。Angularの開発経験があれば簡単に導入できそうだ。(しかもデフォルトでTypeScriptの開発ができる。**Angularをバックエンドで実装するような感じがしてめちゃくちゃおもしろい**)