require('chai').should()
import './action/createMemoizeAction'
import './action/createPositiveAction'
import './reducer/concatEventReducers'
import './reducer/concatReducers'
import './utils/array'
import './utils/compose'
//Babel 6 is not working with decorators
import './utils/listen'
import './Store'
