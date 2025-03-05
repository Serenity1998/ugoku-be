export const FirebaseAuthException = (code: string, {msg = ''}) => {
  switch (code) {
    case 'auth/email-already-exists':
      throw new FirebaseAuthError('Email already exists');
    case 'auth/user-not-found':
      throw new FirebaseAuthError('User not found');
    default:
      throw new FirebaseAuthError(msg);
  }
};

export const UnauthenticatedException = (message: string) => {
  throw new UnauthenticatedError(message);
};

export const NotAnAdminException = (message: string) => {
  throw new NotAnAdminError(message);
};

export const InvalidDataException = (message: string) => {
  throw new InvalidDataError(message);
};

class InvalidDataError extends Error {
  type: string;
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = 'InvalidDataError';
  }
}

class FirebaseAuthError extends Error {
  type: string;
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = 'FirebaseAuthError';
  }
}

class UnauthenticatedError extends Error {
  type: string;
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = 'UnauthenticatedError';
  }
}

class NotAnAdminError extends Error {
  type: string;
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = 'NotAnAdminError';
  }
}
