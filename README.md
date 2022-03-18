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


# Controller制御

`src/auth/auth.service.ts`

```ts
import { Injectable } from "@nestjs/common";

// AuthControllerへつなげる処理をここで簡潔にする。
@Injectable({})
export class AuthService {
    signup() {
        return { msg: 'I have signed up' }
    }

    signin() {
        return { msg: 'I have signed in' }
    }
}

const service = new AuthService()
```

`src/auth/auth.controller.ts`

```ts
// 基本的には、service側で行う処理を本ファイルで制御する、というのが普通のやり方である。
import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  // constructorで予めAuthServiceを設定しておく
  constructor(private authService: AuthService) {
  }

  @Post('signup')
  signup() {
      return this.authService.signup()
  }

  @Post('signin')
  signin() {
      return this.authService.signin()
  }
}
```

# prismaのインストール

```
npm add -D prisma@latest
npm add @prisma/client
npx prisma init
```

これらの手順を踏まえると、新規で`prisma/schema.prisma`ファイルが作成される。

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

# データベースのModel作成

`prisma/schema.prisma`にデータベースのModelを作成する

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  email String
  hash String

  firstname String?
  lastname String?
}

model Bookmark {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  title String
  description String?
  link String
}
```

`.env`(パスワードやデータベース設定名を文字列に挿入する)

```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB (Preview) and CockroachDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

あとはこれらのモデルをDockerのPostgreSQLに接続するだけ。

```
npx prisma migrate dev
```

# 余談

Nestはディレクトリや設計思想がAngularにそっくりである。Angularの開発経験があれば簡単に導入できそうだ。(しかもデフォルトでTypeScriptの開発ができる。**Angularをバックエンドで実装するような感じがしてめちゃくちゃおもしろい**)

# バグ修正

## Docker✕Postgre環境構築でハマる

```powershell
docker pull postgres
docker pull postgres:latest
docker run --name postgres-0 -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:latest # 最終的にコンテナを作成する
```

このような感じで実際にやってみたが、`localhost:5432`が起動せずデータベースをmigrateできない。**しかし、これはデータベースをsqliteにしたら何の問題もなく解決した。**

# 参考サイト

* [Prisma](https://www.prisma.io/)
* [Nest Tutorial - freeCodeCamp](https://youtu.be/GHTA143_b-s)