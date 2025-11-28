import {Routes} from '@angular/router';

const loadDiary = () => import('../diary/diary.component').then(m => m.DiaryComponent);
const loadFeed = () => import('../feed/feed.component').then(m => m.FeedComponent);
const loadPostCard = () => import('../post-card/post-card.component').then(m => m.PostCardComponent);
const loadCommentCard = () => import('../comment-card2/comment-card2.component').then(m => m.CommentCard2Component);
const loadPostForm = () => import('../post-form/post-form.component').then(m => m.PostFormComponent);

export const TIMELINE_ROUTES: Routes = [
  {
    path: 'diary',
    loadComponent: loadDiary
  },
  {
    path: 'feed',
    loadComponent: loadFeed
  },
  {
    path: 'post-card/:id',
    loadComponent: loadPostCard
  },
  {
    path: 'comment/:id',
    loadComponent: loadCommentCard
  },
  {
    path: 'post-form',
    loadComponent: loadPostForm
  }
];
