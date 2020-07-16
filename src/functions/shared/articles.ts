import { getElement, getElements, createElement, updateElement, deleteElement } from './datastore'
const element = "articles"

export interface Article {
  id: string;
  owner: string;
  name: string;
  title: string;
  description: string;
  content: string;
  updated: { at: string, by: string }
  expired: { at: string, by: string }
}

export async function getArticles(): Promise<Array<Article>> {
  return await getElements(element);
}

export async function getArticle(article_id: string): Promise<Article> {
  return await getElement(element, { id: article_id });
}

export async function createArticle(user: string, article: Article) {
  await createElement(user, element, article);
}

export async function updateArticle(user: string, article: Article) {
  await updateElement(user, element, article);
}

export async function deleteArticle(article_id: string) {
  await deleteElement(element, { id: article_id });
}