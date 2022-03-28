import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {

        // ハッシュ化されたパスワードを作成
        const hash = await argon.hash(dto.password)

        try {
            // データベースに新しいユーザを保存する
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })

            delete user.hash

            // ユーザの値を返す
            return user
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            
            throw error
            }
        }
    }

    signin() {
        return { msg: 'I have signed in' }
    }
}