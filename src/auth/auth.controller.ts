import { 
    Controller,
    Post, 
    Get,
    Body,
    Request,
    UseGuards,
    Res,
    Param,
    BadRequestException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
import { AddVoucher } from '../user/dtos/addVoucher.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { Response } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh.guard';
import { EmailConfirmService } from '../email-confirm/email-confirm.service';
import { ChangePasswordDTO } from '../dtos/changePassword.dto'
import { EmailDTO } from '../dtos/enterEmail.dto'

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private userService: UserService,
        private emailConfirmService: EmailConfirmService
    ) {}

    //Register
    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO ) {
        const user = await this.userService.addUser(createUserDTO);
        await this.emailConfirmService.sendVerificationLink(createUserDTO.email)
        return user;
    }

    @Post('/sendMailForNewPassword')
    async sendMailForgetPassword(@Body() emailDto: EmailDTO) {
        await this.emailConfirmService.sendLinkChangePassword(emailDto.email);
        return 'send link forget password successfully';
    }

    @Post('change-password/:token')
    async changePassword(@Body() changePasswordDto: ChangePasswordDTO, @Param('token') token: string) {
        console.log(token)
        const email = await this.emailConfirmService.decodeConfirmationToken(token);
        const user = await this.userService.findByEmail(email);
        if(changePasswordDto.newPassword == changePasswordDto.confirmPassword) {
            user.password = changePasswordDto.newPassword;
            return user.save();
        }
        
    }

    //ADD Voucher to User
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/addVoucher')
    async addVoucher(@Request() req, @Body() idVoucher: AddVoucher) {
        const userId = req.user._id
        const user = await this.userService.addVoucherToUser(userId, idVoucher);
        return user;
    }

    //Login
    @ApiBody({
        description: "username: any, password: any",
    })
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const accessToken = await this.authService.getJwtToken(req.user);
        const refreshToken = await this.authService.getRefreshToken(req.user._id, req.user);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

    }

    //RefreshToken
    @UseGuards(RefreshJwtAuthGuard)
    @Post('/refreshToken')
    async generateAccessToken(@Request() req, @Body() refreshTokenParam: string ) {
        const user = await this.userService.findUserById(req.user._id);
        
        console.log(user)
        let refreshTokenInDB = user.refreshToken;
        console.log(refreshTokenInDB)
        let refreshToken = Object.values(refreshTokenParam).toString()
        if(refreshToken == refreshTokenInDB ) {
            
            const accessToken = await this.authService.getJwtToken(req.user);
            return { accessToken: accessToken}
        }
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
