import { Optional } from './helpers/optional';


export default class Environment {
    private static _envList: {[key: string]: string };

    private constructor() { }

    public static get(key: string): Optional<string> {
        if (!Environment._envList) {
            this._envList = require('dotenv').config({path: './.dotenv'})?.parsed ?? {};
        }
        
        return Optional.of(Environment._envList[key]);
    }
}