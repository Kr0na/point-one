/**@flow*/
export type PointAction = {
  type: string;
  payload?: any;
  data?: any;
}

export type ThunkAction = (dispatch: PointDispatch, getState: GetState) => any;

export type PointDispatch = (action: PointAction | ThunkAction) => any;
export type GetState = () => Object;
export type Listener = (state:any) => void;
export type ListenerRemover = () => void;
export type PointListen = (listener:Listener) => ListenerRemover;

export type PointReducer = (state:any, event:PointAction) => any;

export type Store = {
  getState:GetState;
  dispatch:PointDispatch;
  listen:PointListen;
  dangerously: {
    replaceReducer: (reducer:PointReducer, safe:bool) => void
  };
}
export type StoreInitializer = (reducer:PointReducer, initialState:any) => Store;
export type StoreExtender = (next:StoreInitializer) => StoreInitializer;

export type DispatcherAPI = {
  getState: GetState;
  dispatch: PointDispatch;
}
export type DispatchPlugin = (next: PointDispatch) => PointDispatch;
export type DispatchExtender = (api: DispatcherAPI) => DispatchPlugin;

export type EventManager = {
  register(callback:Function):Function;
  dispatch(event:PointAction):PointAction;
}

export type HandlerThunkAction = (...opts:Array<any>) => ThunkAction;
