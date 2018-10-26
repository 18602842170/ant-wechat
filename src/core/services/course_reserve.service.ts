
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface ICourseReserveQuery {
    id?: number;
    courseId?: number;
    reserveCode?: string;
    phoneNumber?: string;
    deleteFlg?: boolean;
    get_count?: boolean;
}

export interface ICourseReserveGet {
    id?: number;
    courseId?: number;
    reserveCode?: string;
    phoneNumber?: string;
    deleteFlg?: boolean;
}

export interface ICourseReserveCreate {
    id?: number;
    courseId?: number;
    reserveCode?: string;
    phoneNumber?: string;
    deleteFlg?: boolean;
}

export interface ICourseReserveUpdate {
    id?: number;
    courseId?: number;
    reserveCode?: string;
    phoneNumber?: string;
    deleteFlg?: boolean;
}

export class CourseReserveService {

    // id查询
    public get(id: number): Observable<ICourseReserveGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_reserve/${id}`,
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
    public query(CourseQuery: ICourseReserveQuery): Observable<IQueryResults<ICourseReserveGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_reserve/query`,
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
    public create(Course: ICourseReserveCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_reserve/create`,
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
    public update(Course: ICourseReserveUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course_reserve/update/${Course.id}`,
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
            url: `${BACKEND_URL}/course_reserve/delete/${id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 预约
    public reserve(formId: string, phoneNumber: string, courseId: number, code: string): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/not_verifying/course_reserve/`,
            data: {
                formId,
                phoneNumber,
                courseId,
                code,
            },
            method: "GET",
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }
}
