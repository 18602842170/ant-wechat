
import { from as ObservableFrom, Observable, of as ObservableOf, throwError } from "rxjs";
import { map } from "rxjs/operators";
import wepy from "wepy";
import { BACKEND_URL, TOKEN_NAME } from "../constant";
import { IQueryResults } from "./interface";
export interface ITeacherQuery {
    id?: number;
    teacherName?: string;
    teacherCd?: number;
    deleteFlg?: boolean;
    teacherSex?: string;
    teacherProfile?: string;
    userId?: number;
    pageNum?: number;
    pageSize?: number;
}
export interface ITeacherGet {
    id?: number;
    teacherName?: string;
    teacherCd?: number;
    deleteFlg?: boolean;
    teacherSex?: string;
    teacherProfile?: string;
    userId?: number;
    pageNum?: number;
    pageSize?: number;
    teacherLevelStr?: string;
}
export class TeacherService {
    // 条件查询
    public query(TeacherQuery: ITeacherQuery): Observable<IQueryResults<ITeacherGet>> {
        return ObservableFrom(wepy.request({
            url: `${BACKEND_URL}/teacher/query`,
            header: {
                Authorization: wepy.getStorageSync(TOKEN_NAME),
            },
            data: TeacherQuery,
        })).pipe(
            map((response) => {
                return response.data;
            }),
        );
    }


}
