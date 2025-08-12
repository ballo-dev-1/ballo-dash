import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

// Front
import ThemeReducer from "./themeLayouts/reducer";

// calender
import calenderReducer from "./Calendar/reducer";

// ecom
import EcomReducer from "./E-commerce/reducer";

//chat
import ChatReducer from "./Chat/reducer";

// email
import EmailReducer from "./Email/reducer";

// company
import companyReducer from "./Company/reducer";

// user
import userReducer from "./User/reducer";

// integrations
import integrationReducer from "./Integrations/reducer";

import marketingPlansReducer from "./Marketing Plans/reducer";

import metaReducer from "./metaData/reducer";

import linkedInReducer from "./linkedInData/reducer";

// Combine your reducers into a root reducer
const rootReducer = combineReducers({
  Calender: calenderReducer,
  Ecom: EcomReducer,
  chat: ChatReducer,
  Email: EmailReducer,
  Theme: ThemeReducer,
  company: companyReducer,
  user: userReducer,
  marketingPlans: marketingPlansReducer,
  integration: integrationReducer,
  meta: metaReducer,
  linkedin: linkedInReducer,
});

const reducer = (state: any, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: false });
