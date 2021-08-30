import type { SandstoneConfig } from 'sandstone'

export default {
  name: 'game-event-mod',
  description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' data pack.' ],
  formatVersion: 7,
  namespace: 'game-event-mod',
  packUid: '_isPtrS6',
  saveOptions: { path: './.pack' },
  onConflict: {
    default: 'warn',
  },
} as SandstoneConfig
