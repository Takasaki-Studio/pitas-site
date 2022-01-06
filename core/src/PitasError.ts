export default class PitasError extends Error {
  constructor(message: string | undefined) {
    super(message);
  }
}
