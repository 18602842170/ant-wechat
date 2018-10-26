import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class MyCourser extends wepy.page {
  public services: IServices;
  public onLoad() {
    this.services = getServices(this);
  }

  public async onShow() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    wepy.hideLoading();
  }

  public toCourseTimeTable() {
    wepy.navigateTo({
      url: `/pages/course_time_table/course_time_table`,
    });
  }

  public toCourseEvaluate() {
    wepy.navigateTo({
      url: `/pages/course-evaluate/course-evaluate`,
    });
  }

  public toNotice() {
    wepy.navigateTo({
      url: `/pages/notice/notice`,
    });
  }

  public toTrustList() {
    // 老师
    wepy.navigateTo({
      url: `/pages/class-ship-students/class-ship-students`,
    });
  }

  // 首页
  public Dashboar() {
    wepy.redirectTo({
      url: `../../pages/dashboar/dashboar`,
    });
  }
  // 选课预约
  public ElectiveCourses() {
    wepy.redirectTo({
      url: `../../pages/elective-courses/elective-courses`,
    });
  }
  // 个人信息
  public PersonalInfo() {
    wepy.redirectTo({
      url: `../../pages/personal-info/personal-info`,
    });
  }
}
