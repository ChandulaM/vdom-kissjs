import { AttributeMap } from "../attributes";
import { Html, NodeCache, Patch, PatchType, NodeType, IText, INode } from "../types";
import { diffAttributes } from './diffAttrs'

export function diff(oldNode: Html, newNode: Html, nodeCache: NodeCache): Array<Patch> {
    const patches: Array<Patch> = [];
    runDiff(oldNode, newNode, patches, nodeCache);
    return patches;
}

function runDiff(oldNode: Html, newNode: Html, patches: Array<Patch>, nodeCache: NodeCache): void {
    if (oldNode === newNode) {
        // Assume no changes
        return
    } else {
        const domNode: Node = nodeCache.replace(oldNode, newNode);
        if (oldNode.type !== newNode.type) {
            patches.push({
                type: PatchType.REPLACE,
                node: newNode,
                domNode
            })
        } else {
            switch (oldNode.type) {
                case NodeType.TEXT:
                    if (oldNode.value !== (newNode as IText).value) {
                        patches.push({
                            type: PatchType.TEXT,
                            value: (newNode as IText).value,
                            domNode
                        });
                    }
                    return
                case NodeType.NODE:
                    if (oldNode.tagName !== (newNode as INode).tagName) {
                        patches.push({ 
                            type: PatchType.REPLACE, 
                            node: newNode,
                            domNode });
                    } else {
                        const propsDiff: AttributeMap | undefined 
                            = diffAttributes(oldNode.attributes, (newNode as INode).attributes);
                        
                        if (propsDiff !== undefined) {
                            patches.push({ 
                                type: PatchType.PROPS,
                                attributes: propsDiff,
                                domNode});
                        }

                        diffChildren(
                            oldNode, 
                            (newNode as INode),
                            (domNode as HTMLElement),
                            patches,
                            nodeCache);
                    }
                    return
                
                default:
                    const _exhaustiveCheck: never = oldNode
                    throw new Error(
                        `Non-exhaustive match for ${_exhaustiveCheck}`
                    )
            }
        }
    }    
}

function diffChildren<T>(
    oldParent: INode,
    newParent: INode,
    parentNode: HTMLElement,
    patches: Array<Patch>,
    nodeCache: NodeCache
): void {
    const oldChildren: Array<Html> = oldParent.children;
    const newChildren: Array<Html> = newParent.children;
    const len: number = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < len; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        
        if (oldChild === undefined) {
            patches.push({
                type: PatchType.APPEND,
                node: newChild,
                domNode: parentNode
            });
        }
        else if (newChild === undefined) {
            patches.push({
                type: PatchType.REMOVE,
                domNode: nodeCache.get(oldChild)!,
            });
        }
        else {
            runDiff(oldChild, newChild, patches, nodeCache);
        }
    }
}
