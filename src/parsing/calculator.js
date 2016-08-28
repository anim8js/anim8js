
/**
* Returns a calculator based on the input. If the input is an instance of
* {{#crossLink "Calculator"}}{{/crossLink}} it is immediately returned. If the
* input is a string the calculator with that name is returned. If no calculator
* could be determined the default calculator is returned.
*
* @method anim8.calculator
* @for Core
* @param {Calculator|String} calculatorInput
* @return {Calculator}
*/
function $calculator(calculatorInput)
{
 if ( calculatorInput instanceof Calculator )
 {
   return calculatorInput;
 }
 if ( isString( calculatorInput ) && calculatorInput in Calculators )
 {
   return Calculators[ calculatorInput ];
 }

 return Calculators['default'];
}
