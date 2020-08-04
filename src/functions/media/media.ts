import { getElement, getElements, createElement, updateElement, deleteElement } from '../shared/datastore'
const element = "media"

export interface Media {
  id: string
  owner: string
  name: string
  title: string
  description: string
	path: string
	signedURL: string
	exists: boolean
  updated: { at: string, by: string }
  expired: { at: string, by: string }
}

export async function getMedias(): Promise<Array<Media>> {
  return await getElements(element);
}

export async function getMedia(media_id: string): Promise<Media> {
  return await getElement(element, { id: media_id });
}

export async function createMedia(user: string, media: Media) {
  await createElement(user, element, media);
}

export async function updateMedia(user: string, media: Media) {
  await updateElement(user, element, media);
}

export async function deleteMedia(media_id: string) {
  await deleteElement( element, { id: media_id } );
}