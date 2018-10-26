import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Order extends wepy.page {
  public services: IServices;
  public data = {
    courseId: 0,
    phoneNumber: "",
    numberError: false,
  };
  public onLoad(options) {
    this.services = getServices(this);
    this.data.courseId = options.courseId;
  }

  public onShow() {
    //
  }

  // 预约
  public reserve(event) {
    if (this.data.phoneNumber) {
      this.data.numberError = false;
      this.setData("numberError", this.data.numberError);
      ObservableFrom(wepy.login())
        .pipe(
          switchMap((res) => {
            return this.services.courseReserveService
              .reserve(event.detail.formId, this.data.phoneNumber, this.data.courseId, res.code);
          }),
        )
        .subscribe((data) => {
          if (data.msg === "success") {
            wepy.navigateTo({
              url: `/pages/msg/msg`,
            });
          } else {
            wepy.showModal({
              title: "预约失败",
              content: "由于网络错误预约失败，请重新尝试预约",
              showCancel: false,
            });
          }
        });
    } else {
      this.data.numberError = true;
      this.setData("numberError", this.data.numberError);
    }
  }

  public phoneNumberInput(e) {
    this.data.phoneNumber = e.detail.value;
  }
}
