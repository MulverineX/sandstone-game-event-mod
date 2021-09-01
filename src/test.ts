import { execute, MCFunction, setblock } from "sandstone";
import GameEvent from "./main";

GameEvent('test', 'minecraft:block_destroy', {
    condition: 'minecraft:entity_properties',
    entity: 'this',
    predicate: {
       type: 'minecraft:player'
    }
 }, (pos, entity) => MCFunction('destroy', () => {
    setblock(pos, 'minecraft:acacia_button');
    execute.as(entity).run.say('hello');
 }))