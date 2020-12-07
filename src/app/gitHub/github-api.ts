import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export class GitHubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

export interface GitHubApi {
  items: GitHubIssue[];
  total_count: number;
}

export class GitHubIssueHttp {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number): Observable<GitHubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
      `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

    return this._httpClient.get<GitHubApi>(requestUrl);
  }
}
