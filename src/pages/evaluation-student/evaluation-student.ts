import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class EvaluationStudent extends wepy.page {
  public services: IServices;

  public data = {
    courseDetailId: 0,
    courseDetail: null,
    students: [],
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
        // 通过课程id查询点过名的学生
        return this.services.rollCallService.query({
          courseDetailId: this.data.courseDetailId,
          courseId: this.data.courseDetail.courseId,
        });
      }),
    ).subscribe((studentR) => {
      this.data.students = studentR.results;
      this.setData("students", this.data.students);
      wepy.hideLoading();
    });
  }

  public toTeacherEvaluationDetailse(e) {
    wepy.navigateTo({

      // tslint:disable-next-line:max-line-length
      url: `/pages/teacher-evaluation-details/teacher-evaluation-details?rollCallId=${e.currentTarget.dataset.student.id}`,
    });
  }
}
