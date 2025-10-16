import assert from 'node:assert/strict';
import { MapManager } from '../src/modules/map/index.js';

class StubClassList {
  constructor() {
    this.classes = new Set();
  }
  add(name) {
    this.classes.add(name);
  }
  remove(name) {
    this.classes.delete(name);
  }
  contains(name) {
    return this.classes.has(name);
  }
}

class StubElement {
  constructor() {
    this.value = '';
    this.disabled = false;
    this.listeners = {};
    this.classList = new StubClassList();
  }
  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }
  querySelector() {
    return null;
  }
}

const mapEl = new StubElement();
const cityInput = new StubElement();
const submitButton = new StubElement();
const form = new StubElement();
form.querySelector = (selector) => {
  if (selector === '.howto__search-btn') {
    return submitButton;
  }
  return null;
};
const locateBtn = new StubElement();

const elements = {
  map: mapEl,
  'city-search': cityInput,
  'map-search-form': form,
  'map-locate-me': locateBtn
};

global.document = {
  getElementById(id) {
    return elements[id] ?? null;
  }
};

global.window = {};

const mapManager = new MapManager();

const flyToCalls = [];
mapManager.map = {
    flyTo(args) {
        flyToCalls.push(args);
    },
    isStyleLoaded() {
        return true;
    },
    once(event, handler) {
        if (event === 'load') {
            handler();
        }
    }
};

const requests = [];
global.fetch = async (url) => {
  requests.push(url);
  return {
    async json() {
      return {
        features: [
          { center: [12.34, 45.67] }
        ]
      };
    }
  };
};

mapManager.setupCitySearch();

assert(form.listeners.submit, 'submit handler should be registered');

cityInput.value = 'Alatri';

const submitEvent = { preventDefault() {} };
form.listeners.submit(submitEvent);

assert.equal(mapManager.isSearching, true, 'search flag active while fetching');
assert.equal(submitButton.disabled, true, 'submit button disabled during fetch');
assert.equal(submitButton.classList.contains('is-busy'), true, 'busy class applied');

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));
await nextTick();

assert.equal(mapManager.isSearching, false, 'search flag reset after fetch');
assert.equal(submitButton.disabled, false, 'submit button re-enabled');
assert.equal(submitButton.classList.contains('is-busy'), false, 'busy class removed');

assert.equal(requests.length, 1, 'fetch called once');
assert(
  requests[0].startsWith('https://api.mapbox.com/geocoding/v5/mapbox.places/Alatri'),
  'fetch URL should include encoded city query'
);

assert.equal(flyToCalls.length, 1, 'map flyTo should be called');
assert.deepEqual(flyToCalls[0], { center: [12.34, 45.67], zoom: 13 }, 'flyTo called with expected arguments');

console.log('Map search flow verified successfully.');
