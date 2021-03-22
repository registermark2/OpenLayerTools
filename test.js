$.getJSON(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=HOUR_24&parameterName=CITY,TOWN", 
    function(res) {
        console.log(res);
        // location = res.records.location;
    }
);