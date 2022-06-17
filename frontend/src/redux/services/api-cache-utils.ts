// Reference: https://gist.github.com/Shrugsy/6b6af02aef1f783df9d636526c1e05fa#file-rtkquerycacheutils-ts

export function providesList<
  R extends { id: string | number }[],
  T extends string,
>(resultsWithIds: R | undefined, tagType: T) {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

export function invalidatesList<T extends string>(type: T) {
  return [{ type, id: "LIST" }];
}

export const cacher = {
  providesList,
  invalidatesList,
};
