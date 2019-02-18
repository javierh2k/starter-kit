import {
    Authorized,
    JsonController,
    OnUndefined,
    Post,
    Body
} from 'routing-controllers';
import { AuthService } from '../../auth/AuthService';
import { Login } from './requests/Login';
import { User } from '../models/User';

@JsonController('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @Authorized()
    // @Post('/login')
    // @OnUndefined(200)
    // public login(ev: any): any {
    //     console.log(ev);
    //     return undefined;
    // }

    @Post('/login')
    public login(@Body({ validate: true }) { email, password }: Login): Promise<
        User
    > {
        return this.authService.login(email, password);
    }

    // @Post()
    // public login(@Body() user: User): Promise<User> {
    //     return this.userService.create(user);
    // }

    @Post('/logout')
    @OnUndefined(200)
    public logout(): undefined {
        return undefined;
    }
}

/*import {
    Body,
    JsonController,
    Post,
    UseBefore,
    HeaderParam
} from 'routing-controllers';
import { AuthService } from '../services/AuthService';

// import { ClientFromHeader, IClient } from '@redwagon/multitenant-helper';
// import { celebrate } from 'celebrate';

// import { IUser } from '../../shared/interfaces/IUser';
// import { login, refreshToken } from '../schemas/common/request';
// import { getAndThrowBoomError } from '../../shared/utils/http';
// import { authenticationHeadersDecorator } from '../../shared/decorators/AuthenticationHeadersDecorator';
// import { AuthenticationService } from '../services/AuthenticationService';

@JsonController('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    // @UseBefore(celebrate(login))
    public login(
        @Body() user: any,
        @HeaderParam('authorization') headers: string
    ): Promise<any> {
        return this.authService.login(user.email, user.password, headers);
        // .catch(getAndThrowBoomError);
    }

    // @Post('/refresh')
    // @UseBefore(celebrate(refreshToken))
    // refreshToken(@Body() refreshToken: any, @authenticationHeadersDecorator() headers: any): Promise<any> {
    //     return this.authenticationService.refreshToken(refreshToken, headers)
    //         .catch(getAndThrowBoomError);
    // }
}
*/
