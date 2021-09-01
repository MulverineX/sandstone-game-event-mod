import type { SandstoneConfig } from 'sandstone'

export default {
  name: 'game-event-mod',
  description: 'Game Event Mod Library',
  formatVersion: 7,
  namespace: 'game-event-mod',
  packUid: '_isPtrS6',
  saveOptions: { path: './.pack' },
  onConflict: {
    default: 'warn',
  },
} as SandstoneConfig
