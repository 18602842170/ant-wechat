import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Index extends wepy.page {
  public data = {
    longin: "未登录",
  };
  public services: IServices;
  public onLoad() {
    this.services = getServices(this);

    // 已绑定过的系统账户自动登陆
    this.services.authService.logout()
      .pipe(
        switchMap((flag) => {
          return ObservableFrom(wepy.login());
        }),
        switchMap((res) => {
          if (res.code) {
            // 发起网络请求，用微信openid进行登陆
            return this.services.loginService.getTokenByCode(res.code);
          } else {
            return throwError("自动登录失败！");
          }
        }),
        // 验证登陆状态
        switchMap((token) => {
          if (token) {
            return this.services.authService.login();
          } else {
            return throwError("自动登录失败！");
          }
        }),
    )
      .subscribe((msg) => {
        if (this.services.loginService.userInfo.avatarUrl) {
          // 跳转到首页
          this.goDashboar();
        } else {
          // 跳转到微信信息获取页
          wepy.redirectTo({
            url: `/pages/wechat_user_info/wechat_user_info`,
          });
        }
      }, (error) => {
        // 未登陆状态跳转到首页
        this.goDashboar();
      },
    );
  }

  public async onShow() {
    //
  }

  public goDashboar() {
    // 跳转到首页
    wepy.redirectTo({
      url: this.services.authService.redirectUrl,
    });
  }
}
