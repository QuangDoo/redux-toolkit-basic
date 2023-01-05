import { configureStore } from '@reduxjs/toolkit';
import blogReducer from 'pages/blog/blog.slice';
import counterReducer from '../src/features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    blog: blogReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
