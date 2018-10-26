import { Observable, of as ObservableOf } from "rxjs";
import wepy from "wepy";
import { LOGIN_DEFAULT_URL, LOGIN_URL, TOKEN_NAME } from "../constant";
declare function getCurrentPages(): Array<{
  route: string;
  options: any;
}>;

export class AuthService {
  public isLoggedIn: boolean = false;
  public redirectUrl: string = LOGIN_DEFAULT_URL;
  public canActivate(): boolean {
    const urls = getCurrentPages();
    return this.checkLogin(urls[urls.length - 1]);
  }
  public checkLogin(currentPage: { route: string; options: any; }): boolean {
    if (this.isLoggedIn) {
      const token = wepy.getStorageSync(TOKEN_NAME);
      if (token) {
        return true;
      }
    }
    let options = currentPage.options;
    if (options.scene) {
      const optionsScene = JSON.parse(decodeURIComponent(options.scene));
      options = {
        ...optionsScene,
        ...options,
      };
    }
    const queryList: string[] = [];
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        queryList.push(`${key}=${options[key]}`);
      }
    }
    if (queryList.length === 0) {
      this.redirectUrl = `/${currentPage.route}`;
    } else {
      this.redirectUrl = `/${currentPage.route}?${queryList.join("&")}`;
    }

    // Navigate to the login page with extras
    wepy.navigateTo({
      url: LOGIN_URL,
    });
    return false;
  }
  public logout(): Observable<boolean> {
    this.isLoggedIn = false;
    wepy.clearStorageSync();
    return ObservableOf(true);
  }
  public login(): Observable<boolean> {
    this.isLoggedIn = true;
    return ObservableOf(true);
  }
}
