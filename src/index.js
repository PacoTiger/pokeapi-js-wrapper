import endpoints from './endpoints.json';
import rootEndpoints from './rootEndpoints.json';
import { loadResource } from './getter.js';
import { values } from './default.js';
import { configurator } from './configurator.js';

export class Pokedex {
    constructor(config) {
        configurator.setPokedexConfiguration(config);
        
        // add to Pokedex.prototype all our endpoint functions
        endpoints.forEach(endpoint => {
            this[endpoint[0]] = input => { 
                if (input) {

                    // if the user has submitted a Name or an ID, return the JSON promise
                    if (typeof input === 'number' || typeof input === 'string') {
                        return loadResource(`${values.protocol}${values.hostName}${values.versionPath}${endpoint[1]}/${input}/`); 
                    }

                    // if the user has submitted an Array
                    // return a new promise which will resolve when all loadResource calls are ended
                    else if (typeof input === 'object') {
                        return Promise.all(mapResources(endpoint, input));
                    }
                }
            }
        });

        rootEndpoints.forEach(rootEndpoint => {
            this[rootEndpoint[0]] = config => {
                configurator.setRootEndpointConfiguration(config);
                return loadResource(`${values.protocol}${values.hostName}${values.versionPath}${rootEndpoint[1]}?limit=${values.limit}&offset=${values.offset}`);
            }
        });
    }
};

function mapResources(endpoint, input) {
    return input.map(res => {
        return loadResource(`${values.protocol}${values.hostName}${values.versionPath}${endpoint[1]}/${res}/`);
    });
}