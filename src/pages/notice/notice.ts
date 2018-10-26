import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Notice extends wepy.page {
  public services: IServices;

  public data = {
    userType: "0",
    userId: null,
    tabs: [],
    schoolNotices: [],
    teacherNotices: [],
    teacherNoticeUrl: "",
    schoolNoticeUrl: "",
    activeIndex: 0,
    sliderOffset: 1,
    sliderWidth: 96,
    sliderLeft: 0,
  };

  public async onLoad() {
    this.services = getServices(this);
    wepy.checkSession();
    this.data.userType = this.services.loginService.user.userType;
    this.data.userId = this.services.loginService.user.id;
    // 人员分类为教师时
    if ("1" === this.data.userType) {
      this.data.tabs = ["学校通知"];
      this.data.activeIndex = 1;
      this.setData("activeIndex", this.data.activeIndex);
    } else {
      this.data.tabs = ["教师通知", "学校通知"];
    }
    this.setData("tabs", this.data.tabs);
    const res = await wepy.getSystemInfo();
    this.data.sliderLeft = (res.windowWidth / this.data.tabs.length - this.data.sliderWidth) / 2;
    this.data.sliderOffset = res.windowWidth / this.data.tabs.length * this.data.activeIndex;
  }

  public onShow() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 人员分类为教师时
    if ("1" === this.data.userType) {
      this.services.noticeService
        .query({
          schoolNoticeTargets: "-2,0",
        }).subscribe((noticeSchoolData) => {
          this.data.schoolNotices = noticeSchoolData.results;
          this.setData("schoolNotices", this.data.schoolNotices);
        });
    } else {
      this.services.noticeService
        .query({
          userOfStuId: this.data.userId,
          teacherNoticeTargets: this.data.userType,
        }).pipe(
          switchMap((noticeTeacherData) => {
            this.data.teacherNotices = noticeTeacherData.results;

            this.setData("teacherNotices", this.data.teacherNotices);
            // return this.services.noticeService.query({ schoolNoticeTargets: "-2,0,-1" });
            return this.services.noticeService.query({ schoolNoticeTargets: "-2,-1" });
          }),
        ).subscribe((noticeSchoolData) => {
          this.data.schoolNotices = noticeSchoolData.results;
          this.setData("schoolNotices", this.data.schoolNotices);
        });
    }

    wepy.hideLoading();
  }


  public tabClick(e) {
    if ("1" !== this.data.userType) {
      this.data.sliderOffset = e.currentTarget.offsetLeft;
      this.data.activeIndex = e.currentTarget.id;
      this.setData("sliderOffset", this.data.sliderOffset);
      this.setData("activeIndex", this.data.activeIndex);
    }
  }

  public noticeUrl(event) {
    wepy.navigateTo({
      url: `/pages/notice_detail/notice_detail?noticeId=${event.target.dataset.notice.id}`,
    });
  }


}
