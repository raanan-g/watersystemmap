

const BASE_URL = 'https://data.epa.gov/efservice/';

function getEndpointUrl(endpoint, filter = '') {
    return `${BASE_URL}${endpoint}${filter}/JSON`;
}

function fetchFromAPI(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from API: ${response.statusText}`);
            }
            return response.json();
        });
}

// Get details of a water system by PWSID
function getWaterSystemDetails(pwsid) {
    const endpoint = 'WATER_SYSTEM/PWSID';
    const url = getEndpointUrl(endpoint, `/${pwsid}`);
    return fetchFromAPI(url);
}

// Get violations for a water system by PWSID
function getViolationsByPWSID(pwsid) {
    const endpoint = 'VIOLATION/PWSID';
    const url = getEndpointUrl(endpoint, `/${pwsid}`);
    return fetchFromAPI(url);
}

// Get LCR sample results for a water system by PWSID
function getLCRSampleByPWSID(pwsid) {
    const endpoint = 'LCR_SAMPLE/PWSID';
    const url = getEndpointUrl(endpoint, `/${pwsid}`);
    return fetchFromAPI(url);
}

// Get LCR sample results for a water system by PWSID
function getLCRSampleResultsByPWSID(pwsid) {
    const endpoint = 'LCR_SAMPLE_RESULT/PWSID';
    const url = getEndpointUrl(endpoint, `/${pwsid}`);
    return fetchFromAPI(url);
}

// merge together LCR SAMPLE and SAMPLE RESULTS data
function mergeLCRSampleData(sampleResults, sampleInfo) {
    return sampleResults.map(result => {
        const matchedSample = sampleInfo.find(sample => sample.sample_id === result.sample_id);
        
        if (matchedSample) {
            return { ...result, ...matchedSample };
        } else {
            return result;
        }
    });
}

// Display water system details by PWSID
function fetchDetailsByPWSID(pwsid) {
    Loading(true);
    return Promise.all([
        getWaterSystemDetails(pwsid),
        getLCRSampleByPWSID(pwsid),
        getLCRSampleResultsByPWSID(pwsid),
        getViolationsByPWSID(pwsid)
    ]).then(([waterSystemData, lcrSampleData, lcrSampleResultData, violationData]) => {
        var lcrData = mergeLCRSampleData(lcrSampleResultData, lcrSampleData);
        Loading(false);
        return {
            waterSystemData: waterSystemData,
            lcrSampleData: lcrData,
            violationData: violationData
        };
    });
}
