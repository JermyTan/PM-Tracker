// Reference: https://gist.github.com/Shrugsy/6b6af02aef1f783df9d636526c1e05fa#file-rtkquerycacheutils-ts

export function getIdTag<R extends string | number, T extends string>(
  id: R,
  type: T,
  additionalIdComponents: string[] = [],
) {
  return { type, id: [`${id}`, ...additionalIdComponents].join(".") };
}

export function getCustomTag<R extends string, T extends string>(
  id: R,
  type: T,
  additionalIdComponents: string[] = [],
) {
  return { type, id: [id, ...additionalIdComponents].join(".") };
}

export function providesList<
  R extends { id: string | number }[],
  T extends string,
>(
  resultsWithIds: R | undefined,
  type: T,
  additionalIdComponents: string[] = [],
) {
  const listTag = [getCustomTag("LIST", type, additionalIdComponents)];

  return resultsWithIds
    ? [
        ...listTag,
        ...resultsWithIds.map(({ id }) =>
          getIdTag(id, type, additionalIdComponents),
        ),
      ]
    : listTag;
}

export function invalidatesList<T extends string>(
  type: T,
  additionalIdComponents: string[] = [],
) {
  return [getCustomTag("LIST", type, additionalIdComponents)];
}

export const cacher = {
  getIdTag,
  getCustomTag,
  providesList,
  invalidatesList,
};
