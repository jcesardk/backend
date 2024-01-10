import {BadRequestException, Body, Controller, Post, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {AuthForgetPassDto} from "./dto/auth-forget-pass.dto";
import {AuthResetPassDto} from "./dto/auth-reset-pass.dto";
import {UserService} from "../user/user.service";
import {AuthGuard} from "../guards/auth.guard";
import {AuthUser} from "../decorators/auth-user.decorator";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
    }

    @Post('login')
    async loginUser(@Body() model: AuthLoginDto) {
        return this.authService.login(model.email, model.password);
    }

    @UseGuards(AuthGuard)
    @Post('register')
    async createUser(@Body() model: AuthRegisterDto) {
        try {
            return this.authService.registerUser(model);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    @Post('forget-password')
    async forgetPass(@Body() {email}: AuthForgetPassDto) {
        return this.authService.forgetPass(email);
    }

    @Post('reset-password')
    async resetPass(@Body() model: AuthResetPassDto) {
        return this.authService.resetPass(model.password, model.access_token);
    }

    // Criei um AuthGuard para manipular usuario logado com o @AuthUser pegando no header
    @UseGuards(AuthGuard)
    @Post('me')
    async checkToken(@AuthUser() user) {
        return user;
    }

}