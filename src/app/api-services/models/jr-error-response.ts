/**
 * Model pour mapper les erreurs de validation levées par le backend.
 * Error si les champs ne portent pas les mêmes noms.
 */

export interface JrErrorResponse {
  message?: string;
  errorCode?: string;
  path?: string;
  validationErrors?: Array<JrValidationError>;
}

export interface JrValidationError {
  field: string;
  errorCode: string;
  message: string;
}
