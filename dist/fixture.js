/*!
Fixture - v1.2.0 - 2014-07-06
https://github.com/kflorence/fixture
A simple, lightweight JavaScript fixture API.

Copyright (C) 2014 Kyle Florence
Released under the BSD, MIT licenses
*/

(function( root, factory ) {

  // AMD
  if ( typeof define === "function" && define.amd ) {
    define( [], factory );

  // Browser
  } else {
    root.Fixture = factory();
  }

})(this, function() {

var
  rFunctionName = /function ([^(]+)/,
  util = {};

function extend( dest, source ) {
  var
    key;

  source = source || {};

  for ( key in source ) {
    dest[ key ] = source[ key ];
  }

  return dest;
}

extend( util, {
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



var uuid = 0;

function Fixture( settings ) {

  // Allow calling without the "new" operator
  if ( !Fixture.isFixture( this ) ) {
    return new Fixture( settings );
  }

  // Properties
  this.data = {};
  this.uuid = uuid++;

  utils.extend( this, settings );
}

utils.extend( Fixture.prototype, {
  attach: utils.noop,
  detach: utils.noop,
  equals: function( other ) {
    return Fixture.isFixture( other ) && this.uuid === other.uuid;
  },
  interact: utils.noop,
  toString: function() {
    return "Fixture:" + this.uuid;
  },
  verify: utils.noop
} );

utils.extend( Fixture, {
  create: function( value ) {
    value = this.normalize( value );

    if ( value && !this.isFixture( value ) ) {
      value = new Fixture( value );
    }

    return value;
  },

  define: function( name, definition, force ) {
    if ( utils.typeOf( name ) === "object" ) {
      force = definition;
      definition = name;
      name = definition.name;
    }

    definition = this.normalize( definition );
    definition.name = name;

    if (
      utils.typeOf( definition ) !== "object" ||
      utils.typeOf( definition.name ) !== "string" || !(
        utils.typeOf( definition.attach ) === "function" ||
        utils.typeOf( definition.detach ) === "function" ||
        utils.typeOf( definition.interact ) === "function" ||
        utils.typeOf( definition.verify ) === "function"
      )
    ) {
      throw "Fixture definition is invalid.";

    } else if ( this.definitions[ name ] && force !== true ) {
      throw "Fixture definition name already exists: " + name;
    }

    this.definitions[ name ] = definition;

    return definition;
  },

  definitions: {},

  equal: function( first, second ) {
    return this.isFixture( first ) && first.equals( second );
  },

  get: function( name, settings ) {
    var
      definition = this.definitions[ name ];

    if ( definition ) {
      definition = utils.extend( utils.clone( definition ), this.normalize( settings ) );
    }

    return definition;
  },

  isFixture: function( value ) {
    return utils.typeOf( value ) === "fixture";
  },

  normalize: function( value ) {
    var
      normalized,
      type = utils.typeOf( value );

    if ( type === "string" ) {
      normalized = this.get( value );

    } else if ( type === "function" ) {
      normalized = { interact: value };

    } else if ( type === "object" ) {
      normalized = this.get( value.name, value ) || value;

    } else if ( this.isFixture( value ) ) {
      normalized = value;
    }

    return normalized;
  },

  remove: function( name ) {
    var
      definition = this.definitions[ name ];

    if ( definition ) {
      delete this.definitions[ name ];
    }

    return definition;
  }
} );



function Repository() {
  this.items = [];
}

utils.extend( Repository.prototype, {
  add: function( value ) {
    var
      fixture = Fixture.create( value );

    if ( fixture ) {
      this.items.push( fixture );
    }

    return fixture;
  },

  get: function( value, indices ) {
    var
      fixture,
      i,
      j,
      items = [],
      values;

    // Get everything
    if ( value == null ) {
      items = items.push.apply( items, this.items );

    // Get by name, uuid or fixture
    } else {
      values = utils.makeArray( value );

      for ( i = 0; i < values.length; i++ ) {
        value = values[ i ];

        for ( j = 0; j < this.items.length; j++ ) {
          fixture = this.items[ j ];

          if (
            value === fixture ||
            value === fixture.name ||
            value === fixture.uuid
          ) {
            items.push( indices ? j : fixture );
          }
        }
      }
    }

    return items;
  },

  has: function( value ) {
    var
      values = utils.makeArray( value );

    return values.length === this.get( values ).length;
  },

  remove: function( value ) {
    var
      i,
      removed = [],
      items = [],
      indices = this.get( value, true );

    for ( i = 0; i < this.items.length; i++ ) {
      ( indices.indexOf( i ) < 0 ? items : removed ).push( this.items[ i ] );
    }

    this.items = items;

    return removed;
  },

  removeAll: function() {
    var
      removed = this.items;

    this.items = [];

    return removed;
  }
} );

// Exports
Fixture.Repository = Repository;

require( [ "src/utils", "src/fixture", "src/fixture.repository" ] );
define("build/main.js", function(){});


  return Fixture;
});