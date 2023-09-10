// @ts-check

export const baseUrl = "http://localhost:8000/box.php";

export function create() {
    return `${baseUrl}`;
}
/**
 * 
 * @param {TestController} t 
 */
export async function requestCreate(t) {
    const response = await t.request(create());
    const {data: boxId} = /** @type {any} */ (response.body);
    return boxId;
}

/**
 * @param {string} box 
 * @param {string} message 
 */
export function send(box, message) {
    return `${baseUrl}/?box=${box}&msg=${message}`;
}

/**
 * @param {string} box 
 */
export function poll(box) {
    return `${baseUrl}/?box=${box}`;
}
