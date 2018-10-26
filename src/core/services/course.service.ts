
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface ICourseQuery {
    id?: number;
    name?: string;
    price?: number;
    backImageUrl?: string;
    fine?: boolean;
    gradeId?: number;
    subjectId?: number;
    deleteFlg?: boolean;
    searchCourseDetailCount?: string;
    searchCourseReserveCount?: string;
    pageNum?: number;
    pageSize?: number;
    searchTecherOrStudent?: string;
    searchPersonalCourseByUserId?: number;
}

export interface ICourseGet {
    id?: number;
    name?: string;
    price?: number;
    backImageUrl?: string;
    fine?: boolean;
    gradeId?: number;
    subjectId?: number;
    courseDetailCount?: number;
    courseCount?: number;
    courseReserveCount?: number;
    userId?: number;
    gradeClassName?: string;
    courseNumber?: number;
}

export interface ICourseCreate {
    name: string;
    price: number;
    backImageUrl: string;
    fine: boolean;
}

export interface ICourseUpdate {
    id: number;
    name?: string;
    price?: number;
    backImageUrl?: string;
    fine?: boolean;
}

export class CourseService {

    // id查询
    public get(id: number): Observable<ICourseGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course/${id}`,
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
    public query(CourseQuery: ICourseQuery): Observable<IQueryResults<ICourseGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course/query`,
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
    public create(Course: ICourseCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course/create`,
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
    public update(Course: ICourseUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/course/update/${Course.id}`,
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
            url: `${BACKEND_URL}/course/delete/${id}`,
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
