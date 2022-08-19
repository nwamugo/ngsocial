import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import { User, UserResponse, USER_QUERY } from "src/app/shared";

@Injectable({
  providedIn: 'root',
})

export class GetUserGQL extends Query<UserResponse> {
  override document = USER_QUERY;
}