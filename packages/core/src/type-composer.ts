export type TypeCompose<T extends object[]> = T extends [infer Head, ...infer Tail]
  ? Head & TypeCompose<Tail extends object[] ? Tail : []>
  : {}