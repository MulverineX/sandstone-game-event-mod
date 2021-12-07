import { execute, MCFunction, summon } from "sandstone";
import GameEvent from "./main";

GameEvent('testing', 'minecraft:block_place', {
   condition: 'minecraft:entity_properties',
   entity: 'this',
   predicate: {
      nbt: "{Tags:['test']}"
   }
}, (pos, entity) => MCFunction('testing', () => {
   summon('minecraft:pig', pos);
   execute.as(entity).run.say('hello');
}))