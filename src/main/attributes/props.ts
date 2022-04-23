import { AttrType } from './types';

export interface IProperty {
    type: AttrType.PROPERTY;
    name: string;
    value: string | number | boolean | undefined;
}