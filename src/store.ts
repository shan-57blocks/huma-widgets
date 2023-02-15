import {
  Action,
  ActionCreator,
  AnyAction,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'

import appReducers from './app/store/app.reducers'
import walletReducers from './features/wallet/store/wallet.reducers'
import widgetsReducers from './components/widgets/store/widgets.reducers'

export const store = configureStore({
  reducer: {
    app: appReducers,
    wallet: walletReducers,
    widget: widgetsReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['wallet/setConnector'],
        ignoredPaths: [
          'wallet.connectors.MetaMask',
          'wallet.connectors.WalletConnect',
        ],
      },
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type AppActionThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, RootState, unknown, AnyAction>
>
