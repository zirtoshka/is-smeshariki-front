import {Routes} from '@angular/router';

const loadFriendPage = () => import('../friend/friend-page/friend-page.component')
  .then(m => m.FriendPageComponent);
const loadFriendRequests = () => import('../friend/friend-requests-page/friend-requests-page.component')
  .then(m => m.FriendRequestsPageComponent);
const loadFriendReqFromMe = () => import('../friend/friend-req-from-me/friend-req-from-me.component')
  .then(m => m.FriendReqFromMeComponent);
const loadSmesharikiSearch = () => import('../friend/smeshariki-search-page/smeshariki-search-page.component')
  .then(m => m.SmesharikiSearchPageComponent);

export const FRIEND_ROUTES: Routes = [
  {
    path: 'friends',
    loadComponent: loadFriendPage
  },
  {
    path: 'friendrequests',
    loadComponent: loadFriendRequests
  },
  {
    path: 'friendfromme',
    loadComponent: loadFriendReqFromMe
  },
  {
    path: 'smeshsearch',
    loadComponent: loadSmesharikiSearch
  }
];
