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

ファイルを作成したあと、`src/app.module.ts`にアクセスしてプログラムを編集する

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})

export class AppModule {}
```

## 自動でモジュールを生成

上記の設定は自動で行える。以下のコマンドを順番に実行する

```
nest g module user
nest g module bookmark
```

そうすると、`src`フォルダの下にそれぞれ`user`と`bookmark`フォルダが作成される。その際に、`src/app.module.ts`の内容も自動で更新されるようになる

▼出力結果

```
CREATE src/user/user.module.ts (81 bytes)
UPDATE src/app.module.ts (216 bytes)

CREATE src/bookmark/bookmark.module.ts (85 bytes)
UPDATE src/app.module.ts (293 bytes)
```

`src/app.module.ts`(**自動で編集される**)

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// これらの部分が自動で編集されるようになる
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule],
})
export class AppModule {}
```

# `AuthModule`の設定

`auth`フォルダに`auth.controller.ts`と`auth.serive.ts`をそれぞれ新規作成する

`src/auth/auth.controller.ts`

```ts
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()

export class AuthController {}
```

`src/auth/auth.service.ts`

```ts
import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthService {}
```

以上のファイルを編集した後、`src/auth/auth.module.ts`を新規作成する

```ts
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
```

`src/auth/auth.service.ts`

```ts
import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthService {}

// AuthServiceインスタンスを新規作成する
const service = new AuthService()
```

`src/auth/auth.controller.ts`

```ts
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()

export class AuthController {
  // authServiceをプライベート変数に設定することで、controllerとserviceを連携させる
  constructor(private authService: AuthService) {
  }
}
```

`src/auth/auth.service.ts`

```ts
import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthService {
    login() {

    }

    signup() {
        
    }
}

const service = new AuthService()
```

# 余談

Nestはディレクトリや設計思想がAngularにそっくりである。Angularの開発経験があれば簡単に導入できそうだ。(しかもデフォルトでTypeScriptの開発ができる。**Angularをバックエンドで実装するような感じがしてめちゃくちゃおもしろい**)