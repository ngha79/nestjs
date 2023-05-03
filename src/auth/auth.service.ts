import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()

export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    async register(authDto: AuthDto) {
        try {
            const hash = await argon.hash(authDto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: authDto.email,
                    password: hash,
                }
            })
            return await this.signJwtToken(user.id, user.email)
        } catch (error) {
            if (error.code == 'P2002') {
                //throw new ForbiddenException(error.message)
                //for simple
                throw new ForbiddenException(
                    'User with this email already exists'
                )
            }
            throw error;
        }
    }

    async login(authDto: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDto.email
            }
        })
        if (!user) throw new ForbiddenException('User does not exist!')
        const comparePassword = await argon.verify(user.password, authDto.password);
        if (!comparePassword) throw new ForbiddenException("Incorect password , please try again!")
        return await this.signJwtToken(user.id, user.email)
    }

    async convertToJwtString(userId: number, email: String): Promise<String> {
        const payload = {
            sub: userId,
            email
        }
        return this.jwtService.sign(payload, {
            expiresIn: "10m",
            secret: this.configService.get('JWT_SECRET')
        })
    }
    //convert to an object, not string
    async signJwtToken(userId: number, email: String): Promise<{ accessToken: String }> {
        const payload = {
            sub: userId,
            email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: "10m",
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString
        }
    }
}