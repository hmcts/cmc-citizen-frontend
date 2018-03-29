import { Evidence } from 'forms/models/evidence'

export function convertEvidence (evidence: Evidence) {
  return evidence.getPopulatedRowsOnly().map(item => {
    return {
      type: item.type.value,
      description: item.description
    }
  })
}
