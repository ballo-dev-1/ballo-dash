import { createSlice } from "@reduxjs/toolkit";
//constants
import {
  THEME_MODE,
  THEME_PRESET,
  THEME_LAYOUT,
  SIDEBAR_THEME,
  SIDEBAR_THEME_CAPTION,
  LAYOUT_THEME,
  LAYOUT_LANGUAGES
} from "../../Common/layoutConfig";

import { ThemeState } from "./utils";
// import { changeLanguage } from "i18next";

export const initialState: ThemeState = {
  themeMode: THEME_MODE.LIGHT,
  layoutTheme: LAYOUT_THEME.VERTICAL,
  sidebarTheme: SIDEBAR_THEME.LIGHT,
  sidebarThemeCaptions: SIDEBAR_THEME_CAPTION.CAPTION_SHOW,
  themePreset: THEME_PRESET.PRESET_1,
  themeLayout: THEME_LAYOUT.LTR,
  layoutLanguages: LAYOUT_LANGUAGES.ENGLISH
};

const ThemeSlice = createSlice({
  name: 'ThemeSlice',
  initialState,
  reducers: {
    changeLayoutThemeAction(state: any, action: any) {
      state.layoutTheme = action.payload;
    },
    changeThemeModeAction(state: any, action: any) {
      state.themeMode = action.payload;
    },
    changeSidebarThemeAction(state: any, action: any) {
      state.sidebarTheme = action.payload;
    },
    changeSidebarThemeCaptionsAction(state: any, action: any) {
      state.sidebarThemeCaptions = action.payload;
    },
    changeThemePresetAction(state: any, action: any) {
      state.themePreset = action.payload;
    },
    changeThemeLayoutAction(state: any, action: any) {
      state.themeLayout = action.payload;
    },
    changeLanguageAction(state: any, action: any) {
      state.layoutLanguages = action.payload;
    },
  }
});

export const {
  changeThemeModeAction,
  changeLayoutThemeAction,
  changeThemePresetAction,
  changeThemeLayoutAction,
  changeSidebarThemeAction,
  changeSidebarThemeCaptionsAction,
  changeLanguageAction
} = ThemeSlice.actions;

export default ThemeSlice.reducer;