// this file used for rudecer

import { createAction, createReducer, current } from '@reduxjs/toolkit';
import {
  AddPostAction,
  DeletePostAction,
  EditPostAction,
  UpdatePostAction
} from 'constants/actions';
import initialPostList from 'constants/blog';

type PostState = {
  postList: Post[];
  currentPost: Post | null;
};

const initialState: PostState = {
  postList: initialPostList,
  currentPost: null
};

export const addPost = createAction<Post>(AddPostAction);
export const deletePost = createAction<string>(DeletePostAction);
export const editPost = createAction<Post>(EditPostAction);
export const updatePost = createAction<Post>(UpdatePostAction);

const blogReducer = createReducer(
  initialState,
  // Builder callback
  (builder) => {
    builder
      .addCase(addPost, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(deletePost, (state, action) => {
        const postIndex = state.postList.findIndex(
          (post) => post.id === action.payload
        );
        if (postIndex !== -1) {
          state.postList.splice(postIndex, 1);
        }
      })
      .addCase(editPost, (state, action) => {
        if (action.payload !== null) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost, (state, action) => {
        state.postList.map((post, index) => {
          if (post.id === action.payload?.id) {
            state.postList[index] = action.payload;
          }

          return post;
        });
      })
      .addMatcher(
        (action) => action.type.includes('editPost'),
        (state, action) => {
          console.log('state', current(state));
        }
      );
  }
);

export default blogReducer;
