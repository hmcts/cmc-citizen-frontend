export const mockPostcodeLookupResponse = {
  'valid': 'true',
  'country': {
    'gss_code': 'E92000001',
    'name': 'England'
  },
  'local_authority': {
    'gss_code': 'E09000033',
    'name': 'Westminster'
  },
  'centre': {
    'type': 'Point',
    'coordinates': [
      -0.1212324,
      23.5022039
    ]
  }
}

export const mockScottishPostcodeLookupResponse = {
  'valid': 'false',
  'country': {
    'gss_code': 'E92000001',
    'name': 'Scotland'
  },
  'local_authority': {
    'gss_code': 'E09000033',
    'name': 'Edinburgh'
  },
  'centre': {
    'type': 'Point',
    'coordinates': [
      -0.1212324,
      23.5022039
    ]
  }
}
