import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { BACKEND_URL } from "../../core/constant";
import { getServices } from "../../core/services/GetServices";

export default class CourseDetails extends wepy.page {
  public services: IServices;
  public data = {
    courseId: 0,
    course: null,
    teacher: null,
    reserveCount: 0,
  };
  public onLoad(options) {
    this.services = getServices(this);
    this.data.courseId = options.courseId;
    this.setData("courseId", this.data.courseId);
  }

  public onShow() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    this.services.courseService.query({
      id: this.data.courseId,
      searchCourseDetailCount: "1", searchCourseReserveCount: "1",
    })
      .subscribe((courses) => {
        this.data.course = courses.results[0];
        this.setData("course", this.data.course);
        if (courses.results[0].userId) {
          this.services.teacherService.query({
            userId: courses.results[0].userId,
          })
            .subscribe((iteacher) => {
              console.log(iteacher);
              if (iteacher.results.length && !iteacher.results[0].teacherProfile) {
                iteacher.results[0].teacherProfile = "暂无相关介绍";
              }

              this.data.teacher = iteacher.results[0];
              this.setData("teacher", this.data.teacher);
            });

        }
        wepy.hideLoading();
      });
  }

  public toOrder() {
    wepy.navigateTo({
      url: `/pages/order/order?courseId=${this.data.courseId}`,
    });
  }
}
