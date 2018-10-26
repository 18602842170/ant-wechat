
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IDepositTeacherQuery {
    id?: number;
    teacherUserId?: number;
}

export interface IDepositTeacherGet {
    id?: number;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
    classRoomName?: string;
}

export interface IDepositTeacherCreate {
    studentUserId?: number;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
}

export interface IDepositTeacherUpdate {
    id?: number;
    studentUserId?: number;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
}

export class DepositTeacherService {

    // id查询
    public get(id: number): Observable<IDepositTeacherGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositTeacher/${id}`,
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
    public query(CourseQuery: IDepositTeacherQuery): Observable<IQueryResults<IDepositTeacherGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositTeacher/query`,
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
    public create(Course: IDepositTeacherCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositTeacher/create`,
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
    public update(Course: IDepositTeacherUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositTeacher/update/${Course.id}`,
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
            url: `${BACKEND_URL}/depositTeacher/delete/${id}`,
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
