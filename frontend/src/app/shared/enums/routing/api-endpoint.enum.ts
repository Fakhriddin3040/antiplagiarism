export enum ApiEndpointEnum {
  REGISTER = 'auth/register',
  LOGIN = 'auth/login',

  // FOLDERS
  FOLDERS = 'folders',
  FOLDERS_ROOTS = `${FOLDERS}/roots`,

  // DOCUMENTS
  DOCUMENTS = 'documents',

  //AUTHORS
  AUTHORS = `${DOCUMENTS}/authors`,
}
