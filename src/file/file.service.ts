import {Injectable} from "@nestjs/common";
import {writeFile} from "fs/promises";
import {join} from "path";
import {User} from "@prisma/client";

@Injectable()
export class FileService {

    async uoloadFile(user: User, file: Express.Multer.File) {
        const path = join(__dirname, '../../storage/photos', `file-${user.id}.png`)
        return await writeFile(path, file.buffer);
    }
}