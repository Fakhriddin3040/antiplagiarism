export type ConfirmModalOptions = {
  message?: string, // Supports InnerHTML
  title?: string,
  confirmLabel?: string,
  discardLabel?: string,
  danger?: boolean
}


export const defaultConfirmModalOptions: ConfirmModalOptions = {
  message: "Вы уверены?",
  title: "Подтвердите действие",
  confirmLabel: "Подтвердить",
  discardLabel: "Отменить",
  danger: false
}
