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
}
