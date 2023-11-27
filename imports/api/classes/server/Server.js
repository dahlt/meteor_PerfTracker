/* eslint-disable no-console */
import RedisVent from "./RedisVent";

class Server {
    #settings = null;
    constructor(settings) {
        this.#settings = settings;
    }

    get Config() {
        return this.#settings;
    }

    startRedis() {
        return new Promise((resolve) => {
            RedisVent.publish();
            // console.log("Redis ready!", red);
            resolve();
        });
    }

    initDB() {
        // return new Promise((resolve) => {
        // });
    }

    run() {
        return Promise.all([this.startRedis(), this.initDB()]).then(() => {
            // console.log("Server is ready...");
        });
    }
}

export default new Server(Meteor.settings);
