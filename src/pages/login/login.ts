import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Login extends wepy.page {
  public services: IServices;
  public data = {
    flg: "1",
    username: "",
    password: "",
    code: "",
  };

  public onLoad() {
    this.services = getServices(this);
  }

  public async onShow() {
    //
  }

  public userNameInput(e) {
    this.data.username = e.detail.value;
  }

  public passWordInput(e) {
    this.data.password = e.detail.value;
  }

  public verifyInput(e) {
    this.data.code = e.detail.value;
  }

  public clickVerify() {
    this.data.flg = "2";
    this.setData("flg", this.data.flg);
  }

  public clickAccount() {
    this.data.flg = "1";
    this.setData("flg", this.data.flg);
  }

  // 账号登录
  public loginByAccount(e) {
    if (this.data.username && this.data.password) {
      ObservableFrom(wepy.login())
        .pipe(
          switchMap((res) => {
            if (res.code) {
              // 发起网络请求，用微信openid进行登陆
              return this.services.loginService.wechatLogin(this.data.username, this.data.password, res.code);
            } else {
              return throwError("登录失败！");
            }
          }),
      ).subscribe((data) => {
        if (data.msg === "success") {
          wepy.redirectTo({
            url: `/pages/index/index`,
          });
        } else if (data.msg === "userDelete") {
          wepy.showModal({
            title: "提示",
            content: "账号不存在",
            showCancel: false,
          });
        } else {
          wepy.showModal({
            title: "提示",
            content: "账号密码错误",
            showCancel: false,
          });
        }
      }, (error) => {
        wepy.showModal({
          title: "提示",
          content: "网络错误。请重试",
          showCancel: false,
        });
      });
    } else {
      wepy.showModal({
        title: "提示",
        content: "账号、密码不能为空",
        showCancel: false,
      });
    }

  }

  public loginByVerify() {
    console.log(this.data);
    if (this.data.username && this.data.code) {
      this.services.loginService.verifyCodeLogin(this.data.username, this.data.code)
        .subscribe((data) => {
          if (data.msg === "success") {
            this.services.authService.login();
            wepy.redirectTo({
              url: `/pages/dashboar/dashboar`,
            });
          } else if (data.msg === "invalid") {
            wepy.showModal({
              title: "提示",
              content: "账号验证码失效",
              showCancel: false,
            });
          } else if (data.msg === "userDelete") {
            wepy.showModal({
              title: "提示",
              content: "账号不存在",
              showCancel: false,
            });
          } else {
            wepy.showModal({
              title: "提示",
              content: "账号密码错误",
              showCancel: false,
            });
          }
        }, (error) => {
          wepy.showModal({
            title: "提示",
            content: "网络错误。请重试",
            showCancel: false,
          });
        });
    } else {
      wepy.showModal({
        title: "提示",
        content: "账号、验证码不能为空",
        showCancel: false,
      });
    }
  }

}
