import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class ElectiveCourses extends wepy.page {
  public services: IServices;
  public data = {
    grades: [],
    subjects: [],
    gradeSelect: 0,
    subjectsSelect: 0,
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
    // 获取下拉框
    this.services.distinguishService.query({ cd: "CD00001" })
      .pipe(
        switchMap((gradesData) => {
          this.data.grades = gradesData.results;
          this.setData("grades", this.data.grades);
          return this.services.distinguishService.query({ cd: "CD00002" });
        }),
        switchMap((subjectData) => {
          if (subjectData.results) {
            this.data.subjects = subjectData.results;
            this.setData("subjects", this.data.subjects);
            return this.services.courseService
              .query({
                gradeId: this.data.grades[this.data.gradeSelect].id,
                subjectId: this.data.subjects[this.data.subjectsSelect].id,
                searchCourseDetailCount: "1", searchCourseReserveCount: "1",
              });
          }
        }),
    ).subscribe((courseData) => {
      this.data.courses = courseData.results;
      this.setData("courses", this.data.courses);
      wepy.hideLoading();
    });
  }

  public CourseDetails(event) {
    if (event.target.dataset.course) {
      wepy.navigateTo({
        url: `/pages/course-details/course-details?courseId=${event.target.dataset.course.id}`,
      });
    }
  }

  // 选择器
  public gradeChange(e) {
    this.data.gradeSelect = e.detail.value;
    this.setData("gradeSelect", this.data.gradeSelect);
  }

  public subjectChange(e) {
    this.data.subjectsSelect = e.detail.value;
    this.setData("subjectsSelect", this.data.subjectsSelect);
  }

  public search() {
    this.services.courseService
      .query({
        gradeId: this.data.grades[this.data.gradeSelect].id,
        subjectId: this.data.subjects[this.data.subjectsSelect].id,
        searchCourseDetailCount: "1", searchCourseReserveCount: "1",
      }).subscribe((courseData) => {
        this.data.courses = courseData.results;
        this.setData("courses", this.data.courses);
      });
  }

  // 首页
  public Dashboar() {
    wepy.redirectTo({
      url: `../../pages/dashboar/dashboar`,
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
