import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap, map, filter, catchError } from "rxjs/operators";
import { Listing } from "../models/Listing";
import { throwError } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class ListingService {
  constructor(private http: HttpClient) { }

  getListings(page = 1, data: any) {
    return this.http
      .get(`${environment.apiUrl}/listings`, {
        params: {
          page: page.toString(),
          ...data
        }
      })
      .pipe(
        map(res => res),
        catchError(error => this.handleError(error))
      );
  }

  getLatestListing() {
    return this.http
      .get(`${environment.apiUrl}/listings/latest_data`)
      .pipe(
        map(res => res),
        catchError(error => this.handleError(error))
      );
  }

  getListing(listing_id) {
    return this.http.get(`${environment.apiUrl}/listings/${listing_id}`).pipe(
      map(res => res),
      catchError(error => this.handleError(error))
    );
  }

  getCategory(category_id) {
    return this.http.get(`${environment.apiUrl}/categories/${category_id}`).pipe(
      map(res => res),
      catchError(error => this.handleError(error))
    );
  }


  getCategories() {
    return this.http.get(`${environment.apiUrl}/categories`).pipe(
      map(res => res),
      catchError(error => this.handleError(error))
    );
  }

  getLocations() {
    return this.http.get(`${environment.apiUrl}/listings/locations`).pipe(
      map(res => res),
      catchError(error => this.handleError(error))
    );
  }

  getUserListings(page = 1) {
    return this.http
      .get(`${environment.apiUrl}/listings/user-listings`, {
        params: {
          page: page.toString()
        }
      })
      .pipe(
        map(res => res),
        catchError(error => this.handleError(error))
      );
  }

  searchListing(data: any, page) {
    return this.http
      .get(`${environment.apiUrl}/listings/search`, {
        params: {
          page: page.toString(),
          ...data
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
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
        catchError(error => this.handleError(error))
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
        catchError(error => this.handleError(error))
      );
  }

  removeListing(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/listings/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }


  saveRating(id: number, rating: Review) {
    return this.http
      .post(`${environment.apiUrl}/listings/${id}/ratings`, rating, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  updateRating(id: number, rating: Review) {
    return this.http
      .put(`${environment.apiUrl}/ratings/${id}`, rating, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  isBookmarked(id: number) {
    return this.http
      .get(`${environment.apiUrl}/listings/${id}/is_bookmarked`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  getBookmarks() {
    return this.http
      .get(`${environment.apiUrl}/listings/bookmarks/list`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  addBookmark(id: number) {
    return this.http
      .post(`${environment.apiUrl}/listings/${id}/bookmarks/add`, {}, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  removeBookmark(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/listings/${id}/bookmarks/remove`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteRating(id: number) {
    return this.http
      .delete(`${environment.apiUrl}/ratings/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteMedia(id: number, listing: number) {
    return this.http
      .delete(`${environment.apiUrl}/listings/${listing}/remove-file/${id}`, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
      );
  }

  onSubscribe(data: { email: string }) {
    return this.http
      .post(`${environment.apiUrl}/subscriptions/create`, data, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => this.handleError(error))
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
