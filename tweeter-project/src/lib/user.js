import { CURRENT_USER, USER_STORAGE_KEY } from "./constants"

export function loadUsername() {
    return localStorage.getItem(USER_STORAGE_KEY) || CURRENT_USER;
}

export function saveUsername(name) {
    localStorage.setItem(USER_STORAGE_KEY, name);
}
