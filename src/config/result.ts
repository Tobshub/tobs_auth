interface Ok<V> {
  ok: true;
  value: V;
}

export const Ok = <const V = {}>(data?: V): Ok<V> => ({
  ok: true,
  value: data ?? ({} as V),
});

interface Err<M, C> {
  ok: false;
  message: M;
  cause?: C;
}

export const Err = <const M = "An error occured", const C = unknown>(
  message?: M,
  cause?: C
): Err<M, C> => ({
  ok: false,
  message: message ?? ("An error occured" as M),
  cause,
});
