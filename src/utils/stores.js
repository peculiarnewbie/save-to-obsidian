import { writable } from 'svelte/store';

export const formScroll = writable(0);
export const formTopLimit = writable(0);
export const formBottomLimit = writable(0);