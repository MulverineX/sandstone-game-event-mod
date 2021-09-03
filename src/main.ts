import * as path from 'path';
import { env } from 'process';
import { CustomResource, LiteralUnion, MCFunctionInstance, PredicateCondition, PredicateInstance, SelectorClass, rel, Coordinates, Selector } from 'sandstone';
import { CustomResourceFactory, CustomResourceInstance } from 'sandstone/resources/Custom';

/**
 * GameEvent ID https://minecraft.gamepedia.com/Sculk_Sensor#Vibration_frequencies 
 */
export type GameEventID = LiteralUnion<'minecraft:block_attach' | 'minecraft:block_change' | 'minecraft:block_close' | 'minecraft:block_destroy' | 'minecraft:block_detach' | 'minecraft:block_open' | 'minecraft:block_place' | 'minecraft:block_press' | 'minecraft:block_switch' | 'minecraft:block_unpress' | 'minecraft:block_unswitch' | 'minecraft:container_close' | 'minecraft:container_open' | 'minecraft:dispense_fail' | 'minecraft:drinking_finish' | 'minecraft:eat' | 'minecraft:elytra_free_fall' | 'minecraft:entity_damaged' | 'minecraft:entity_killed' | 'minecraft:entity_place' | 'minecraft:equip' | 'minecraft:explode' | 'minecraft:fishing_rod_cast' | 'minecraft:fishing_rod_reel_in' | 'minecraft:flap' | 'minecraft:fluid_pickup' | 'minecraft:fluid_place' | 'minecraft:hit_ground' | 'minecraft:lightning_strike' | 'minecraft:minecart_moving' | 'minecraft:mob_interact' | 'minecraft:piston_contract' | 'minecraft:piston_extend' | 'minecraft:prime_fuse' | 'minecraft:projectile_land' | 'minecraft:projectile_shoot' | 'minecraft:ravager_roar' | 'minecraft:ring_bell' | 'minecraft:shear' | 'minecraft:shulker_close' | 'minecraft:shulker_open' | 'minecraft:splash' | 'minecraft:step' | 'minecraft:swim' | 'minecraft:wolf_shaking'>;

/**
 * A predicate condition you want checked before the function runs, has position set to `GameEvent.BlockPos`, entity `this` set to `GameEvent.Entity` if present. 
 */
type PredicateType = PredicateInstance | PredicateCondition | string;

/**
 * `GameEvent.BlockPos`. Always present, in many events describes position of an entity but has no decimal precision.
 */
export type PositionTarget = Coordinates;
/**
 * When an entity is involved, `GameEvent.Entity` (Absent in several events).
 */
export type EntityTarget = SelectorClass<true, boolean>;
/**
 * The function you want ran for the event, either the name, an existing function, or a new function using built-in targets.
 */
type RunFunction = string | MCFunctionInstance | ((pos: PositionTarget, entity: EntityTarget) => MCFunctionInstance);

/**
 * Exporter of GameEvent JSON files
 */
/*export const GameEventResource = CustomResource('GameEvent', {
   dataType: 'json',
   extension: 'json',
   save: ({ packName, saveLocation, namespace }) => path.join(saveLocation, packName + '/data', namespace, 'game_events')
});*/

const GameEventNamespaces: Record<string, CustomResourceFactory<string, 'json'>> = {};

function GameEventNamespace(name: string) {
   let namespace = env.NAMESPACE;
   let _name = name;

   if (name.indexOf(':') !== -1) {
      const split = name.split(':');
      namespace = split[0];
      _name = split[1];
   }

   if (!GameEventNamespaces[namespace]) {
      GameEventNamespaces[namespace] = CustomResource(`GameEvent.${namespace}`, {
         dataType: 'json',
         extension: 'json',
         save: ({ packName, saveLocation }) => path.join(saveLocation, packName + '/data', namespace, 'game_events')
      });
   }
   return [ GameEventNamespaces[namespace], _name];
}

/**
 * Object to be exported to JSON for Event.
 * @param event Event ID
 * @param conditions Predicate conditions
 * @param function Name of MCFunction that's ran
 */
export type GameEventJSON = {
   event: GameEventID,
   conditions?: PredicateCondition[],
   function: string
}

export class GameEventInstance {
   name: string
   _gameEventJSON: GameEventJSON
   _resourceInstance: CustomResourceInstance<string, 'json'>

   constructor (name: string, event: GameEventID, conditions: false | PredicateCondition[], run: string) {
      const data: GameEventJSON = {
         event,
         function: run
      };

      if (conditions) data.conditions = conditions;

      this.name = name;
      this._gameEventJSON = data;

      const factory = GameEventNamespace(name);
      this._resourceInstance = (factory[0] as CustomResourceFactory<string, 'json'>).create(factory[1] as string, data);
   }
}

/**
 * @param name Event hook ID
 * @param event GameEvent ID https://minecraft.gamepedia.com/Sculk_Sensor#Vibration_frequencies 
 * @param conditions Predicate conditions you want checked before the function runs, has position set to `GameEvent.BlockPos`, entity `this` set to `GameEvent.Entity` if present
 * @param run The function you want ran for the event, either the name, an existing function, or a new function using built-in targets.
 */
function GameEvent(name: string, event: GameEventID, run: RunFunction): GameEventInstance;
function GameEvent(name: string, event: GameEventID, conditions: PredicateType | PredicateType[], run: RunFunction): GameEventInstance;
function GameEvent(name: string, event: GameEventID, arg2: RunFunction | PredicateType | PredicateType[], arg3?: RunFunction): GameEventInstance {
   let conditions = (arg3 ? arg2 : false) as false | PredicateType | PredicateType[];

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
      if (run.name) run = run.name;

      else run = (run(rel(0, 0, 0), Selector('@s')) as MCFunctionInstance).name;
   } 

   return new GameEventInstance(name, event, conditions as false | PredicateCondition[], run);
}

export default GameEvent;