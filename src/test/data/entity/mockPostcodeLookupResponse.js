"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPostcodeLookupResponse = {
    'header': {
        'uri': 'https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?offset=0&postcode=SW2%201AN',
        'query': 'postcode=SW2 1AN',
        'offset': 0,
        'totalresults': 33,
        'format': 'JSON',
        'dataset': 'DPA',
        'lr': 'EN,CY',
        'maxresults': 100,
        'epoch': '64',
        'output_srs': 'EPSG:27700'
    },
    'results': [
        {
            'DPA': {
                'UPRN': '100021830774',
                'UDPRN': '23779778',
                'ADDRESS': '2, DALBERG ROAD, LONDON, SW2 1AN',
                'BUILDING_NUMBER': '2',
                'THOROUGHFARE_NAME': 'DALBERG ROAD',
                'POST_TOWN': 'LONDON',
                'POSTCODE': 'SW2 1AN',
                'RPC': '2',
                'X_COORDINATE': 531141,
                'Y_COORDINATE': 175024,
                'STATUS': 'APPROVED',
                'LOGICAL_STATUS_CODE': '1',
                'CLASSIFICATION_CODE': 'RD04',
                'CLASSIFICATION_CODE_DESCRIPTION': 'Terraced',
                'LOCAL_CUSTODIAN_CODE': 5660,
                'LOCAL_CUSTODIAN_CODE_DESCRIPTION': 'LAMBETH',
                'POSTAL_ADDRESS_CODE': 'D',
                'POSTAL_ADDRESS_CODE_DESCRIPTION': 'A record which is linked to PAF',
                'BLPU_STATE_CODE_DESCRIPTION': 'Unknown/Not applicable',
                'TOPOGRAPHY_LAYER_TOID': 'osgb1000005715271',
                'LAST_UPDATE_DATE': '10/02/2016',
                'ENTRY_DATE': '19/03/2001',
                'LANGUAGE': 'EN',
                'MATCH': 1,
                'MATCH_DESCRIPTION': 'EXACT'
            }
        },
        {
            'DPA': {
                'UPRN': '100023350072',
                'UDPRN': '23779789',
                'ADDRESS': '4, DALBERG ROAD, LONDON, SW2 1AN',
                'BUILDING_NUMBER': '4',
                'THOROUGHFARE_NAME': 'DALBERG ROAD',
                'POST_TOWN': 'LONDON',
                'POSTCODE': 'SW2 1AN',
                'RPC': '2',
                'X_COORDINATE': 531141,
                'Y_COORDINATE': 175020,
                'STATUS': 'APPROVED',
                'LOGICAL_STATUS_CODE': '1',
                'CLASSIFICATION_CODE': 'P',
                'CLASSIFICATION_CODE_DESCRIPTION': 'Parent Shell',
                'LOCAL_CUSTODIAN_CODE': 5660,
                'LOCAL_CUSTODIAN_CODE_DESCRIPTION': 'LAMBETH',
                'POSTAL_ADDRESS_CODE': 'D',
                'POSTAL_ADDRESS_CODE_DESCRIPTION': 'A record which is linked to PAF',
                'BLPU_STATE_CODE_DESCRIPTION': 'Unknown/Not applicable',
                'TOPOGRAPHY_LAYER_TOID': 'osgb1000005715272',
                'LAST_UPDATE_DATE': '12/11/2018',
                'ENTRY_DATE': '19/03/2001',
                'LANGUAGE': 'EN',
                'MATCH': 1,
                'MATCH_DESCRIPTION': 'EXACT'
            }
        }
    ]
};
exports.mockScottishPostcodeLookupResponse = {
    'header': {
        'uri': 'https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?offset=0&postcode=EH9%201SH',
        'query': 'postcode=EH9 1SH',
        'offset': 0,
        'totalresults': 2,
        'format': 'JSON',
        'dataset': 'DPA',
        'lr': 'EN,CY',
        'maxresults': 100,
        'epoch': '64',
        'output_srs': 'EPSG:27700'
    },
    'results': [
        {
            'DPA': {
                'UPRN': '906368446',
                'UDPRN': '8308006',
                'ADDRESS': '6, SALISBURY PLACE, EDINBURGH, EH9 1SH',
                'BUILDING_NUMBER': '6',
                'THOROUGHFARE_NAME': 'SALISBURY PLACE',
                'POST_TOWN': 'EDINBURGH',
                'POSTCODE': 'EH9 1SH',
                'RPC': '1',
                'X_COORDINATE': 326489,
                'Y_COORDINATE': 672216,
                'STATUS': 'APPROVED',
                'LOGICAL_STATUS_CODE': '1',
                'CLASSIFICATION_CODE': 'C',
                'CLASSIFICATION_CODE_DESCRIPTION': 'Commercial',
                'LOCAL_CUSTODIAN_CODE': 9064,
                'LOCAL_CUSTODIAN_CODE_DESCRIPTION': 'CITY OF EDINBURGH',
                'POSTAL_ADDRESS_CODE': 'D',
                'POSTAL_ADDRESS_CODE_DESCRIPTION': 'A record which is linked to PAF',
                'BLPU_STATE_CODE': '2',
                'BLPU_STATE_CODE_DESCRIPTION': 'In use',
                'TOPOGRAPHY_LAYER_TOID': 'osgb1000036583260',
                'LAST_UPDATE_DATE': '10/02/2016',
                'ENTRY_DATE': '01/03/1991',
                'BLPU_STATE_DATE': '01/03/1991',
                'LANGUAGE': 'EN',
                'MATCH': 1,
                'MATCH_DESCRIPTION': 'EXACT'
            }
        },
        {
            'DPA': {
                'UPRN': '906368443',
                'UDPRN': '8308003',
                'ADDRESS': '4/1, SALISBURY PLACE, EDINBURGH, EH9 1SH',
                'BUILDING_NAME': '4/1',
                'THOROUGHFARE_NAME': 'SALISBURY PLACE',
                'POST_TOWN': 'EDINBURGH',
                'POSTCODE': 'EH9 1SH',
                'RPC': '2',
                'X_COORDINATE': 326488,
                'Y_COORDINATE': 672226,
                'STATUS': 'APPROVED',
                'LOGICAL_STATUS_CODE': '1',
                'CLASSIFICATION_CODE': 'RD',
                'CLASSIFICATION_CODE_DESCRIPTION': 'Dwelling',
                'LOCAL_CUSTODIAN_CODE': 9064,
                'LOCAL_CUSTODIAN_CODE_DESCRIPTION': 'CITY OF EDINBURGH',
                'POSTAL_ADDRESS_CODE': 'D',
                'POSTAL_ADDRESS_CODE_DESCRIPTION': 'A record which is linked to PAF',
                'BLPU_STATE_CODE': '2',
                'BLPU_STATE_CODE_DESCRIPTION': 'In use',
                'TOPOGRAPHY_LAYER_TOID': 'osgb1000036583263',
                'PARENT_UPRN': '906398542',
                'LAST_UPDATE_DATE': '23/09/2018',
                'ENTRY_DATE': '01/03/1991',
                'BLPU_STATE_DATE': '01/03/1991',
                'LANGUAGE': 'EN',
                'MATCH': 1,
                'MATCH_DESCRIPTION': 'EXACT'
            }
        }
    ]
};
