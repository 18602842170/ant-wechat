import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Msg extends wepy.page {
  public services: IServices;
  public onLoad() {
    this.services = getServices(this);
    // wepy.showToast({
    //   title: "登陆中",
    //   icon: "loading",
    //   duration: 10000,
    // });
    wepy.checkSession();
  }
  public Dashboar() {
    wepy.redirectTo({
      url: `/pages/dashboar/dashboar`,
    });
  }
  public async onShow() {
    //
  }
}
