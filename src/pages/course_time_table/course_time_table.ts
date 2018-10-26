import { from as ObservableFrom } from "rxjs";
import { switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class CourseTimeTable extends wepy.page {
  public services: IServices;

  public data = {
    userType: "0",
    hasEmptyGrid: false,
    empytGrids: [],
    cur_year: 0,
    cur_month: 0,
    weeks_ch: ["日", "一", "二", "三", "四", "五", "六"],
    todayIndex: 0,
    todayCourses: [],
    days: [],
  };

  public onLoad() {
    this.services = getServices(this);
    this.data.userType = this.services.loginService.user.userType;
    // 设置时间表
    this.setNowDate();
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
    // 从data中取得当前年月以及user查询出课时
    this.services.courseDetailService.query({
      userId: this.services.loginService.user.id,
      searchYear: this.data.cur_year,
      searchMonth: this.data.cur_month,
      techerId: this.data.userType === "1" ? this.services.loginService.user.id : null,
    }).subscribe((result) => {
      const courseDetails = result.results;
      // for循环days 将课时数据放入
      for (const day of this.data.days) {
        day.courseDetails = [];
        const courseDetailList = courseDetails.filter((course) => new Date(course.courseDay).getDate() === day.day);
        for (const co of courseDetailList) {
          day.courseDetails.push({
            ...co,
            showFlag: false,
            status: "",
          });
        }
      }
      this.setTimeData();
      wepy.hideLoading();
      this.searchCourseUser();
    });
  }

  // 通过todayIndex查询老师或学生
  public searchCourseUser() {
    const searchType = this.data.userType === "1" ? "2" : "1";
    for (const course of this.data.todayCourses) {
      course.showFlag = false;
    }
    this.data.todayCourses = this.data.days[this.data.todayIndex].courseDetails;
    this.setTimeData();
    if (this.data.todayCourses.length > 0) {
      for (const courseDetail of this.data.todayCourses) {
        // 查询所有的用户
        this.services.userService.query({
          searchTecherOrStrudentByCourseId: searchType,
          courseId: courseDetail.courseId,
          courseDetailId: courseDetail.id,
        }).pipe(
          switchMap((result) => {
            // 根据课程用户生成点名列表
            courseDetail.userList = [];
            for (const user of result.results) {
              courseDetail.userList.push({
                id: null,
                courseDetailId: courseDetail.id,
                userId: user.id,
                nikeName: user.nikeName,
                checked: false,
              });
            }
            // 取得课时以前的点名表
            return this.services.rollCallService.query({
              courseDetailId: courseDetail.id,
            });
          }),
        ).subscribe((rollCallResult) => {
          const rollCallList = rollCallResult.results;
          // 将点名数据插入到点名列表中
          if (rollCallList && rollCallList.length > 0) {
            for (const user of courseDetail.userList) {
              // 根据用户id过滤
              const rollCalls = rollCallList.filter((rollCall) => rollCall.userId === user.userId);
              if (rollCalls && rollCalls.length > 0) {
                user.id = rollCalls[0].id;
                user.checked = rollCalls[0].isToClass;
              }
            }
          }
          // 当用户为学生时候。将点名数据生成为课程状态
          if (this.data.userType === "2") {
            if (rollCallList && rollCallList.length > 0) {
              const userRollCall =
                rollCallResult.results.filter((rollcall) => rollcall.userId === this.services.loginService.user.id);
              if (userRollCall && userRollCall.length > 0) {
                if (userRollCall[0].isToClass) {
                  courseDetail.status = "已上课";
                } else {
                  courseDetail.status = "点名未到";
                }
              }
            } else {
              courseDetail.status = "未上课";
            }
          }
          this.setTimeData();
        });
      }
    }
  }

  public dateSelectAction(e) {
    this.data.todayIndex = e.currentTarget.dataset.idx;
    this.searchCourseUser();
  }

  public changeShowFlag(e) {
    this.data.todayCourses[e.target.dataset.idx].showFlag = !this.data.todayCourses[e.target.dataset.idx].showFlag;
    this.setData("todayCourses", this.data.todayCourses);
  }

  // 保存点名
  public saveRollCall(e) {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    this.data.todayCourses[e.target.dataset.idx].showFlag = !this.data.todayCourses[e.target.dataset.idx].showFlag;
    this.setData("todayCourses", this.data.todayCourses);
    this.services.courseDetailService.update({
      id: this.data.todayCourses[e.target.dataset.idx].id,
      isRollCall: true,
    }).pipe(
      switchMap((courseDetail) => {
        return this.services.rollCallService.create({
          saveList: this.data.todayCourses[e.target.dataset.idx].userList,
        });
      }),
    ).subscribe((result) => {
      wepy.hideLoading();
    });
  }

  public checkboxChange(e) {
    const course = this.data.todayCourses[e.target.dataset.courseindex];
    for (const user of course.userList) {
      user.checked = false;
    }
    for (const index of e.detail.value) {
      course.userList[index].checked = true;
    }
  }

  public setNowDate() {
    const date = new Date();
    this.data.cur_year = date.getFullYear();
    this.data.cur_month = date.getMonth() + 1;
    this.data.todayIndex = date.getDate() - 1;
    this.calculateEmptyGrids(this.data.cur_year, this.data.cur_month);
    this.calculateDays(this.data.cur_year, this.data.cur_month);
    this.setTimeData();
  }

  public getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  }

  public getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  }

  public calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    const empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.data.hasEmptyGrid = true;
      this.data.empytGrids = empytGrids;
    } else {
      this.data.hasEmptyGrid = false;
      this.data.empytGrids = [];
    }
    this.setTimeData();
  }

  public calculateDays(year, month) {
    const days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ day: i, courseDetails: [] });
    }
    this.data.days = days;
    this.setTimeData();
  }

  // 变更月
  public handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === "prev") {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.data.cur_year = newYear;
      this.data.cur_month = newMonth;
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.data.cur_year = newYear;
      this.data.cur_month = newMonth;
      this.data.todayIndex = 0;
    }
    this.searchCourseDetail();
  }

  public setTimeData() {
    this.setData("hasEmptyGrid", this.data.hasEmptyGrid);
    this.setData("empytGrids", this.data.empytGrids);
    this.setData("cur_year", this.data.cur_year);
    this.setData("cur_month", this.data.cur_month);
    this.setData("weeks_ch", this.data.weeks_ch);
    this.setData("todayIndex", this.data.todayIndex);
    this.setData("days", this.data.days);
    this.setData("todayCourses", this.data.todayCourses);
    this.setData("userType", this.data.userType);
  }

}
