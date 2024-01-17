import {Injectable} from "@nestjs/common";
import {writeFile} from "fs/promises";
import {join} from "path";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class FileService {

    async uoloadFile(user: UserEntity, file: Express.Multer.File) {
        const path = join(__dirname, '../../storage/photos', `file-${user.id}.png`)
        return await writeFile(path, file.buffer);
    }
}