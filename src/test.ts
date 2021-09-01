import { execute, MCFunction, summon } from "sandstone";
import GameEvent from "./main";

GameEvent('test', 'minecraft:block_destroy', {
    condition: 'minecraft:entity_properties',
    entity: 'this',
    predicate: {
       type: 'minecraft:player'
    }
 }, (pos, entity) => MCFunction('destroy', () => {
    summon('minecraft:pig', pos);
    execute.as(entity).run.say('hello');
 }))