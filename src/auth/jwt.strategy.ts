import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.entity';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: { id: string; scr: string }) {
    const { id, scr } = payload;
    const user = await User.findOne({ where: { id: id, token: scr } });

    if (!user) throw new UnprocessableEntityException('026');

    return user;
  }
}
