export const delay = (t:number):Promise<void> => new Promise((res) => setTimeout(res, t));
