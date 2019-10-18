export const mockCountryLookupResponse = {
  'header': {
    'uri': 'https://api.ordnancesurvey.co.uk/opennames/v1/find?query=SW2%201AN&maxresults=1&fq=LOCAL_TYPE%3APostcode',
    'query': 'SW2 1AN',
    'format': 'JSON',
    'maxresults': 1,
    'offset': 0,
    'totalresults': 2039,
    'filter': 'fq=LOCAL_TYPE:Postcode'
  },
  'results': [
    {
      'GAZETTEER_ENTRY': {
        'ID': 'SW21AN',
        'NAMES_URI': 'http://data.ordnancesurvey.co.uk/id/postcodeunit/SW21AN',
        'NAME1': 'SW2 1AN',
        'TYPE': 'other',
        'LOCAL_TYPE': 'Postcode',
        'GEOMETRY_X': 531188,
        'GEOMETRY_Y': 174956,
        'MOST_DETAIL_VIEW_RES': 3500,
        'LEAST_DETAIL_VIEW_RES': 18000,
        'POPULATED_PLACE': 'London',
        'POPULATED_PLACE_URI': 'http://data.ordnancesurvey.co.uk/id/4000000074813508',
        'POPULATED_PLACE_TYPE': 'http://www.ordnancesurvey.co.uk/xml/codelists/localtype.xml#city',
        'DISTRICT_BOROUGH': 'Lambeth',
        'DISTRICT_BOROUGH_URI': 'http://data.ordnancesurvey.co.uk/id/7000000000011144',
        'DISTRICT_BOROUGH_TYPE': 'http://data.ordnancesurvey.co.uk/ontology/admingeo/LondonBorough',
        'COUNTY_UNITARY': 'Greater London',
        'COUNTY_UNITARY_URI': 'http://data.ordnancesurvey.co.uk/id/7000000000041441',
        'COUNTY_UNITARY_TYPE': 'http://data.ordnancesurvey.co.uk/ontology/admingeo/GreaterLondonAuthority',
        'REGION': 'London',
        'REGION_URI': 'http://data.ordnancesurvey.co.uk/id/7000000000041428',
        'COUNTRY': 'England',
        'COUNTRY_URI': 'http://data.ordnancesurvey.co.uk/id/country/england'
      }
    }
  ]
}

export const mockScottishCountryLookupResponse = {
  'header': {
    'uri': 'https://api.ordnancesurvey.co.uk/opennames/v1/find?query=EH9%201SH&maxresults=1&fq=LOCAL_TYPE%3APostcode',
    'query': 'EH9 1SH',
    'format': 'JSON',
    'maxresults': 1,
    'offset': 0,
    'totalresults': 1842,
    'filter': 'fq=LOCAL_TYPE:Postcode'
  },
  'results': [
    {
      'GAZETTEER_ENTRY': {
        'ID': 'EH91SH',
        'NAMES_URI': 'http://data.ordnancesurvey.co.uk/id/postcodeunit/EH91SH',
        'NAME1': 'EH9 1SH',
        'TYPE': 'other',
        'LOCAL_TYPE': 'Postcode',
        'GEOMETRY_X': 326488,
        'GEOMETRY_Y': 672226,
        'MOST_DETAIL_VIEW_RES': 3500,
        'LEAST_DETAIL_VIEW_RES': 18000,
        'POPULATED_PLACE': 'Edinburgh',
        'POPULATED_PLACE_URI': 'http://data.ordnancesurvey.co.uk/id/4000000074558316',
        'POPULATED_PLACE_TYPE': 'http://www.ordnancesurvey.co.uk/xml/codelists/localtype.xml#city',
        'COUNTY_UNITARY': 'City of Edinburgh',
        'COUNTY_UNITARY_URI': 'http://data.ordnancesurvey.co.uk/id/7000000000030505',
        'COUNTY_UNITARY_TYPE': 'http://data.ordnancesurvey.co.uk/ontology/admingeo/UnitaryAuthority',
        'REGION': 'Scotland',
        'REGION_URI': 'http://data.ordnancesurvey.co.uk/id/7000000000041429',
        'COUNTRY': 'Scotland',
        'COUNTRY_URI': 'http://data.ordnancesurvey.co.uk/id/country/scotland'
      }
    }
  ]
}
