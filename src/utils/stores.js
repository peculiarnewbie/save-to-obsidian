import { writable } from 'svelte/store';

/***************************/
/* Main messaging section */

/**
 * Enum for message actions values.
 * @readonly
 * @enum {string}
 */
export var Actions = {
    /** The true value */
    Dummy: "dummy",
    ClosePopup: "closePopup",
    OpenPopup: "openPopup",
    /**
     * data: {paths}
    */
    CollectValues: "collectValues",
    /**
    * data: {values}
    */
    ValuesCollected: "valuesCollected",
    StartInspect: "startInspect",
    FinishHover: "finishHover",
    FinishSelection: "finishSelection",
    /**
     * data: {path, value}
     */
    ElementSelected: "elementSelected",
    
};

/** 
 * @typedef {Object} Message 
 * @property {Actions} action 
 * @property {any} [data]
 */

/**
 * @type {Message}
 */
let dummyMessage = {action: Actions.Dummy};

export const storeMessaging = writable(dummyMessage);


/***************************/
/* Floating Modal section */

export const formScroll = writable(0);
export const formTopLimit = writable(0);
export const formBottomLimit = writable(0);


/***************************/
/* Hove Messaging Section */

/**
 * Enum for message actions values.
 * @readonly
 * @enum {string}
 */
export var HoverActions = {
    GetParent: "getParent",

}

export const currentSelectedElement = writable(null);

export const initAllStores = () => {
    formScroll.set(0);
    formTopLimit.set(0);
    formBottomLimit.set(0);
    currentSelectedElement.set(null);
    storeMessaging.set(dummyMessage)
}