
function translate(animation, mappings, saveAs, options, cache)
{
  var parsed = $animation(animation, options, cache);
  var attrimators = parsed.newAttrimators();

  for (var fromAttribute in mappings)
  {
    var toAttribute = mappings[ fromAttribute ];

    attrimators.get( fromAttribute ).attribute = toAttribute;
    attrimators.rekey( fromAttribute, toAttribute );
  }

  var translated = new Animation( saveAs, parsed.input, parsed.options, attrimators );

  if ( isString( saveAs ) )
  {
    save( saveAs, translated );
  }

  return translated;
}
