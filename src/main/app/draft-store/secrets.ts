export class Secrets {
  constructor (
    readonly primary: string,
    readonly secondary?: string
  ) {}

  asHeader (): string {
    return this.secondary ? `${this.primary},${this.secondary}` : this.primary
  }
}
