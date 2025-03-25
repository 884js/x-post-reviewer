// This file is auto-generated from next-typesafe-path
// DO NOT EDIT DIRECTLY

declare module "@@@next-typesafe-path" {
  type IsEmpty<T> = T extends Record<string, never> ? true : false;
  type IsSearchParams<T> = symbol extends keyof T ? false : IsEmpty<T> extends true ? false : true;
  type SearchParamsConfig = import("./next-typesafe-path.config").SearchParams;
  type SearchParams = IsSearchParams<SearchParamsConfig> extends true ? SearchParamsConfig : never;
  type ExportedQuery<T> = IsSearchParams<T> extends true
    ? SearchParams extends never ? { [K in keyof T]: T[K] } : SearchParams & { [K in keyof T]: T[K] }
    : SearchParams;
  type RoutePath = "/";

  interface RouteList {
    "/": {
      params: Record<string, never>,
      searchParams: ExportedQuery<import("src/app/page.tsx").SearchParams>
    }
  }
}
