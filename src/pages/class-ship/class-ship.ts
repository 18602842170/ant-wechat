import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class Classship extends wepy.page {
  public services: IServices;

  public data = {
    studentId: 0,
    student: null,
    userType: "0",
    hasEmptyGrid: false,
    empytGrids: [],
    cur_year: 0,
    cur_month: 0,
    weeks_ch: ["日", "一", "二", "三", "四", "五", "六"],
    todayIndex: 0,
    todayStudentScore: null,
    days: [],
    editFlag: false,
  };

  public onLoad(options) {
    this.services = getServices(this);
    this.data.studentId = options.studentId;
    this.setData("studentId", this.data.studentId);
    this.data.userType = this.services.loginService.user.userType;
    // 设置时间表
    this.setNowDate();
  }

  public onShow() {
    this.searchStudent();
  }

  public searchStudent() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 通过选择的课程id查出上课区间
    this.services.depositStudentService.get(this.data.studentId)
      .subscribe((student) => {
        this.data.student = student;
        wepy.hideLoading();
        this.setClassKey();
      });
  }

  // 设置上课标记
  public setClassKey() {
    const depositStartDate = this.strToDate(this.data.student.depositStartDate);
    const depositEndDate = this.strToDate(this.data.student.depositEndDate);
    // for循环days 将课时数据放入
    for (const day of this.data.days) {
      const dayDate = new Date(this.data.cur_year, this.data.cur_month - 1, day.day);
      if (depositStartDate <= dayDate && depositEndDate >= dayDate) {
        day.hasClassFlag = true;
      }
    }
    this.searchStudentScores();
  }

  public dateSelectAction(e) {
    this.data.todayIndex = e.currentTarget.dataset.idx;
    this.data.todayStudentScore = null;
    this.data.editFlag = false;
    this.setTimeData();
    this.searchStudentScores();
  }

  // 通过todayIndex查询成绩数据
  public searchStudentScores() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    // 今天有课
    if (this.data.days[this.data.todayIndex].hasClassFlag) {
      // 查询今天的成绩数据
      const today = `${this.data.cur_year}-${this.data.cur_month}-${this.data.days[this.data.todayIndex].day}`;
      this.services.depositScoresService.query({
        depositStudentId: this.data.studentId,
        scoresDateString: today,
      })
        .subscribe((scoresR) => {
          let allScores = 0;
          if (scoresR.results.length > 0) {
            allScores += scoresR.results[0].scoresA;
            allScores += scoresR.results[0].scoresB;
            allScores += scoresR.results[0].scoresC;
            this.data.todayStudentScore = {
              ...scoresR.results[0],
              allScores,
            };
          } else {
            this.data.todayStudentScore = {
              id: 0,
              depositStudentId: this.data.studentId,
              scoresDateString: today,
              scoresA: null,
              scoresB: null,
              scoresC: null,
              allScores,
            };
          }
          this.setTimeData();
          wepy.hideLoading();
        });
    } else {
      wepy.hideLoading();
      this.setTimeData();
    }
  }

  // 保存点名
  public saveDepositScores(e) {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    if (this.data.todayStudentScore.id) {
      this.services.depositScoresService.update({
        id: this.data.todayStudentScore.id,
        scoresDateString: this.data.todayStudentScore.scoresDateString,
        scoresA: this.data.todayStudentScore.scoresA,
        scoresB: this.data.todayStudentScore.scoresB,
        scoresC: this.data.todayStudentScore.scoresC,
      })
        .subscribe((scores) => {
          let allScores = 0;
          allScores += scores.scoresA;
          allScores += scores.scoresB;
          allScores += scores.scoresC;
          this.data.todayStudentScore = {
            ...scores,
            allScores,
          };
          wepy.hideLoading();
          this.hideEdit();
          this.setTimeData();
        });
    } else {
      this.services.depositScoresService.create({
        depositStudentId: this.data.todayStudentScore.depositStudentId,
        scoresDateString: this.data.todayStudentScore.scoresDateString,
        scoresA: this.data.todayStudentScore.scoresA,
        scoresB: this.data.todayStudentScore.scoresB,
        scoresC: this.data.todayStudentScore.scoresC,
      })
        .subscribe((scores) => {
          let allScores = 0;
          allScores += scores.scoresA;
          allScores += scores.scoresB;
          allScores += scores.scoresC;
          this.data.todayStudentScore = {
            ...scores,
            allScores,
          };
          wepy.hideLoading();
          this.hideEdit();
          this.setTimeData();
        });
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
      days.push({ day: i, hasClassFlag: false });
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
    this.setClassKey();
  }

  public showEdit() {
    this.data.editFlag = true;
    this.data.todayStudentScore.scoresA
      = this.data.todayStudentScore.scoresA === null ? 0 : this.data.todayStudentScore.scoresA;
    this.data.todayStudentScore.scoresB
      = this.data.todayStudentScore.scoresB === null ? 0 : this.data.todayStudentScore.scoresB;
    this.data.todayStudentScore.scoresC
      = this.data.todayStudentScore.scoresC === null ? 0 : this.data.todayStudentScore.scoresC;
    this.setTimeData();
  }

  public hideEdit() {
    this.data.editFlag = false;
    this.setTimeData();
  }

  public inputA(value) {
    if (value.detail.value != null && value.detail.value !== "") {
      this.data.todayStudentScore.scoresA = +value.detail.value;
    } else {
      this.data.todayStudentScore.scoresA = 0;
    }
    this.allScores();
  }

  public inputB(value) {
    if (value.detail.value != null && value.detail.value !== "") {
      this.data.todayStudentScore.scoresB = +value.detail.value;
    } else {
      this.data.todayStudentScore.scoresB = 0;
    }
    this.allScores();
  }

  public inputC(value) {
    if (value.detail.value != null && value.detail.value !== "") {
      this.data.todayStudentScore.scoresC = +value.detail.value;
    } else {
      this.data.todayStudentScore.scoresC = 0;
    }
    this.allScores();
  }

  public allScores() {
    this.data.todayStudentScore.allScores
      = this.data.todayStudentScore.scoresA + this.data.todayStudentScore.scoresB + this.data.todayStudentScore.scoresC;
    this.setTimeData();
  }

  public setTimeData() {
    this.setData("hasEmptyGrid", this.data.hasEmptyGrid);
    this.setData("empytGrids", this.data.empytGrids);
    this.setData("cur_year", this.data.cur_year);
    this.setData("cur_month", this.data.cur_month);
    this.setData("weeks_ch", this.data.weeks_ch);
    this.setData("todayIndex", this.data.todayIndex);
    this.setData("days", this.data.days);
    this.setData("todayStudentScore", this.data.todayStudentScore);
    this.setData("student", this.data.student);
    this.setData("userType", this.data.userType);
    this.setData("editFlag", this.data.editFlag);
  }

  public strToDate(dateString) {
    dateString = dateString.replace(/T/g, " ").replace(/\.[\d]{3}Z/, "").replace(/(-)/g, "/");
    dateString = dateString.slice(0, dateString.indexOf("."));
    const date = new Date(dateString);
    return new Date(date.valueOf() + 60 * 60 * 1000 * 8);
  }

}
