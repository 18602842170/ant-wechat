
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";

export interface INoticeQuery {
    id?: number;
    noticeTitle?: string;
    userId?: number;
    noticeContent?: string;
    noticeTarget?: number;
    schoolNoticeTargets?: string;
    teacherNoticeTargets?: string;
    userOfStuId?: number;
    deleteFlg?: boolean;
    pageNum?: number;
    pageSize?: number;
}

export interface INoticeGet {
    id?: number;
    noticeTitle?: string;
    userId?: number;
    noticeContent?: string;
    noticeTarget?: number;
    deleteFlg?: boolean;
    updateDate?: Date;
    noticeDateStr?: string;
}

export interface INoticeCreate {
    noticeTitle?: string;
    userId?: number;
    noticeContent?: string;
    noticeTarget?: number;
    deleteFlg?: boolean;
}

export interface INoticeUpdate {
    id?: number;
    noticeTitle?: string;
    userId?: number;
    noticeContent?: string;
    noticeTarget?: number;
    deleteFlg?: boolean;
}

export class NoticeService {

    // id查询
    public get(id: number): Observable<INoticeGet> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/notice/${id}`,
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
    public query(noticeQuery: INoticeQuery): Observable<IQueryResults<INoticeGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/notice/query`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: noticeQuery,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 新建
    public create(notice: INoticeCreate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/notice/create`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: notice,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 更新
    public update(notice: INoticeUpdate): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/notice/update/${notice.id}`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: notice,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }

    // 删除
    public delete(id: number): Observable<any> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/notice/delete/${id}`,
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
