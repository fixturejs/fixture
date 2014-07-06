/* start-build-ignore */
define( [
  "src/utils"
], function(
  utils
) {
/* end-build-ignore */

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

/* start-build-ignore */
return Fixture;
} );
/* end-build-ignore */
