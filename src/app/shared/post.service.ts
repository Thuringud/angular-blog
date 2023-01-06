import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FireBaseCreateResponse, Post} from "./interfaces";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})

export class PostService {
  constructor(private http: HttpClient) {

  }

  create(post: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.FireBaseDBurl}/posts.json`, post)
      .pipe(map((response: FireBaseCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        }
      }))
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.FireBaseDBurl}/posts.json`)
      .pipe(map((response: {[key: string]:any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }))
      }))
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.FireBaseDBurl}/posts/${id}.json`)
  }
}
