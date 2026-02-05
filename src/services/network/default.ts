import { type BaseListModel, type BaseParamsModel } from ".";


export function getBaseList_DEFAULT(): BaseListModel<any> {
  const object: BaseListModel<any> = {
    content: [],
    size: 10,
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    number: 1,
    last: false,
    first: false,
  };

  return object;
}

export function getBaseParams_DEFAULT(): BaseParamsModel {
  const object: BaseParamsModel = {
    page: 1,
    size: 10,
  };

  return object;
}