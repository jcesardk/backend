import {
    BadRequestException,
    Body,
    Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AuthRegisterDto} from "./dto/auth-register.dto";
import {AuthForgetPassDto} from "./dto/auth-forget-pass.dto";
import {AuthResetPassDto} from "./dto/auth-reset-pass.dto";
import {UserService} from "../user/user.service";
import {AuthGuard} from "../guards/auth.guard";
import {AuthUser} from "../decorators/auth-user.decorator";
import {SkipThrottle} from "@nestjs/throttler";
import {FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from "../file/file.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly fileService: FileService,
    ) {
    }

    @SkipThrottle()
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

    @UseGuards(AuthGuard)
    @Post('photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@AuthUser() user, @UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({fileType: 'image/png'}),
            new MaxFileSizeValidator({maxSize: 1024 * 100})
        ]
    })) file: Express.Multer.File) {
        try {
            await this.fileService.uoloadFile(user, file);
            return {success: true}
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    // @UseGuards(AuthGuard)
    // @Post('files')
    // @UseInterceptors(FilesInterceptor('files'))
    // async uploadFiles(@AuthUser() user, @UploadedFiles() files: Express.Multer.File[]) {
    //     try {
    //         await this.fileService.uoloadFile(user, files);
    //         return {success: true}
    //     } catch (e) {
    //         throw new BadRequestException(e);
    //     }
    // }

    // @UseGuards(AuthGuard)
    // @Post('files-fields')
    // @UseInterceptors(FileFieldsInterceptor([{
    //     name: 'photo',
    //     maxCount: 1
    // }, {
    //     name: 'documents',
    //     maxCount: 5
    // }
    // ]))
    // async uploadFilesFields(@AuthUser() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
    //     return files
    // }

}