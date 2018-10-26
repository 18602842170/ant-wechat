
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface IRollCallQuery {
    id?: number;
    courseDetailId?: number;
    userId?: number;
    courseId?: number;
}

export interface IRollCallGet {
    id?: number;
    courseDetailId?: number;
    userId?: number;
    userName?: string;
    isToClass?: boolean;
    comment?: string;
}

export interface IRollCallCreate {
    courseDetailId?: number;
    userId?: number;
    isToClass?: boolean;
    comment?: string;
    saveList?: any[];
}

export interface IRollCallUpdate {
    id: number;
    courseDetailId?: number;
    userId?: number;
    isToClass?: boolean;
    comment?: string;
    saveList?: any[];
}

export class RollCallService {

    // id查询
    public get(id: number): Observable<IRollCallGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/roll_call/${id}`,
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
    public query(RollCallQuery: IRollCallQuery): Observable<IQueryResults<IRollCallGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/roll_call/query`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: RollCallQuery,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 新建
    public create(RollCall: IRollCallCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/roll_call/create`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: RollCall,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 更新
    public update(RollCall: IRollCallUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/roll_call/update/${RollCall.id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: RollCall,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 删除
    public delete(id: number): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/roll_call/delete/${id}`,
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
