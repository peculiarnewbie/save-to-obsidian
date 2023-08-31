import { writable } from 'svelte/store';


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
    StartInspect: "startInspect",
    /**
     * data: {path, value}
     */
    ElementSelected: "elementSelected",
    /**
     * data: {paths}
    */
    CollectValues: "collectValues",
    /**
    * data: {values}
    */
    ValuesCollected: "valuesCollected"
    
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


export const formScroll = writable(0);
export const formTopLimit = writable(0);
export const formBottomLimit = writable(0);
export const currentSelectedElement = writable(null)

export const storeMessaging = writable(dummyMessage);

export const initAllStores = () => {
    formScroll.set(0);
    formTopLimit.set(0);
    formBottomLimit.set(0);
    currentSelectedElement.set(null);
    storeMessaging.set(dummyMessage)
}