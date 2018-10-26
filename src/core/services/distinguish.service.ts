
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IDistinguishQuery {
    id?: number;
    cd?: string;
    cdName?: string;
    tpName?: string;
    deleteFlg?: boolean;
    pageNum?: number;
    pageSize?: number;
}

export interface IDistinguishGet {
    id?: number;
    cd?: string;
    cdName?: string;
    tpName?: string;
    deleteFlg?: boolean;
}

export interface IDistinguishCreate {
    cd: string;
    cdName: string;
    tpName: string;
    deleteFlg: boolean;
}

export interface ICourseUpdate {
    id: number;
    cdName?: string;
    tpName?: string;
    deleteFlg?: boolean;
}

export class DistinguishService {

    // id查询
    public get(id: number): Observable<IDistinguishGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/distinguish/${id}`,
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
    public query(CourseQuery: IDistinguishQuery): Observable<IQueryResults<IDistinguishGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/distinguish/query`,
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
    public create(Course: IDistinguishCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/distinguish/create`,
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
            url: `${BACKEND_URL}/distinguish/update/${Course.id}`,
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
            url: `${BACKEND_URL}/distinguish/delete/${id}`,
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
