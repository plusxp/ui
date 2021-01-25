import {getAnnotation} from 'src/annotations/api'
import {Dispatch} from "react";

import {setAnnotations,
       Action as AnnotationAction}

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
    console.log("jill3:  in getAnnotations,", response)

    if (response.status >= 300) {
        throw new Error('no annotations available')
    }

    if (response.length) {
        const anns = response[0].annotations;
        console.log('ack! jill3 inside here...', anns);

       dispatch(setAnnotations(anns))
    } else {
        console.log('ick! jill3....problem')
    }
}