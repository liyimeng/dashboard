export function removeObject(ary, obj) {
  const idx = ary.indexOf(obj);

  if ( idx >= 0 ) {
    ary.splice(idx, 1);
  }

  return ary;
}

export function removeObjects(ary, objs) {
  for ( let i = objs.length - 1 ; i >= 0 ; i-- ) {
    removeObject(ary, objs[i]);
  }

  return ary;
}

export function addObject(ary, obj) {
  const idx = ary.indexOf(obj);

  if ( idx === -1 ) {
    ary.push(obj);
  }
}

export function addObjects(ary, objs) {
  for ( let i = 0 ; i < objs.length ; i++ ) {
    addObject(ary, objs[i]);
  }
}

export function isArray(thing) {
  return Array.isArray(thing);
}

export function removeAt(ary, idx, len = 1) {
  if ( idx < 0 ) {
    throw new Error('Index too low');
  }

  if ( idx + len > ary.length ) {
    throw new Error('Index + length too high');
  }

  ary.splice(idx, len);

  return ary;
}

export function clear(ary) {
  ary.length = 0;
}
