import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class ClassShipStudents extends wepy.page {
  public services: IServices;

  public data = {
    students: [],
    userType: "0",
  };

  public onLoad() {
    this.services = getServices(this);
    this.data.userType = this.services.loginService.user.userType;
    this.setData("userType", this.data.userType);
  }

  public onShow() {
    this.searchCourseDetail();
  }

  public searchCourseDetail() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    if (this.data.userType === "1") {
      // 从data中取得当前年月以及user查询出课时
      this.services.depositStudentService.query({
        teacherUserId: this.services.loginService.user.id,
      }).subscribe((students) => {
        this.data.students = [];
        for (const student of students.results) {
          const depositStartDate = this.strToDate(student.depositStartDate);
          const depositEndDate = this.strToDate(student.depositEndDate);
          this.data.students.push({
            ...student,
            depositStartDateString:
              `${depositStartDate.getFullYear()}-${depositStartDate.getMonth() + 1}-${depositStartDate.getDate()}`,
            depositEndDateString:
              `${depositEndDate.getFullYear()}-${depositEndDate.getMonth() + 1}-${depositEndDate.getDate()}`,
          });
        }
        this.setData("students", this.data.students);
        wepy.hideLoading();
      });
    } else {
      // 从学生id中取得当前年月以及user查询出课时
      this.services.depositStudentService.query({
        studentUserId: this.services.loginService.user.id,
      }).subscribe((students) => {
        this.data.students = [];
        for (const student of students.results) {
          const depositStartDate = this.strToDate(student.depositStartDate);
          const depositEndDate = this.strToDate(student.depositEndDate);
          this.data.students.push({
            ...student,
            depositStartDateString:
              `${depositStartDate.getFullYear()}-${depositStartDate.getMonth() + 1}-${depositStartDate.getDate()}`,
            depositEndDateString:
              `${depositEndDate.getFullYear()}-${depositEndDate.getMonth() + 1}-${depositEndDate.getDate()}`,
          });
        }
        this.setData("students", this.data.students);
        wepy.hideLoading();
      });
    }
  }

  public strToDate(dateString) {
    dateString = dateString.replace(/T/g, " ").replace(/\.[\d]{3}Z/, "").replace(/(-)/g, "/");
    dateString = dateString.slice(0, dateString.indexOf("."));
    const date = new Date(dateString);
    return new Date(date.valueOf() + 60 * 60 * 1000 * 8);
  }

  public toClassShip(e) {
    wepy.navigateTo({
      url: `/pages/class-ship/class-ship?studentId=${e.currentTarget.dataset.student.id}`,
    });
  }
}
