export class Err<E> {
  success: false = false;
  error: E;
  constructor(error: E) {
    this.error = error;
  }
}
export class Ok<T> {
  success: true = true;
  value: T;
  constructor(value: T) {
    this.value = value;
  }

  unwrap = () => {
    return this.value;
  };
}

// I'm coding rust now
export type Result<T, E> = Err<E> | Ok<T>;

// And also coding some golang here.
export function to<T, E>(promise: Promise<T>): Promise<Result<T, E>> {
  return promise
    .then((data) => {
      return new Ok(data);
    })
    .catch((err) => {
      return new Err(err);
    });
}
