import React from 'react'

import HelloWorld from './hello-world'
import '../scss/app.scss'

const App = () => {
	return (
		<div>
			<h1>React Webpack Demo</h1>
			<HelloWorld emoji='🐒 ♥️ 🍑'/>
		</div>
	)
}
export default App