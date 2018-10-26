
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";
import { IUserGet } from "./user.service";

export interface ICourseDetailQuery {
    id?: number;
    name?: string;
    courseId?: number;
    courseDay?: Date;
    startTime?: string;
    endTime?: string;
    deleteFlg?: boolean;
    userId?: number;
    searchYear?: number;
    searchMonth?: number;
    searchDay?: number;
    isRollCall?: boolean;
    techerId?: number;
}

export interface ICourseDetailGet {
    id?: number;
    name?: string;
    courseId?: number;
    courseDay?: Date;
    startTime?: string;
    endTime?: string;
    deleteFlg?: boolean;
    isRollCall?: boolean;
    userList?: IUserGet[];
}

export interface ICourseDetailCreate {
    id?: number;
    name?: string;
    courseId?: number;
    courseDay?: Date;
    startTime?: string;
    endTime?: string;
    isRollCall?: boolean;
    deleteFlg?: boolean;
}

export interface ICourseDetailUpdate {
    id?: number;
    name?: string;
    courseId?: number;
    courseDay?: Date;
    startTime?: string;
    endTime?: string;
    isRollCall?: boolean;
    deleteFlg?: boolean;
}

export class CourseDetailService {

    // id查询
    public get(id: number): Observable<ICourseDetailGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_detail/${id}`,
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
    public query(CourseQuery: ICourseDetailQuery): Observable<IQueryResults<ICourseDetailGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_detail/query`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: CourseQuery,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 新建
    public create(Course: ICourseDetailCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_detail/create`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: Course,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 更新
    public update(Course: ICourseDetailUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_detail/update/${Course.id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: Course,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 删除
    public delete(id: number): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_detail/delete/${id}`,
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
