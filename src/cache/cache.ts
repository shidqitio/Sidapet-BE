import NodeCache from "node-cache";

const myCache = new NodeCache({stdTTL : 100, checkperiod:120})

const setCache = (key : string, value : any, ttl? : number | any) : void => {
    myCache.set(key, value, ttl)
}

const getCache = (key : string) : any | undefined => {
    return myCache.get(key)
}

const delCache = (key: string): void => {
    myCache.del(key);
};

const flushAllCache = (): void => {
    myCache.flushAll();
};

export {
    setCache,
    getCache,
    delCache,
    flushAllCache,
}
