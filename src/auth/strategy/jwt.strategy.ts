import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        public prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWT_SECRET")
        })
    }

    async validate(payload: { sub: number, email: String }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        delete user.password;
        return user;
    }
}