import { NgModule } from '@angular/core';

import { FeedRoutingModule } from './feed-routing.module';
import { SharedModule } from './../shared/shared.module';

import { PostsComponent } from './components/posts/posts.component';


@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    FeedRoutingModule,
    SharedModule
  ]
})
export class FeedModule { }
