import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap, map, filter, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Listing } from "src/app/models/Listing";
import { Category } from 'src/app/models/Category';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getDashboardData() {
    return this.http.get(`${environment.apiUrl}/admin/dashboard`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  getListings(page = 1, data: any) {
    return this.http
      .get(`${environment.apiUrl}/admin/listings`, {
        params: {
          page: page.toString(),
          ...data,
        },
      })
      .pipe(
        map((res) => res),
        catchError((error) => this.handleError(error))
      );
  }

  getUsers(page = 1, data: any) {
    return this.http
      .get(`${environment.apiUrl}/admin/users`, {
        params: {
          page: page.toString(),
          ...data,
        },
      })
      .pipe(
        map((res) => res),
        catchError((error) => this.handleError(error))
      );
  }

  getLatestListing() {
    return this.http.get(`${environment.apiUrl}/listings/latest_data`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  getListing(listing_id) {
    return this.http.get(`${environment.apiUrl}/listings/${listing_id}`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  getCategories() {
    return this.http.get(`${environment.apiUrl}/categories`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  getLocations() {
    return this.http.get(`${environment.apiUrl}/listings/locations`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  getUserListings(page = 1, userId) {
    return this.http
      .get(`${environment.apiUrl}/admin/listings/user-listings/${userId}`, {
        params: {
          page: page.toString(),
        },
      })
      .pipe(
        map((res) => res),
        catchError((error) => this.handleError(error))
      );
  }

  getSubscriberListings(page = 1) {
    return this.http.get(`${environment.apiUrl}/admin/subscribers`).pipe(
      map((res) => res),
      catchError((error) => this.handleError(error))
    );
  }

  removeSubscriber(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/admin/subscribers/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  changeSubscriberStatus(id: number, status) {
    return this.http
      .post(`${environment.apiUrl}/admin/subscribers/${id}`, { status }, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  searchListing(data: any, page) {
    return this.http
      .get(`${environment.apiUrl}/listings/search`, {
        params: {
          page: page.toString(),
          ...data,
        },
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  saveListing(listing: Listing) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(`${environment.apiUrl}/listings`, listing, { headers })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  updateListing(id: number, listing: Listing) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(`${environment.apiUrl}/listings/${id}`, listing, { headers })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  removeListing(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/listings/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  setFeatured(id: number, status: boolean) {
    return this.http
      .post(`${environment.apiUrl}/listings/${id}/set-featured`, { status }, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  setActiveStatus(id: number, status: boolean) {
    return this.http
      .post(`${environment.apiUrl}/listings/${id}/set-status`, { status }, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }


  saveRating(id: number, rating: Review) {
    return this.http
      .post(`${environment.apiUrl}/listings/${id}/ratings`, rating, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  updateRating(id: number, rating: Review) {
    return this.http
      .put(`${environment.apiUrl}/ratings/${id}`, rating, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  saveCategory(category: Category) {
    return this.http
      .post(`${environment.apiUrl}/categories`, category, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  updateCategory(id: number, category: Category) {
    return this.http
      .put(`${environment.apiUrl}/categories/${id}`, category, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }


  removeCategory(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/categories/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  isBookmarked(id: number) {
    return this.http
      .get(`${environment.apiUrl}/listings/${id}/is_bookmarked`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  getBookmarks() {
    return this.http.get(`${environment.apiUrl}/listings/bookmarks/list`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  addBookmark(id: number) {
    return this.http
      .post(
        `${environment.apiUrl}/listings/${id}/bookmarks/add`,
        {},
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  removeBookmark(id: number) {
    return this.http
      .delete(
        `${environment.apiUrl}/listings/${id}/bookmarks/remove`,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  deleteRating(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/ratings/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  deleteMedia(id: number, listing: number) {
    return this.http
      .delete(
        `${environment.apiUrl}/listings/${listing}/remove-file/${id}`,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side error.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend error.
      return throwError(error);
    }
    // return a custom error message
    return throwError(
      "Ohps something wrong happen here; please try again later."
    );
  }
}
