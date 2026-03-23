import { useCallback, useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmDialogOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}

type ConfirmDialogState = {
  options: ConfirmDialogOptions
  resolve: (value: boolean) => void
}

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState | null>(null)

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve })
    })
  }, [])

  const close = useCallback((value: boolean) => {
    setState((previous) => {
      if (previous) {
        previous.resolve(value)
      }
      return null
    })
  }, [])

  const dialog = useMemo(() => {
    if (!state) return null

    return (
      <AlertDialog open onOpenChange={(open) => !open && close(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.options.title}</AlertDialogTitle>
            {state.options.description && (
              <AlertDialogDescription>{state.options.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => close(false)}>
              {state.options.cancelText ?? 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => close(true)}
            >
              {state.options.confirmText ?? 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }, [close, state])

  return { confirm, confirmDialog: dialog }
}
