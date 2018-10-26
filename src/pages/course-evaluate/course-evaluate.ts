import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class CourseEvaluate extends wepy.page {
  public services: IServices;

  public data = {
    date: "",
    todayCourses: [],
  };

  public onLoad() {
    this.services = getServices(this);
    const date = new Date();
    this.data.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    this.setData("date", this.data.date);
  }

  public onShow() {
    this.searchCourseDetail();
  }

  public searchCourseDetail() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    this.data.todayCourses = [];
    const dateArr = this.data.date.split("-");
    // 从data中取得当前年月以及user查询出课时
    this.services.courseDetailService.query({
      userId: this.services.loginService.user.id,
      searchYear: +dateArr[0],
      searchMonth: +dateArr[1],
      searchDay: +dateArr[2],
      isRollCall: true,
    }).subscribe((result) => {

      for (const courseDetail of result.results) {
        const courseD = {
          ...courseDetail,
          techerName: "",
        };
        this.data.todayCourses.push(courseD);
        this.setData("todayCourses", this.data.todayCourses);
        this.services.userService.query({
          searchTecherOrStrudentByCourseId: "1",
          courseId: courseDetail.courseId,
        }).subscribe((techerResult) => {
          for (const techer of techerResult.results) {
            courseD.techerName = `${courseD.techerName} ${techer.nikeName}`;
          }
          this.setData("todayCourses", this.data.todayCourses);
        });
      }
      wepy.hideLoading();
    });
  }

  public bindDateChange(e) {
    this.data.date = e.detail.value;
    this.setData("date", this.data.date);
    this.searchCourseDetail();
  }

  public toCourseEvaluate(e) {
    if (this.services.loginService.user.userType === "1") {
      // 老师
      wepy.navigateTo({
        url: `/pages/evaluation-student/evaluation-student?courseDetailId=${e.currentTarget.dataset.course.id}`,
      });
    } else {
      // 学生
      wepy.navigateTo({
        url: `/pages/evaluate-details/evaluate-details?courseDetailId=${e.currentTarget.dataset.course.id}`,
      });
    }
  }
}
