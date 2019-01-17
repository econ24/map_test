import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import { FalcorProvider } from 'utils/redux-falcor'
import { falcorGraph } from 'store/falcorGraph'

import store, { history } from './store'
import App from './App';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
  	<FalcorProvider store={store} falcor={falcorGraph}>
	    <ConnectedRouter history={history}>
	     	<App />
	    </ConnectedRouter>
	</FalcorProvider>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
