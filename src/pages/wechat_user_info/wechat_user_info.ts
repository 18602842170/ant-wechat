import { from as ObservableFrom } from "rxjs";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class WechatUserInfo extends wepy.page {
  public services: IServices;

  public data = {
  };

  public onLoad() {
    this.services = getServices(this);
  }

  public onShow() {
    //
  }

  public getUserInfo(event) {
    this.services.loginService.userInfo = event.detail.userInfo;
    // 登陆到系统的用户将微信信息保存
    if (this.services.loginService.user) {
      this.services.userService.update({
        id: this.services.loginService.user.id,
        wechatAvatarUrl: event.detail.userInfo.avatarUrl,
        wechatCity: event.detail.userInfo.city,
        wechatprovince: event.detail.userInfo.province,
        wechatCountry: event.detail.userInfo.country,
        wechatGender: event.detail.userInfo.gender,
        wechatNickName: event.detail.userInfo.nickName,
      }).subscribe((user) => {
        this.services.loginService.user = user;
        wepy.redirectTo({ url: `/pages/dashboar/dashboar` });
      });
    } else {
      wepy.redirectTo({ url: `/pages/dashboar/dashboar` });
    }
  }

  public cencl() {
    wepy.redirectTo({ url: `/pages/dashboar/dashboar` });
  }
}
