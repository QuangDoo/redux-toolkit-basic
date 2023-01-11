import {
  AnyAction,
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { isEntityError } from 'helper';
import { toast } from 'react-toastify';

const isPayloadErrorMessage = (
  payload: unknown
): payload is {
  data: {
    error: string;
  };
  status: number;
} => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload.data as any)?.error === 'string'
  );
};

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    /**
     * `isRejectedWithValue` là một function giúp chúng ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
     * RTK Qurery sử dụng createAsyncThunk từ bên trong nên chúng ta có thể sử dụng isRejectedWithValue để kiểm tra lỗi
     */
    if (isRejectedWithValue(action)) {
      // Mỗi khi thực hiện mutaion mà bị lõi thì nó sẽ chạy vào đây
      // Những lỗi liên quan tới server, lỗi thực thi thì action nó mới rejectWithValue = true
      // Còn những action liên quan tới việc caching hay rtk query thì rejectWithValue = false, nên đừng lo lắng nó không nhảy vào case này đâu
      // Thông qua isRejectedWithValue thì action sẽ có type là
      /**
        * action: PayloadAction<unknown, string, {
    arg: unknown;
    requestId: string;
    requestStatus: "rejected";
    aborted: boolean;
    condition: boolean;
} & ({
    rejectedWithValue: true;
} | ({
    rejectedWithValue: false;
} & {})), SerializedError>
           */
      if (isPayloadErrorMessage(action.payload)) {
        // Lỗi từ server chí có message thôi
        toast.error(action.payload.data.error);
      } else if (!isEntityError(action.payload)) {
        // Các lỗi còn lại trừ 422: có thể là SerializedError
        toast.warn(action.error.message);
      }
    }
    return next(action);
  };
