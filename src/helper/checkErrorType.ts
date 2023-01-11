import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ErrorFromObject = {
  [key: string]: string | ErrorFromObject | ErrorFromObject[];
};

type EntityError = {
  status: 422;
  data: {
    error: ErrorFromObject;
  };
};

/**
 * Phương pháp "type predicate" dùng để thu hẹp kiểu một biến
 * Đầu tiên chúng ta sẽ khai báo một function kiểm tra cấu trúc về mặt logic javascript
 * Tiếp theo chúng ta sẽ thêm `parameterName is Type` làm kiểu return functin thay vì boolean
 * Khi dùng function kiểm tra kiểu này, ngoài việc kiểm tra về mặt logic cấu trúc, nó còn giúp chuyển kiểu dẽ dàng
 */

/**
 * Narrow an error own unknown type to FetchBaseQueryError type
 * @param {unknown} error
 * @return {FetchBaseQueryError}  FetchBaseQueryError
 */
export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

/**
 * Narrow an error own unknown type to SerializedError type
 *  @param {unknown} error
 *  @return  {SerializedError} {
  name?: string,
  message?: string,
  stack?: string,
  code?: string,
}
 */
export const isErrorWithMessage = (
  error: unknown
): error is SerializedError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

/**
 * Narrow an error onw unknown type to POST, PUT type
 */

export const isEntityError = (error: unknown): error is EntityError => {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    error.data !== null &&
    !(error.data instanceof Array)
  );
};
