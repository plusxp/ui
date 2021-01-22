import {ActionTypes} from 'src/annotations/actions'

import {Annotation} from 'src/types';

export interface AnnotationsState {
  visibleStreamsByID: string[]
  annotations: Annotation[]
}

export const initialState = (): AnnotationsState => ({
  visibleStreamsByID: [],
  annotations: [],
})

// TODO: use immer
export const annotationsReducer = (
  state = initialState(),
  action: ActionTypes
): AnnotationsState => {
  switch (action.type) {
    case 'ENABLE_ANNOTATION_STREAM':
      return {
        ...state,
        visibleStreamsByID: [...state.visibleStreamsByID, action.streamID],
      }
    case 'DISABLE_ANNOTATION_STREAM':
      return {
        ...state,
        visibleStreamsByID: state.visibleStreamsByID.filter(
          streamID => streamID !== action.streamID
        ),
      }
    case 'SET_ANNOTATIONS':
      console.log('jill3:  in set_annotations; here this am (hi!)', action)

      return {
        ...state,
        annotations:action.annotations
      }
    default:
      return state
  }
}
