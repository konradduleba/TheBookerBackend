import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from "./dto/AuthLoginDto.dto";
import { UserData as User } from "../user/userData.entity";
import { hashPwd } from "../utils/hash-pwd";
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): { accessToken: string, expiresIn: number } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, '!@#$%^&*()_+QWERTYUIOPASDFGHJKLZXCVBNM<>?:"{}~~|zqawxsedcrfvtgbyhnujmiko ,l', { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOne({ currentTokenId: token });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        email: req.email,
        pwdHash: hashPwd(req.pwd),
      });

      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }

      const { isDeactivated, deactivationDate } = user;

      if (isDeactivated) {
        return res.json({
          error: 'Your account has been deactivated',
          date: deactivationDate
        })
      }

      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken)
        .json({ isSuccess: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie(
        'jwt',
        {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        }
      );
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
