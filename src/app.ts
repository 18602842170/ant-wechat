import wepy from "wepy";
import "wepy-async-function";
import { AuthService } from "./core/services/auth.service";
import { CourseService } from "./core/services/course.service";
import { CourseDetailService } from "./core/services/course_detail.service";
import { CourseReserveService } from "./core/services/course_reserve.service";
import { DepositScoresService } from "./core/services/deposit_scores_service";
import { DepositStudentService } from "./core/services/deposit_student_service";
import { DistinguishService } from "./core/services/distinguish.service";
import { LoginService } from "./core/services/login.service";
import { NoticeService } from "./core/services/notice.service.";
import { RollCallService } from "./core/services/roll_call.service";
import { TeacherService } from "./core/services/teacher.service";
import { UserService } from "./core/services/user.service";

export interface IServices {
  loginService: LoginService;
  authService: AuthService;
  userService: UserService;
  courseService: CourseService;
  courseReserveService: CourseReserveService;
  distinguishService: DistinguishService;
  courseDetailService: CourseDetailService;
  rollCallService: RollCallService;
  noticeService: NoticeService;
  teacherService: TeacherService;
  depositStudentService: DepositStudentService;
  depositScoresService: DepositScoresService;
}

export default class SirenApp extends wepy.app {
  public config = {
    pages: [
      "pages/index/index",
      "pages/wechat_user_info/wechat_user_info",
      "pages/login/login",
      "pages/dashboar/dashboar",
      "pages/elective-courses/elective-courses",
      "pages/my-course/my-course",
      "pages/personal-info/personal-info",
      "pages/course-details/course-details",
      "pages/course_time_table/course_time_table",
      "pages/course-evaluate/course-evaluate",
      "pages/evaluate-details/evaluate-details",
      "pages/evaluation-student/evaluation-student",
      "pages/teacher-evaluation-details/teacher-evaluation-details",
      "pages/notice/notice",
      "pages/notice_detail/notice_detail",
      "pages/order/order",
      "pages/msg/msg",
      "pages/class-ship/class-ship",
      "pages/class-ship-students/class-ship-students",
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "多喜教育",
      navigationBarTextStyle: "black",
      backgroundColor: "#fff",
    },
  };
  public globalData: {
    services: IServices,
  } = {
      services: {
        authService: new AuthService(),
        loginService: new LoginService(),
        userService: new UserService(),
        courseService: new CourseService(),
        courseReserveService: new CourseReserveService(),
        distinguishService: new DistinguishService(),
        courseDetailService: new CourseDetailService(),
        rollCallService: new RollCallService(),
        noticeService: new NoticeService(),
        teacherService: new TeacherService(),
        depositStudentService: new DepositStudentService(),
        depositScoresService: new DepositScoresService(),
      },
    };
  constructor() {
    super();
    this.use("promisify");
  }

  public async onShow() {
    // this.globalData.services.authService.logout();
  }
  public onHide() {
    // this.globalData.services.authService.logout();
  }
  public onError(msg) {
    console.log(msg);
  }
}
