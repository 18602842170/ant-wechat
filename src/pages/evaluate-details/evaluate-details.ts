import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class EvaluateDetails extends wepy.page {
  public services: IServices;

  public data = {
    courseDetailId: 0,
    courseDetail: null,
    rollCall: null,
    techerName: "",
  };


  public onLoad(options) {
    this.services = getServices(this);
    this.data.courseDetailId = options.courseDetailId;
    this.setData("courseDetailId", this.data.courseDetailId);
  }

  public onShow() {
    this.searchData();
  }

  public searchData() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 查询课程
    this.services.courseDetailService.query({
      id: this.data.courseDetailId,
    }).pipe(
      switchMap((courseDetailR) => {
        this.data.courseDetail = courseDetailR.results[0];
        this.setData("courseDetail", this.data.courseDetail);
        // 通过课程id和登陆人id查询点过名的学生
        return this.services.rollCallService.query({
          courseDetailId: this.data.courseDetailId,
          userId: this.services.loginService.user.id,
        });
      }),
      switchMap((studentR) => {

        if (studentR.results && studentR.results.length > 0) {
          console.log(studentR.results);
          this.data.rollCall = studentR.results[0];
          this.setData("rollCall", this.data.rollCall);
        }
        // 查询课程老师
        return this.services.userService.query({
          searchTecherOrStrudentByCourseId: "1",
          courseId: this.data.courseDetail.courseId,
        });
      }),
    ).subscribe((techerResult) => {
      for (const techer of techerResult.results) {
        this.data.techerName = `${this.data.techerName} ${techer.nikeName}`;
      }
      this.setData("techerName", this.data.techerName);
      wepy.hideLoading();
    });
  }
}
