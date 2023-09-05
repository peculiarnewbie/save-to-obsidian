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

export const mainIframeDoc = writable(null);


/*****************/
/* Header Stuff */

/**
 * Enum for message actions values.
 * @readonly
 * @enum {string}
 */
export var HeaderTypes = {
    /** The true value */
    Title: "title",
    URL: "url",
    Image: "image"
};

/** 
 * @typedef {Object} Headers 
 * @property {HTMLMetaElement} title 
 * @property {HTMLMetaElement} url
 * @property {HTMLMetaElement} image
 */

/**
 * @type {Headers}
 */
let dummyHeader = {title: null, url: null, image: null};

export const docHeaders = writable(dummyHeader)

export const currentSelectedElement = writable(null);

export const initAllStores = () => {
    formScroll.set(0);
    formTopLimit.set(0);
    formBottomLimit.set(0);
    currentSelectedElement.set(null);
    storeMessaging.set(dummyMessage)
}