export type ErrorResponse = { status: 'error' | 'fail'; message: string };

export type SuccessList<K extends string, T> = {
  status: 'success';
  data: {
    results: number;
  } & Record<K, T[]>;
};

export type SuccessItem<K extends string, T> = {
  status: 'success';
  data: Record<K, T>;
};
