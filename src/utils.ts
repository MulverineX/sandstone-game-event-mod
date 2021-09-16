import * as path from 'path';
import { CustomResource, CustomResourceDataTypes } from "sandstone";
import { CustomResourceInstance } from 'sandstone/resources/Custom';

/**
 * Create a custom datapack resource
 * @param type The Custom Resource type name
 * @param dataType The type of data the file contains
 * @param extension The extension of the file
 * @param typePath The relative path in the datapack namespace of this resource type
 */
export function CustomDataResource(type: string, dataType: CustomResourceDataTypes, extension: string, typePath: string) {
  return CustomResource(type, {
    dataType, extension,
    save: ({ packName, saveLocation, namespace }) => path.join(saveLocation, packName, 'data', namespace, typePath)
 });
}

export type CustomDataResourceInstance = CustomResourceInstance<string, CustomResourceDataTypes>