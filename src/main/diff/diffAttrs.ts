import { Attribute, AttributeMap, AttrType } from '../attributes';
import { IAttribute } from '../attributes/attrs';
import { IProperty } from '../attributes/props';

export function diffAttributes(
    oldAttributes:AttributeMap, 
    newAttributes:AttributeMap)
    : AttributeMap | undefined {
        let diff: AttributeMap | undefined = undefined;

        for (const key in oldAttributes) {
            const oldAttribute : Attribute = oldAttributes[key];
            const newAttribute : Attribute | undefined = newAttributes[key];

            switch (oldAttribute.type) {
                case AttrType.ATTRIBUTE:
                case AttrType.PROPERTY:
                    if (newAttribute === undefined || oldAttribute.type === newAttribute.type) {
                        const attrDiff = diffAttribute(oldAttribute, newAttribute);
                        if (attrDiff !== undefined) {
                            diff = (diff || {});
                            diff[key] = attrDiff;
                        }
                    } else {
                        throw new Error(
                            `Type of new prop ${
                              newAttribute.type
                            } does not match type of old prop ${
                              oldAttribute.type
                            }`
                          )
                    }
                    break;

                default:
                    const _exhaustiveCheck: never = oldAttribute;
                    throw new Error(`Unknown attribute type ${_exhaustiveCheck}`);
            }
        }

        for (const key in newAttributes) {
            if (oldAttributes[key] === undefined) {
                diff = diff || {};
                diff[key] = newAttributes[key];
            }
        }
        return diff;
}

function diffAttribute(
    oldAttribute: IAttribute | IProperty,
    newAttribute: IAttribute | IProperty | undefined
    ): IAttribute | IProperty | undefined {
        if (newAttribute === undefined) {
            return {
              type: oldAttribute.type,
              name: oldAttribute.name,
              value: undefined,
            }
        } else if (oldAttribute.value !== newAttribute.value) {
            return newAttribute;
        }
}