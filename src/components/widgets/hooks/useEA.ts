import { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import EAService, { EAPayload } from '../../../services/EAService'
import { EARejectMessage, EARejectReason } from '../../../utils/const'
import { EARejectionError } from '../../../utils/errors'
import { downScale } from '../../../utils/number'
import { setApproveInfo, setError } from '../store/widgets.reducers'

const useEA = () => {
  const dispatch = useAppDispatch()

  const checkingEA = useCallback(
    async (payload: EAPayload) => {
      try {
        const result = await EAService.approve(payload)
        result.creditLimit = downScale<number>(
          result.creditLimit,
          result.tokenDecimal,
        )
        dispatch(setApproveInfo(result))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e instanceof EARejectionError) {
          dispatch(
            setError({
              errorMessage: EARejectMessage,
              errorReason: EARejectReason,
            }),
          )
        } else {
          dispatch(
            setError({
              errorMessage: e.message,
            }),
          )
        }
      }
    },
    [dispatch],
  )

  return { checkingEA }
}

export default useEA
