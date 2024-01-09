import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseInterceptors} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdatePatchUserDto} from "./dto/update-patch-user.dto";
import {UserService} from "./user.service";
import {LogInterceptor} from "../interceptors/log.interceptor";
import {CustomParamId} from "../decorators/param-id.decorator";

@Controller('user')
export class UserControllers {

    constructor(private userService: UserService) {
    }

    @UseInterceptors(LogInterceptor)
    @Post()
    async createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user);
    }

    @Get()
    async listUsers() {
        return this.userService.listAllUsers();
    }

    @Get(':id')
    async searchUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.searchUser(id);
    }

    @Put(':id')
    async updateUser(@Body() user: UpdateUserDto, @CustomParamId() id: number) {
        console.log('ID RETORNA', id)
        return this.userService.updateUser(id, user);
    }

    @Patch(':id')
    async updateUserPartial(@Body() user: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updateUserPartial(id, user);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}