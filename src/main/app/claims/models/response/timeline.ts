export interface TimelineEvent {
  // TODO: The name `date` might be misleading in that is suggests it's
  // supposed to be a precise date, when it's more of a possibly approximate,
  // textually described time of an event
  date: string,
  description: string
}

export type Timeline = ReadonlyArray<TimelineEvent>
