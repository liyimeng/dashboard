import Vue from 'vue';
import Serializable from './_serializable';
import { isArray } from '@/utils/array';
import Models from '@/models';

// @TODO Validation

class base {
  type = null

  constructor(data) {
    let values = data;

    if ( this.constructor.mangleIn ) {
      values = this.constructor.mangleIn(data);
    }

    Object.assign(this, values);
  }
}

export default class resource extends Serializable(base) {
  toString() {
    if ( this.id ) {
      return `resource:${ this.type }:${ this.id }`;
    } else {
      return `resource:${ this.type }`;
    }
  }

  get schema() {
    return this.$store.getById('schema', this.type);
  }

  trimValues(depth = 0, seenObjs = []) {
    if ( !depth ) {
      depth = 0;
    }

    if ( !seenObjs ) {
      seenObjs = [];
    }

    this.eachKeys((val, key) => {
      Vue.set(this, key, recurse(val, depth + 1));
    }, false);

    return this;

    function recurse(val, depth) {
      if ( depth > 10 ) {
        return val;
      } else if ( typeof val === 'string' ) {
        return val.trim();
      } else if ( isArray(val) ) {
        val.forEach((v, idx) => {
          const out = recurse(v, depth + 1);

          if ( val[idx] !== out ) {
            val.replace(idx, 1, [out]);
          }
        });

        return val;
      } else if ( resource.detectInstance(val) ) {
        // Don't include a resource we've already seen in the chain
        if ( seenObjs.indexOf(val) > 0 ) {
          return null;
        }

        seenObjs.pushObject(val);

        return val.trimValues(depth + 1, seenObjs);
      } else if ( val && typeof val === 'object' ) {
        Object.keys(val).forEach((key) => {
          // Skip keys with dots in them, like container labels
          if ( key.indexOf('.') === -1 ) {
            Vue.set(val, key, recurse(val[key], depth + 1));
          }
        });

        return val;
      } else {
        return val;
      }
    }
  }
}

resource.register = function() {
  Models.register(resource);
};
