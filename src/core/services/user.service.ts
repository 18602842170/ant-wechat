
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IUserQuery {
    id?: number;
    name?: string;
    roleId?: number;
    deptId?: number;
    phoneCheck?: boolean;
    searchTecherOrStrudentByCourseId?: string;
    courseId?: number;
    courseDetailId?: number;
}

export interface IUserGet {
    id?: number;
    name?: string;
    nikeName?: string;
    userType?: string;
    roleId?: number;
    deptId?: number;
    phoneCheck?: boolean;
    phoneNumber?: string;
    wechatAvatarUrl?: string;
    wechatCity?: string;
    wechatprovince?: string;
    wechatCountry?: string;
    wechatGender?: number;
    wechatNickName?: string;
}

export interface IUserCreate {
    name: string;
    roleId?: number;
    deptId?: number;
    phoneCheck?: boolean;
}

export interface IUserUpdate {
    id: number;
    name?: string;
    roleId?: number;
    deptId?: number;
    phoneCheck?: boolean;
    wechatAvatarUrl?: string;
    wechatCity?: string;
    wechatprovince?: string;
    wechatCountry?: string;
    wechatGender?: number;
    wechatNickName?: string;
}

export class UserService {

    // id查询
    public get(id: number): Observable<IUserGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/user/${id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 条件查询
    public query(userQuery: IUserQuery): Observable<IQueryResults<IUserGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/user/query`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: userQuery,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 新建
    public create(user: IUserCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/user/create`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: user,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 更新
    public update(user: IUserUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/user/update/${user.id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: user,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 删除
    public delete(id: number): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/user/delete/${id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }
}
