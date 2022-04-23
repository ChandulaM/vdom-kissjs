import { AttributeMap, Attribute, Attributes } from "./attributes";

export const enum NodeType {
    TEXT,
    NODE,
}

export interface INode {
    type: NodeType.NODE,
    tagName: string;
    attributes: AttributeMap;
    children: Array<Html>;
}

export interface IText {
    type: NodeType.TEXT
    value: string
}

export type Html = INode | IText;

export const enum PatchType {
    APPEND,
    REPLACE,
    REMOVE,
    PROPS,
    TEXT,
}

export interface IAppendPatch {
    type: PatchType.APPEND
    node: Html
    domNode: Node
}
export interface IReplacePatch {
    type: PatchType.REPLACE
    node: Html
    domNode: Node
}
export interface IRemovePatch {
    type: PatchType.REMOVE
    domNode: Node
}
export interface IPropsPatch {
    type: PatchType.PROPS
    attributes: AttributeMap
    domNode?: Node
}
export interface ITextPatch {
    type: PatchType.TEXT
    value: string
    domNode: Node
}

export type Patch = IAppendPatch | IReplacePatch | ITextPatch | IPropsPatch | IRemovePatch;

export class NodeCache extends WeakMap<Html, Node> {
    
    replace(oldKey: Html, newKey: Html): Node {
        const value: Node = this.get(oldKey)!
        this.delete(oldKey)
        this.set(newKey, value)
        return value
    }
}

