import {Annotation} from 'src/types';

export const SET_ANNOTATIONS = 'SET_ANNOTATIONS'

export type Action = ReturnType<typeof setAnnotations>

export const setAnnotations = (annotations: Annotation[]) =>
    ({
        type:SET_ANNOTATIONS,
        annotations,
    } as const)

