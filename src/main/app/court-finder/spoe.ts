export class Spoe {
  public static readonly NEAREST = new Spoe('nearest')
  public static readonly START = new Spoe('start')
  public static readonly CONTINUE = new Spoe('continue')

  constructor (public readonly name: string) {
  }

  public static all (): Spoe[] {
    return [
      Spoe.NEAREST,
      Spoe.START,
      Spoe.CONTINUE
    ]
  }

}
