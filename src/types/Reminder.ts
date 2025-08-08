export type Reminder = {
  id: string
  userId: string
  daysBefore: number
  hour: string // ISO string format (DateTime)
  viaEmail: boolean
  viaPush: boolean
  viaWhatsapp: boolean
  active: boolean
}
