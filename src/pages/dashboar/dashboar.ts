import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Dashboar extends wepy.page {
  public services: IServices;
  public data = {
    courses: [],
  };
  public onLoad() {
    this.services = getServices(this);
  }

  public onShow() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    this.services.courseService.query({
      deleteFlg: false, fine: true, pageNum: 1,
      pageSize: 100, searchCourseDetailCount: "1",
    })
      .subscribe((queryResults) => {
        this.data.courses = queryResults.results;
        this.setData("courses", this.data.courses);
        wepy.hideLoading();
      });
  }

  // 课程详细信息
  public CourseDetails(event) {
    if (event.target.dataset.course) {
      wepy.navigateTo({
        url: `/pages/course-details/course-details?courseId=${event.target.dataset.course.id}`,
      });
    }
  }

  // 选课预约
  public ElectiveCourses() {
    wepy.redirectTo({
      url: `/pages/elective-courses/elective-courses`,
    });
  }

  // 我的课程
  public MyCourse() {
    // 登陆判断
    if (this.services.authService.canActivate()) {
      wepy.redirectTo({
        url: `/pages/my-course/my-course`,
      });
    }
  }

  // 个人信息
  public PersonalInfo() {
    // 登陆判断
    if (this.services.authService.canActivate()) {
      wepy.redirectTo({
        url: `/pages/personal-info/personal-info`,
      });
    }
  }
}
