import { render } from "./render";
import { applyAttributes, removeElement, replaceElement } from "./ops/";
import { NodeCache, Patch, PatchType } from "./types";

function applyPatch(patch: Patch, nodeCache: NodeCache): void {
    if (patch.domNode === undefined) {
        console.error("DOM Node for patch is undefined");
    } else {

        switch (patch.type) {
            case PatchType.PROPS:
                applyAttributes(
                    (patch.domNode as HTMLElement),
                    patch.attributes
                )
                return;
            case PatchType.TEXT:
                patch.domNode.textContent = patch.value;
                return;
            case PatchType.REMOVE:
                removeElement(patch.domNode);
                return;
            case PatchType.REPLACE:
                const toReplace: Node = patch.domNode;
                const replacement: Node = render(patch.node, nodeCache);
                replaceElement(replacement, toReplace);
                return;
            case PatchType.APPEND:
                const parentNode = patch.domNode;
                const toAppend = render(patch.node, nodeCache);
                parentNode.appendChild(toAppend);
                return;
        }
    }
}

export function applyPatches(patches: Array<Patch>, nodeCache: NodeCache): void {
    for (const patch of patches) {
        applyPatch(patch, nodeCache);
    }
}