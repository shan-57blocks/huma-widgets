import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import { Switch404 } from './components/Switch404'
import { StreamBorrow } from './features/stream'

export const routes: {
  [page: string]: {
    path: string
    isRoot?: boolean
    component: () => React.ReactElement
  }
} = {
  lend: {
    path: '/stream/borrow',
    component: StreamBorrow,
    isRoot: true,
  },
}

function Router() {
  return (
    <Switch404>
      {Object.values(routes).map((route) => (
        <Route
          key={route.path}
          exact
          path={route.path}
          component={route.component}
        />
      ))}
      <Route exact path='/' render={() => <Redirect to='/stream/borrow' />} />
    </Switch404>
  )
}

export default Router
