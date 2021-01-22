import {getAnnotation} from 'src/annotations/api'
import {Dispatch} from "react";

import {Annotation} from 'src/types'

import {setAnnotations,
       Action as AnnotationAction},
from 'src/annotations/actions/creators'


// export const fetchAndSetAnnotations = (origID:string) => async (
//     dispatch: Dispatch<Action>
// ): Promise<void> => {
//     try {
//         const annotations = await fetchAnnotations(orgID)
//         dispatch(setAnnotations(annotations))
//     } catch (error) {
//         console.error(error)
//     }
// }

export const getAnnotations =  (stream?: string) => async (
 dispatch: Dispatch<AnnotationAction>
 ): Promise<void> =>
    {
    const response = await getAnnotation({stream: stream})

    if (response.status >= 300) {
        throw new Error('no annotations available')
    }

    if (response.length) {
       dispatch(setAnnotations(response[0].annotations))
    }
}