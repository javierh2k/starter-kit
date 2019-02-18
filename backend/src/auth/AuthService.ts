import * as express from 'express';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, ILogger } from '../decorators/Logger';

import { unauthorized } from 'boom';
import { Redis, IRedis } from '../decorators/Redis';
import { head } from 'ramda';
import { env } from '../env';
import * as jwt from 'jsonwebtoken';

@Service()
export class AuthService {
    private tokenList = {};
    constructor(
        @Logger(__filename) private log: ILogger,
        @OrmRepository() private userRepository: UserRepository,
        @Redis() private redisService: IRedis
    ) {
        // this.tokenList = {};
    }

    public async login(email: string, password: string): Promise<any> {
        // const user = await this.userRepository._findOneEmail(email);
        this.log.info('METHOD LOGIN');
        const user = await this.validateUser(email, password);
        if (user) {
            const token = jwt.sign({ uid: user.id }, env.app.salt, {
                // expiresIn: 60 * 60,
                algorithm: 'HS256',
                expiresIn: env.app.tokenLife, // '5h'let the token expire after 2 hours of creation
                jwtid: user.id, // unique identifier (uuid.v4())
            });
            // jwt.sign({ uid: user.id }, secret, { expiresIn: 60 * 60, algorithm: 'HS256'})

            this.redisService.saveObject(token, user);

            const refreshToken = jwt.sign(
                // JSON.stringify(user),
                { uid: user.id },
                env.app.refreshSalt,
                {
                    expiresIn: env.app.refreshTokenLife, // '24h',
                    algorithm: 'HS256',
                    jwtid: user.id,
                }
            );
            const response = {
                status: 'Logged in',
                token,
                refreshToken,
            };
            this.tokenList[refreshToken] = response;
            return response; // ;Promise.resolve({ data: '123456' });
        }
        throw unauthorized(
            'Sorry, that email or password is invalid, please try again.'
        );
    }

    public refresh(refreshToken: string): any {
        const loadUser = this.redisService.loadObject(refreshToken);
        const user = head(loadUser); // .toJSON();
        console.log(user);

        if (user && refreshToken && refreshToken in this.tokenList) {
            const token = jwt.sign(JSON.stringify(user), env.app.salt, {
                expiresIn: env.app.tokenLife,
            });
            this.redisService.saveObject(token, user);
            const response = {
                token,
            };
            // update the token in the list
            this.tokenList[refreshToken].token = token;
            return response;
        } else {
            throw new Error('Invalid request');
        }
    }

    public parseBasicAuthFromRequest(
        req: express.Request
    ): { email: string; password: string } {
        const authorization = req.header('authorization');
        const token = authorization && authorization.split(' ')[1];
        // console.log('AUTH:', authorization);
        // console.log('TOKEN:', token);
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            this.log.info('Credentials provided by the client');

            const loadUser = this.redisService.loadObject(token);
            const user = head(loadUser); // .toJSON();
            console.log(user);

            const decoded = this.checker(token);
            console.log('TOKEN', token);
            console.log('DEC', decoded, '<<<<<<<<');
            const email = 'bruce.wayne@wayne-enterprises.com'; // user.email; //
            const password = '1234'; // user.password;
            // if (decoded) {
            if (email && password) {
                return { email, password };
            }
            // }
            // const decodedBase64 = Buffer.from(
            //     authorization.split(' ')[1],
            //     'base64'
            // ).toString('ascii');
            // const email = decodedBase64.split(':')[0];
            // const password = decodedBase64.split(':')[1];
        }

        // const userData = await this.userRepository._findOne(user.id);
        //     this.redisService.set('token', userData);

        //     console.log(headers);

        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async validateUser(email: string, password: string): Promise<User> {
        console.log('USER', email, password);
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (await User.comparePassword(user, password)) {
            return user;
        }

        return undefined;
    }

    private checker(token: string): string {
        // const token = req.body.token || req.query.token || req.headers['x-access-token']  x-access-header
        console.log('CHECK', token);
        if (token) {
            // verifies secret and checks exp
            // const resp = jwt.verify(token, env.app.salt, (err, decoded) => {
            //     // if (err) {
            //     //     return '';
            //     // }
            //     console.log('ERR: ', err);
            //     console.log('COMP: ', decoded);
            //     return decoded;
            // });

            const verifyOptions = {
                // expiresIn: '12h',
                algorithm: ['RS256'],
            };

            const de = jwt.decode(token, { complete: true });
            console.log('ddddddd:', de);
            const resp = jwt.verify(token, env.app.salt);
            console.log(
                env.app.salt +
                '\nJWT verification result: ' +
                JSON.stringify(resp)
            );

            console.log('RESP: DECODED', resp);
            return resp;
        }
        return '';
    }
}
