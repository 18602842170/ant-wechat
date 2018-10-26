
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IDepositScoresQuery {
    id?: number;
    depositStudentId?: number;
    scoresDateString?: string;
}

export interface IDepositScoresGet {
    id?: number;
    depositStudentId?: number;
    scoresDateString?: string;
    scoresA?: number;
    scoresB?: number;
    scoresC?: number;
}

export interface IDepositScoresCreate {
    depositStudentId?: number;
    scoresDateString?: string;
    scoresA?: number;
    scoresB?: number;
    scoresC?: number;
}

export interface IDepositScoresUpdate {
    id?: number;
    depositStudentId?: number;
    scoresDateString?: string;
    scoresA?: number;
    scoresB?: number;
    scoresC?: number;
}

export class DepositScoresService {

    // id查询
    public get(id: number): Observable<IDepositScoresGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/deposit_scores/${id}`,
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
    public query(CourseQuery: IDepositScoresQuery): Observable<IQueryResults<IDepositScoresGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/deposit_scores/query`,
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
    public create(Course: IDepositScoresCreate): Observable<IDepositScoresGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/deposit_scores/create`,
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
    public update(Course: IDepositScoresUpdate): Observable<IDepositScoresGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/deposit_scores/update/${Course.id}`,
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
    public delete(id: number): Observable<IDepositScoresGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/deposit_scores/delete/${id}`,
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
