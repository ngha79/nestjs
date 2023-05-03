import { Body, Controller, Post, Req, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')

export class AuthController {
    // auth service is automatically created then initializing the controller
    constructor(private authService: AuthService) {
    }

    // create account
    @Post("/register")
    register(@Body() dto: AuthDto) {
        return this.authService.register(dto)
    }

    // login page
    @Post("/login")
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto)
    }


}