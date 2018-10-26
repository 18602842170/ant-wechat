import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IUserGet } from "./user.service";

export class LoginService {
  public token: string;
  public user: IUserGet;
  public userInfo: {
    avatarUrl?: string;
    city?: string;
    province?: string;
    country?: string;
    gender?: number;
    nickName?: string;
    language?: string;
  };

  public getTokenByCode(code: string): Observable<any> {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/not_verifying/getTokenByCode/`,
      data: {
        code,
      },
      method: "GET",
    })).pipe(
      map((response) => {
        if (response.data.token) {
          wepy.setStorageSync(TOKEN_NAME, response.data.token);
          this.token = response.data.token;
          this.user = response.data.user;
          this.userInfo = {
            avatarUrl: response.data.user.wechatAvatarUrl,
            city: response.data.user.wechatCity,
            province: response.data.user.wechatprovince,
            country: response.data.user.wechatCountry,
            gender: response.data.user.wechatGender,
            nickName: response.data.user.nickName,
          };
        }
        return response.data.token;
      }),
    );
  }

  public wechatLogin(name: string, password: string, code: string): Observable<any> {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/not_verifying/wechat_login/`,
      data: {
        name,
        password,
        code,
      },
      method: "GET",
    })).pipe(
      map((response) => response.data),
    );
  }

  public verifyCodeLogin(name: string, verifyCode: string) {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/not_verifying/verifyCode_login`,
      data: {
        name,
        verifyCode,
      },
      method: "GET",
    })).pipe(
      map((response) => {
        if (response.data.token) {
          wepy.setStorageSync(TOKEN_NAME, response.data.token);
          this.token = response.data.token;
          this.user = response.data.user;
          if (response.data.user.wechatAvatarUrl) {
            this.userInfo = {
              avatarUrl: response.data.user.wechatAvatarUrl,
              city: response.data.user.wechatCity,
              province: response.data.user.wechatprovince,
              country: response.data.user.wechatCountry,
              gender: response.data.user.wechatGender,
              nickName: response.data.user.nickName,
            };
          }
        }
        return response.data;
      }),
    );
  }

  public verify(token): Observable<string> {
    return ObservableFrom(wepy.request({
      url: `${BACKEND_URL}/user/getUserByWechatSessionId`,
      header: {
        Authorization: token,
      },
      data: {
        token,
      },
      method: "GET",
    })).pipe(
      map((response) => {
        if (response.statusCode === 200 && !response.data.code) {
          this.user = response.data;
          return "success";
        } else {
          return "Login expired";
        }
      }),
      catchError((error) => {
        if (error.json().non_field_errors) {
          return ObservableOf("Login expired");
        } else {
          return ObservableOf("network error");
        }
      }),
    );
  }

  public getToken(): Observable<string> {
    const token = wepy.getStorageSync(TOKEN_NAME);
    if (token) {

      return ObservableOf(wepy.getStorageSync(TOKEN_NAME));
    } else {
      return throwError(new Error("no token"));
    }
  }

  public getPhoneVerifyCode(phoneNumber: string): Observable<string> {
    return ObservableFrom(wepy.request({
      url: BACKEND_URL + "/phoneverify/send_code/",
      data: {
        phone_number: phoneNumber,
        expires: "60",
      },
      method: "POST",
    })).pipe(
      map((response) => {
        return response.data.code;
      }),
    );
  }

  public checkPhoneVerifyCode(code: string, userName: string, password: string): Observable<string> {
    return ObservableFrom(wepy.request({
      url: BACKEND_URL + "/not_verifying/phone_check/",
      data: {
        code,
        userName,
        password,
      },
      method: "GET",
    })).pipe(
      map((response) => {
        if (response.data.token) {
          wepy.setStorageSync(TOKEN_NAME, response.data.token);
          this.token = response.data.token;
          this.user = response.data.user;
        }
        return response.data.token;
      }),
    );
  }
}
