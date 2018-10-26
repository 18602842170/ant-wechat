import { from as ObservableFrom } from "rxjs";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class PersonalInfo extends wepy.page {
  public services: IServices;

  public data = {
    userType: "0",
    sessionFlag: false,
    courses: [],
    userInfo: {
      name: "",
      phoneNumber: "",
      sex: "",
      imag: "",
    },
  };

  public onLoad() {
    this.services = getServices(this);
    this.data.userType = this.services.loginService.user.userType;
    this.setData("userType", this.data.userType);
  }

  public onShow() {
    //
  }

  public onReady() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 获取用户信息
    this.data.userInfo.name = this.services.loginService.user.nikeName;
    this.data.userInfo.phoneNumber = this.services.loginService.user.phoneNumber;
    if (this.services.loginService.userInfo.avatarUrl) {
      this.data.userInfo.imag = this.services.loginService.userInfo.avatarUrl;
    } else {
      this.data.userInfo.imag = `../../share/image/result-empty.png`;
    }
    if (this.services.loginService.userInfo &&
      this.services.loginService.userInfo.gender === 2) {
      this.data.userInfo.sex = "女";
    } else {
      this.data.userInfo.sex = "男";
    }
    this.setData("userInfo", this.data.userInfo);
    this.services.courseService.query({
      searchPersonalCourseByUserId: this.services.loginService.user.id,
    }).subscribe((course) => {
      if (course.results.length > 0) {

        this.data.courses = course.results;
      }
      this.setData("courses", this.data.courses);
    });
    wepy.hideLoading();
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
  // 我的课程
  public MyCourse() {
    wepy.redirectTo({
      url: `../../pages/my-course/my-course`,
    });
  }
  // 个人信息
  public PersonalInfo() {
    wepy.redirectTo({
      url: `../../pages/personal-info/personal-info`,
    });
  }
}
