import { changeHTMLAttribute } from './utils';
import {
    changeThemeModeAction,
    changeThemePresetAction,
    changeThemeLayoutAction,
    changeSidebarThemeAction,
    changeSidebarThemeCaptionsAction,
    changeLayoutThemeAction,
    changeLanguageAction,
} from './reducer';

/**
 * Changes the layout type
 * @param {*} param0
 */
export const changeThemeMode = (themeMode: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-theme", themeMode);
        dispatch(changeThemeModeAction(themeMode));
    } catch (error) {

    }
};

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeSidebarTheme = (sidebarTheme: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-sidebar-theme", sidebarTheme);
        dispatch(changeSidebarThemeAction(sidebarTheme));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeSidebarThemeCaptions = (sidebarThemeCaptions: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-sidebar-caption", sidebarThemeCaptions);
        dispatch(changeSidebarThemeCaptionsAction(sidebarThemeCaptions));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeThemePreset = (preset: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-preset", preset);
        dispatch(changeThemePresetAction(preset));
    } catch (error) {

    }
};


/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeThemeLayout = (layoutMode: any) => async (dispatch: any) => {
    try {
        changeHTMLAttribute("data-pc-direction", layoutMode);
        dispatch(changeThemeLayoutAction(layoutMode));
    } catch (error) {

    }
};

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
export const changeLayoutTheme = (layoutTheme: any) => async (dispatch: any) => {
    const className = 'layout-3'
    const className2 = 'layout-extended'
    const className3 = 'layout-moduler'
    try {
        changeHTMLAttribute("data-pc-layout", layoutTheme);
        dispatch(changeLayoutThemeAction(layoutTheme));
        if (layoutTheme === 'vertical-tab') {
            document.body.classList.add(className);
        }
        if (layoutTheme === 'extended') {
            document.body.classList.add(className2);
        }
        if (layoutTheme === 'moduler') {
            document.body.classList.add(className3);
        }

    } catch (error) {

    }
};

// export const chanageLanguage = (language: any) => async (dispatch: any) => {
//     try {
//         dispatch({ type: "CHANGE_LANGUAGE", payload: language });
//     } catch (error) {
//         console.error(error);
//     }
// }

export const chanageLanguage = (language: any) => async (dispatch: any) => {
    dispatch(changeLanguageAction(language));
};