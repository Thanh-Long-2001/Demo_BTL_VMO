import { 
    Controller,
    Post, 
    Get,
    Body,
    Request,
    UseGuards,
    Res
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    //Register
    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO ) {
        const user = await this.userService.addUser(createUserDTO);
        return user;
    }

    //Login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const accessToken = await this.authService.getJwtToken(req.user);
        const refreshToken = await this.userService.getRefreshToken(req.user._id);
        const secretData = {
            accessToken,
            refreshToken,
        }
        console.log(secretData);
        res.cookie('auth-cookie', secretData, {httpOnly: true});
        return {msg: 'login success'};
    }

    //RefreshToken
    @UseGuards(RefreshJwtAuthGuard)
    @Get('/refreshToken')
    async generateAccessToken(@Request() req, @Res({ passthrough: true }) res: Response) {
        const accessToken = await this.authService.getJwtToken(req.user)
        const refreshToken = await this.userService.getRefreshToken(req.user.userId)
        const secretData = {
            accessToken,
            refreshToken
        }
        console.log(secretData)

        res.cookie('auth-cookie', secretData, { httpOnly: true });
        return {msg:'refresh token success'};
    }

    // Get info user
    @Get('/user')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    async getProfile(@Request() req) {
        return req.user;
    }

    // Get admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/admin')
    async getDashboard(@Request() req) {
        return req.user;
    }
}
