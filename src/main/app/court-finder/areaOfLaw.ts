export class AreaOfLaw {
  public static readonly ADOPTION = new AreaOfLaw('Adoption')
  public static readonly BANKRUPTCY = new AreaOfLaw('Bankruptcy')
  public static readonly CHILDREN = new AreaOfLaw('Children')
  public static readonly CIVIL_PARTNERSHIP = new AreaOfLaw('Civil Partnership')
  public static readonly CRIME = new AreaOfLaw('Crime')
  public static readonly DIVORCE = new AreaOfLaw('Divorce')
  public static readonly DOMESTIC_VIOLENCE = new AreaOfLaw('Domestic Violence')
  public static readonly EMPLOYMENT = new AreaOfLaw('Employment')
  public static readonly FORCED_MARRIAGE_AND_FGM = new AreaOfLaw('Forced Marriage and FGM')
  public static readonly HIGH_COURT_DISTRICT_REGISTRY = new AreaOfLaw('High Court District Registry')
  public static readonly HOUSING_POSSESSION = new AreaOfLaw('Housing Possession')
  public static readonly IMMIGRATION = new AreaOfLaw('Immigration')
  public static readonly MONEY_CLAIMS = new AreaOfLaw('Money Claims')
  public static readonly PROBATE = new AreaOfLaw('Probate')
  public static readonly SOCIAL_SECURITY = new AreaOfLaw('Social Security')
  public static readonly TAX = new AreaOfLaw('Tax')
  public static readonly ALL = new AreaOfLaw('All')

  constructor (public readonly name: string,
               public readonly externalLink: string = '',
               public readonly externalLinkDescription: string = '') {
  }

  public static all (): AreaOfLaw[] {
    return [
      AreaOfLaw.ADOPTION,
      AreaOfLaw.BANKRUPTCY,
      AreaOfLaw.CHILDREN,
      AreaOfLaw.CIVIL_PARTNERSHIP,
      AreaOfLaw.CRIME,
      AreaOfLaw.DIVORCE,
      AreaOfLaw.DOMESTIC_VIOLENCE,
      AreaOfLaw.EMPLOYMENT,
      AreaOfLaw.FORCED_MARRIAGE_AND_FGM,
      AreaOfLaw.HIGH_COURT_DISTRICT_REGISTRY,
      AreaOfLaw.HOUSING_POSSESSION,
      AreaOfLaw.IMMIGRATION,
      AreaOfLaw.MONEY_CLAIMS,
      AreaOfLaw.PROBATE,
      AreaOfLaw.SOCIAL_SECURITY,
      AreaOfLaw.TAX,
      AreaOfLaw.ALL
    ]
  }
}
