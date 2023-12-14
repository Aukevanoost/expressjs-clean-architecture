import { ISanitizer } from '@usecases/security';
import defaultSanitizer from './sanitizers/default.sanitizer';

export default class DefaultSanitizationService<T extends object> implements ISanitizer<T> {

    clean(input:T): Promise<T> {

        return new Promise((resolve, reject) => {
            try {
                const props = Object.keys(input) as Array<keyof T>;

                resolve( 
                    props.filter(x => typeof input[x] === 'string')
                    .reduce((cleanOutput, prop: keyof T) => {
                        cleanOutput[prop] = defaultSanitizer(input[prop] as string);
                        return cleanOutput;
                    }, {} as Record<keyof T, string>) as T
                );
            } catch(e) { reject(e); }
        });


    }
}