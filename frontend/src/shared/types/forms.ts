/** Reguły walidacji formularza, dla których mamy polskie komunikaty. */
export type ValidationRuleName = 'required' | 'minLength' | 'maxLength' | 'validate';

/** Komunikaty jednej reguły: nazwa pola -> komunikat (klucz `default` to komunikat domyślny). */
export type FieldMessages = Record<string, string>;

/** Komunikaty walidacji: nazwa reguły -> komunikaty dla pól. */
export type ValidationMessages = Record<string, FieldMessages>;
