import {fetchAnnotations} from 'src/annotations/api'
import {Dispatch} from "react";
import {Error as PkgError} from "../../client";
import {InstalledStack} from "../../types";

import {Action as }


export const fetchAndSetAnnotations = (origID:string) => async (
    dispatch: Dispatch<Action>
): Promise<void> => {
    try {
        const annotations = await fetchAnnotations(orgID)
        dispatch(setAnnotations(annotations))
    } catch (error) {
        console.error(error)
    }
}

export const fetchAnnotations = async (orgID: string) => {
    const resp = await getAnnotations({query: {orgID}})

    if (resp.status >= 300) {
        throw new Error((resp.data as PkgError).message)
    }

    return (resp.data as {annotations: InstalledStack[]}).stacks
}