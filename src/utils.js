/* start-build-ignore */
define( [], function() {
/* end-build-ignore */

var
  rFunctionName = /function ([^(]+)/,
  utils = {};

function extend( dest, source ) {
  var
    key;

  source = source || {};

  for ( key in source ) {
    dest[ key ] = source[ key ];
  }

  return dest;
}

extend( utils, {
  clone: function( source ) {
    var
      key,
      dest = {};

    for ( key in source ) {
      dest[ key ] = source[ key ];
    }

    return dest;
  },

  extend: extend,

  makeArray: function( value ) {
    return this.typeOf( value ) === "array" ? value : [ value ];
  },

  noop: function() {},

  typeOf: function( value ) {
    var
      matches,
      type;

    return value == null ? value + "" : (
      ( type = typeof value ) === "object" || type === "function" ? (
        ( matches = rFunctionName.exec( value.constructor.toString() ) ) &&
        matches[ 1 ] && matches[ 1 ].toLowerCase() || "object"
      ) : type
    );
  }
});

/* start-build-ignore */
return utils;
});
/* end-build-ignore */
