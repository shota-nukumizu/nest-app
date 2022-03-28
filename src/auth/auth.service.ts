import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    signup(dto: AuthDto) {
        return { msg: 'I have signed up' }
    }

    signin() {
        return { msg: 'I have signed in' }
    }
}