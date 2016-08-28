
var Factories = {};

/**
 * Registers the object factory.
 */
Factories['object'] = new FactoryObject();

/**
 * Registers the default factory.
 */
Factories['default'] = Factories['object'];
