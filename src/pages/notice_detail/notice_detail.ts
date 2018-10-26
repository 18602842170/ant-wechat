import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import wepy from "wepy";
import { IServices } from "../../app";
import { getServices } from "../../core/services/GetServices";

export default class NoticeDetail extends wepy.page {
  public services: IServices;
  public data = {
    noticeId: 0,
    noticeDetail: null,
    userName: "",
  };
  public onLoad(options) {
    this.services = getServices(this);
    this.data.noticeId = options.noticeId;
    this.setData("noticeId", this.data.noticeId);
  }

  public onShow() {
    wepy.showLoading({
      title: "加载中...",
      mask: true,
    });
    this.services.noticeService.get(this.data.noticeId)
      .pipe(
        switchMap((result) => {
          result.noticeDateStr = this.format("yyyy-MM-dd HH:mm:ss", this.strToDate(result.updateDate));
          this.data.noticeDetail = result;
          this.setData("noticeDetail", this.data.noticeDetail);
          return this.services.userService.get(result.userId);
        }),
    )
      .subscribe((user) => {
        this.data.userName = user.name;
        this.setData("userName", this.data.userName);
        wepy.hideLoading();
      });
  }

  public format(fmt, date) {
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "H+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "S+": date.getMilliseconds(),
    };

    // 因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
      // 第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {

        // 第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。

        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
      }
    }
    return fmt;
  }

  public strToDate(dateString) {
    dateString = dateString.replace(/T/g, " ").replace(/\.[\d]{3}Z/, "").replace(/(-)/g, "/");
    dateString = dateString.slice(0, dateString.indexOf("."));
    const date = new Date(dateString);
    return new Date(date.valueOf() + 60 * 60 * 1000 * 8);
  }
}
