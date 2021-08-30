import * as path from 'path';
import { CustomResource, LiteralUnion, MCFunctionInstance, PredicateCondition, PredicateInstance, SelectorClass, rel, Coordinates, Selector } from 'sandstone';

export const GameEventResource = CustomResource('GameEvent', {
   dataType: 'json',
   extension: 'json',
   save: ({ packName, saveLocation }) => path.join(saveLocation, packName + '/data', 'game_events')
});

export type EventTarget1 = SelectorClass<true, boolean>;

type RunFunction = string | MCFunctionInstance | ((target1: EventTarget1, target2: Coordinates) => MCFunctionInstance);
type PredicateType = PredicateInstance | PredicateCondition | string;

export type GameEventName = LiteralUnion<'minecraft:block_attach' | 'minecraft:block_change' | 'minecraft:block_close' | 'minecraft:block_destroy' | 'minecraft:block_detach' | 'minecraft:block_open' | 'minecraft:block_place' | 'minecraft:block_press' | 'minecraft:block_switch' | 'minecraft:block_unpress' | 'minecraft:block_unswitch' | 'minecraft:container_close' | 'minecraft:container_open' | 'minecraft:dispense_fail' | 'minecraft:drinking_finish' | 'minecraft:eat' | 'minecraft:elytra_free_fall' | 'minecraft:entity_damaged' | 'minecraft:entity_killed' | 'minecraft:entity_place' | 'minecraft:equip' | 'minecraft:explode' | 'minecraft:fishing_rod_cast' | 'minecraft:fishing_rod_reel_in' | 'minecraft:flap' | 'minecraft:fluid_pickup' | 'minecraft:fluid_place' | 'minecraft:hit_ground' | 'minecraft:lightning_strike' | 'minecraft:minecart_moving' | 'minecraft:mob_interact' | 'minecraft:piston_contract' | 'minecraft:piston_extend' | 'minecraft:prime_fuse' | 'minecraft:projectile_land' | 'minecraft:projectile_shoot' | 'minecraft:ravager_roar' | 'minecraft:ring_bell' | 'minecraft:shear' | 'minecraft:shulker_close' | 'minecraft:shulker_open' | 'minecraft:splash' | 'minecraft:step' | 'minecraft:swim' | 'minecraft:wolf_shaking'>;

export type GameEventJSON = {
   name: string,
   event: GameEventName,
   conditions?: PredicateCondition[],
   function: string
}

export class GameEventInstance {
   name: string
   _gameEventJSON: GameEventJSON

   constructor (name: string, event: GameEventName, conditions: false | PredicateCondition[], run: string) {
      const data = {
         name, event,
         function: run
      } as GameEventJSON;

      if (conditions) data.conditions = conditions;

      GameEventResource.create(name, data);

      this.name = name;
      this._gameEventJSON = data;
   }
}

function GameEvent(name: string, event: GameEventName, run: RunFunction): GameEventInstance;
function GameEvent(name: string, event: GameEventName, conditions: PredicateType | PredicateType[], run: RunFunction): GameEventInstance;
function GameEvent(name: string, event: GameEventName, arg2: RunFunction | PredicateType | PredicateType[], arg3?: RunFunction): GameEventInstance {
   let conditions = (arg3 ? arg2 : false) as false | PredicateType | PredicateType[]

   if (conditions) {
      if (!Array.isArray(conditions)) conditions = [ conditions ];

      for (let [i, condition] of conditions.entries()) {
         if (typeof condition !== 'string' && (condition as PredicateInstance).predicateJSON) 
            conditions[i] = (condition as PredicateInstance).name;

         if (typeof condition === 'string') {
            conditions[i] = {
               condition: 'minecraft:reference',
               name: condition
            };
         }
      }
   }

   let run = (arg3 || arg2) as RunFunction;

   if (typeof run !== 'string') {
      if ((run as MCFunctionInstance).name) run = (run as MCFunctionInstance).name;

      else run = (run(Selector('@s'), rel(0, 0, 0)) as MCFunctionInstance).name;
   } 

   return new GameEventInstance(name, event, conditions as false | PredicateCondition[], run);
}

export default GameEvent;