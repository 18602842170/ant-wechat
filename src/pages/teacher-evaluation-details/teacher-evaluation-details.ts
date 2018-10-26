import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class TeacherEvaluationDetails extends wepy.page {
  public services: IServices;

  public data = {
    rollCallId: 0,
    rollCall: null,
    courseDetail: null,
  };

  public onLoad(options) {
    this.services = getServices(this);
    this.data.rollCallId = options.rollCallId;
    this.setData("rollCallId", this.data.rollCallId);
  }

  public onShow() {
    this.searchData();
  }

  public searchData() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 查询点名表
    this.services.rollCallService.query({
      id: this.data.rollCallId,
    }).pipe(
      switchMap((rollCallR) => {
        this.data.rollCall = rollCallR.results[0];
        this.setData("rollCall", this.data.rollCall);
        // 查询课程
        return this.services.courseDetailService.query({
          id: this.data.rollCall.courseDetailId,
        });
      }),
    ).subscribe((courseDetailR) => {
      this.data.courseDetail = courseDetailR.results[0];
      this.setData("courseDetail", this.data.courseDetail);
      wepy.hideLoading();
    });
  }

  public save() {
    this.services.rollCallService.update({
      id: this.data.rollCall.id,
      comment: this.data.rollCall.comment,
    })
      .subscribe((rollCall) => {
        wepy.navigateBack(1);
      });
  }

  public changeComment(e) {
    console.log(e);
    this.data.rollCall.comment = e.detail.value;
    this.setData("rollCall", this.data.rollCall);
  }
}
