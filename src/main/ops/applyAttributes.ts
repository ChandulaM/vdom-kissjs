import { Attribute, AttributeMap, AttrType } from "../attributes";
import { IAttribute } from "../attributes/attrs";
import { IProperty } from "../attributes/props";

export function applyAttributes(element: HTMLElement, attrs: AttributeMap): void {
    for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
            const attr: Attribute = attrs[key];
            switch (attr.type) {
                case AttrType.ATTRIBUTE:
                    applyAttribute(element, attr);
                    break;
                case AttrType.PROPERTY:
                    applyProperty(element, attr);
                    break;
                default:
                    const _exhaustiveCheck: never = attr
                    throw new Error(
                        `Unknown attribute type ${_exhaustiveCheck}`
                    )
            }
        }
    }
}

function applyAttribute(
    element: HTMLElement,
    attr: IAttribute
): void {
    if (attr.value === true) {
        element.setAttribute(attr.name, '');
    } else if (attr.value === false || attr.value === undefined) {
        element.removeAttribute(attr.name);
    } else {
        element.setAttribute(attr.name, attr.value);
    }
}

function applyProperty(
    element: HTMLElement,
    attr: IProperty
): void {
    (element as any)[attr.name] = attr.value;
}