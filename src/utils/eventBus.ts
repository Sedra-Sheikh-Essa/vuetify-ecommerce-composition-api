import mitt from 'mitt'

type Events = {
  'show-notification': { message: string; color?: string }
}

export const SimpleEventBus = mitt<Events>()
