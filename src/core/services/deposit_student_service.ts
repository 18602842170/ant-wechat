
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IDepositStudentQuery {
    id?: number;
    teacherUserId?: number;
    studentUserId?: number;
}

export interface IDepositStudentGet {
    id?: number;
    studentUserId?: number;
    studentNameInUser?: string;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
    classRoomName?: string;
}

export interface IDepositStudentCreate {
    studentUserId?: number;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
}

export interface IDepositStudentUpdate {
    id?: number;
    studentUserId?: number;
    depositStartDate?: Date;
    depositEndDate?: Date;
    classRoomId?: number;
}

export class DepositStudentService {

    // id查询
    public get(id: number): Observable<IDepositStudentGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositStudent/${id}`,
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
    public query(CourseQuery: IDepositStudentQuery): Observable<IQueryResults<IDepositStudentGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositStudent/query`,
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
    public create(Course: IDepositStudentCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositStudent/create`,
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
    public update(Course: IDepositStudentUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/depositStudent/update/${Course.id}`,
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
            url: `${BACKEND_URL}/depositStudent/delete/${id}`,
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
