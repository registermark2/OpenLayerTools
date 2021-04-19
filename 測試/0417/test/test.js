document.addEventListener("DOMContentLoaded", function () {
    init_fixCheckBox();
    var odbsso = document.cookie.split("odbsso=");
    if (odbsso.length > 1) {
        odbsso = odbsso[1].substr(0, 32);
        chk_login_done(odbsso);
    } else {
        gen_logout();
        //toggleGreeting();
    };

    if (window.location.href.indexOf("?") > 0) {
        if (window.location.href.indexOf("sat=") > 0) {
            var pretmpsat = ((window.location.href.split("sat=")[1]).split("&")[0]);
            document.getElementById("fdate4").value = pretmpsat.split(",")[0];
            if (pretmpsat.split(",")[1] > 0) {
                document.getElementById("alphabarsat").value = pretmpsat.split(",")[1];
            }
            gettimfg4();
        };
        if (window.location.href.indexOf("alpha=") > 0) {
            var pretmpalpha = (window.location.href.split("alpha=")[1]).split("&")[0].split(",");
            document.getElementById("alphabartopo").value = pretmpalpha[0];
            document.getElementById("alphabarhydro").value = pretmpalpha[1];
        };
        if (window.location.href.indexOf("io=") > 0) {
            (window.location.href.split("io=")[1]).split("&")[0].split(",").map(function (i) {
                document.getElementById(i).click();
            });
        };
        if (window.location.href.indexOf("argo=") > 0) {
            var pretmpargo = (window.location.href.split("argo=")[1]).split("&")[0].split(",");
            if (pretmpargo[pretmpargo.length - 1] === "bio") {
                document.getElementById("btbioargo").checked = true;
            };
            document.getElementById("fdate2").value = pretmpargo[1];
            gettimfg2();
            document.getElementById("fdate1").value = pretmpargo[0];
            gettimfg1();
            if (pretmpargo.length > 3) {
                document.getElementById(pretmpargo[3]).click();
                document.getElementById("abc").style.top = pretmpargo[4];
                document.getElementById("abc").style.left = pretmpargo[5];
                argotraj.setSource(new ol.source.Vector({
                    url: "/odbargo/get/argosvp/gettrajfrompk/" + pretmpargo[2] + "/geojson",
                    format: new ol.format.GeoJSON()
                }));
                argotraj.once('change', function () {
                    if (argotraj.getSource() && argotraj.getSource().getState() == 'ready') {
                        argo.changed();
                        for (var i = 0; i < argotraj.getSource().getFeatures().length; i++) {
                            if (argotraj.getSource().getFeatures()[i].get("pk") == parseInt(pretmpargo[2])) {
                                $.getScript("/odbargo/static/js/plotmod.js", function () {
                                    iojsplotly = 1;
                                    argolayer(argotraj.getSource().getFeatures()[i]);
                                });
                                break;
                            };
                        };
                    }
                });
            };
        };
        if (window.location.href.indexOf("svp=") > 0) {
            var pretmpsvp = (window.location.href.split("svp=")[1]).split("&")[0].split(",");
            document.getElementById("fdate3").value = pretmpsvp[0];
            gettimfg3();
            if (parseInt(pretmpsvp[1]) >= 0) {
                document.getElementById(pretmpsvp[2]).click();
                document.getElementById("abc").style.top = pretmpsvp[3];
                document.getElementById("abc").style.left = pretmpsvp[4];
                svp.once('change', function () {
                    if (svp.getSource() != null && svp.getSource().getState() == 'ready') {
                        for (var i = 0; i < svp.getSource().getFeatures().length; i++) {
                            if (svp.getSource().getFeatures()[i].get("pk") == parseInt(pretmpsvp[1])) {
                                $.getScript("/odbargo/static/js/plotmod.js", function () {
                                    iojsplotly = 1;
                                    svplayer(svp.getSource().getFeatures()[i]);
                                });
                                break;
                            };
                        };
                    }
                });
            };
        };
        if (window.location.href.indexOf("glider=") > 0 && document.getElementById("glider").style.display != "none") {
            var pretmpglider = (window.location.href.split("glider=")[1]).split("&")[0].split(",");
            $.getJSON('https://odbgo.oc.ntu.edu.tw/glider/getgliderlist/', function (g) {
                document.getElementById('sgmod').options.length = 0;
                document.getElementById('sgcrmod').options.length = 0;
                for (var i = 0; i < g.sg.length; i++) {
                    sglist[g.sg[i][0]] = g.sg[i].slice(1, g.sg[i].length).reverse();
                    var o = document.createElement("option");
                    o.value = g.sg[i][0];
                    o.innerHTML = g.sg[i][0];
                    document.getElementById("sgmod").appendChild(o);
                };
                for (var i = 0; i < sglist[pretmpglider[0]].length; i++) {
                    var o = document.createElement("option");
                    o.value = sglist[pretmpglider[0]][i];
                    o.innerHTML = ('000' + sglist[pretmpglider[0]][i].toString()).substr(-4);
                    document.getElementById("sgcrmod").appendChild(o)
                };
                document.getElementById("sgmod").value = pretmpglider[0];
                sgchange(pretmpglider[0], false);
                document.getElementById("sgcrmod").value = pretmpglider[1];
                if (pretmpglider.length > 2) {
                    if (parseInt(pretmpglider[2]) >= 0) {
                        document.getElementById(pretmpglider[3]).click();
                        document.getElementById("abc").style.top = pretmpglider[4];
                        document.getElementById("abc").style.left = pretmpglider[5];
                        if (pretmpglider.length <= 6) {
                            glider.on('change', tmpgliderlistener);

                            function tmpgliderlistener() {
                                if (glider.getSource().getFeatures().length > 0) {
                                    for (var i = 0; i < glider.getSource().getFeatures().length; i++) {
                                        if (glider.getSource().getFeatures()[i].get("pk") == parseInt(pretmpglider[2])) {
                                            glider.un('change', tmpgliderlistener);
                                            $.getScript("/odbargo/static/js/plotmod.js", function () {
                                                iojsplotly = 1;
                                                gliderlayer(glider.getSource().getFeatures()[i]);
                                            });
                                            break;
                                        };
                                    }
                                };
                            };
                            document.getElementById("btglider").checked = true;
                            toggleGlider(true);
                        };
                    };
                    if (pretmpglider.length > 8) {
                        document.getElementById("contourfig").style.top = pretmpglider[6];
                        document.getElementById("contourfig").style.left = pretmpglider[7];
                        document.getElementById("sgcontourmod").value = pretmpglider[8];
                        if (parseInt(pretmpglider[2]) >= 0) {
                            glidertraj.once('change', function () {
                                if (glider.getSource() != null && glider.getSource().getState() == 'ready') {
                                    for (var i = 0; i < glider.getSource().getFeatures().length; i++) {
                                        if (glider.getSource().getFeatures()[i].get("pk") == parseInt(pretmpglider[2])) {
                                            $.getScript("/odbargo/static/js/plotmod.js", function () {
                                                iojsplotly = 1;
                                                gliderlayer(glider.getSource().getFeatures()[i]);
                                            });
                                            break;
                                        };
                                    };
                                }
                            });
                        };
                        drawContourfig();
                    };
                } else {
                    document.getElementById("btglider").checked = true;
                    toggleGlider(true);
                };
            });
        };
        if (window.location.href.indexOf("pvd=") > 0) {
            var pretmppvd = (window.location.href.split("pvd=")[1]).split("&")[0].split("P");
            for (var i = 1; i < pretmppvd.length; i++) {
                var j = pretmppvd[i].split(",");
                document.getElementById("pvdhr").value = j[0];
                trajpvd(ol.proj.transform([parseFloat(j[1]), parseFloat(j[2])], "EPSG:4326", "EPSG:3857"));
            };
        };
        if (window.location.href.indexOf("ckey=") > 0) {
            var pretmpcplan = (window.location.href.split("ckey=")[1]).split("&")[0].split(",");
            if (!document.getElementById("cplanexpandbtn").checked) {
                document.getElementById('cplanexpandbtn').click();
            };
            document.getElementById("btcplan").checked = true;
            var pretmpcset;
            if (window.location.href.indexOf("ckeyset=") > 0) {
                pretmpcset = (window.location.href.split("ckeyset=")[1]).split("&")[0].split(",");
            };
            for (var i = 1; i <= parseInt(pretmpcplan[0]); i++) {
                if (pretmpcset) {
                    ckeyset[i] = [parseInt(pretmpcset[i - 1][0], 16), parseInt(pretmpcset[i - 1][1]),
                        parseInt(pretmpcset[i - 1][2]), parseInt(pretmpcset[i - 1][3]), parseInt(pretmpcset[i - 1][4])
                    ];
                };
                document.getElementById("cplantxt" + i.toString()).value = decodeURIComponent(pretmpcplan[i]);
                document.getElementById('cplanbtn' + i.toString()).click();
            };
            document.getElementById("cplan").scrollIntoView(true);
        };
        if (window.location.href.indexOf("model=") > 0) {
            var pretmpmodel = (window.location.href.split("model=")[1]).split("&")[0].split(",");
            if (!document.getElementById("modelexpandbtn").checked) {
                document.getElementById('modelexpandbtn').click();
            };
            document.getElementById("modeldep").value = pretmpmodel[2];
            if (pretmpmodel[3] > 0) {
                document.getElementById("alphabarmodel").value = pretmpmodel[3];
            }
            document.getElementById(pretmpmodel[1]).click();
            document.getElementById("fdate5").value = pretmpmodel[1];
            gettimfg5();
        };
        if (window.location.href.indexOf("draw=") > 0) {
            var pretmpdraw = (window.location.href.split("draw=")[1]).split("&")[0].split(",");
            document.getElementById('btdraw').click();
            document.getElementById("drawp1x").value = pretmpdraw[0];
            document.getElementById("drawp1y").value = pretmpdraw[1];
            document.getElementById("drawp2x").value = pretmpdraw[2];
            document.getElementById("drawp2y").value = pretmpdraw[3];
            modDrawzseg();
            if (pretmpdraw.length > 4) {
                document.getElementById("segfig").style.top = pretmpdraw[4];
                document.getElementById("segfig").style.left = pretmpdraw[5];
            } else {
                document.getElementById("segfig").style.display = "none";
            };
            moddraw.setActive(false);
            zseg.setActive(false);
            /*
            if (pretmpdraw.indexOf("L")>=0) {
              pretmpdraw.splice(0,pretmpdraw.indexOf("L")+1);
              pretmpdraw=pretmpdraw.map(function(i) {return parseFloat(i)});
              var pretmpdraw2=[]; while (pretmpdraw.length) {pretmpdraw2.push(pretmpdraw.splice(0,2));};
              segdraw.getSource().getFeatures()[2].getGeometry().setCoordinates(pretmpdraw2);
              drawSegfig();
            };
            */
        };
        if (window.location.href.indexOf("tide=") > 0 && !document.getElementById("bttide").disabled) {
            var pretmptide = (window.location.href.split("tide=")[1]).split("&")[0].split(",");
            document.getElementById("fdate6").value = pretmptide[0];
            document.getElementById("tidehr1").value = pretmptide[1];
            document.getElementById("fdate7").value = pretmptide[2];
            document.getElementById("tidehr2").value = pretmptide[3];
            document.getElementById("tidetmz").value = pretmptide[4];
            document.getElementById("tidep0x").value = pretmptide[5];
            document.getElementById("tidep0y").value = pretmptide[6];
            document.getElementById("tidefig").style.top = pretmptide[7];
            document.getElementById("tidefig").style.left = pretmptide[8];
            modDrawtide();
        };
        if (window.location.href.indexOf("meanfield") > 0) {
            var pretmpmf = (window.location.href.split("meanfield=")[1]).split("&")[0].split(",");
            document.getElementById("meanfieldvar").value = pretmpmf[0];
            //      if (pretmpmf[1]=="1") { document.getElementById("btclimts").click(); };
            if (parseInt(pretmpmf[2]) > 0) {
                if (pretmpmf[1] == "0" || pretmpmf[2] == "2") {
                    var i = (pretmpmf[1] == "0") ? 3 : 5;
                    document.getElementById("mftimbtn" + ((pretmpmf[i].substr(0, 4) == "1000") ? "1" : "2")).click();
                    if (pretmpmf[i].substr(0, 4) == "1000") {
                        var ii = pretmpmf[i].substr(4, 2);
                        if (ii == "00") {
                            document.getElementById("mftim0").click();
                        } else {
                            document.getElementById("mftim" + ((parseInt(ii) > 12) ? "2" : "1")).value = ii;
                            document.getElementById("mfatim" + ((parseInt(ii) > 12) ? "2" : "1")).click();
                        };
                    } else {
                        document.getElementById("mfyear").value = pretmpmf[i].substr(0, 4);
                        document.getElementById("mfmon").value = pretmpmf[i].substr(4, 2);
                    };
                } else {
                    document.getElementById("mfarea3z").value = pretmpmf[5];
                };
                if (pretmpmf[1] == "1") {
                    document.getElementById("mfarea" + (parseInt(pretmpmf[2]) + 2) + "x").value = pretmpmf[3];
                    document.getElementById("mfarea" + (parseInt(pretmpmf[2]) + 2) + "y").value = pretmpmf[4];
                    document.getElementById("clim" + ((pretmpmf[2] == "1") ? "ts" : "pz") + "fig").style.top = pretmpmf[6];
                    document.getElementById("clim" + ((pretmpmf[2] == "1") ? "ts" : "pz") + "fig").style.left = pretmpmf[7];
                } else {
                    document.getElementById("mfarea" + pretmpmf[2]).value = pretmpmf[4];
                    document.getElementById("climsectzfig").style.top = pretmpmf[5];
                    document.getElementById("climsectzfig").style.left = pretmpmf[6];
                };
                document.getElementById("mf" + ((pretmpmf[1] == "1") ? "grid" : "xy") + "btn" + pretmpmf[2]).click();
            };
        };
        if (window.location.href.indexOf("histship=") > 0 && document.getElementById("ship").style.display != "none") {
            var pretmphistship = (window.location.href.split("histship=")[1]).split("&")[0].split(",");
            //      $.getJSON("https://odbpo.oc.ntu.edu.tw/ais/getorshiplist",function(g) {
            //        histshiplist[0]=g[0].OR1; histshiplist[1]=g[0].OR2; histshiplist[2]=g[0].OR3;
            document.getElementById("histshipor").value = pretmphistship[0];
            histshipchange(pretmphistship[0], pretmphistship[1]);
            //        document.getElementById("histshipyr").value=pretmphistship[1]; toggleShipCr(true);
            //      });
        };

    };
});

var iojsplotly = 0;
var iojshighchart = 0;
var iojsshp = 0;
var clr = ['0080FF', '00A0FF', '40C0FF', '40E0FF', '40FFFF', '40FF40', '80FF40', 'C0FF40',
    'FFFF40', 'FFE040', 'FFA040', 'FF6040', 'FF2040', 'FF60C0', 'FFA0FF', 'FFE0FF'
];
var star = ['<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d=' +
    '"M 10,0.4 12.4,7.2 19.6,7.2 14,11.6 16,18.4 10,14.4 4,18.4 6,11.6 .4,7.2 7.6,7.2 Z" ' +
    'stroke="white" stroke-width="1" fill="%23FF007F"/></svg>',
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d=' +
    '"M 10,.4 12.4,7.2 19.6,7.2 14,11.6 16,18.4 10,14.4 4,18.4 6,11.6 .4,7.2 7.6,7.2 Z" ' +
    'stroke="white" stroke-width="1" fill="%23007FFF"/></svg>'
];
var qvec = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">' +
    '<path d="M 4,0 16,8 4,16" stroke="%2300FF00" stroke-width="2" fill="none"/></svg>';
var cwbicon = ['<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M8 24 L0 12 L4 12 L4 0 L12 0 L12 12 L16 12 L8 24 Z" stroke-width="2" stroke="white" fill="blue"/></svg>', '',
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M8 0 L0 10 L4 10 L4 24 L12 24 L12 10 L16 10 L8 0 Z" stroke-width="2" stroke="white" fill="red"/></svg>',
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" stroke="orange" stroke-width="3"><circle cx="12" cy="5" r="3"></circle><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path><line x1="12" y1="22" x2="12" y2="8"></line></svg>'
];
var clrfront = ['255,245,240', '254,219,203', '252,175,148', '252,129,97', '244,79,57', '213,34,33', '170,16,22', '103,0,13'];
var clrsat = [
    [],
    ['239,250,244', '222,244,239', '207,235,239', '198,224,241', '193,209,243', '195,193,242', '200,175,234', '207,159,221', '212,144,198', '212,133,172', '206,125,140', '193,122,112', '172,121,84', '147,122,64', '117,123,51', '90,122,47', '63,118,50', '43,111,57', '29,100,67', '22,87,75', '21,70,78', '23,54,76', '26,37,67', '26,24,53', '22,13,33', '14,5,15', '0,0,0', '28,0,32', '56,0,64', '84,0,96', '112,0,128', '123,0,140', '127,0,144', '131,0,148', '135,0,152', '99,0,158', '67,0,162', '35,0,166', '3,0,170', '0,0,185', '0,0,197', '0,0,209', '0,0,221', '0,37,221', '0,65,221', '0,93,221', '0,120,221', '0,130,221', '0,138,221', '0,146,221', '0,154,219', '0,159,203', '0,163,191', '0,167,179', '0,170,168', '0,170,160', '0,170,149', '0,170,141', '0,169,125', '0,165,93', '0,159,51', '0,155,19', '0,156,0', '0,164,0', '0,175,0', '0,183,0', '0,191,0', '0,199,0', '0,210,0', '0,218,0', '0,226,0', '0,234,0', '0,244,0', '0,252,0', '29,255,0', '73,255,0', '132,255,0', '176,255,0', '196,252,0', '208,248,0', '220,244,0', '236,239,0', '241,231,0', '245,223,0', '249,215,0', '255,205,0', '255,193,0', '255,181,0', '255,169,0', '255,153,0', '255,117,0', '255,81,0', '255,45,0', '254,0,0', '246,0,0', '238,0,0', '230,0,0', '220,0,0', '216,0,0', '212,0,0', '208,0,0', '179,3,3', '153,3,3', '128,3,3', '102,3,3', '77,3,3', '51,0,4', '6,5,24', '17,12,47', '30,17,73', '47,17,99', '66,15,117', '84,19,125', '101,26,128', '120,34,129', '137,40,129', '155,46,127', '173,52,124', '191,58,119', '208,65,111', '224,76,103', '237,90,95', '246,110,92', '251,131,95', '253,152,105', '254,172,118', '254,193,133', '254,213,151', '253,233,170', '252,253,191'],
    ['0,0,128', '0,0,156', '0,0,184', '0,0,212', '0,0,241', '0,0,255', '0,22,255', '0,47,255', '0,72,255', '0,96,255', '0,121,255', '0,146,255', '0,171,255', '0,196,255', '0,221,254', '13,246,234', '33,255,214', '53,255,194', '73,255,174', '93,255,153', '113,255,133', '133,255,113', '153,255,93', '174,255,73', '194,255,53', '214,255,33', '234,255,13', '254,237,0', '255,214,0', '255,191,0', '255,168,0', '255,145,0', '255,122,0', '255,99,0', '255,76,0', '255,53,0', '255,30,0', '241,7,0', '212,0,0', '184,0,0', '156,0,0', '128,0,0'],
    ['5,48,97', '19,75,135', '33,102,172', '50,125,184', '67,147,195', '107,172,209', '146,197,222', '178,213,231', '209,229,240', '228,238,244', '247,247,247', '250,233,233', '253,219,199', '249,192,165', '244,165,130', '229,131,104', '214,96,77', '196,60,60', '178,24,43', '141,12,37', '103,0,31'],
    ['0,231,236', '0,222,237', '0,213,239', '0,204,240', '1,195,241', '1,186,242', '1,177,244', '1,168,245', '1,158,246', '1,139,246', '1,120,246', '1,101,246', '1,83,246', '0,64,246', '0,45,246', '0,26,246', '0,8,246', '0,18,229', '0,48,200', '0,78,171', '0,108,142', '0,138,113', '0,168,84', '0,198,55', '0,228,26', '0,254,0', '0,248,0', '0,241,0', '0,235,0', '0,228,0', '0,222,0', '0,215,0', '0,208,0', '0,202,0', '0,196,0', '0,190,0', '0,185,0', '0,179,0', '0,174,0', '0,168,0', '0,163,0', '0,157,0', '0,153,0', '0,151,0', '0,150,0', '0,148,0', '0,147,0', '0,145,0', '0,144,0', '0,142,0', '0,141,0', '253,250,0', '250,242,0', '247,235,0', '244,227,0', '241,220,0', '239,212,0', '236,205,0', '233,197,0', '232,191,0', '235,188,0', '237,185,0', '240,182,0', '243,179,0', '246,177,0', '249,174,0', '252,171,0', '254,168,0', '255,152,0', '255,132,0', '255,112,0', '255,93,0', '255,73,0', '255,53,0', '255,34,0', '255,14,0', '254,0,0', '249,0,0', '244,0,0', '239,0,0', '234,0,0', '229,0,0', '224,0,0', '219,0,0', '214,0,0', '212,0,0', '209,0,0', '206,0,0', '204,0,0', '201,0,0', '199,0,0', '196,0,0', '194,0,0', '190,0,0', '185,0,0', '180,0,0', '175,0,0', '170,0,0', '165,0,0', '160,0,0', '155,0,0', '150,0,0', '244,0,249', '232,0,243', '220,0,236', '208,0,230', '195,0,223', '183,0,217', '171,0,211', '159,0,204', '159,85,204', '171,85,211', '183,85,217', '195,85,223', '207,85,230', '219,85,236', '231,85,242', '243,85,249', '255,85,255'],
    ['129,89,143', '154,89,178', '150,89,202', '131,89,216', '100,89,216', '89,122,216', '89,155,216', '0,189,255', '0,241,255', '0,255,152', '13,255,0', '71,255,0', '118,255,0', '159,255,0', '200,255,0', '237,255,0', '255,232,0', '255,192,0', '255,148,0', '255,102,0', '255,48,0', '255,30,0', '255,12,0', '255,0,0', '248,0,0', '241,0,0', '234,0,0', '211,0,0', '187,0,0', '162,0,0', '137,0,0', '110,0,0']
];
var clrsatval = [
    [],
    [4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18.125, 18.25, 18.375, 18.5, 18.625, 18.75, 18.875, 19, 19.125, 19.25, 19.375, 19.5, 19.625, 19.75, 19.875, 20, 20.125, 20.25, 20.375, 20.5, 20.625, 20.75, 20.875, 21, 21.125, 21.25, 21.375, 21.5, 21.625, 21.75, 21.875, 22, 22.125, 22.25, 22.375, 22.5, 22.625, 22.75, 22.875, 23, 23.125, 23.25, 23.375, 23.5, 23.625, 23.75, 23.875, 24, 24.125, 24.25, 24.375, 24.5, 24.625, 24.75, 24.875, 25, 25.125, 25.25, 25.375, 25.5, 25.625, 25.75, 25.875, 26, 26.125, 26.25, 26.375, 26.5, 26.625, 26.75, 26.875, 27, 27.125, 27.25, 27.375, 27.5, 27.625, 27.75, 27.875, 28, 28.2, 28.3, 28.5, 28.7, 28.8, 29, 29.2, 29.3, 29.5, 29.7, 29.8, 30, 30.2, 30.3, 30.5, 30.7, 30.8, 31, 31.2, 31.3, 31.5, 31.7, 31.8],
    [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2, 2.05],
    [-0.5, -0.45, -0.4, -0.35, -0.3, -0.25, -0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5],
    [0.025, 0.05, 0.075, 0.1, 0.125, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35, 0.375, 0.4, 0.425, 0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.775, 0.8, 0.825, 0.85, 0.875, 0.9, 0.925, 0.95, 0.975, 1, 1.025, 1.05, 1.075, 1.1, 1.125, 1.15, 1.175, 1.2, 1.225, 1.25, 1.275, 1.3, 1.325, 1.35, 1.375, 1.4, 1.425, 1.45, 1.475, 1.5, 1.525, 1.55, 1.575, 1.6, 1.625, 1.65, 1.675, 1.7, 1.725, 1.75, 1.775, 1.8, 1.825, 1.85, 1.875, 1.9, 1.925, 1.95, 1.975, 2, 2.025, 2.05, 2.075, 2.1, 2.125, 2.15, 2.175, 2.2, 2.225, 2.25, 2.275, 2.3, 2.325, 2.35, 2.375, 2.4, 2.425, 2.45, 2.475, 2.5, 2.525, 2.55, 2.575, 2.6, 2.625, 2.65, 2.675, 2.7, 2.725, 2.75, 2.775, 2.8, 2.825, 2.85, 2.875, 2.9, 2.925, 2.95, 2.975],
    [0, 0.03, 0.06, 0.1, 0.13, 0.16, 0.2, 0.23, 0.27, 0.3, 0.33, 0.36, 0.4, 0.43, 0.47, 0.5, 0.53, 0.55, 0.6, 0.63, 0.66, 0.7, 0.73, 0.75, 0.8, 0.83, 0.85, 0.9, 0.94, 0.97, 1, 1]
];

var satpop1 = ['', 'SST: ', 'SSH: ', 'SSHa: ', 'Chla: '];
var satpop2 = ['', '<sup>o</sup>C', ' m', ' m', ' mg/m<sup>3</sup>'];

var iclrmodel = [2, 1, 3, 1, 4, 5];
var modelpop0 = [" m", "<sup>o</sup>C", " m", "<sup>o</sup>C", " psu", " m/s"];
var micoef1 = [1.0, 1.0, 100.0, 1.0, 1.0, 1.0],
    micoef2 = [0.0, 0.0, 50.0, 0, 32.0, 0.0]

var windy;
var canctx;
var mk0 = new ol.Feature();
var pk0 = new ol.Feature();
var gk0 = new ol.Feature();
var ck0 = new ol.Feature();
var cstyles = function (f, r) {
    return [new ol.style.Style({
            image: new ol.style.RegularShape({
                radius: 14,
                fill: new ol.style.Fill({
                    color: "#fff"
                }),
                points: 4,
                stroke: new ol.style.Stroke({
                    color: "#fff",
                    width: 4
                })
            }),
            zIndex: 17
        }),
        new ol.style.Style({
            image: new ol.style.RegularShape({
                radius: 12,
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                points: 4,
                stroke: new ol.style.Stroke({
                    color: "#000",
                    width: 2
                })
            }),
            zIndex: 17
        }),
        new ol.style.Style({
            text: new ol.style.Text({
                font: '32px Arial,標楷體,sans-serif',
                offsetY: -10,
                fill: new ol.style.Fill({
                    color: "#fff"
                }),
                stroke: new ol.style.Stroke({
                    color: "#fff",
                    width: 6
                }),
                textBaseline: 'bottom',
                textAlign: 'center',
                text: f.get('name'),
                padding: [2, 2, 2, 2]
            }),
            zIndex: 17
        }),
        new ol.style.Style({
            text: new ol.style.Text({
                font: '32px Arial,標楷體,sans-serif',
                offsetY: -8,
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 3
                }),
                textBaseline: 'bottom',
                textAlign: 'center',
                text: f.get('name'),
                padding: [2, 2, 2, 2]
            }),
            zIndex: 17
        })
    ]
};

var mapzoom = (window.location.href.indexOf("map=") > 0) ? ((window.location.href.split("map=")[1]).split("&")[0].split(",")[2]) : 7;
var canvas = document.getElementById('flowmap');
var da1 = new Date(),
    da2 = new Date(),
    da3 = new Date(),
    da4 = new Date(),
    da5 = new Date(),
    db5 = new Date(),
    da6 = new Date(),
    da7 = new Date();
da1.setDate(da2.getDate() - 7);
da5.setDate(da5.getDate() + 1);
db5.setDate(db5.getDate() + 7);
da7.setDate(da7.getDate() + 3);
da1 = da1.getUTCFullYear() + ("0" + (da1.getUTCMonth() + 1)).slice(-2) + ("0" + da1.getUTCDate()).slice(-2);
da2 = da2.getUTCFullYear() + ("0" + (da2.getUTCMonth() + 1)).slice(-2) + ("0" + da2.getUTCDate()).slice(-2);
da3 = da3.getUTCFullYear() + ("0" + (da3.getUTCMonth() + 1)).slice(-2) + ("0" + da3.getUTCDate()).slice(-2);
da4 = da4.getUTCFullYear() + ("0" + (da4.getUTCMonth() + 1)).slice(-2) + ("0" + da4.getUTCDate()).slice(-2);
da5 = da5.getUTCFullYear() + ("0" + (da5.getUTCMonth() + 1)).slice(-2) + ("0" + da5.getUTCDate()).slice(-2);
db5 = db5.getUTCFullYear() + ("0" + (db5.getUTCMonth() + 1)).slice(-2) + ("0" + db5.getUTCDate()).slice(-2);
da6 = da6.getUTCFullYear() + ("0" + (da6.getUTCMonth() + 1)).slice(-2) + ("0" + da6.getUTCDate()).slice(-2);
da7 = da7.getUTCFullYear() + ("0" + (da7.getUTCMonth() + 1)).slice(-2) + ("0" + da7.getUTCDate()).slice(-2);
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        var ftm = Math.floor(((new Date()).getTime() - (new Date((xhr.responseText).replace(" ", "T").replace("\n", "Z")))) / 60000)
        document.getElementById('ftim').innerHTML = ftm;
    };
};
xhr.open('GET', "/odbargo/fileutc.tim" + "?time=" + (new Date()).getTime(), true);
xhr.send();
document.getElementById('fdate1').value = da1;
document.getElementById('fdate2').value = da2;
document.getElementById('fdate3').value = da3;
document.getElementById('fdate4').value = da4;
document.getElementById('fdate5').value = da5;
document.getElementById('fdate6').value = da6;
document.getElementById('fdate7').value = da7;

var svpw = [
    ['Temp (degC)', 'Hot', "<sup>o</sup>C", "<b>Temperature (<sup>o</sup>C)</b>", true],
    ['Speed (cm/s)', 'RdBu', 'cm/s', "<b>Speed (cm/s)</b>", false],
    ['Time-Series']
]; //Rainbow
var pj = '3857';
var imgextent = new ol.extent.applyTransform([105, 2, 135, 35], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'))
var hstyles = function () {
    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#F0F',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#F0F'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    })]
};

var baselayer = new ol.layer.Tile({
    zIndex: 2
});
toggleBaselayer((window.location.href.indexOf("baselayer=") > 0) ? (window.location.href.split("baselayer=")[1].split("&")[0]) : 0);

var odbtopo = new ol.layer.Tile({
    zIndex: 3
});
var satimg = new ol.layer.Image({
    zIndex: 4,
    visible: false
});
var model = new ol.layer.Image({
    zIndex: 5,
    visible: false
});
var odbhydro = new ol.layer.Image({
    zIndex: 5,
    visible: false
});
var climxymap = new ol.layer.Vector({
    source: new ol.source.Vector(),
    zIndex: 6,
    style: function (f) {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: f.get('color'),
                width: 3
            }),
            text: new ol.style.Text({
                font: (mapzoom * 2 + 4) + 'px sans-serif',
                text: f.get('title').substring(0, f.get('title').indexOf(" ")),
                fill: new ol.style.Fill({
                    color: f.get('color')
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 2
                }),
                maxAngle: 0.1,
                placement: 'line',
                overflow: true
            })
        })
    },
    renderMode: 'image',
    visible: false,
    declutter: true
});
var climgrid = new ol.layer.Vector({
    source: new ol.source.Vector(),
    zIndex: 6,
    visible: false,
    style: function (f) {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "rgba(99,99,99,.5)",
                width: mapzoom / 2
            })
        })
    },
    renderMode: 'image'
});
var climpoly = new ol.layer.Vector({
    source: new ol.source.Vector(),
    zIndex: 6,
    opacity: 0,
    visible: false,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,.3)",
            width: 1
        }),
        fill: new ol.style.Fill({
            color: "rgba(99,99,99,.5)"
        })
    }),
    renderMode: 'image'
});
var odbship = new ol.layer.Tile({
    zIndex: 4
});
var odbgravity = new ol.layer.Tile({
    zIndex: 6
});
var odbgravityfig = new ol.layer.Image({
    zIndex: 6,
    visible: false
});
var odbadcp = new ol.layer.Vector({
    zIndex: 7,
    renderMode: 'image'
});
var odbbio = new ol.layer.Vector({
    zIndex: 7,
    renderMode: 'image'
});
var odbchem = new ol.layer.Vector({
    zIndex: 7
});
var odbsedcore = new ol.layer.Vector({
    zIndex: 7
});
var histship = new ol.layer.Vector({
    zIndex: 7,
    renderMode: 'image'
});
var histshiplist = [];
var select = new ol.Feature();
var sglist = {};

var geoname = new ol.layer.Vector({
    zIndex: 8
});
var sstfront = new ol.layer.Image({
    zIndex: 9,
    visible: false
});
var eddy = new ol.layer.Vector({
    zIndex: 10
});
var or1ship = new ol.layer.Vector({
    style: [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 4
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff0',
                width: 2
            })
        })
    ],
    zIndex: 9,
    renderMode: 'image'
})
var or1now = new ol.Feature(),
    or2now = new ol.Feature(),
    or3now = new ol.Feature();
var ship = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [or1now, or2now, or3now]
    }),
    zIndex: 10
});
var svp = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 4
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#FAAC58',
                width: 2
            })
        })
    ],
    zIndex: 11,
    renderMode: 'image'
});
var argo = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: mapzoom,
            fill: new ol.style.Fill({
                color: "#ff0"
            }),
            stroke: new ol.style.Stroke({
                color: '#000',
                width: mapzoom * 0.3
            })
        })
    }),
    zIndex: 12,
    renderMode: 'image'
});
var argotraj = new ol.layer.Vector({
    source: null,
    style: [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: "#fff"
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#888',
                width: 3
            })
        })
    ],
    zIndex: 12,
    renderMode: 'image'
});
var glider = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: mapzoom,
            fill: new ol.style.Fill({
                color: "#00a5ff"
            }),
            stroke: new ol.style.Stroke({
                color: '#000',
                width: mapzoom * 0.1
            })
        })
    }),
    zIndex: 13,
    renderMode: 'image'
});
var glidertraj = new ol.layer.Vector({
    style: [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 4
            })
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#66f9ff',
                width: 2
            })
        })
    ],
    zIndex: 14,
    renderMode: 'image'
})
var gliderkml = new ol.layer.Vector({
    zIndex: 9
});

var wind = new ol.layer.Image({
    zIndex: 14,
    visible: false
});
var pvd = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#0F0',
            width: 2
        })
    }),
    zIndex: 15
});
var cloud = new ol.layer.Image({
    zIndex: 16,
    visible: false
});
var cwb = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: function (f) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 1,
                src: 'data:image/svg+xml,' + cwbicon[parseInt(f.get("si")) + 1],
                anchor: [.5, .5],
                rotation: 0,
                scale: 1,
                imageSize: [24, 24]
            })
        })
    },
    zIndex: 16,
    visible: false,
    renderMode: 'image'
});
var cwbatm = new ol.layer.Vector({
    source: new ol.source.Cluster({
        distance: 25,
        source: new ol.source.Vector()
    }),
    style: function (f) {
        var ii = f.get("features").length;
        var i = cwbasty[ii];
        if (!i) {
            i = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 12,
                    stroke: new ol.style.Stroke({
                        color: "#fff",
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: "#0f0"
                    })
                }),
                text: new ol.style.Text({
                    text: ii.toString(),
                    fill: new ol.style.Fill({
                        color: "#000"
                    }),
                    font: "14px Verdana,Geneva,sans-serif"
                })
            });
            cwbasty[ii] = i;
        };
        return i
    },
    zIndex: 16,
    visible: false,
    renderMode: 'image'
});
var cwbanim, cwbsite = new Object(),
    cwbdata = new Object(),
    cwbbuoyu = [
        ["陣風", 0.1, " m/s"],
        ["平均風", 0.1, " m/s"],
        ["風向", 1, " 度"],
        ["氣壓", 0.1, "&#13169;"],
        ["氣溫", 0.1, "°C  "],
        ["海溫", 0.1, "°C"],
        ["浪高", 1, " cm"],
        ["週期", 0.1, " 秒"],
        ["波向", 1, " 度"]
    ],
    cwbtidesite = {
        "1436": ["C4F01", 350.7],
        "1116": ["C4C01", 229.6],
        "1236": ["C4U02", 198.9],
        "1456": ["1456", 0],
        "1676": ["1676", 0],
        "1356": ["C4W02", 183.9],
        "1256": ["C4T01", 247.7],
        "1156": ["C4J01", 96.8],
        "1516": ["C4B01", 155.4],
        "1956": ["1956", 0],
        "11781": ["11781", 0],
        "1276": ["C4S02", 266.4],
        "1496": ["1496", 0],
        "1176": ["C4N01", 240.0],
        "1396": ["C4S01", 233.0],
        "1196": ["C4Q03", 190.5],
        "12191": ["C4B03", 0],
        "198": ["C4P02", 0],
        "1966": ["1966", 0],
        "112": ["C4D01", 369.7],
        "1206": ["C4A03", 268.6],
        "113": ["C4E01", 419.9],
        "1226": ["C4A02", 279.8],
        "13606": ["C4W03", 331.0],
        "1566": ["1566", 0],
        "1786": ["1786", 0],
        "1246": ["C4U01", 218.2],
        "1102": ["C4A01", 359.2],
        "1146": ["C4G01", 333.8],
        "1366": ["C4L01", 568.2],
        "1586": ["1586", 0],
        "1486": ["C4P01", 153.5],
        "11881": ["11881", 0],
        "11006": ["C4A06", 284.3],
        "1926": ["C4W01", 264.3],
        "19901": ["C4P03", 220.0],
        "1826": ["C4A05", 194.4],
        "1166": ["C4L02", 290.3],
        "1386": ["C4Q01", 342.7],
        "1186": ["C4Q02", 248.0]
    },
    cwbweather = [
        ['WDIR', "風向", 1, "度"],
        ['WDSD', "風速", 1, "m/s"],
        ['H_24R', "日雨量", 1, "mm"],
        ['HUMD', "濕度", 100, "%"],
        ['PRES', "氣壓", 1, "&#13169;"],
        ['TEMP', "氣溫", 1, "°C"],
        ['D_TX', "日最高", 1, "°C"],
        ['D_TN', "日最低", 1, "°C"]
    ],
    cwbasty = {};

var icplan = 1;
var ckeyset = [
    [0, 0, 0, 0, 0]
];
var cplan = new Array();
var cplanworkitem;

var zseg;
var moddraw;
var segdraw = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: function (f) {
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 4
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#FAF',
                    width: 2
                }),
                image: new ol.style.RegularShape({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: '#FAF'
                    }),
                    points: 4,
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 2
                    })
                }),
                text: new ol.style.Text({
                    font: (mapzoom * 3) + 'px sans-serif',
                    text: f.get('pn'),
                    fill: new ol.style.Fill({
                        color: '#FAF'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 4
                    }),
                    textBaseline: 'bottom',
                    placement: (f.get('type') == 'Point') ? 'point' : 'line' /*,maxAngle:Math.PI*/
                })
            })
        ]
    },
    zIndex: 17
});

var tidept;
var modtide;
var tidedraw = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        image: new ol.style.RegularShape({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#ADFF2F'
            }),
            points: 4,
            angle: Math.PI / 4,
            stroke: new ol.style.Stroke({
                color: '#73BF2F',
                width: 2
            })
        }),
        text: new ol.style.Text({
            font: '24px sans-serif,"微軟正黑體"',
            text: 'P0',
            fill: new ol.style.Fill({
                color: '#7CFC00'
            }),
            stroke: new ol.style.Stroke({
                color: '#000',
                width: 4
            }),
            textBaseline: 'bottom',
            offsetY: -2,
            offsetX: 12
        })
    }),
    zIndex: 18
});

var freehand, freehandvec;
var wmsdemo = 0,
    extwms;

var mfvars = 'tsoipnckmhwquv';
var mfvarn = ["Temperature", "Salinity", "Diss. Oxygen", "Silicate", "Phosphate", "Nitrate", "Chlorophyll-a", "Phytoplankton", "Primary Production", "pH", "Current velocity", "Sound speed", "U component", "V component"];
//var mfvaru=['&#8451;','psu','&#956;M','&#956;M','&#956;M','&#956;M','&#956;g/L','&#956;M','&#956;g/L','','m/s','m/s'];
var mfvaru = ['\u2103', 'psu', '\u03bcM', '\u03bcM', '\u03bcM', '\u03bcM', '\u03bcg/L', '\u03bcM', '\u03bcg/L', 'value', 'm/s', 'm/s', 'm/s', 'm/s'];
var mfd3tim = ['Clim.', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.', 'Winter', 'Spring', 'Summer', 'Autumn'];
var mfd3clr = [
    ["#00F", "#0FF", "#FF0", "#F00", "#800"],
    ["#2539AF", "#55DAFF", "#D6FA97", "#FFA446", "#FFFFFF"],
    ["#6440C4", "#64E1FF", "#64FF64", "#FFFF64", "#FF7964", "#FFA5FF"],
    ["#00F", "#0FF", "#FF0", "#F00", "#800"],
    ["#000", "#373FEF", "#FF3284", "#D29B3F", "#BFEB36", "#F6FFA1"],
    ["#0050FF", "#6BFF1B", "#FFED00", "#FF3A00", "#AA0000"],
    ["#FF0000", "#80FF00", "#00FFFF", "#8000FF", "#FF004D"],
    ["#FFFFF2", "#B3FFAE", "#86FFF2", "#5E79FF", "#D236FF", "#FFD51"],
    ["#A5CFF4", "#6A8BB0", "#C3D06F", "#F3C64D", "#E5614E", "#7B4D57"],
    ["#352A87", "#1487D3", "#44BB97", "#E7B94F", "#F9FB0E"],
    ["#780087", "#0027FF", "#00FF4A", "#FFE300", "#F00", "#800"],
    ["#DDACF5", "#9854CB", "#64379F", "#27104#"],
    ["#2400D9", "#3A7FFF", "#FFFFFF", "#FF3A3C", "#A60021"],
    ["#2400D9", "#3A7FFF", "#FFFFFF", "#FF3A3C", "#A60021"]
];
var mfd3clim = [
    [6, 30, 1.0],
    [34, 35, 0.05],
    [60, 240, 5],
    [0, 20, 1],
    [0, 1, 0.05],
    [0, 20, 1],
    [0, 1, 0.05],
    [0, 2, 0.1],
    [0, 20, 1],
    [7.8, 8.2, 0.02],
    [0, 1.5, 0.1],
    [1450, 1550, 10],
    [-1, 1, 0.05],
    [-1, 1, 0.05]
];
var mfd3ctk = [
    [6, 12, 18, 24, 30],
    [33, 33.5, 34, 34.5, 35],
    [60, 96, 132, 168, 204, 240],
    [0, 5, 10, 15, 20],
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 4, 8, 12, 16, 20],
    [0, 0.25, 0.5, 0.75, 1],
    [0, 0.4, 0.8, 1.2, 1.6, 2],
    [0, 4, 8, 12, 16, 20],
    [7.8, 7.9, 8, 8.1, 8.2],
    [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5],
    [1450, 1475, 1500, 1525, 1550],
    [-1, -0.5, 0, 0.5, 1],
    [-1, -0.5, 0, 0.5, 1]
];
var mfymd = 0,
    mfxyz = 999;
var climselect = new ol.Feature();
var climselectp = new ol.Feature();

var grid = new ol.layer.Graticule({
    strokeStyle: new ol.style.Stroke({
        color: 'rgba(255,255,255,0.5)',
        width: 0.5
    }),
    zIndex: 50,
    showLabels: true,
    lonLabelStyle: new ol.style.Text({
        font: '12px Arial,Calibri,sans-serif',
        textBaseline: 'bottom',
        fill: new ol.style.Fill({
            color: '#fff'
        }),
        stroke: new ol.style.Stroke({
            color: '#000',
            width: 2
        })
    }),
    latLabelStyle: new ol.style.Text({
        font: '12px Arial,Calibri,sans-serif',
        textAlign: 'end',
        fill: new ol.style.Fill({
            color: '#fff'
        }),
        stroke: new ol.style.Stroke({
            color: '#000',
            width: 2
        })
    })
});

var map = new ol.Map({
    controls: ol.control.defaults({
        zoom: true,
        attribution: false,
        rotate: false /*zIndex:2*/
    }),
    layers: [baselayer, cloud, odbtopo, satimg, model, odbship, odbhydro, odbgravityfig, odbgravity, odbadcp, odbbio, odbchem, odbsedcore,
        climxymap, climgrid, climpoly, geoname, sstfront, eddy, or1ship, ship, histship, svp, argo, gliderkml, glider, glidertraj, wind,
        pvd, segdraw, tidedraw, argotraj, grid, cwb, cwbatm
    ],
    target: 'map',
    interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        shiftDragZoom: false,
        pinchRotate: false
    }),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.transform((window.location.href.indexOf("map=") > 0) ? [parseFloat((window.location.href.split("map=")[1]).split("&")[0].split(",")[0]), parseFloat((window.location.href.split("map=")[1]).split("&")[0].split(",")[1])] : [121, 24], "EPSG:4326", "EPSG:3857"),
        extent: ol.extent.applyTransform([0, -85, 360, 85], ol.proj.getTransform("EPSG:4326", "EPSG:3857")), //zoomFactor:1.5,
        zoom: mapzoom,
        minZoom: 5 - 1,
        maxZoom: 15
    }),
    pixelRatio: 1,
    logo: false
});

argo.on('change', function () {
    if (argo.getSource() != null && argo.getSource().getState() == 'ready') {
        if (document.getElementById('btargo').checked) {
            document.getElementById('argonum').innerHTML = " " +
                (argo.getSource().getFeatures().length + ((argotraj.getSource() && argotraj.getSource().getFeatures().length > 0) ? argotraj.getSource().getFeatures().filter(function (i) {
                    var j = i.get("tim").substr(0, 10).replace(/-/g, '');
                    return j > da2 || j < da1
                }).length : 0));
        };
    } else {
        document.getElementById('argonum').innerHTML =
            "<span class='KUOml-3px material-icons KUOclr-argo KUOfs-2 KUOlh-2 KUOd-i KUOva-tt'>fiber_manual_record</span>";
    };
});
svp.on('change', function () {
    if (svp.getSource() != null && svp.getSource().getState() == 'ready') {
        if (document.getElementById('bttraj').checked) {
            document.getElementById('svpnum').innerHTML = " " +
                svp.getSource().getFeatures().length;
        };
    } else {
        document.getElementById('svpnum').innerHTML =
            "<span class='KUOml-3px material-icons KUOclr-svp KUOfs-2 KUOlh-2 KUOd-i KUOva-tt'>gesture</span>";
    };
});
glider.on('change', function () {
    if (glider.getSource() != null && glider.getSource().getState() == 'ready' && glider.getSource().getFeatures().length > 0) {
        if (document.getElementById('btglider').checked) {
            document.getElementById('glidernum').innerHTML = " " + glider.getSource().getFeatures().length;
            if (document.getElementById("contourfig").style.display == 'block') {
                if ((document.getElementById("dragcontourfig") == null) || document.getElementById("sgmod").value + "," + document.getElementById("sgcrmod").value != document.getElementById("dragcontourfig").dataset.sgcr) {
                    drawContourfig();
                };
            };
        };
    } else {
        document.getElementById('glidernum').innerHTML =
            "<span class='KUOml-3px material-icons KUOclr-glider KUOfs-2 KUOlh-2 KUOd-i KUOva-tt'>gps_fixed</span>";
    };
});

var divpop = document.getElementById('popup');
var popup = new ol.Overlay({
    element: document.getElementById('popup')
});
map.addOverlay(popup);

map.on('singleclick', function (evt) {
    if (document.querySelector(":focus")) {
        document.querySelector(":focus").blur();
    }
    var ioa = (document.getElementById("btdraw").checked) ? ((zseg.getActive()) ? 1 : 0) : 0;
    ioa = ioa + ((document.getElementById("btdraw").checked) ? ((moddraw.getActive()) ? 2 : 0) : 0);
    ioa = ioa + ((document.getElementById("bttide").checked) ? ((tidept.getActive()) ? 4 : 0) : 0);
    if (document.getElementById('btpvd').checked) {
        switch (ioa) {
            case 0:
                trajpvd(evt.coordinate);
                break;
            case 1:
                zseg.setActive(false);
                trajpvd(evt.coordinate);
                zseg.setActive(true);
                break;
            case 2:
                moddraw.setActive(false);
                trajpvd(evt.coordinate);
                moddraw.setActive(true);
                break;
            case 3:
                zseg.setActive(false);
                moddraw.setActive(false);
                trajpvd(evt.coordinate);
                zseg.setActive(true);
                moddraw.setActive(true);
                break;
            case 4:
                tidept.setActive(false);
                trajpvd(evt.coordinate);
                tidept.setActive(true);
                break;
            case 5:
                zseg.setActive(false);
                tidept.setActive(false);
                trajpvd(evt.coordinate);
                zseg.setActive(true);
                tidept.setActive(true);
                break;
            case 6:
                moddraw.setActive(false);
                tidept.setActive(false);
                trajpvd(evt.coordinate);
                moddraw.setActive(true);
                tidept.setActive(true);
                break;
        };
    } else {
        if (ioa === 0) {
            var a;
            var f1 = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                if (layer == climgrid) {
                    a = 0;
                    if (parseFloat(feature.get("title"))) {
                        document.getElementById("mfarea2").value = feature.get("title");
                        mfchange(1, 2, false)
                    }
                } else if (layer == climpoly) {
                    a = 0;
                    if (parseFloat(feature.get("title"))) {
                        var i = feature.get("title").split(",");
                        if (parseInt(document.getElementById("divmfgrid").dataset.mf) > 0) {
                            document.getElementById("mfarea3x").value = i[0];
                            document.getElementById("mfarea4x").value = i[0];
                            document.getElementById("mfarea3y").value = i[1];
                            document.getElementById("mfarea4y").value = i[1];
                            drawClimfig();
                        };
                    };
                } else if (layer == histship) {
                    a = 0;
                    var i = feature.get("name"),
                        j = "http://app01.odb.ntu.edu.tw/";
                    window.open(j + "CSRQry/CSRQry/Item.aspx?crid=" + i.substr(0, 3) + i.substr(4).replace("_", "-"), "_blank");
                } else if (layer == cwb || layer == cwbatm) {
                    a = 0;
                    window.open("https://www.cwb.gov.tw/V8/C/" + ((layer == cwb) ? ("M/OBS_Marine_plot.html?MID=" + feature.get("sid")) : (
                        "W/OBS_Station.html?ID=" + feature.get("features")[0].get("sid").substring(0, 5))), '_blank');
                } else if (layer == argo || layer == argotraj) {
                    a = 1
                } else if (layer == svp) {
                    a = 2
                } else if (layer == glider) {
                    a = 3
                };
                return feature
            });
            if (a > 0) {
                if (iojsplotly === 0) {
                    $.getScript("/odbargo/static/js/plotmod.js", function () {
                        iojsplotly = 1;
                        switch (a) {
                            case 1:
                                argolayer(f1);
                                break;
                            case 2:
                                svplayer(f1);
                                break;
                            case 3:
                                gliderlayer(f1);
                                break;
                        }
                    });
                } else {
                    switch (a) {
                        case 1:
                            argolayer(f1);
                            break;
                        case 2:
                            svplayer(f1);
                            break;
                        case 3:
                            gliderlayer(f1);
                            break;
                    }
                };
            };
        }
    };
    if (document.getElementById("btblayermenu").checked) {
        BaselayerMenu(false);
    };
});

map.on('pointermove', function (evt) {
    var a;
    var feature = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        switch (layer) {
            case argo:
            case argotraj:
                a = 1;
                break;
            case svp:
                a = 2;
                break;
            case eddy:
                a = 3;
                break;
            case glider:
                a = 4;
                break;
            case odbadcp:
                a = 5;
                break;
            case climxymap:
                a = 6;
                break;
            case climgrid:
                a = 7;
                break;
            case climpoly:
                a = 8;
                break;
            case histship:
                a = 9;
                break;
            case cwb:
            case cwbatm:
                a = 10;
                break;
            case ship:
                a = 11;
                break;
            default:
                a = 0;
                break;
        };
        return feature;
    });
    if (a > 0) {
        this.getTargetElement().style.cursor = 'pointer';
        divpop.style.display = 'block';
        switch (a) {
            case 1:
                divpop.style.width = '90px';
                divpop.innerHTML = feature.get('tim').replace("T", "\n").replace("Z", "").replace("-", "/").replace("-", "/");
                popup.setPosition(feature.getGeometry().getCoordinates());
                break;
            case 2:
                divpop.style.width = '90px';
                divpop.innerHTML = feature.get('tim1').replace("T", "\n").replace("Z", "").replace("-", "/").replace("-", "/");
                popup.setPosition(evt.coordinate);
                break;
            case 3:
                divpop.style.width = '120px';
                divpop.innerHTML = (feature.get('alive') > 0) ? 'Alive: ' + feature.get('alive') + ' days<br>Track: ' +
                    (feature.get('dkm') / 1000).toFixed(1) + ' km' : 'Amp: ' + feature.get('amp').toFixed(1) + ' cm<br>Uspd: ' +
                    feature.get('spd').toFixed(1) + ' cm/s<br>Rad: ' + feature.get('radspd').toFixed(1) + ' km<br>Reff: ' +
                    feature.get('radeff').toFixed(1) + ' km<br>Eke: ' + feature.get('teke').toFixed(1) + ' m2/s2';
                popup.setPosition(evt.coordinate);
                break;
            case 4:
                divpop.style.width = '90px';
                divpop.innerHTML = feature.get('tim1').substr(0, 19).replace("T", "\n").replace("-", "/").replace("-", "/") +
                    "\n<b>Dive=" + feature.get('gliderdive') + "</b>" + "<br><i class='material-icons KUOva-m KUOclr-glider' style='-webkit-transform:rotate(" + parseInt(feature.get('dadir')) + "deg);-ms-transform:rotate(" + parseInt(feature.get('dadir')) + "deg);transform:rotate(" + parseInt(feature.get('dadir')) + "deg)'>arrow_upward</i>&nbsp;" + Math.round(feature.get("dacur"), 1) + "&nbsp;cm/s";
                popup.setPosition(evt.coordinate);
                break;
            case 5:
                divpop.style.width = '100px';
                divpop.innerHTML = "u: <b>" + feature.get("u") + "</b> cm/s<br>v: <b>" + feature.get("v") + "</b> cm/s<br>" +
                    "N = <i>O</i>(<b>10<sup>" + feature.get("mCounts") + "</sup></b>)";
                select.setStyle(null);
                feature.setStyle([new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#000",
                            width: 4
                        })
                    }),
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: "#a0f"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#fff",
                            width: 2
                        })
                    })
                ]);
                select = feature;
                popup.setPosition(evt.coordinate);
                break;
            case 6:
                if (feature.get("title").length > 0) {
                    divpop.style.width = '100px';
                    divpop.innerHTML = feature.get("title");
                } else {
                    divpop.style.display = "none";
                };
                select.setStyle(null);
                feature.setStyle([new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 6
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: feature.get("color"),
                            width: 5
                        })
                    })
                ]);
                select = feature;
                popup.setPosition(evt.coordinate);
                break;
            case 7:
                select.setStyle(null);
                divpop.style.width = '100px';
                divpop.innerHTML = feature.get("title") + "" + ((parseFloat(feature.get("title")) > 100.0) ? "&#176;E" : "&#176;N");
                if (feature != climselect) {
                    feature.setStyle(new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#fff",
                            width: mapzoom / 2
                        })
                    }));
                    select = feature;
                };
                popup.setPosition(evt.coordinate);
                break;
            case 8:
                select.setStyle(null);
                divpop.style.width = '100px';
                divpop.innerHTML = (feature.get("title") + "&deg;N").replace(",", "&deg;E<br>");
                if (feature != climselectp) {
                    feature.setStyle(new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: "rgba(255,255,255,.5)"
                        })
                    }));
                    select = feature;
                };
                popup.setPosition(evt.coordinate);
                break;
            case 9:
                select.setStyle(null);
                divpop.style.width = '150px';
                divpop.innerHTML = "<b>" + feature.get("name") + "</b>"; //<br>"+feature.get("description");
                /*var i=feature.getStyleFunction()(feature,map.getView().getResolution())[0].getStroke().getColor();
                feature.setStyle(new ol.style.Style({color:"rgb("+i[0]+","+i[1]+","+i[2]+")",width:1}));*/
                //var i=feature.getStyleFunction()(feature,map.getView().getResolution());
                //feature.setStyle(i);
                select = feature;
                select.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#fff",
                        width: 6
                    })
                }));
                popup.setPosition(evt.coordinate);
                break;
            case 10:
                divpop.style.width = '250px';
                if (feature.getKeys().indexOf("features") < 0) {
                    divpop.innerHTML = "<b>" + feature.get('sn') + "</b><br>" + cwbdata[feature.get('sid')];
                } else {
                    feature = feature.get("features");
                    if (feature.length == 1) {
                        divpop.innerHTML = "<b>" + feature[0].get('sn') + "</b><br>" + cwbdata[feature[0].get('sid')];
                    } else {
                        divpop.innerHTML = (feature.map(function (i) {
                            return "<b>" + i.get('sn') + "</b> , "
                        })).join("") + "...";
                    };
                };
                popup.setPosition(evt.coordinate);
                break;
            case 11:
                divpop.style.width = '200px';
                var iinshp = (ship.getSource().getFeatures().indexOf(feature) + 1).toString();
                if (iinshp >= 0) {
                    divpop.innerHTML = "<p class='KUOclr-or" + iinshp + " KUOfs-1dot5 KUOff-c-am KUOta-l KUOpl-4px'><b>NOR" + iinshp + ":</b><br>" +
                        "<small class='KUOfs-1dot2 KUOclr-k KUOff-a'>" + document.getElementById('or' + iinshp + 'now').innerHTML + "<br>" +
                        "<b>Lon:&nbsp;" + ol.proj.transform(or1now.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326').map(function (i) {
                            return i.toFixed(4)
                        }).join("\u00b0E<br>Lat&nbsp;:&nbsp;") + "\u00b0N</b></small></p>";
                    popup.setPosition(evt.coordinate);
                };
                break;
        };
    } else {
        this.getTargetElement().style.cursor = '';
        divpop.style.display = 'none';
        select.setStyle(null);
        if (document.getElementById('btlive').checked) {
            if (document.getElementById('btmodel').checked) {
                var i = $.inArray(document.querySelector('input[name="modelfig"]:checked').value, ["z", "b", "m", "t", "s", "q"]);
                if (i >= 0 && document.getElementById('alphabarmodel').value == "0") {
                    this.getTargetElement().style.cursor = 'crosshair';
                    var pxr = evt.frameState.pixelRatio;
                    var c = canctx.getImageData(evt.pixel[0] * pxr, evt.pixel[1] * pxr, 1, 1).data;
                    var k = $.inArray(c[0].toString() + "," + c[1].toString() + "," + c[2].toString(), clrsat[iclrmodel[i]]);
                    if (k >= 0) {
                        popup.setPosition(evt.coordinate);
                        divpop.style.width = '80px';
                        divpop.innerHTML = "<b>" + (clrsatval[iclrmodel[i]][k] * micoef1[i] + micoef2[i]) + " " + modelpop0[i] + "</b>";
                        divpop.style.display = 'block';
                    };
                };
            } else {
                if (document.getElementById('btfront').checked) {
                    this.getTargetElement().style.cursor = 'crosshair';
                    var pxr = evt.frameState.pixelRatio;
                    var c = canctx.getImageData(evt.pixel[0] * pxr, evt.pixel[1] * pxr, 1, 1).data;
                    if (c[0] > 102) {
                        var k = $.inArray(c[0].toString() + "," + c[1].toString() + "," + c[2].toString(), clrfront);
                        if (k >= 0) {
                            popup.setPosition(evt.coordinate);
                            divpop.style.width = '90px';
                            divpop.innerHTML = '<b>SST Front:<br>0.' + (k + 1) + '<sup>o</sup>C/km</b>';
                            divpop.style.display = 'block';
                        };
                    };
                };
                var i = document.querySelector('input[name="radios"]:checked').value;
                if (i > 0 && document.getElementById('alphabarsat').value == "0") {
                    this.getTargetElement().style.cursor = 'crosshair';
                    var pxr = evt.frameState.pixelRatio;
                    var c = canctx.getImageData(evt.pixel[0] * pxr, evt.pixel[1] * pxr, 1, 1).data;
                    var k = $.inArray(c[0].toString() + "," + c[1].toString() + "," + c[2].toString(), clrsat[i]);
                    if (k >= 0) {
                        popup.setPosition(evt.coordinate);
                        divpop.style.width = '110px';
                        divpop.innerHTML = "<b>" + satpop1[i] + clrsatval[i][k] + satpop2[i] + "</b>";
                        divpop.style.display = 'block';
                    };
                };
            };
        };
    };
});

map.getViewport().addEventListener('contextmenu', function (e) {
    if (document.getElementById('btdraw').checked) {
        e.preventDefault();
        moddraw.setActive(!zseg.getActive());
        zseg.setActive(!zseg.getActive());
    }
});

map.getView().on('change:resolution', function () {
    mapzoom = map.getView().getZoom();
    if (document.getElementById('btgeoname').checked) {
        togglegeoname(true);
    }
    if (document.getElementById('btglider').checked) {
        glider.getStyle().getImage().setRadius(mapzoom);
        glider.getStyle().getImage().getStroke().setWidth(mapzoom * 0.1);
        glider.changed();
    };
    if (document.getElementById('btargo').checked) {
        argo.getStyle().getImage().setRadius(mapzoom);
        argo.changed();
    };
});

var mousepos = new ol.control.MousePosition({
    coordinateFormat: function (c) {
        document.getElementById('tdCursor2').innerHTML = (~~c[0]) + "<sup>o</sup>" + ("00" + ((c[0] % 1) * 60).toFixed(2)).slice(-5) + "'E<br>&nbsp;" + (~~c[1]) + "<sup>o</sup>" + ("00" + ((c[1] % 1) * 60).toFixed(2)).slice(-5) + "'N";
        return ol.coordinate.format(c, " {x} <sup>o</sup>E , {y} <sup>o</sup>N&nbsp;", 4)
    },
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('tdCursor'),
    undefinedHTML: " Longitude<sup>o</sup>E , Latitude<sup>o</sup>N&nbsp;"
});
map.addControl(mousepos);

sstfront.on('postrender', function (evt) {
    canctx = null;
    canctx = evt.context;
});
satimg.on('postrender', function (evt) {
    canctx = null;
    canctx = evt.context;
});
model.on('postrender', function (evt) {
    canctx = null;
    canctx = evt.context;
});

var styledragdrop = {
    'Point': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(128,128,0,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#ff0',
                width: 1
            })
        })
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'Polygon': new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0,128,128,0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#0ff',
            width: 1
        })
    }),
    'MultiPoint': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(128,0,128,0.5)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#f0f',
                width: 1
            })
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'MultiPolygon': new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0,0,128,0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#00f',
            width: 1
        })
    })
};
var styledragdropfun = function (f, r) {
    var fStyleFunc = f.getStyleFunction();
    if (fStyleFunc) {
        return fStyleFunc.call(f, r);
    } else {
        return styledragdrop[f.getGeometry().getType()];
    }
};
var dragdropinteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [
        ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON
    ]
});
dragdropinteraction.on('addfeatures', function (e) {
    var vsr = new ol.source.Vector({
        features: e.features
    });
    var ii = (map.getLayers().getArray().length).toString() + new Date().getSeconds().toString();
    map.addLayer(new ol.layer.Vector({
        renderMode: 'image',
        source: vsr,
        style: styledragdropfun,
        zIndex: 10,
        name: "dgdp" + ii
    }));
    map.getView().fit(vsr.getExtent());
    var i = document.createElement("BUTTON");
    i.innerHTML = "&#10006;";
    i.id = "btdgdp" + ii;
    i.className = "btdgdp";
    i.title = e.file.name;
    i.setAttribute("onclick", "closeDragDropLayer(" + ii + ")");
    document.getElementById("dragdropbtn").appendChild(i);
});
map.addInteraction(dragdropinteraction);

var initchkx0 = ["btgeoname", "btwind", "btfront", "bteddy", "chkexpcol", "btargo", "argoexpandbtn", "btbioargo", "bttraj", "svpexpandbtn", "satexpandbtn", "btpvd", "pvdexpandbtn", "btdraw", "drawexpandbtn", "btcplan", "cplanexpandbtn", "btodbs", "odbsexpandbtn", "btntopo1", "btncurrent1", "btnhydro1", "btngravity1", "btngravity2", "btnbio1", "btnchem1", "btnsedcore1", "btnorship1", "btglider", "gliderexpandbtn", "btgliderkml", "btship", "shipexpandbtn", "bthistship", "btmodel", "modelexpandbtn", "bttide", "tideexpandbtn", "btmeanfield", "meanfieldexpandbtn", "btclimts", "infolangen", "btixxx", "btctrbar", "btfreehand", "btblayermenu", "btcloud", "btcwbatm", "btcwbsea", "btextwms", "btext1", "btext2", "btext3", "btext4", "btext5", "btext6"];
var initchkx1 = ["infochkx", "btgrid", "btone", "btone2", "btlive", "infolangch"];

function init_fixCheckBox() {
    initchkx0.map(function (i) {
        document.getElementById(i).checked = false;
    });
    initchkx1.map(function (i) {
        document.getElementById(i).checked = true;
    });
}; //end of func init_fixCheckBox
function gen_urlshare() {
    var initchkxm = ["bturlshare", "btargo", "btbioargo", "bttraj", "btone", "btone2", "btpvd", "btdraw", "btcplan", "btodbs", "btglider", "shipexpandbtn", "btmodel", "bttide", "btmeanfield", "infolangch"];
    var initchkxe = ["argoexpandbtn", "svpexpandbtn", "satexpandbtn", "pvdexpandbtn", "drawexpandbtn", "cplanexpandbtn", "odbsexpandbtn", "gliderexpandbtn", "modelexpandbtn", "tideexpandbtn", "meanfieldexpandbtn"]
    var aurl = window.location.href.split("?")[0] + "?map=" + ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326").toString() + "," + (Math.round(mapzoom * 1000.0) / 1000.0).toString();
    var btio = new Array();
    if (document.getElementById("chkexpcol").checked) {
        initchkxe.map(function (i) {
            if (document.getElementById(i).checked) {
                initchkxm.push(i);
            };
        });
    };
    if (document.getElementById("btnhydro1").checked) {
        btio.push(document.querySelector("[name=hydrofig]:checked").id);
    };
    initchkx0.map(function (i) {
        if (initchkxm.indexOf(i) < 0) {
            if (document.getElementById(i).checked) {
                btio.push(i);
            };
        };
    });
    initchkx1.map(function (i) {
        if (initchkxm.indexOf(i) < 0) {
            if (!document.getElementById(i).checked) {
                btio.push(i);
            };
        };
    });
    if (document.getElementById("chkexpcol").checked) {
        initchkxe.map(function (i) {
            if (!document.getElementById(i).checked) {
                btio.push(i);
            };
        });
    };
    if (!document.getElementById("btone").checked) {
        btio.push(document.querySelector("[name=radios]:checked").id);
    };
    if (!document.getElementById("btone2").checked) {
        btio.push(document.querySelector("[name=radios2]:checked").id);
    };
    if (btio.join().replace(/,/g, "").length > 0) {
        aurl = aurl + "&io=" + btio;
    };
    if ((document.getElementById("btntopo1").checked && parseInt(document.getElementById("alphabartopo").value) > 0) || (document.getElementById("btnhydro1").checked && parseInt(document.getElementById("alphabarhydro").value) > 0)) {
        aurl = aurl + "&alpha=" + document.getElementById("alphabartopo").value + "," + document.getElementById("alphabarhydro").value;
    };
    if (document.getElementById("btargo").checked) {
        aurl = aurl + "&argo=" + da1 + "," + da2;
        if (mk0.getStyle() != null) {
            aurl = aurl + "," + mk0.get("pk") + "," + document.querySelector("[name=argofig]:checked").id + "," + document.getElementById("abc").style.top + "," + document.getElementById("abc").style.left;
        };
        if (document.getElementById("btbioargo").checked) {
            aurl = aurl + ",bio";
        };
    };
    if (document.getElementById("bttraj").checked) {
        aurl = aurl + "&svp=" + da3;
        if (pk0.getStyle() != null) {
            aurl = aurl + "," + pk0.get("pk") + "," + document.querySelector("[name=svpfig]:checked").id + "," + document.getElementById("abc").style.top + "," + document.getElementById("abc").style.left;
        };
    };
    if (document.getElementById("btglider").checked) {
        aurl = aurl + "&glider=" + document.getElementById("sgmod").value + "," + document.getElementById("sgcrmod").value;
        if (gk0.getStyle() != null) {
            aurl = aurl + "," + gk0.get("pk") + "," + document.querySelector("[name=gliderfig]:checked").id + "," + document.getElementById("abc").style.top + "," + document.getElementById("abc").style.left;
        };
        if (document.getElementById("contourfig").style.display != "none") {
            aurl = aurl + ((gk0.getStyle() == null) ? ",-1,0,0,0," : ",") + document.getElementById("contourfig").style.top + "," + document.getElementById("contourfig").style.left + "," + document.getElementById("sgcontourmod").value;
        };
    };
    if (document.getElementById("btclose2").style.display == "inline") {
        aurl = aurl + "&pvd=";
        for (var i = 0; i < pvd.getSource().getFeatures().length; i++) {
            var j = pvd.getSource().getFeatures()[i];
            aurl += "P" + j.get("hr") + "," + (ol.proj.transform(j.getGeometry().getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326').map(function (jj) {
                return jj.toFixed(5);
            })).toString();
        };
    };
    if (cplan.join().replace(/,/g, "").length > 0) {
        var btckey = new Array(),
            btckeyset = new Array();
        for (var i = 0; i < cplan.length; i++) {
            if (cplan[i] != null) {
                btckey.push(cplan[i].getSource().getUrl().split("?name=")[1]);
                btckeyset.push(ckeyset[i + 1].toString().replace(ckeyset[i + 1][0], ckeyset[i + 1][0].toString(16)).replace(/,/g, ""));
            }
        };
        aurl = aurl + "&ckey=" + btckey.length + "," + btckey;
        aurl = aurl + "&ckeyset=" + btckeyset;
        if ($("#cplanol .KUOckeytableio.KUOclr-gray").length > 0) {
            var i = $("#cplanol .KUOckeytableio");
            var j = new Array();
            for (var ii = 0; ii < i.length; ii++) {
                j.push((i[ii].className.indexOf("KUOclr-gray") > 0) ? 1 : 0);
            };
            aurl = aurl + "&ckeytabx=" + j;
        };
    };
    if (document.getElementById("btmodel").checked) {
        aurl = aurl + "&model=" + da5 + "," + document.querySelector("[name=modelfig]:checked").id + "," + document.getElementById("modeldep").value;
        if (parseInt(document.getElementById("alphabarmodel").value) > 0) {
            aurl = aurl + "," + document.getElementById("alphabarmodel").value;
        }
    };
    if (document.getElementById("btdraw").checked) {
        aurl = aurl + "&draw=" + document.getElementById("drawp1x").value + "," + document.getElementById("drawp1y").value + "," + document.getElementById("drawp2x").value + "," + document.getElementById("drawp2y").value;
        if (document.getElementById("segfig").style.display != "none") {
            aurl = aurl + "," + document.getElementById("segfig").style.top + "," + document.getElementById("segfig").style.left;
        };
    };
    if (document.getElementById("bttide").checked) {
        aurl = aurl + "&tide=" + da6 + "," + document.getElementById("tidehr1").value + "," + da7 + "," + document.getElementById("tidehr2").value + "," + document.getElementById("tidetmz").checked + "," + document.getElementById("tidep0x").value + "," + document.getElementById("tidep0y").value + "," + document.getElementById("tidefig").style.top + "," + document.getElementById("tidefig").style.left;
    };
    if (document.getElementById("btmeanfield").checked) {
        aurl = aurl + "&meanfield=" + document.getElementById("meanfieldvar").value + ","
        if (document.getElementById("btclimts").checked) {
            var ii = parseInt(document.getElementById("divmfgrid").dataset.mf);
            aurl = aurl + "1," + ii;
            if (ii > 0) {
                aurl = aurl + "," + document.getElementById("mfarea" + (ii + 2) + "x").value + "," + document.getElementById("mfarea" + (ii + 2) + "y").value + "," + ((ii == 1) ? document.getElementById("mfarea3z").value : mfymd.toString()) + "," + document.getElementById("clim" + ((ii == 1) ? "ts" : "pz") + "fig").style.top + "," + document.getElementById("clim" + ((ii == 1) ? "ts" : "pz") + "fig").style.left;
            };
        } else {
            var ii = parseInt(document.getElementById("divmfxy").dataset.mf);
            aurl = aurl + "0," + ii;
            if (ii > 0) {
                aurl = aurl + "," + mfymd.toString() + "," + document.getElementById("mfarea" + ii).value + "," + document.getElementById("climsectzfig").style.top + "," + document.getElementById("climsectzfig").style.left;
            };
        };
    };
    if (!document.getElementById("btone").checked || !document.getElementById("btone2").checked || document.getElementById("bteddy").checked || document.getElementById("btfront").checked) {
        aurl = aurl + "&sat=" + da4;
        if (!document.getElementById("btone").checked && parseInt(document.getElementById("alphabarsat").value) > 0) {
            aurl = aurl + "," + document.getElementById("alphabarsat").value
        }
    }
    if (document.getElementById("bthistship").checked) {
        aurl = aurl + "&histship=" + document.getElementById("histshipor").value + "," + document.getElementById("histshipyr").value;
    };
    if (document.getElementById("baselayermenu").dataset.bb > 0) {
        aurl = aurl + "&baselayer=" + document.getElementById("baselayermenu").dataset.bb;
    };
    document.getElementById("urlshare").innerHTML = aurl;
    document.getElementById("urlshare").focus();
    document.onclick = function (e) {
        if (e.target.id.indexOf("urlshare") >= 0) {
            if (e.target.id.indexOf("copyurlshare") >= 0) {
                document.getElementById("urlshare").select();
                document.execCommand("copy");
                document.getElementById("bturlshare").click();
                document.onclick = null;
            };
        } else {
            document.getElementById("bturlshare").click();
            document.onclick = null;
        }
    };
}; //end of func gen_urlshare
function imgoverlay(img) {
    if ((da4 < 19930101) || (da4 < 19990101 && img === 'ghrsst/sst') || (da4 < 19990101 && img === 'chla/chla')) {
        satimg.setVisible(false)
    } else {
        let imgextent_guam;
        if (da4 >= 20201204) {
            imgextent_guam = new ol.extent.applyTransform([105, 2, 150, 35], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
        } else {
            imgextent_guam = imgextent;
        };
        document.getElementById("satexpandbtn").checked = true;
        document.getElementById("divsatblock").style.display = "block";
        $.get("https://odbpo.oc.ntu.edu.tw/static/figs/" + img + da4 + ".png", function () {
            satimg.setSource(new ol.source.ImageStatic({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/" + img + da4 + ".png",
                projection: 'EPSG:' + pj,
                imageExtent: imgextent_guam,
                crossOrigin: 'anonymous'
            }));
        }).fail(function () {
            satimg.setSource(new ol.source.ImageStatic({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/" + img + "latest.png",
                projection: 'EPSG:' + pj,
                imageExtent: imgextent_guam,
                crossOrigin: 'anonymous'
            }));
        });

        satimg.setVisible(true);
        satimg.setOpacity(1 - document.getElementById("alphabarsat").value / 10);
        document.getElementById("colorbar").src = "/odbargo/static/figs/" + img + "colorbar.png";
        document.getElementById("colorbar").style.visibility = "visible";
    };
} //end of func imgoverlay
function hideimgoverlay() {
    satimg.setVisible(false);
    document.getElementById("colorbar").src = "";
    document.getElementById("colorbar").style.visibility = "hidden";
}; //end of func hideimgoverlay
function toggleFront(a) {
    if (a) {
        if (da4 < 19990101) {
            sstfront.setVisible(false);
        } else {
            let imgextent_guam;
            if (da4 >= 20201204) {
                imgextent_guam = new ol.extent.applyTransform([105, 2, 150, 35], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
            } else {
                imgextent_guam = imgextent;
            };
            document.getElementById("satexpandbtn").checked = true;
            document.getElementById("divsatblock").style.display = "block";
            $.get("https://odbpo.oc.ntu.edu.tw/static/figs/front/front" + da4 + ".png", function () {
                console.log('ok')
                sstfront.setSource(new ol.source.ImageStatic({
                    url: "https://odbpo.oc.ntu.edu.tw/static/figs/front/front" + da4 + ".png",
                    projection: 'EPSG:' + pj,
                    imageExtent: imgextent_guam,
                    crossOrigin: 'anonymous'
                }));
            }).fail(function () {
                console.log('fail')
                sstfront.setSource(new ol.source.ImageStatic({
                    url: "https://odbpo.oc.ntu.edu.tw/static/figs/front/frontlatest.png",
                    projection: 'EPSG:' + pj,
                    imageExtent: imgextent_guam,
                    crossOrigin: 'anonymous'
                }));
            });
            sstfront.setVisible(true);
        }
    } else {
        sstfront.setVisible(false);
        canctx = null;
        divpop.style.display = 'none';
    };
}; //end of func toggleFront
function toggleEddy(a) {
    eddy.setSource(null);
    if (a) {
        document.getElementById("satexpandbtn").checked = true;
        document.getElementById("divsatblock").style.display = "block";
        eddy.setSource(new ol.source.Vector({
            url: "/eddy/eddy/" + da4 + "/geojson",
            format: new ol.format.GeoJSON()
        }));
        eddy.setStyle(function (feature) {
            var eclr = (feature.get('eddyac') > 0) ? '#FF007F' : '#007FFF';
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: (feature.get('eddytype') > 0) ? '#FF007F' : '#007FFF',
                        width: 3
                    }),
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: (feature.get('eddyac') > 0) ? '#FF007F' : '#007FFF'
                        }),
                        radius1: 12,
                        radius2: 5,
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        }),
                        points: 5
                    })
                })
            ]
        });
    };
}; //end func toggleEddy
function trajpvd(lonlat) {
    var xy = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
    $.getJSON("/grd/seaclim/pvd/" + xy[0] + "," + xy[1] + "/" + document.getElementById("pvdhr").value + "/geojson", function (g) {
        var f = new ol.format.GeoJSON({
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
        }).readFeatures(g);
        if (Number(f[0].get("d")) > 0) {
            document.getElementById("btpvd").checked = null;
            document.getElementById("btclose2").style.visibility = 'visible';
            document.getElementById("btclose2").style.display = 'inline';
            var c = 'data:image/svg+xml,' + qvec;
            var s = [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 4
                })
            }), new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#0f0',
                    width: 2
                })
            })];
            var d = f[0].get('d');
            xy = [f[0].getGeometry().getLastCoordinate(), f[0].getGeometry().getCoordinateAt(0.95)];
            s.push(new ol.style.Style({
                geometry: new ol.geom.Point([xy[0][0], xy[0][1]]),
                image: new ol.style.RegularShape({
                    points: 3,
                    radius: 10,
                    angle: Math.PI / 2,
                    rotation: -Math.atan2(xy[0][1] - xy[1][1], xy[0][0] - xy[1][0]),
                    stroke: new ol.style.Stroke({
                        color: '#0f0',
                        width: 2
                    })
                }),
                text: new ol.style.Text({
                    text: "Distance:\n" + parseFloat(d).toFixed(1) + " km\n",
                    font: '18px Arial,Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#0f0'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 3
                    }),
                    textBaseline: 'bottom'
                })
            }));
            if (d > 100) {
                for (var i = 1; i < mapzoom; i++) {
                    xy = [f[0].getGeometry().getCoordinateAt(i / mapzoom), f[0].getGeometry().getCoordinateAt(i / mapzoom * 0.95)];
                    s.push(new ol.style.Style({
                        geometry: new ol.geom.Point([xy[0][0], xy[0][1]]),
                        image: new ol.style.Icon({
                            opacity: 1,
                            src: c,
                            anchor: [.5, .5],
                            rotation: -Math.atan2(xy[0][1] - xy[1][1], xy[0][0] - xy[1][0]),
                            scale: 1,
                            imageSize: [16, 16]
                        })
                    }))
                };
            };
            f[0].setProperties({
                'hr': document.getElementById("pvdhr").value
            });
            f[0].setStyle(s);
            pvd.getSource().addFeatures(f);
        } else {
            var pvdtemp = new ol.layer.Vector({
                map: map,
                source: new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.Point(lonlat),
                        type: 'Point'
                    })]
                }),
                style: new ol.style.Style({
                    image: new ol.style.RegularShape({
                        points: 4,
                        radius: 10,
                        radius2: 0,
                        rotation: Math.PI / 4,
                        fill: new ol.style.Fill({
                            color: '#0f0'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#0f0',
                            width: 2
                        })
                    }),
                    text: new ol.style.Text({
                        text: (document.getElementById("infolangen").checked) ? "No data" : "無資料",
                        font: '20px Arial,sans-serif,"微軟正黑體"',
                        fill: new ol.style.Fill({
                            color: '#0f0'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: 2
                        }),
                        textBaseline: 'bottom',
                        offsetY: -15
                    })
                })
            })
            setTimeout(function () {
                pvdtemp.getSource().refresh();
                pvdtemp.setSource(null);
                map.removeLayer(pvdtemp);
            }, 3000);
        };
    });
}; //end of func trajpvd
function togglegeoname(a) {
    if (a) {
        geoname.setSource(new ol.source.Vector({
            url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiledgeoname" + parseInt(mapzoom) + ".geojson",
            format: new ol.format.GeoJSON()
        }));
        geoname.setStyle(function (feature) {
            return [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: mapzoom * 2 - 2,
                    fill: new ol.style.Fill({
                        color: 'rgba(0,0,0,0.5)'
                    })
                }),
                text: new ol.style.Text({
                    text: feature.get('namechar'),
                    font: Math.round((mapzoom - 3) / 2 * 10) + 'px Calibri,標楷體,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#' + clr[(feature.get('geoname') % 16)]
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 2
                    })
                })
            })]
        });
        document.getElementById('btctrbar').checked = true;
        document.getElementById('btctrbar').style.display = 'inline';
    } else {
        geoname.setSource(null);
        if (!document.getElementById('btfreehand').checked) {
            document.getElementById('btctrbar').checked = false;
            document.getElementById('btctrbar').style.display = 'none';
        };
    };
}; //end of func togglegeoname
function toggleGraticule(a) {
    grid.setOpacity(a ? 1 : 0);
}; //end of func toggleGraticule
function toggleWind(a) {
    if (a) {
        //wind.setSource(new ol.source.ImageStatic({url:"https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/O"+((a>1)?a:4)+".jpg"+"?time="+(new Date()).getTime(),projection:'EPSG:3857',imageExtent:[11131949.079327358,1118889.9748579597,15495673.118423682,4865942.279503176],crossOrigin:'anonymous'}));
        if (document.getElementById("btcloud").checked) {
            document.getElementById("btcloud").click();
        };
        var windfig = new Array();
        wind.setSource(new ol.source.ImageStatic({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/R22.png",
            projection: 'EPSG:3857',
            crossOrigin: 'anonymous',
            imageExtent: ol.proj.transformExtent([115, 17.75, 126.5, 29.25], 'EPSG:4326', 'EPSG:3857')
        }));
        for (var i = 10; i <= 22; i++) {
            windfig[i - 10] = new ol.source.ImageStatic({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/R" + i + ".png",
                projection: 'EPSG:3857',
                crossOrigin: 'anonymous',
                imageExtent: ol.proj.transformExtent([115, 17.75, 126.5, 29.25], 'EPSG:4326', 'EPSG:3857')
            });
        };
        wind.setVisible(true);
        cwbanim = setInterval(function () {
            var i = wind.getSource().getUrl().substr(49, 2) - 1;
            i = (i >= 10) ? i : 22;
            wind.setSource(windfig[i - 10]);
            wind.changed();
        }, 350);
        document.getElementById('btairsea').checked = true;
        document.getElementById('btairsea').style.display = 'inline';
    } else {
        clearInterval(cwbanim);
        wind.setVisible(a);
        if (['btcloud', 'btcwbatm', 'btcwbsea'].every(function (i) {
                return !document.getElementById(i).checked
            })) {
            document.getElementById('btairsea').checked = false;
            document.getElementById('btairsea').style.display = 'none';
        };
    };
}; //end of func toggleWind
function toggleCloud(a) {
    if (a) {
        if (document.getElementById("btwind").checked) {
            document.getElementById("btwind").click();
        };
        var cloudfig = new Array();
        cloud.setSource(new ol.source.ImageStatic({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/N22.png",
            projection: 'EPSG:3857',
            crossOrigin: 'anonymous',
            imageExtent: imgextent
        }));
        for (var i = 10; i <= 22; i++) {
            cloudfig[i - 10] = new ol.source.ImageStatic({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/N" + i + ".png",
                projection: 'EPSG:3857',
                crossOrigin: 'anonymous',
                imageExtent: imgextent
            });
        };
        cloud.setVisible(true);
        cwbanim = setInterval(function () {
            var i = cloud.getSource().getUrl().substr(49, 2) - 1;
            i = (i >= 10) ? i : 22;
            cloud.setSource(cloudfig[i - 10]);
            cloud.changed();
        }, 350);
        document.getElementById('btairsea').checked = true;
        document.getElementById('btairsea').style.display = 'inline';
        //    odbchem.setSource(new ol.source.Vector({url:"https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/fifows_wsp.kml",format:new ol.format.KML(),crossOrigin:'anonymous'}));
        //    odbsedcore.setSource(new ol.source.Vector({url:"https://odbpo.oc.ntu.edu.tw/static/figs/cwbdata/fifows_typhoon.kml",format:new ol.format.KML(),crossOrigin:'anonymous'}));
    } else {
        clearInterval(cwbanim);
        cloud.setVisible(a);
        cloud.setSource(null); //odbchem.setSource(null); odbsedcore.setSource(null);
        if (['btwind', 'btcwbatm', 'btcwbsea'].every(function (i) {
                return !document.getElementById(i).checked
            })) {
            document.getElementById('btairsea').checked = false;
            document.getElementById('btairsea').style.display = 'none';
        };
    };
}; //end of func toggleCloud
function toggleCWB(a, b) {
    if (a) {
        if (!cwbsite.length) {
            $.getJSON("https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-B0076-001?Authorization=CWB-3BA4E6B0-4A4D-4762-B7DD-B9289815F0CF&downloadType=WEB&format=JSON", function (e) {
                var c = e.cwbdata.resources.resource.data.seaSurfaceObs.location;
                for (var i = 0; i < c.length; i++) {
                    var j = c[i].station;
                    cwbsite[j.stationID] = {
                        "sn": j.stationName,
                        "xy": ol.proj.transform([parseFloat(j.stationLongitude), parseFloat(j.stationLatitude)], "EPSG:4326", "EPSG:3857")
                    };
                };
            }).then(function () {
                toggleCWBdata(a, b);
            });
        } else {
            toggleCWBdata(a, b);
        };
    } else {
        toggleCWBdata(a, b);
    };
}; //end of func toggleCWB
function toggleCWBdata(a, b) {
    if (a) {
        var k = "CWB-3BA4E6B0-4A4D-4762-B7DD-B9289815F0CF",
            cw = "https://opendata.cwb.gov.tw/";
        if (b) {
            //let tmpurl="api/v1/rest/datastore/O-A0017-001?Authorization="
            let tmpurl1 = "api/v1/rest/datastore/O-A0017-001?Authorization="
            $.getJSON(cw + tmpurl1 + k + "&format=JSON&sort=obsTime&callback=?", function (v) {
                var vv = (v.success) ? v.records.location : null;
                if (vv) {
                    for (var i = 0; i < vv.length; i++) {
                        if (vv[i].time.length > 0) {
                            var jj = cwbtidesite[vv[i].stationId],
                                d = "";
                            cwb.getSource().addFeature(new ol.Feature({
                                type: 'Point',
                                geometry: new ol.geom.Point(cwbsite[jj[0]].xy),
                                sid: jj[0],
                                sn: cwbsite[jj[0]].sn,
                                si: Math.sign(parseFloat(vv[i].time[vv[i].time.length - 1].weatherElement[0].elementValue) + jj[1])
                            }));
                            for (var j = vv[i].time.length - 1; j > Math.max(vv[i].time.length - 5, 0); j--) {
                                var ii = vv[i].time[j];
                                d = d + "<tr><td>" + ii.obsTime.substr(0, 16) + "</td><td style=text-align:end><b>" +
                                    (parseFloat(ii.weatherElement[0].elementValue) + jj[1]).toFixed(1) + " </b>cm</td></tr>";
                            };
                            cwbdata[jj[0]] = "<table class=KUOcwbpop>" + d + "</table>";
                        };
                    };
                };
            });
            //$.getJSON(cw+"api/v1/rest/datastore/O-A0018-001?Authorization="+k+"&format=JSON&sort=obsTime&timeFrom="+tk,function(u){
            let tmpurl2 = "api/v1/rest/datastore/O-A0018-001?Authorization="
            $.getJSON(cw + tmpurl2 + k + "&format=JSON&sort=obsTime&callback=?", function (u) {
                var uu = (u.success) ? u.records.location : null;
                if (uu) {
                    for (var i = 0; i < uu.length; i++) {
                        if (uu[i].time.length > 0) {
                            var ii = uu[i].time[uu[i].time.length - 1].weatherElement;
                            var d = '';
                            for (var j = 0; j < cwbbuoyu.length; j++) {
                                for (var jj = 0; jj < ii.length; jj++) {
                                    if (ii[jj].elementName == cwbbuoyu[j][0]) {
                                        d = d + ((j % 2 == 0) ? "</tr><tr>" : "") + "<td>" + ii[jj].elementName + ":<b>" +
                                            (ii[jj].elementValue * cwbbuoyu[j][1]).toFixed(Math.log(1 / cwbbuoyu[j][1]) / Math.log(10)) + "</b>" +
                                            cwbbuoyu[j][2] + "</td>";
                                        break;
                                    };
                                };
                            };
                            cwbdata[uu[i].stationId] = "<table class=KUOcwbpop><caption>" + uu[i].time[uu[i].time.length - 1].obsTime +
                                "</caption>" + d.substr(5) + "</tr></table>";
                            cwb.getSource().addFeature(new ol.Feature({
                                type: 'Point',
                                geometry: new ol.geom.Point(cwbsite[uu[i].stationId].xy),
                                sid: uu[i].stationId,
                                sn: cwbsite[uu[i].stationId].sn,
                                si: 2
                            }));
                        };
                    };
                };
            });
        } else {
            $.getJSON(cw + "api/v1/rest/datastore/O-A0001-001?Authorization=" + k + "&format=JSON", function (w) {
                var ww = (w.success) ? w.records.location : null;
                if (ww) {
                    for (var i = 0; i < ww.length; i++) {
                        var ii = ww[i].weatherElement;
                        var d = '';
                        for (var j = 0; j < cwbweather.length; j++) {
                            for (var jj = 0; jj < ii.length; jj++) {
                                if (ii[jj].elementName == cwbweather[j][0]) {
                                    d = d + ((j % 2 == 0) ? "</tr><tr>" : "") + "<td>" + cwbweather[j][1] + ":<b>" +
                                        ((ii[jj].elementValue == -99) ? "NaN" : (ii[jj].elementValue * cwbweather[j][2]).toFixed(1)) + "</b>" +
                                        cwbweather[j][3] + "</td>";
                                    break;
                                };
                            };
                        };
                        cwbdata[ww[i].stationId] = "<table class=KUOcwbpop><caption>" + ww[i].time.obsTime + "</caption>" + d.substr(5) +
                            "</tr></table>";
                        cwbatm.getSource().getSource().addFeature(new ol.Feature({
                            type: 'Point',
                            geometry: new ol.geom.Point(new ol.proj.transform([parseFloat(ww[i].lon), parseFloat(ww[i].lat)],
                                'EPSG:4326', 'EPSG:3857')),
                            sid: ww[i].stationId,
                            sn: ww[i].locationName,
                            si: 3
                        }));
                    };
                };
            });
        };
        document.getElementById('btairsea').checked = true;
        document.getElementById('btairsea').style.display = 'inline';
    } else {
        if (['btwind', 'btcloud', b ? 'btcwbatm' : 'btcwbsea'].every(function (i) {
                return !document.getElementById(i).checked
            })) {
            document.getElementById('btairsea').checked = false;
            document.getElementById('btairsea').style.display = 'none';
        };
        if (b) {
            cwb.setSource(new ol.source.Vector());
        } else {
            cwbatm.setSource(new ol.source.Cluster({
                distance: 25,
                source: new ol.source.Vector()
            }));
        };
    };
    if (b) {
        cwb.setVisible(a);
    } else {
        cwbatm.setVisible(a);
    };
}; //end of func toggleCWBdata
function toggleSubToggle(a) {
    if (document.getElementById(a).className.indexOf("sublswth") >= 0) {
        document.getElementById(a).parentElement.removeAttribute("onmouseout");
        document.getElementById(a).className = "KUOsubtoggle";
        document.getElementById(a).style.display = "block";
    } else {
        document.getElementById(a).parentElement.setAttribute("onmouseout", "document.getElementById('" + a + "').style.display='none'");
        document.getElementById(a).className = "KUOsubtoggle sublswth";
        document.getElementById(a).style.display = "none";
    };
    if (document.getElementsByClassName("sublswth").length < 2) {
        var i = document.querySelectorAll(".KUOsubtoggle:not(.sublswth)");
        toggleSubToggle((i[0].id == a) ? i[1].id : i[0].id);
    };
}; //end of func toggleSubToggle
function toggleOffAllctrbar() {
    if (document.getElementById('btgeoname').checked) {
        document.getElementById('btgeoname').click();
    };
    if (document.getElementById('btfreehand').checked) {
        document.getElementById('btfreehand').click();
    };
    document.getElementById('btctrbar').checked = false;
    document.getElementById('btctrbar').style.display = 'none';
}; //end of func toggleOffAllctrbar
function toggleOffAllairsea() {
    if (document.getElementById('btwind').checked) {
        document.getElementById('btwind').click();
    };
    if (document.getElementById('btcloud').checked) {
        document.getElementById('btcloud').click();
    };
    if (document.getElementById('btcwbsea').checked) {
        document.getElementById('btcwbsea').click();
    };
    if (document.getElementById('btcwbatm').checked) {
        document.getElementById('btcwbatm').click();
    };
    document.getElementById('btairsea').checked = false;
    document.getElementById('btairsea').style.display = 'none';
}; //end of func toggleOffAllairsea
function toggleFreehand(a) {
    if (a) {
        var k = Math.floor(Math.random() * 16);
        var s = [new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 5,
                color: '#000'
            })
        }), new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 3,
                color: '#' + clr[k]
            }),
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: '#' + clr[k]
                }),
                stroke: new ol.style.Stroke({
                    width: 2,
                    color: '#000'
                })
            })
        })];
        freehandvec = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: s,
            zIndex: 16,
            renderMode: 'image'
        });
        freehand = new ol.interaction.Draw({
            source: freehandvec.getSource(),
            freehand: true,
            type: 'LineString',
            style: s
        });
        map.addLayer(freehandvec);
        map.addInteraction(freehand);
        document.getElementById('btctrbar').checked = true;
        document.getElementById('btctrbar').style.display = 'inline';
    } else {
        map.removeInteraction(freehand);
        freehandvec.setSource(null);
        map.removeLayer(freehandvec);
        if (!document.getElementById('btgeoname').checked) {
            document.getElementById('btctrbar').checked = false;
            document.getElementById('btctrbar').style.display = 'none';
        };
    };
}; //end of func toggleFreehand
function dragoverimg(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}; //end of func dragoverimg
function dropoverimg(event) {
    event.stopPropagation();
    event.preventDefault();
    var f = event.dataTransfer.files[0],
        r = new FileReader();
    r.onload = function (e) {
        //    document.getElementById("dragdropimg").src=e.target.result; document.getElementById("dragdropdiv").style.display="block";
        //var a=new ol.layer.Image({source:new ol.source.ImageStatic({url:e.target.result,projection:'EPSG:3857',imageExtent:new ol.proj.transformExtent([101.25,0,135,40.98],'EPSG:4326','EPSG:3857'),crossOrigin:'anonymous'}),map:map,zIndex:10,opacity:0.8});
        var a = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: e.target.result,
                projection: 'EPSG:3857',
                imageExtent: imgextent,
                crossOrigin: 'anonymous'
            }),
            map: map,
            zIndex: 10,
            opacity: 1
        });
    };
    r.readAsDataURL(f);
}; //end of func dropoverimg
function dragovershp(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
}; //end of func dragovershp
function dropovershp(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var f = event.dataTransfer.files[0],
        r = new FileReader();
    r.onload = function (e) {
        if (iojsshp === 0) {
            $.getScript("/odbargo/static/js/shp.js", function () {
                iojsshp = 1;
                loadSHPfile(e);
            });
        } else {
            loadSHPfile(e);
        };
    };
    r.readAsArrayBuffer(f);
}; //end of func dropovershp
function loadSHPfile(e2) {
    shp(e2.target.result).then(function (ee) {
        if (ee.length) {
            for (var j = 0; j < ee.length; j++) {
                var vsr = new ol.source.Vector({
                    features: new ol.format.GeoJSON({
                        featureProjection: 'EPSG:3857',
                        dataProjection: 'EPSG:4326'
                    }).readFeatures(ee[j])
                });
                var ii = (map.getLayers().getArray().length).toString() + new Date().getSeconds().toString();
                map.addLayer(new ol.layer.Vector({
                    renderMode: 'image',
                    source: vsr,
                    style: styledragdropfun,
                    zIndex: 10,
                    name: "dgdp" + ii
                }));
                map.getView().fit(vsr.getExtent());
                var i = document.createElement("BUTTON");
                i.innerHTML = "&#10006;";
                i.id = "btdgdp" + ii;
                i.className = "btdgdp";
                i.title = ee[j].fileName;
                i.setAttribute("onclick", "closeDragDropLayer(" + ii + ")");
                document.getElementById("dragdropbtn").appendChild(i);
            };
        } else {
            var vsr = new ol.source.Vector({
                features: new ol.format.GeoJSON({
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                }).readFeatures(ee)
            });
            var ii = (map.getLayers().getArray().length).toString() + new Date().getSeconds().toString();
            map.addLayer(new ol.layer.Vector({
                renderMode: 'image',
                source: vsr,
                style: styledragdropfun,
                zIndex: 10,
                name: "dgdp" + ii
            }));
            map.getView().fit(vsr.getExtent());
            var i = document.createElement("BUTTON");
            i.innerHTML = "&#10006;";
            i.id = "btdgdp" + ii;
            i.className = "btdgdp";
            i.title = ee.fileName;
            i.setAttribute("onclick", "closeDragDropLayer(" + ii + ")");
            document.getElementById("dragdropbtn").appendChild(i);
        };
    });
}; //end of func loadSHPfile
function toggleExternalWMS(a, b) {
    if (a) {
        if (!document.getElementById("dtpicker").getAttribute('class')) {
            $("#dtpicker").flatpickr({
                enableTime: true,
                defaultDate: 'today',
                time_24hr: true,
                onYearChange: function (i, j, k) {
                    document.getElementById("dtpicker").value = k.currentYear.toString() + document.getElementById("dtpicker").value.substr(4);
                    document.getElementById("dtpicker")._flatpickr.setDate(document.getElementById("dtpicker").value.substr(0, 10), true);
                },
                onMonthChange: function (i, j, k) {
                    document.getElementById("dtpicker").value = k.currentYear.toString() + "-" +
                        ("0" + (k.currentMonth + 1).toString()).slice(0, 2) + document.getElementById("dtpicker").value.substr(8);
                    document.getElementById("dtpicker")._flatpickr.setDate(document.getElementById("dtpicker").value.substr(0, 10), true);
                },
                allowInput: true
            });
            extwms = new ol.layer.Tile({
                zIndex: 3
            });
            map.addLayer(extwms);
        };
        document.getElementById("dtpicker").style.display = 'block';
        if (wmsdemo > 0 && b != wmsdemo) {
            document.getElementById("btext" + wmsdemo).checked = false;
            extwms.setSource(null);
        };
        var i = document.getElementById("dtpicker").value;
        if (i.length > 9) {
            switch (b) {
                case 1:
                    extwms.setSource(new ol.source.XYZ({
                        url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/" + (((new Date().getTime() - new Date(i.substr(0, 10)).getTime()) / 3600000 < 48) ? "" : i.substr(0, 10)) + "/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png",
                        maxZoom: 7,
                        projection: new ol.proj.get('EPSG:3857'),
                        matrixSet: 'EPSG:3857',
                        tileSize: [256, 256],
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
                case 2:
                    extwms.setSource(new ol.source.XYZ({
                        url: "https://ops-podaac-tools.jpl.nasa.gov/onearth/wmts/jpl_l4_mur_ssta___ssta___36000_x_18000___daynight/default/" + i.substr(0, 10) + "/EPSG4326_1km/{z}/{y}/{x}.png",
                        projection: 'EPSG:4326',
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent: [-180, -90, 180, 90],
                            origin: [-180, 90],
                            resolutions: [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625],
                            tileSize: [512, 512]
                        }),
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
                case 3:
                    extwms.setSource(new ol.source.XYZ({
                        url: "https://gibs-c.earthdata.nasa.gov/wmts/epsg3857/all/wmts.cgi?TIME=" + i.substr(0, 10) + "&layer=MODIS_Aqua_Chlorophyll_A&style=default&tilematrixset=GoogleMapsCompatible_Level7&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
                        maxZoom: 7,
                        projection: new ol.proj.get('EPSG:3857'),
                        matrixSet: 'EPSG:3857',
                        tileSize: [256, 256],
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
                case 4:
                    extwms.setSource(new ol.source.XYZ({
                        url: 'https://gibs-c.earthdata.nasa.gov/wmts/epsg3857/all/wmts.cgi?TIME=' + i.substr(0, 10) + '&layer=MODIS_Aqua_CorrectedReflectance_TrueColor&style=default&tilematrixset=GoogleMapsCompatible_Level9&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}',
                        maxZoom: 19,
                        projection: new ol.proj.get('EPSG:3857'),
                        matrixSet: 'EPSG:3857',
                        tileSize: [256, 256],
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
                case 5:
                    extwms.setSource(new ol.source.XYZ({
                        url: "https://gibs-a.earthdata.nasa.gov/wmts/epsg4326/all/wmts.cgi?TIME=" + i.substr(0, 10) + "T" + i.substr(11, 5) + ":00Z&layer=Himawari_AHI_Band13_Clean_Infrared&style=default&tilematrixset=2km&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
                        maxZoom: 5,
                        projection: 'EPSG:4326',
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent: [-180, -90, 180, 90],
                            origin: [-180, 90],
                            resolutions: [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625],
                            tileSize: [512, 512]
                        }),
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
                case 6:
                    extwms.setSource(new ol.source.XYZ({
                        url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/himawari/{z}/{x}/{y}.tif?Time=" + i.replace(" ", "T") + ":00Z",
                        maxZoom: 14,
                        projection: new ol.proj.get('EPSG:3857'),
                        matrixSet: 'EPSG:3857',
                        tileSize: [256, 256],
                        wrapX: true,
                        crossOrigin: 'anonymous'
                    }));
                    break;
            };
            document.getElementById("btextwms").checked = true;
            document.getElementById("btextwms").style.display = "inline";
        };
        wmsdemo = b;
    } else {
        document.getElementById("btext" + wmsdemo).checked = false;
        document.getElementById("dtpicker").style.display = 'none';
        extwms.setSource(null);
        wmsdemo = 0;
        document.getElementById("btextwms").checked = false;
        document.getElementById("btextwms").style.display = "none";
    };
}; //end of func toggleExternalWMS
function toggleODBtopo(a, b) {
    if (a) {
        document.getElementById("btodbs").checked = true;
        odbtopo.setSource(new ol.source.XYZ({
            url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/" + b + "/{z}/{x}/{y}.tif",
            crossOrigin: 'anonymous'
        }));
        odbtopo.setOpacity(1 - document.getElementById("alphabartopo").value / 10);
        document.getElementById("colorbar2").innerHTML += '<img src="https://odbpo.oc.ntu.edu.tw/static/figs/odb/' + b + 'bar.png" ' +
            'class=KUO-colorbar-img2 id=' + b + '-bar>';
    } else {
        odbtopo.setSource(null);
        $("#" + b + "-bar").remove();
    };
}; //end of func toggleODBwms
function toggleODBsadcp(a) {
    odbadcp.setSource(null);
    if (a) {
        document.getElementById("btodbs").checked = true;
        //odbadcp.setSource(new ol.source.Vector({url:"http://app05.odb.ntu.edu.tw/sadcp15moa/Sadcp15moa_json.json",
        odbadcp.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/adcp_grid15moaUV.geojson",
            defaultDataProjection: "EPSG:4326",
            format: new ol.format.GeoJSON()
        }));
        odbadcp.setStyle([new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "#000",
                    width: 4
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(255,255,255,.5)",
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: "#9370db"
                })
            })
        ]);
    };
}; //end of func toggleODBsadcp
function toggleODBhydro(a) {
    odbhydro.setVisible(a);
    if (a) {
        document.getElementById("btodbs").checked = true;
        var ww = document.querySelector('input[name="hydrofig"]:checked').value;
        odbhydro.setSource(new ol.source.ImageStatic({
            //url:"http://app05.odb.ntu.edu.tw/sadcp15moa/"+ww.toLowerCase()+"_20m/"+ww+"_20[113,%2017.5,%20127,%2029].png",
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/hydro" + ww + "_20.png",
            projection: 'EPSG:3857',
            imageExtent: new ol.extent.applyTransform([113, 29, 127, 17.5],
                ol.proj.getTransform('EPSG:4326', 'EPSG:3857')),
            crossOrigin: 'anonymous'
        }));
        odbhydro.setOpacity(1 - document.getElementById("alphabarhydro").value / 10);
        document.getElementById("colorbar2").innerHTML += '<img src="https://odbpo.oc.ntu.edu.tw/static/figs/odb/hydro' +
            ww + '_20bar.png" class=KUO-colorbar-img2 id=hydro-bar>';
    } else {
        $("#hydro-bar").remove();
    };
}; //end of func toggleODBhydro
function toggleODBgravity(b, a) {
    if (a) {
        document.getElementById("btodbs").checked = true;
        if (b) {
            odbgravity.setSource(new ol.source.XYZ({
                url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/odb_gravitytrack/{z}/{x}/{y}.tif",
                crossOrigin: 'anonymous'
            }));
        } else {
            odbgravityfig.setSource(new ol.source.ImageStatic({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/gravity.png",
                projection: 'EPSG:3857',
                crossOrigin: 'anonymous',
                imageExtent: new ol.extent.applyTransform([117.5, 22.5, 122, 20.5],
                    ol.proj.getTransform('EPSG:4326', 'EPSG:3857'))
            }));
            odbgravityfig.setVisible(true);
        };
        if (document.getElementById("gravity-bar") == null) {
            document.getElementById("colorbar2").innerHTML += '<img src="https://odbpo.oc.ntu.edu.tw/static/figs/odb/gravitybar.png"' +
                ' class=KUO-colorbar-img2 id=gravity-bar>';
        };
    } else {
        if (b) {
            odbgravity.setSource(null);
        } else {
            odbgravityfig.setVisible(false);
        }
        if (document.getElementById("btngravity1").checked + document.getElementById("btngravity2").checked == 0) {
            $("#gravity-bar").remove();
        };
    };
}; //end of func toggleODBgravity
function toggleODBbio(a) {
    odbbio.setSource(null);
    if (a) {
        document.getElementById("btodbs").checked = true;
        odbbio.setSource(new ol.source.Vector({
            //url:"http://app09.odb.ntu.edu.tw/data/site_bio01.geojson",format:new ol.format.GeoJSON()}));
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/biosite.geojson",
            format: new ol.format.GeoJSON()
        }));
        /*var bioclr=["#E41A1C","#377EB8","#4DAF4A","#984EA3"];
        odbbio.setStyle(function(f){return[new ol.style.Style({image:new ol.style.Circle({radius:2,fill:new ol.style.Fill({
          color:bioclr[f.get('season')-1]})})})]});*/
        /*odbbio.setStyle(new ol.style.Style({image:new ol.style.Circle({radius:3,fill:new ol.style.Fill({color:"#82c8a0"}),
          stroke:new ol.style.Stroke({color:'#000',width:1})})}));*/
        odbbio.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: "rgba(130,200,160,0.5)"
                }),
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                })
            })
        }));
    };
}; //end of func toggleODBbio
function toggleODBchem(a) {
    if (a) {
        document.getElementById("btodbs").checked = true;
        /*odbchem.setSource(new ol.source.ImageStatic({url:"http://odbpo.oc.ntu.edu.tw/static/figs/odb/chem.png",
          projection:'EPSG:3857',imageExtent:new ol.extent.applyTransform([105,35,135,2],
            ol.proj.getTransform('EPSG:4326','EPSG:3857')),crossOrigin:'anonymous'}));*/
        odbchem.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/chem.kml",
            format: new ol.format.KML({
                showPointNames: false,
                writeStyles: false
            }),
            crossOrigin: 'anonymous'
        }));
        document.getElementById("colorbar2").innerHTML += '<img src="https://odbpo.oc.ntu.edu.tw/static/figs/odb/chembar.png"' +
            ' class=KUO-colorbar-img2 id=chem-bar>';
    } else {
        odbchem.setSource(null);
        $("#chem-bar").remove();
    };
}; //end of func toggleODBchem
function toggleODBsedcore(a) {
    if (a) {
        document.getElementById("btodbs").checked = true;
        odbsedcore.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/odb/sedcore.kml",
            format: new ol.format.KML({
                showPointNames: false,
                writeStyles: false
            }),
            crossOrigin: 'anonymous'
        }));
    } else {
        odbsedcore.setSource(null);
    };
}; //end of func toggleODBsedcore
function toggleODBship(a) {
    odbship.setSource(null);
    if (a) {
        document.getElementById("btodbs").checked = true;
        odbship.setSource(new ol.source.XYZ({
            url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/tiles/odb_shiptrack_new/{z}/{x}/{y}.tif",
            crossOrigin: 'anonymous'
        }));
        document.getElementById("colorbar2").innerHTML += '<img src="https://odbpo.oc.ntu.edu.tw/static/figs/odb/shiptrackbar.png"' +
            ' class=KUO-colorbar-img2 id=shiptrack-bar>';
    } else {
        $("#shiptrack-bar").remove();
    };
}; //end of func toggleODBship
function histshipchange(b, a) {
    if (b > 0) {
        var hs = document.getElementById("histshipyr");
        var c = hs.value;
        hs.options.length = 0;
        var o = document.createElement("option");
        o.value = "-1";
        o.innerHTML = "Year";
        hs.appendChild(o);
        if (histshiplist.length < 1) {
            $.getJSON("https://odbpo.oc.ntu.edu.tw/ais/getorshiplist", function (g) {
                histshiplist[0] = g[0].OR1;
                histshiplist[1] = g[0].OR2;
                histshiplist[2] = g[0].OR3;
                for (var i = 0; i < histshiplist[b - 1].length; i++) {
                    o = document.createElement("option");
                    o.value = histshiplist[b - 1][i];
                    o.innerHTML = histshiplist[b - 1][i];
                    hs.appendChild(o);
                };
                hs.value = a;
                toggleShipCr(true);
            });
        } else {
            for (var i = 0; i < histshiplist[b - 1].length; i++) {
                o = document.createElement("option");
                o.value = histshiplist[b - 1][i];
                o.innerHTML = histshiplist[b - 1][i];
                hs.appendChild(o);
            };
            if (a < 0 && histshiplist[b - 1].indexOf(parseInt(c)) >= 0) {
                hs.value = c;
                toggleShipCr(true);
            } else {
                hs.value = "-1";
                histship.setSource(null);
            }
        };
    } else {
        var hs = document.getElementById("histshipyr");
        hs.options.length = 0;
        var o = document.createElement("option");
        o.value = "-1";
        o.innerHTML = "Year";
        hs.appendChild(o);
        histship.setSource(null);
    };
}; //end of func histshipchange
function toggleShipCr(a) {
    if (a) {
        if (document.getElementById("histshipyr").value > 0 && document.getElementById("histshipor").value > 0) {
            document.getElementById("bthistship").checked = true;
            histship.setSource(new ol.source.Vector({
                url: "https://odbpo.oc.ntu.edu.tw/ais/getorship/" + document.getElementById("histshipor").value + "/" + document.getElementById("histshipyr").value + "/kml?ucode=" + document.cookie.split("odbsso=")[1].substr(0, 32),
                format: new ol.format.KML(),
                crossOrigin: "anonymous"
            }));
        } else {
            histship.setSource(null);
        };
    } else {
        histship.setSource(null);
    };
}; //end of func toggleShipCr
function cplanlayer() {
    if (!document.getElementById("btcplan").checked) {
        document.getElementById("btcplan").checked = true;
        if (cplan.length > 0) {
            cplan.map(function (i) {
                if (i != null) {
                    i.setVisible(true)
                }
            })
        };
    };
    var cname = document.getElementById('cplantxt' + icplan).value;
    var i = (icplan + 1).toString();
    var j = icplan.toString();
    var k = Math.floor(Math.random() * 16);
    ckeyset[icplan] = ckeyset[icplan] || [k, 1, 2, 2, 2];
    var a = $("#cplanckeylist option[value='" + cname + "']");
    if (a.index() >= 0) {
        document.getElementById('cplantxt' + j).maxLength = 31;
        a.remove();
    };
    var cplantemp = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: "https://odbwms.oc.ntu.edu.tw/odbintl/rasters/getcplan/?name=" + encodeURIComponent(cname),
            format: new ol.format.GeoJSON()
        }),
        zIndex: 15,
        renderMode: 'image'
    });
    cplan[icplan - 1] = cplantemp;
    changeCkeyStyle(icplan);
    map.addLayer(cplantemp);
    document.getElementById('cplanbtn' + j).className = 'cplanbtn cplanbtnx';
    document.getElementById('cplanbtn' + j).innerHTML = '&#10006;';
    document.getElementById('cplanbtn' + j).setAttribute('onclick', 'cplanremovelayer(' + j + ')');
    $('#cplantxt' + j).off('keyup mouseup');
    var iio = document.createElement('i');
    iio.className = "material-icons KUOfs-1vw KUOva-m KUOml-3px KUOc-p KUOckeytableio";
    iio.id = "ckeytableio" + j;
    document.getElementById('cplanli' + j).appendChild(iio);
    var iio2 = document.createElement('i');
    iio2.className = "material-icons KUOfs-1vw KUOva-m KUOml-3px KUOc-p";
    iio2.id = "ckeystyleset" + j;
    document.getElementById('cplanli' + j).appendChild(iio2);
    document.getElementById('cplantxt' + j).readOnly = true;
    $("#cplanol").append('<li id=cplanli' + i + '><input type=text id=cplantxt' + i +
        ' class=cplantxt maxlength=30 placeholder="Enter C-key" list="cplanckeylist" autocomplete="off"' +
        '><button type=button id=cplanbtn' + i + ' class="cplanbtn cplanbtno" onclick=cplanlayer()>&#10004;</button></li>');
    $("#cplantxt" + i).on('keyup', function (e) {
        chkcplanckeyinput(e);
    });
    cplantemp.once('change', function () {
        if (cplantemp.getSource() != null && cplantemp.getSource().getState() == 'ready') {
            if (typeof cplanworkitem === "undefined") {
                $.getJSON("https://odbwms.oc.ntu.edu.tw/odbintl/rasters/getWorkItem/", function (i) {
                    cplanworkitem = i;
                    buildCkeyCruise(parseInt(j), cplantemp);
                });
            } else {
                buildCkeyCruise(parseInt(j), cplantemp);
            };
        }
    });
    icplan = icplan + 1;
}; //end of func cplanlayer
function buildCkeyCruise(a, b) {
    document.getElementById("ckeytableio" + a).setAttribute("onclick", "closeCKeyTable(" + a + ")");
    document.getElementById("ckeytableio" + a).innerHTML = "grid_on";
    document.getElementById("ckeytableio" + a).className = document.getElementById("ckeytableio" + a).className.replace(" KUOclr-gray", "");
    document.getElementById("ckeystyleset" + a).setAttribute("onclick", "setCKeyStyle(" + a + ")");
    document.getElementById("ckeystyleset" + a).innerHTML = "settings";

    var ii = document.createElement('div');
    ii.id = "ckeycruise" + a;
    ii.className = "KUO-ckeycruise";
    ii.setAttribute('style', "left:" + Math.min((20 + a * 45), 440).toString() + "px;top:" + Math.min((50 + a * 45), 460).toString() + "px;");
    ii.setAttribute("onmouseup", "resizeCkeyTable(" + a + ",0);");
    var jj = "<div id=dragckeycruise" + a + " class=dragckeycruise style='background-color:#" + clr[ckeyset[a][0]] + "'><i class='material-icons KUOva-tt KUOrot-45deg KUOpl-4px'>zoom_out_map</i><span>&nbsp;" + document.getElementById("cplantxt" + a).value + "</span></div><button type=button class=btclose5 onclick=closeCKeyTable(" + a + ")>&#10006;</button>";
    ii.innerHTML = jj + "<table id=ckeytable" + a + " class='cell-border hover row-border stripe KUOf-l'><thead><tr><th>id</th><th style='padding:0'><i class='material-icons KUOva-m dtKUObg-w'>import_export</i></th><th>Name</th><th>Lon</th><th>Lat</th><th>Note</th></tr></thead><tbody id=cktable" + a + " onmouseleave='ck0.setStyle(null);'></tbody><div class=KUOdt-foot><button onclick=$('.buttons-copy[aria-controls=ckeytable" + a + "]').click()>Copy&nbsp;<i class='material-icons KUOva-m'>content_copy</i></button><button class=KUOml-5px onclick=$('.buttons-csv[aria-controls=ckeytable" + a + "]').click()>CSV&nbsp;<i class='material-icons KUOva-t'>save</i></button><button class=KUOml-5px onclick=document.getElementById('ckeystyleset" + a + "').click()>&nbsp;<i class='material-icons KUOva-t'>settings</i>&nbsp;</button></div></table>";
    document.body.appendChild(ii);
    dragfig(document.getElementById("ckeycruise" + a));
    var aa = '';
    var ib = -1;
    var ic = [0];
    for (var i = 0; i < b.getSource().getFeatures().length; i++) {
        if (b.getSource().getFeatures()[i].getGeometry().getType() === "Point") {
            var j = ol.proj.transform(b.getSource().getFeatures()[i].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            aa = aa + "<tr ckid=" + b.getSource().getFeatures()[i].get('id') + " onmouseenter='ck0.setStyle(null); ck0=cplan[" + (a - 1) + "].getSource().getFeatures()[" + i + "]; ck0.setStyle(cstyles);'><td>" + i + "</td><td style='background-color:#" + clr[ckeyset[a][0]] + "'></td><td>" + b.getSource().getFeatures()[i].get("name") + "</td><td>" + (j[0].toFixed(4)).toString() + "</td><td>" + (j[1].toFixed(4)).toString() + "</td><td style='margin:0;padding:0 10px'><ul style='font-size:16px;padding:0 0 0 14px;margin:0'></ul></td></tr>";
        } else if (b.getSource().getFeatures()[i].getGeometry().getType() === "LineString") {
            ib = i;
        };
    };

    document.getElementById("cktable" + a).innerHTML = aa;
    if (ib >= 0 && b.getSource().getFeatures()[ib].getKeys().indexOf("workitem") >= 0) {
        b.getSource().getFeatures()[ib].get("workitem").map(function (i, j) {
            var i2 = JSON.parse(i).item;
            var i3 = (i2[0] == "PT") ? "" : i2.map(function (i4) {
                return (i4 === "O") ? JSON.parse(i).other : cplanworkitem[i4][1]
            });
            if (i3.length > 0) {
                $("#cktable" + a + " tr[ckid=" + b.getSource().getFeatures()[ib].get("id")[j] + "] td:nth-child(6) ul").append(
                    "<li><div>" + i3.join(", ") + "</div></li>");
            };
        });
    } else {
        ic.push(5);
    };
    $("#ckeytable" + a).DataTable({
        /*bSort:false,*/
        scrollY: 350,
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        fixedColumns: {
            leftColumns: 1,
            rightColumns: 0
        },
        rowReorder: true,
        info: false,
        filter: false,
        "columnDefs": [{
            "targets": ic,
            "visible": false
        }, {
            "targets": [1, 2, 3, 4, 5],
            "orderable": /*false*/ true
        }],
        /*"order":[[0,"desc"]],*/
        dom: 'Bfrtip',
        buttons: ['columnsToggle',
            {
                extend: 'copy',
                exportOptions: {
                    columns: [':visible:not(:first-Child)']
                },
                fieldSeparator: ",",
                title: null /*b.getSource().getUrl().split("?name=")[1]*/ ,
                header: false
            },
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: [':visible:not(:first-Child)']
                },
                title: b.getSource().getUrl().split("?name=")[1]
            }
            //{extend:'pdfHtml5',title:b.getSource().getUrl().split("?name=")[1],exportOptions:{columns:[':visible:not([data-column-index="1"])']}}
        ] //,colResize:{exclude:[0,1]}
    });
    document.getElementById("ckeytable" + a).style.tableLayout = 'auto';
    $(".buttons-columnVisibility[aria-controls='ckeytable" + a + "']").attr("onclick", "resizeCkeyTable(" + a + ",1)");
    if (window.location.href.indexOf("ckeytabx=") > 0) {
        var i = (window.location.href.split("ckeytabx=")[1]).split("&")[0].split(",");
        if (!document.getElementById("ckeytableio" + a).hasAttribute("kuoinit") && i.length >= parseInt(a) && i[parseInt(a) - 1] === "1") {
            document.getElementById("ckeytableio" + a).setAttribute("kuoinit", 1);
            document.getElementById("ckeytableio" + a).click();
        };
    };
    $("#ckeytable" + a).DataTable().columns.adjust().fixedColumns().relayout();
}; //end of func buildCkeyCruise
function resizeCkeyTable(a, b) {
    if (b == 0) {
        document.getElementById("ckeytable" + a).parentElement.style.maxHeight = (document.getElementById("ckeycruise" + a).style.height.replace('px', '') - 150) + 'px';
        var i = (document.getElementById("ckeycruise" + a).style.width.replace('px', '') - 18) + 'px';
        document.getElementById("ckeytable" + a).style.width = i;
        $("#ckeycruise" + a + " .dataTables_scrollHeadInner,#ckeycruise" + a + " .dataTables_scrollHeadInner table").width(i);
    } else {
        $("#ckeycruise" + a).width($("#ckeytable" + a).width() + 18);
    };
}; //end of func resizeCkeyTable
function cplanremovelayer(jj) {
    if (document.getElementById("ckeystyleset" + jj).className.indexOf("KUOckeyset-hl") >= 0) {
        closeStylepanel();
    };
    if (document.getElementById("ckeycruise" + jj)) {
        closeCKeyTable(jj);
    };
    if (document.getElementById("cplantxt" + jj).maxLength > 30) {
        var o = document.createElement("option");
        o.value = document.getElementById("cplantxt" + jj).value;
        document.getElementById("cplanckeylist").appendChild(o);
    };
    $("#cplanli" + jj.toString()).remove();
    var cplantemp = cplan[jj - 1];
    cplantemp.setSource(null);
    cplan[jj - 1] = null;
}; //end of func cplanremovelayer
function chkcplanckeyinput(aa) {
    if (aa.currentTarget.value.length > 0) {
        var a = (aa.which || aa.keyCode);
        if (a == 13) {
            cplanlayer();
        } else if (a === undefined && $("#cplanckeylist option[value='" + aa.currentTarget.value + "']").index() >= 0) {
            cplanlayer();
        };
    };
}; //end of func chkcplanckeyinput
function updcplanckeylist(aa) {
    var ckeys = document.getElementById("cplanckeylist");
    ckeys.options.length = 0;
    ckeys.innerHTML = "";
    if (aa) {
        if (document.getElementById('acname').innerHTML.length > 3) {
            var ckon = document.getElementsByClassName('cplantxt');
            var ckexist = [];
            for (var i = 0; i < ckon.length - 1; i++) {
                ckexist[i] = ckon[i].value;
            };
            //if (ckon.index()>=0) {document.getElementById('cplantxt'+j).maxLength=31; a.remove();};
            $.getJSON("https://odbwms.oc.ntu.edu.tw/odbintl/rasters/getcPlanList/?ucode=" +
                document.cookie.split("odbsso=")[1].substr(0, 32),
                function (a) {
                    if (a.length > 0) {
                        for (var i = 0; i < a.length; i++) {
                            if (ckexist.indexOf(a[i].fields.name) < 0) {
                                var o = document.createElement("option");
                                o.value = a[i].fields.name;
                                ckeys.appendChild(o);
                            };
                        };
                    };
                });
        };
    };
    if (icplan == 1 && document.getElementById("cplantxt1").maxLength < 30) {
        $("#cplantxt1").on('keyup', function (e) {
            chkcplanckeyinput(e);
        });
        document.getElementById("cplantxt1").maxLength = 30;
    };
}; //end of func updcplanckeylist
function setCKeyStyle(a) {
    closeStylepanel();
    document.getElementById("ckeystyleset" + a).className += " KUOckeyset-hl";
    var sf = "<div id=dragstylepanel><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px KUOfs-1dot5'>zoom_out_map</i>&nbsp;<span class=KUOva-m id=stylepanelname>" + document.getElementById("cplantxt" + a).value + "</span></div><div id=stylepanel1 class=stylepaneln><span class='txt0 KUOfs-1dot8 KUOva-b'>Color</span><span class='txt1 KUOfs-2 KUOva-b KUOmr-dot2'>顏色</span>";
    for (var i = 0; i < clr.length; i++) {
        sf += "<i class='material-icons KUOml-5px' style=color:#" + clr[i] + " data-n=" + i + ">lens</i>";
    };
    sf = sf + "</div><div id=stylepanel2 class=stylepaneln><span class='txt0 KUOfs-1dot8 KUOva-b'>Shape</span><span class='txt1 KUOfs-2 KUOva-b KUOmr-dot2'>圖例</span><i class='material-icons KUOml-5px' data-h='0'>fiber_manual_record</i><i class='material-icons KUOml-5px KUOrot-270deg KUOva-b' data-h='1'>play_arrow</i><i class='material-icons KUOml-5px' data-h='2'>stop</i><i class='material-icons KUOml-5px' data-h='3'>star</i>";
    sf = sf + "</div><div id=stylepanel3 class=stylepaneln><span class='txt0 KUOfs-1dot8 KUOva-m KUOmr-dot5'>Radii</span><span class='txt1 KUOfs-2 KUOva-m KUOmr-dot2'>大小</span><i class='material-icons KUOfs-1dot2' data-f='0'>assistant</i><i class='material-icons KUOfs-1dot4' data-f='1'>assistant</i><i class='material-icons KUOfs-1dot6' data-f='2'>assistant</i><i class='material-icons KUOfs-1dot8' data-f='3'>assistant</i><i class='material-icons KUOfs-2' data-f='4'>assistant</i>";
    sf = sf + "</div><div id=stylepanel4 class=stylepaneln><span class='txt0 KUOfs-1dot8 KUOva-m'>Width</span><span class='txt1 KUOfs-2 KUOva-m KUOmr-dot2'>線寬</span><i class='material-icons KUOfs-1dot2' data-f='0'>remove</i><i class='material-icons KUOfs-1dot4' data-f='1'>drag_handle</i><i class='material-icons KUOfs-1dot6' data-f='2'>menu</i><i class='material-icons KUOfs-1dot8' data-f='3'>view_headline</i><i class='material-icons KUOfs-2' data-f='4'>format_align_justify</i>";
    sf = sf + "</div><div id=stylepanel5 class=stylepaneln><span class='txt0 KUOfs-1dot8 KUOva-m KUOmr-1vw'>Font</span><span class='txt1 KUOfs-2 KUOva-m KUOmr-dot2'>字型</span><i class='material-icons KUOfs-1dot2' data-f='0'>format_clear</i><i class='material-icons KUOfs-1dot4' data-f='1'>format_shapes</i><i class='material-icons KUOfs-1dot6' data-f='2'>format_shapes</i><i class='material-icons KUOfs-1dot8' data-f='3'>format_shapes</i><i class='material-icons KUOfs-2' data-f='4'>format_shapes</i>";
    sf = sf + "</div><button type=button class='btclose7' id=btclose7 onclick=closeStylepanel()>&#10006;</button>";
    $("#stylepanel").html(sf);
    dragfig(document.getElementById("stylepanel"));
    document.getElementById("stylepanel").style.display = "block";
    $("#stylepanel1 i:nth-of-type(" + (ckeyset[a][0] + 1) + ")").html("check_circle");
    $("#stylepanel2 i:nth-of-type(" + (ckeyset[a][1] + 1) + ")").css("opacity", "1");
    $("#stylepanel3 i:nth-of-type(" + (ckeyset[a][2] + 1) + ")").css("opacity", "1");
    $("#stylepanel4 i:nth-of-type(" + (ckeyset[a][3] + 1) + ")").css("opacity", "1");
    $("#stylepanel5 i:nth-of-type(" + (ckeyset[a][4] + 1) + ")").css("opacity", "1");
    $("#stylepanel1 i").on("click", function () {
        if (this.innerHTML === "lens") {
            var k = parseInt(this.dataset.n);
            $("#stylepanel1 i:nth-of-type(" + (ckeyset[a][0] + 1) + ")").html("lens");
            this.innerHTML = "check_circle";
            if (document.getElementById("ckeycruise" + a)) {
                document.getElementById("dragckeycruise" + a).style.backgroundColor = "#" + clr[k];
                $("#cktable" + a + " tr td:nth-of-type(1)").css("background-color", "#" + clr[k]);
            };
            ckeyset[a][0] = k;
            changeCkeyStyle(a);
        };
    });
    $("#stylepanel2 i").on("click", function () {
        if (this.style.opacity != "1") {
            var k = parseInt(this.dataset.h);
            $("#stylepanel2 i:nth-of-type(" + (ckeyset[a][1] + 1) + ")").removeAttr("style");
            this.style.opacity = "1";
            ckeyset[a][1] = k;
            changeCkeyStyle(a);
        };
    });
    $("#stylepanel3 i").on("click", function () {
        if (this.style.opacity != "1") {
            var k = parseInt(this.dataset.f);
            $("#stylepanel3 i:nth-of-type(" + (ckeyset[a][2] + 1) + ")").removeAttr("style");
            this.style.opacity = "1";
            ckeyset[a][2] = k;
            changeCkeyStyle(a);
        };
    });
    $("#stylepanel4 i").on("click", function () {
        if (this.style.opacity != "1") {
            var k = parseInt(this.dataset.f);
            $("#stylepanel4 i:nth-of-type(" + (ckeyset[a][3] + 1) + ")").removeAttr("style");
            this.style.opacity = "1";
            ckeyset[a][3] = k;
            changeCkeyStyle(a);
        };
    });
    $("#stylepanel5 i").on("click", function () {
        if (this.style.opacity != "1") {
            var k = parseInt(this.dataset.f);
            $("#stylepanel5 i:nth-of-type(" + (ckeyset[a][4] + 1) + ")").removeAttr("style");
            this.style.opacity = "1";
            ckeyset[a][4] = k;
            changeCkeyStyle(a);
        };
    });
}; //end of func setCKeyStyle
function changeCkeyStyleODB(a, bb) {
    cplan[a - 1].setStyle(function (feature) {
        var i, j, k0 = [1, 6, 10, 14, 19],
            k1 = [0, 3, 5, 9, 11];
        switch (ckeyset[a][1]) {
            case 0:
                i = new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: "#" + clr[ckeyset[a][0]]
                        }),
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
            case 1:
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 3,
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
            case 2:
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 4,
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        }),
                        angle: Math.PI / 4
                    })
                });
                break;
            case 3:
                var l = (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]];
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 5,
                        radius1: l * 1.5,
                        radius2: Math.max(l * 0.75 - 1, 0),
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
        };
        if (ckeyset[a][4] > 0) {
            j = new ol.style.Style({
                text: new ol.style.Text({
                    padding: [2, 2, 2, 2],
                    text: feature.get('name'),
                    font: (((mapzoom > 10) ? 16 : 8) + k0[ckeyset[a][4]]).toString() + 'px Arial,標楷體,sans-serif',
                    rotation: Math.PI * bb / 180,
                    fill: new ol.style.Fill({
                        color: '#' + clr[ckeyset[a][0]]
                    }),
                    offsetX: k1[ckeyset[a][2]],
                    offsetY: k1[ckeyset[a][2]] * -0.5,
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: ckeyset[a][4] / 2
                    }),
                    textBaseline: 'bottom',
                    textAlign: 'end'
                })
            });
        } else {
            j = new ol.style.Style();
        };
        return [i, j,
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: ckeyset[a][3] + 3
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#' + clr[ckeyset[a][0]],
                    width: ckeyset[a][3] + 1
                })
            })
        ];
    });
}; //end of func changeCkeyStyleODB
function changeCkeyStyle(a) {
    cplan[a - 1].setStyle(function (feature) {
        var i, j, k0 = [1, 6, 10, 14, 19],
            k1 = [0, 3, 5, 9, 11];
        switch (ckeyset[a][1]) {
            case 0:
                i = new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: "#" + clr[ckeyset[a][0]]
                        }),
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
            case 1:
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 3,
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
            case 2:
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 4,
                        radius: (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]],
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        }),
                        angle: Math.PI / 4
                    })
                });
                break;
            case 3:
                var l = (feature.get('inLine') == 0) ? ((feature.get('name') == '') ? 0 : k1[ckeyset[a][2]]) : k0[ckeyset[a][2]];
                i = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: '#' + clr[ckeyset[a][0]]
                        }),
                        points: 5,
                        radius1: l * 1.5,
                        radius2: Math.max(l * 0.75 - 1, 0),
                        stroke: new ol.style.Stroke({
                            color: '#000',
                            width: ckeyset[a][2] / 2
                        })
                    })
                });
                break;
        };
        if (ckeyset[a][4] > 0) {
            j = new ol.style.Style({
                text: new ol.style.Text({
                    padding: [2, 2, 2, 2],
                    text: feature.get('name'),
                    font: (((mapzoom > 10) ? 16 : 8) + k0[ckeyset[a][4]]).toString() + 'px Arial,標楷體,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#' + clr[ckeyset[a][0]]
                    }),
                    offsetX: k1[ckeyset[a][2]],
                    offsetY: k1[ckeyset[a][2]] * -0.5,
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: ckeyset[a][4] / 2
                    }),
                    textBaseline: 'bottom',
                    textAlign: 'end'
                })
            });
        } else {
            j = new ol.style.Style();
        };
        return [i, j,
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#000',
                    width: ckeyset[a][3] + 3
                })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#' + clr[ckeyset[a][0]],
                    width: ckeyset[a][3] + 1
                })
            })
        ];
    });
}; //end of func changeCkeyStyle
function toggleDrawzseg(a) {
    if (a) {
        document.getElementById("draw").scrollIntoView(true);
        var segdrawsrc = segdraw.getSource();
        zseg = new ol.interaction.Draw({
            source: segdrawsrc,
            type: 'LineString',
            style: [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#FFF',
                    width: 3
                }),
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    radius1: 8,
                    radius2: 1,
                    stroke: new ol.style.Stroke({
                        color: '#F8F',
                        width: 2
                    }),
                    points: 4
                })
            })],
            maxPoints: 2,
            minPoints: 1,
            condition: function (e) {
                if (e.originalEvent.buttons != 1) {
                    return false;
                } else {
                    return true;
                }
            }
        });
        moddraw = new ol.interaction.Modify({
            source: segdrawsrc
        });
        map.addInteraction(zseg);
        map.addInteraction(moddraw);
        zseg.on('drawstart', function (evt) {
            document.getElementById("drawmsg").style.visibility = "hidden";
            document.getElementById("drawbtnexport").style.display = "none";
            moddraw.features_.clear();
            moddraw.setActive(false);
            var xy = ol.proj.transform(evt.feature.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
            document.getElementById('drawp1x').value = xy[0].toFixed(5);
            document.getElementById('drawp1y').value = xy[1].toFixed(5);
            segdraw.setSource(null);
        });
        zseg.on('drawend', function (evt) {
            document.getElementById("drawbtnexport").style.display = "block";
            var xy0 = [evt.feature.getGeometry().getFirstCoordinate(), evt.feature.getGeometry().getLastCoordinate()];
            moddraw.setActive(true);
            var xy = ol.proj.transform(evt.feature.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
            document.getElementById('drawp2x').value = xy[0].toFixed(5);
            document.getElementById('drawp2y').value = xy[1].toFixed(5);
            segdraw.setSource(segdrawsrc);
            segdrawsrc.refresh();
            segdraw.getSource().addFeature(new ol.Feature({
                type: 'Point',
                geometry: new ol.geom.Point(xy0[0]),
                pn: 'P1'
            }))
            segdraw.getSource().addFeature(new ol.Feature({
                type: 'Point',
                geometry: new ol.geom.Point(xy0[1]),
                pn: 'P2'
            }))
            var f3 = new ol.Feature();
            f3.setProperties({
                type: 'Point',
                geometry: null
            });
            f3.setId(3);
            var d = ol.sphere.getDistance(ol.proj.transform(xy0[0], 'EPSG:3857', 'EPSG:4326'), xy) / 1000;
            segdraw.once('change', function () {
                var f = segdraw.getSource().getFeatures();
                for (var i = f.length - 1; i >= 0; i--) {
                    if (f[i].get('type') != 'Point') {
                        segdraw.getSource().getFeatures()[i].setProperties({
                            pn: Math.round(d) + " km"
                        });
                        segdraw.getSource().getFeatures()[i].setId(2);
                        segdraw.getSource().addFeature(f3);
                        break;
                    };
                };
                document.getElementById('btdrawsegfig').disabled = false;
                if (document.getElementById('segfig').style.visibility != 'hidden') {
                    drawSegfig();
                } else {
                    savesegcsv(false, null);
                };
            });
        });
        moddraw.on('modifystart', function (evt) {
            document.getElementById("drawmsg").style.visibility = "hidden";
            if (segdraw.getSource() == null) {
                return
            };
            segdraw.getSource().getFeatureById(3).setProperties({
                geometry: null
            });
        });
        moddraw.on('modifyend', function (evt) {
            if (segdraw.getSource() == null) {
                return
            };
            var f = segdraw.getSource().getFeatureById(2);
            var d = 0;
            var j = f.getGeometry().getCoordinates();
            j[0] = ol.proj.transform(j[0], 'EPSG:3857', 'EPSG:4326');
            for (var i = 1; i < j.length; i++) {
                j[i] = ol.proj.transform(j[i], 'EPSG:3857', 'EPSG:4326');
                d += ol.sphere.getDistance(j[i - 1], j[i])
            }
            f.setProperties({
                pn: Math.round(d / 1000) + ' km'
            });
            var j = [ol.proj.transform(f.getGeometry().getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326'),
                ol.proj.transform(f.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326')
            ];
            document.getElementById('drawp1x').value = j[0][0].toFixed(5);
            document.getElementById('drawp1y').value = j[0][1].toFixed(5);
            document.getElementById('drawp2x').value = j[1][0].toFixed(5);
            document.getElementById('drawp2y').value = j[1][1].toFixed(5);
            document.getElementById("btdrawsegfig").disabled = false;
            if (document.getElementById('segfig').style.visibility != 'hidden') {
                drawSegfig();
            } else {
                savesegcsv(false, null);
            };
        });
    } else {
        map.removeInteraction(zseg);
        map.removeInteraction(moddraw);
        //segdraw.setSource(null);
        segdraw.getSource().refresh();
        document.getElementById('drawp1x').value = '';
        document.getElementById('drawp1y').value = '';
        document.getElementById('drawp2x').value = '';
        document.getElementById('drawp2y').value = '';
        document.getElementById('btdrawsegfig').disabled = true;
        document.getElementById("drawmsg").style.visibility = "hidden";
        document.getElementById("drawbtnexport").style.display = "none";
        closeSegfig();
    };
}; //end of func toggleDrawzseg
function modDrawzseg() {
    if (!document.getElementById("btdraw").checked) {
        document.getElementById("btdraw").checked = true;
        toggleDrawzseg(true);
    };
    document.getElementById("drawmsg").style.visibility = "hidden";
    document.getElementById("drawbtnexport").style.display = "none";
    var xy = [
            [document.getElementById('drawp1x').value, document.getElementById('drawp1y').value],
            [document.getElementById('drawp2x').value, document.getElementById('drawp2y').value]
        ],
        xy4326 = new Array(2);
    if (xy[1][1].length > 0 && xy[1][0].length > 0 && xy[0][1].length > 0 && xy[0][0].length > 0) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                var ii = xy[i][j].split('d');
                ii = (ii.length > 1) ? [ii[0], ii[1].split('s')[0], (ii[1].split('s').length > 1) ? ii[1].split('s')[1] : "0"] : [ii[0], "0", "0"];
                xy[i][j] = parseFloat(ii[0]) + parseFloat(ii[1]) / 60 + parseFloat(ii[2]) / 3600;
                if (ii[1] + ii[2] > 0) {
                    document.getElementById('drawp' + (i + 1) + ((j > 0) ? 'y' : 'x')).value = xy[i][j].toFixed(5);
                }
            };
            xy4326[i] = xy[i];
            xy[i] = ol.proj.transform(xy[i], 'EPSG:4326', 'EPSG:3857');
        };
        document.getElementById("drawbtnexport").style.display = "block";
        var s = segdraw.getSource();
        if (s != null) {
            s.refresh();
        };
        var ii = new ol.geom.LineString(xy);
        var f = new ol.Feature();
        f.setProperties({
            type: 'LineString',
            geometry: ii,
            pn: Math.round(ol.sphere.getDistance(xy4326[0], xy4326[1]) / 1000) + ' km'
        });
        f.setId(2);
        s.addFeature(f);
        s.addFeature(new ol.Feature({
            type: 'Point',
            geometry: new ol.geom.Point(xy[0]),
            pn: 'P1'
        }));
        s.addFeature(new ol.Feature({
            type: 'Point',
            geometry: new ol.geom.Point(xy[1]),
            pn: 'P2'
        }));
        var f3 = new ol.Feature();
        f3.setProperties({
            type: 'Point'
        });
        f3.setId(3);
        s.addFeature(f3);
        document.getElementById("btdrawsegfig").disabled = false;
        segdraw.setSource(s);
        if (document.getElementById('segfig').style.visibility != 'hidden') {
            drawSegfig();
        } else {
            savesegcsv(false, null);
        };
    };
}; //end of func modDrawzseg
function drawSegfig() {
    document.getElementById("segfig").style.visibility = "visible";
    document.getElementById("drawbtnexport").style.display = "block";
    document.getElementById("draw").scrollIntoView(true);
    if (segdraw.getSource() == null || segdraw.getSource().getFeatureById(2) == null) {
        return
    };
    var s = segdraw.getSource(),
        f2 = s.getFeatureById(2).getGeometry(),
        f3 = s.getFeatureById(3);
    if (!ol.extent.containsExtent(imgextent, f2.getExtent())) {
        document.getElementById("drawmsg").style.visibility = "visible";
        closeSegfig();
        document.getElementById('segfig').style.visibility = "visible";
        savesegcsv(false, null);
        return;
    };
    var xy = f2.getCoordinates();
    for (var i in xy) {
        var j = ol.proj.transform(xy[i], 'EPSG:3857', 'EPSG:4326');
        xy[i] = [j[0].toFixed(5), j[1].toFixed(5)];
    };
    var zsegurl = (xy.length > 2) ? "/grd/seaclim/zsegtrack/json/?line=" +
        (('(' + xy.join(';') + ')').replace(/,/g, ' ')).replace(/;/g, ',') : "/grd/seaclim/zseg/" +
        xy[0][0] + "," + xy[0][1] + "," + xy[1][0] + "," + xy[1][1] + "/json";
    var sf = "<div id=dragsegfig><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;P1&nbsp;&#8674;&nbsp;P2&nbsp;&nbsp;(<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span>)</div><canvas id=segchart></canvas><button type=button class='btclose3' id=btclose3 onclick=closeSegfig()>&#10006;</button><button type=button class='material-icons KUOclr-draw KUOfs-2 KUOc-p btpntseg' onclick='savesegfig();'>get_app</button>";
    $('#segfig').html(sf);
    document.getElementById("segfig").onmouseleave = function () {
        f3.setProperties({
            geometry: null
        })
    };
    document.getElementById("segfig").style.display = "block";
    dragfig(document.getElementById("segfig"));
    $.getJSON(zsegurl, function (g) {
        var zn = g[0].z.length - 1;
        Chart.defaults.LineWithLine = Chart.defaults.line;
        Chart.controllers.LineWithLine = Chart.controllers.line.extend({
            draw: function (ease) {
                Chart.controllers.line.prototype.draw.call(this, ease);
                if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                    var activePoint = this.chart.tooltip._active[0],
                        ctx = this.chart.ctx,
                        x = activePoint.tooltipPosition().x,
                        topY = this.chart.scales['y-axis-0'].top,
                        bottomY = this.chart.scales['y-axis-0'].bottom;
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#000';
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
        var segchart = new Chart('segchart', {
            type: 'LineWithLine',
            data: {
                labels: g[0].d,
                datasets: [{
                    data: g[0].z,
                    backgroundColor: '#666',
                    borderColor: '#000',
                    pointRadius: 0,
                    fill: 'start'
                }]
            },
            options: {
                legend: {
                    display: false
                },
                //title:{display:true,position:'bottom',fontSize:20,fontColor:'#000',text:'Distance (km)'},
                tooltips: {
                    bodyFontSize: 16,
                    bodyFontColor: '#faf',
                    intersect: false,
                    displayColors: false,
                    titleFontSize: 16,
                    xPadding: 0,
                    yPadding: 5,
                    bodySpacing: 0,
                    mode: 'index',
                    axis: 'x',
                    filter: function (l) {
                        if (l.index > 0 && l.index < zn) {
                            return true;
                        } else {
                            f3.setProperties({
                                geometry: null
                            });
                            return false;
                        }
                    },
                    callbacks: {
                        label: function (l) {
                            f3.setProperties({
                                geometry: new ol.geom.Point(f2.getCoordinateAt(l.index / zn))
                            });
                            return [" X: " + g[0].x[l.index] + "\u00B0E", " Y: " + g[0].y[l.index] + "\u00B0N", " Z: " + g[0].z[l.index] + " m "];
                        },
                        title: function (l) {
                            return (l.length > 0) ? " " + g[0].d[l[0].index] + " km" : null;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            autoSkipPadding: 10,
                            maxRotation: 0,
                            fontColor: '#000',
                            fontSize: 16,
                            min: 0
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Distance (km)',
                            fontColor: "#000",
                            fontSize: 20,
                            fontStyle: 'bold'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            autoSkip: true,
                            fontColor: '#000',
                            fontSize: 16
                        },
                        gridLines: {
                            zeroLineColor: "#888",
                            zeroLineWidth: 2,
                            zeroLineBorderDash: [10, 3]
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Depth (m)',
                            fontColor: '#000',
                            fontSize: 20,
                            fontStyle: 'bold'
                        }
                    }]
                },
                maintainAspectRatio: false,
                spanGaps: false,
                elements: {
                    line: {
                        tension: 0.5
                    },
                    point: {
                        hoverRadius: 10
                    }
                }
            }
        });
        savesegcsv(true, g[0]);
    });
}; //end of func drawSegfig
function savesegcsv(ioz, ia) {
    $("#btdrawcsv").off("click");
    $("#btdrawcsv").click(function () {
        var segcsv = "Lon,Lat" + ((ioz) ? ",dist(km),depth(m)\n" : "\n");
        if (ioz) {
            for (var i = 0; i < ia.x.length; i++) {
                segcsv = segcsv + ia.x[i] + "," + ia.y[i] + "," + ia.d[i] + "," + ia.z[i] + "\n";
            };
        } else {
            var j = segdraw.getSource().getFeatureById(2).getGeometry().getCoordinates();
            for (var i = 0; i < j.length; i++) {
                var jj = ol.proj.transform(j[i], "EPSG:3857", "EPSG:4326");
                segcsv = segcsv + (jj[0]).toFixed(6) + "," + (jj[1]).toFixed(6) + "\n";
            };
        };
        var fn = "Hidy_" + ((ioz) ? "zseg" : "seg") + "_" + $("#drawp1x").val().replace(".", "E") + "_" + $("#drawp1y").val().replace(".", "N") + "_" + $("#drawp2x").val().replace(".", "E") + "_" + $("#drawp2y").val().replace(".", "N") + ".csv";
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(Blob([segcsv], {
                type: 'text/csv;charset=utf-8;'
            }), fn);
        } else {
            segcsv = "data:text/csv;charset=utf-8," + segcsv;
            if (document.getElementById("templinkseg") === null) {
                var b = document.createElement("a");
                b.id = "templinkseg";
                document.body.appendChild(b);
            } else {
                b = document.getElementById("templinkseg");
            };
            b.href = encodeURI(segcsv);
            b.download = fn;
            b.click();
        };
    });
}; //end of savesegcsv
function copysegtrack() {
    var segcsv = "";
    var j = segdraw.getSource().getFeatureById(2).getGeometry().getCoordinates();
    for (var i = 0; i < j.length; i++) {
        var jj = ol.proj.transform(j[i], "EPSG:3857", "EPSG:4326");
        segcsv = segcsv + (jj[0]).toFixed(6) + "," + (jj[1]).toFixed(6) + "\n";
    };
    var tempseg = document.createElement("textarea");
    tempseg.id = "tempsegxy";
    document.body.appendChild(tempseg);
    document.getElementById("tempsegxy").value = segcsv;
    tempseg.select();
    document.execCommand("copy");
    document.body.removeChild(tempseg);
}; //end of func copysegtrack
function dragfig(e) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    if (mobile) {
        var de = document.getElementById("drag" + e.id)
        de.addEventListener("touchmove", function (ee) {
            var touch = ee.targetTouches[0];
            //e.style.left=touch.pageX+"px"; e.style.top=touch.pageY+"px";
            e.style.left = touch.pageX - touch.radiusX + "px";
            e.style.top = touch.pageY + touch.radiusY + "px";
            ee.preventDefault();
        }, false);
    } else {
        if (document.getElementById("drag" + e.id)) {
            document.getElementById("drag" + e.id).onmousedown = dragfigmd;
        } else {
            e.onmousedown = dragfigmd;
        };

        function dragfigmd(ee) {
            ee = ee || window.event;
            pos3 = ee.clientX;
            pos4 = ee.clientY;
            document.onmouseup = dragfigdone;
            document.onmousemove = dragfigelm;
            if (document.getElementsByClassName("KUOz-11")[0]) {
                var i = document.getElementsByClassName("KUOz-11")[0];
                document.getElementById(i.id).className = document.getElementById(i.id).className.replace(" KUOz-11", "");
            };
            document.getElementById(e.id).className = document.getElementById(e.id).className + " KUOz-11";
        };

        function dragfigelm(ee) {
            ee = ee || window.event;
            pos1 = pos3 - ee.clientX;
            pos2 = pos4 - ee.clientY;
            pos3 = ee.clientX;
            pos4 = ee.clientY;
            e.style.top = (e.offsetTop - pos2) + "px";
            e.style.left = (e.offsetLeft - pos1) + "px";
        };

        function dragfigdone() {
            document.onmouseup = null;
            document.onmousemove = null;
        };
    };
}; //end of func dragfig
function toggleArgo(a) {
    argotraj.setSource(null);
    if (document.getElementById("abc").dataset.kuoplt == 1) {
        closeABC();
    };
    if (a) {
        argo.setSource(new ol.source.Vector({
            //url:"/odbargo/get/argosvp/"+da1+"/"+da2+"/99,2,135,35/geojson"+((document.getElementById("btbioargo").checked)?"?notft=1":""),format: new ol.format.GeoJSON()}));
            url: "/odbargo/get/argosvp/" + da1 + "/" + da2 + "/" + ((document.getElementById("btbioargo").checked) ? "geojson?notft=1" : "99,2,135,35/geojson"),
            format: new ol.format.GeoJSON()
        }));
        //    url:"/odbargo/get/argosvp/"+da1+"/"+da2+"/geojson"+((document.getElementById("btbioargo").checked)?"?notft=1":""),format: new ol.format.GeoJSON()}));
    } else {
        argo.setSource(null);
    };
}; //end of func toggleArgo
function toggleSvp(a) {
    if (document.getElementById("abc").dataset.kuoplt == 2) {
        closeABC();
    };
    if (a) {
        svp.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/svp/drifter/trajgeojson/?tim1=" + da3,
            format: new ol.format.GeoJSON()
        }));
    } else {
        svp.setSource(null);
    };
}; //end of func toggleSvp
function toggle_odbs(a) {
    var i = ['tide'];
    if (!a) {
        closeTidefig();
    }; /*if(document.getElementById("btmodel").checked){document.getElementById("btmodel").click();};*/
    for (var ii in i) {
        document.getElementById('bt' + i[ii]).disabled = !a;
        document.getElementById(i[ii] + 'expandbtn').disabled = !a;
        document.getElementById(i[ii]).style.opacity = a ? 1 : 0.5;
        document.getElementById(i[ii]).onmouseover = null;
        document.getElementById(i[ii]).onmousout = null;
        document.getElementById(i[ii] + 'expandbtn').className = a ? "chkexp" : "KUOd-n";
        if (!a) {
            document.getElementById('div' + i[ii] + 'block').style.display = 'none';
            document.getElementById(i[ii] + 'expandbtn').checked = false;
            document.getElementById('bt' + i[ii]).checked = false;
            document.getElementById(i[ii]).onmouseover = function () {
                document.getElementById("greeting").style.maxHeight = "12vw";
            };
            document.getElementById(i[ii]).onmouseout = function () {
                document.getElementById("greeting").removeAttribute("style");
            };
        };
    };
}; //end of toggle_odbs
function toggleGlider(a) {
    if (document.getElementById("abc").dataset.kuoplt == 3) {
        closeABC();
    };
    if (a) {
        if (Object.keys(sglist).length < 3) {
            $.getJSON('https://odbgo.oc.ntu.edu.tw/glider/getgliderlist/', function (g) {
                document.getElementById('sgmod').options.length = 0;
                document.getElementById('sgcrmod').options.length = 0;
                for (var i = 0; i < g.sg.length; i++) {
                    sglist[g.sg[i][0]] = g.sg[i].slice(1, g.sg[i].length).reverse();
                    var o = document.createElement("option");
                    o.value = g.sg[i][0];
                    o.innerHTML = g.sg[i][0];
                    document.getElementById("sgmod").appendChild(o);
                };
                document.getElementById("sgmod").value = g.latest;
                for (var i = 0; i < sglist[g.latest].length; i++) {
                    var o = document.createElement("option");
                    o.value = sglist[g.latest][i];
                    o.innerHTML = ('000' + sglist[g.latest][i].toString()).substr(-4);
                    document.getElementById("sgcrmod").appendChild(o);
                };
                document.getElementById("sgcrmod").value = sglist[g.latest][0];
                glider.setSource(new ol.source.Vector({
                    url: "/glider/gettraj/" + g.latest + "/" + sglist[g.latest][0] + "/geojson?ucode=" +
                        document.cookie.split("odbsso=")[1].substr(0, 32),
                    format: new ol.format.GeoJSON()
                }));
            });
        } else {
            glider.setSource(new ol.source.Vector({
                url: "/glider/gettraj/" + document.getElementById('sgmod').value + "/" +
                    document.getElementById('sgcrmod').value + "/geojson?ucode=" + document.cookie.split("odbsso=")[1].substr(0, 32),
                format: new ol.format.GeoJSON()
            }));
        };
    } else {
        glider.setSource(null);
        closeContourfig();
    };
    toggleGliderKMLlayer(document.getElementById('btgliderkml').checked);
}; //end of func toggleGlider
function toggleGliderKMLlayer(a) {
    gliderkml.setSource(null);
    document.getElementById("btgliderkml").checked = a;
    if (a) {
        gliderkml.setSource(new ol.source.Vector({
            url: "https://odbgo.oc.ntu.edu.tw/glider/getgliderkml/" +
                document.getElementById('sgmod').value + "/" + document.getElementById('sgcrmod').value + "/kml?ucode=" +
                document.cookie.split("odbsso=")[1].substr(0, 32) + "&time=" + (new Date()).getTime(),
            crossOrigin: 'anonymous',
            format: new ol.format.KML({
                showPointNames: true,
                writeStyles: false,
                extractStyles: true
            })
        }));
    };
}; //end of func toggleGliderKMLlayer
function drawContourfig() {
    if (document.getElementById("btglider").checked == false) {
        closeContourfig();
        document.getElementById("contourfig").style.display = "block";
        document.getElementById('btglider').checked = true;
        toggleGlider(true);
        return;
    };
    var sf = "<div id=dragcontourfig" + " data-sgcr=" + document.getElementById('sgmod').value + "," + document.getElementById('sgcrmod').value + "><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span></div><div id=contourchart></div><button type=button class=btclose4 id=btclose4 onclick=closeContourfig()>&#10006;</button><button type=button class='material-icons KUOclr-glider KUOfs-1dot5 KUOc-p btpntcontour' onclick='savecontourfig();'>get_app</button><button type=button class='material-icons KUOclr-glider KUOfs-1dot5 KUOc-p btpntcontour' style='left:53px' id='btglidertransrev' onclick=glidertransrev(this.dataset.revio,true) data-revio=0>swap_horiz</button>";
    $('#contourfig').html(sf);
    document.getElementById("contourfig").style.display = "block";
    dragfig(document.getElementById("contourfig"));

    glidertraj.setSource(null);
    var ga = new Array();
    var gp = new ol.layer.Vector({
        zIndex: 14,
        map: map,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 9,
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#66f9ff',
                    width: 2
                })
            })
        })
    });

    $.getJSON("/glider/getsglatest/" + document.getElementById('sgmod').value + "/" + document.getElementById('sgcrmod').value + "/json", function (sglatest) {

        var cn = document.getElementById('sgcontourmod').value;
        switch (cn) {
            case "temp":
                var clim = [4, 28, 0.5],
                    ctick = [4, 10, 16, 22, 28],
                    u = "\u2103";
                var c = d3.scaleLinear().domain(ctick).range(['#00F', '#0FF', '#FF0', '#F00', '#800']).interpolate(d3.interpolateHcl);
                break;
            case "salt":
                var clim = [34, 35, 0.05],
                    ctick = [34, 34.2, 34.4, 34.6, 34.8, 35],
                    u = "psu";
                //var c = d3.scaleSequential(d3.interpolateRdYlBu).domain([clim[1],clim[0]]);
                //var c = d3.scaleSequential(d3.interpolateViridis).domain([clim[0],clim[1]]);
                var c = d3.scaleSequential(d3.interpolateCubehelixDefault).domain([clim[0], clim[1]]);
                break;
            case "dens":
                var clim = [1022, 1028, 0.25],
                    ctick = [1028, 1026, 1024, 1022],
                    u = "kg/\u33a5";
                var c = d3.scaleSequential(d3.interpolateRainbow).domain([clim[0], clim[1]]);
                break;
            case "oxyg":
                var clim = [60, 240, 5],
                    ctick = [60, 96, 132, 168, 204, 240],
                    u = "\u03bcM";
                var c = d3.scaleLinear().domain(ctick).range(['#C0F', '#06F', '#0F6', '#CF0', '#F00', '#800']).interpolate(d3.interpolateHcl);
                break;
        };
        var figtrans = document.getElementById("contourchart");
        var m = [10, 30, 50, 50];
        var w = figtrans.clientWidth - m[3] - m[1] - 50;
        var h = figtrans.clientHeight - m[0] - m[2];
        var dw = sglatest.dnum / 100;
        var tp = d3.select(figtrans).append("div").attr("class", "contourtlp").style("display", "none");
        var lx = d3.select(figtrans).append("div").attr("class", "contourlnx").style("display", "none")
            .style("height", h + "px").style("top", m[0] + "px").style("left", "0px");
        var dc = (clim[1] - clim[0]) / clim[2];
        var sx = d3.scaleLinear().domain([0, 100]).range([0, w]).nice();
        var sy = d3.scaleLinear().domain([-1000, 0]).range([h, 0]).nice();
        var xis = d3.axisBottom(sx).tickFormat(function (d) {
            return sglatest.d0[d];
        }).tickSizeOuter(0);
        var yis = d3.axisLeft(sy).tickSizeOuter(0);

        var s = d3.select(figtrans).append("svg").attr("viewBox", "0 0 " + figtrans.clientWidth + " " + figtrans.clientHeight)
            .append("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        var gx = s.append("g").attr("class", "contouraxis").attr("transform", "translate(0," + h + ")").call(xis);
        var gy = s.append("g").attr("class", "contouraxis").attr("transform", "translate(0,0)").call(yis);

        s.append("g").attr("class", "contouraxis").call(d3.axisTop(sx).ticks(0).tickSizeOuter(0));
        s.append("g").attr("class", "contouraxis").attr("transform", "translate(" + w + ",0)").call(d3.axisRight(sy).ticks(0).tickSizeOuter(0));

        s.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("x", 1).attr("y", 1).attr("width", w - 1).attr("height", h - 1);
        s.append("text").attr("class", "contouraxistext").attr("x", (w - m[3]) / 2).attr("y", h + m[0] + m[2] / 2).text("Dive");
        var s1 = s.append("g").attr("clip-path", "url(#clip)");

        d3.json("/glider/getcontour/" + document.getElementById('sgmod').value + "/" + document.getElementById('sgcrmod').value + "/json?ucode=" + document.cookie.split("odbsso=")[1].substr(0, 32) + "&dive0=" + sglatest.d0[0] + "&dive1=" + sglatest.dive + "&varn=" + cn).then(function (v) {
            if (cn == 'oxyg') {
                if (document.getElementById("sgmod").value == "648") {
                    if (parseInt(document.getElementById("sgcrmod").value) == 2) {
                        for (var i = 0; i < v.z.length; i++) {
                            v.z[i] = v.z[i] * 1.0954 + 10.289;
                        };
                    } else {
                        for (var i = 0; i < v.z.length; i++) {
                            v.z[i] = v.z[i] * 1.0624 + 11.805;
                        };
                    };
                };
                //KUO 20190519
                //        if (document.getElementById("sgmod").value=="628") {for(var i=0;i<v.z.length;i++){v.z[i]=v.z[i]*1.1524+6.8641;};};
                if (document.getElementById("sgmod").value == "628") {
                    if (parseInt(document.getElementById("sgcrmod").value) == 7) {
                        for (var i = 0; i < v.z.length; i++) {
                            v.z[i] = v.z[i] * 0.9934 + 7.7484;
                        };
                    } else {
                        for (var i = 0; i < v.z.length; i++) {
                            v.z[i] = v.z[i] * 1.1524 + 6.8641;
                        };
                    };
                };
            };
            var g = glider.getSource().getFeatures();
            for (var i = 0; i < g.length; i++) {
                ga[sglatest.d0.indexOf(g[i].get('gliderdive'))] = g[i].getGeometry().getCoordinates();
            };
            ga.filter(function (i) {
                if (i[0] != null) {
                    return i
                }
            });
            glidertraj.setSource(new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.LineString(ga.slice(0, 100))
                })]
            }));

            s1.selectAll("path")
                .data(d3.contours().size([v.x.length, v.y.length]).smooth(true).thresholds(d3.range(clim[0], clim[1], clim[2]))(v.z))
                .enter().append("path").attr("d", d3.geoPath(d3.geoIdentity()).projection(d3.geoTransform({
                    point: function (x, y) {
                        return this.stream.point(x / 100 * w, y / 100 * h);
                    }
                }))).attr("fill", function (d) {
                    return c(d.value);
                })
                .style("stroke", "black").style("stroke-width", 0.4).style("cursor", "cell")
                .on("mouseover", function () {
                    tp.style("display", "block");
                    lx.style("display", "block");
                })
                .on("mousemove", function (d) {
                    d3.select(this).style("stroke-width", 2);
                    var i = d3.mouse(this),
                        j = xis.scale().domain();
                    lx.style("left", (parseInt(document.getElementById("btglidertransrev").dataset.revio) == 1) ? Math.round(document.getElementById("contourchart").clientWidth - i[0] - m[3] - m[1] + 2) + "px" : (Math.round(i[0] + m[3]) - 1) + "px");
                    tp.html((Math.round(d.value * 100) / 100) + " " + u + "<br>Dive: " + v.x[Math.max(0, Math.floor(i[0] / w * (j[1] - j[0]) + j[0]) - 1)])
                        .style("left", (parseInt(document.getElementById("btglidertransrev").dataset.revio) == 1) ? Math.round(document.getElementById("contourchart").clientWidth - i[0] - 100 + m[3]) + "px" : (Math.round(i[0] + 100)) + "px").style("top", (i[1] + 10) + "px");
                    gp.setSource(new ol.source.Vector({
                        features: [new ol.Feature({
                            geometry: new ol.geom.Point(ga[Math.max(0, Math.floor(i[0] / w * (j[1] - j[0]) + j[0]) - 1)])
                        })]
                    }));
                }).on("mouseout", function () {
                    d3.select(this).style("stroke-width", 0.4);
                    tp.style("display", "none");
                    lx.style("display", "none");
                    gp.setSource(null);
                });
        });

        var z = d3.zoom().scaleExtent([1.0 / dw, 8]).translateExtent([
                [0, 0],
                [(w + m[3] + m[1] + 50) * dw, h + m[2] + m[0]]
            ])
            .wheelDelta(function () {
                return -d3.event.deltaY * 0.001 * ((d3.event.deltaMode) ? 100 : 1);
            }).on("zoom", function () {
                var t = d3.event.transform;
                var k = t.k;
                if (t.k < 1) {
                    t.y = 0;
                    k = 1;
                } else {
                    gy.call(yis.scale(t.rescaleY(sy)));
                };
                s1.selectAll("path").attr("d", d3.geoPath(d3.geoIdentity()).projection(d3.geoTransform({
                    point: function (x, y) {
                        return this.stream.point(x / 100 * w * t.k + t.x, y / 100 * h * k + t.y);
                    }
                })));
                gx.call(xis.scale(t.rescaleX(sx)));
            }).on("end", function () {
                var i = xis.scale().domain();
                glidertraj.setSource(new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.LineString(ga.slice(Math.max(0, Math.floor(i[0])), Math.min(ga.length, Math.ceil(i[1]))))
                    })]
                }));
                if (parseInt(document.getElementById("btglidertransrev").dataset.revio) == 1) {
                    glidertransrev(1, false);
                };
            });

        //s.call(z).on("dblclick.zoom",function(){drawContourfig();});
        s.call(z).on("dblclick.zoom", null);

        s.append("g").attr("transform", "translate(" + (w + 25) + ",5)").call(d3.axisRight(d3.scaleLinear().domain([clim[1], clim[0]])
                .range([40, h - 6]).nice()).tickValues(ctick).tickSizeOuter(0).tickFormat(d3.format("")))
            .style("font-size", "16px").style("font-family", "Arial");
        s.selectAll(".contourscale").data(d3.range(clim[0], clim[1], clim[2])).enter().append("rect")
            .attr("x", w + 10).attr("width", 15).attr("y", function (d, i) {
                return h - (h - 46) * (i + 1) / dc;
            }).attr("height", (h - 46) / dc)
            .attr("fill", function (d) {
                return c(d);
            }).style("stroke", "black").style("stroke-width", 0.5)
        s.append("text").attr("x", w + 10).attr("y", 25).text(u).style("font-size", "24px")
            .style("font-family", "Arial");

    });
}; //end of func drawContourfig
function glidertransrev(a, iodorev) {
    if (iodorev) {
        if (parseInt(a) == 0) {
            $('#contourchart svg .contouraxistext+g').attr('style', 'transform:rotateY(180deg) translate(-' + (parseInt($("#contourchart svg").attr("viewBox").split(" ")[2]) - 130).toString() + 'px,0)');
        } else {
            $('#contourchart svg .contouraxistext+g').removeAttr('style');
        };
        document.getElementById("btglidertransrev").dataset.revio = 1 - parseInt(a);
    };
    var ax = $("#contourchart svg g g.contouraxis:first g.tick");
    var ib = new Array(ax.length);
    for (var i = 0; i < ax.length; i++) {
        ib[i] = ax[i].getAttribute("transform").split("translate(")[1].split(",")[0];
    }
    for (var i = 0; i < ax.length; i++) {
        ax[i].setAttribute("transform", "translate(" + ib[ax.length - i - 1] + ",0)");
    }
}; //end of func glidertransrev
function toggleDrawtide(a) {
    if (a) {
        document.getElementById("tide").scrollIntoView(true);
        var tidesrc = new ol.source.Vector();
        tidept = new ol.interaction.Draw({
            source: tidesrc,
            type: 'Point',
            style: new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({
                        color: '#ADFF2F'
                    }),
                    radius: 8,
                    stroke: new ol.style.Stroke({
                        color: '#73BF2F',
                        width: 2
                    }),
                    points: 4,
                    angle: Math.PI / 4
                })
            }),
            maxPoints: 1
            //condition:function(e){if(e.originalEvent.buttons!=1) {return false;} else {return true;}}
        });
        modtide = new ol.interaction.Modify({
            source: tidesrc
        });
        map.addInteraction(tidept);
        map.addInteraction(modtide);
        tidept.on('drawend', function (evt) {
            //modtide.setActive(false);
            var xy = ol.proj.transform(evt.feature.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
            document.getElementById('tidep0x').value = xy[0].toFixed(5);
            document.getElementById('tidep0y').value = xy[1].toFixed(5);
            //modtide.setActive(true);
            tidedraw.setSource(tidesrc);
            tidesrc.refresh();
            tidedraw.once('change', function () {
                if (iojshighchart === 0) {
                    $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                        iojshighchart = 1;
                        drawTidefig();
                    });
                } else {
                    drawTidefig();
                };
            });
            tidept.setActive(false);
        });
        modtide.on('modifystart', function (evt) {
            //document.getElementById("tidemsg").style.visibility="hidden"; 
        });
        modtide.on('modifyend', function (evt) {
            if (tidedraw.getSource().getFeatures().length < 1) {
                return
            };
            var xy = ol.proj.transform(tidedraw.getSource().getFeatures()[0].getGeometry().getLastCoordinate(),
                'EPSG:3857', 'EPSG:4326');
            document.getElementById('tidep0x').value = xy[0].toFixed(5);
            document.getElementById('tidep0y').value = xy[1].toFixed(5);
            if (iojshighchart === 0) {
                $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                    iojshighchart = 1;
                    drawTidefig();
                });
            } else {
                drawTidefig();
            };
        });
    } else {
        map.removeInteraction(tidept);
        map.removeInteraction(tidedraw);
        if (tidedraw.getSource().getFeatures().length > 0) {
            tidedraw.getSource().removeFeature(tidedraw.getSource().getFeatures()[0]);
        };
        document.getElementById('tidep0x').value = '';
        document.getElementById('tidep0y').value = '';
        closeTidefig();
    };
}; //end of func toggleDrawtide
function modDrawtide() {
    if (!document.getElementById("bttide").checked) {
        document.getElementById("bttide").click();
    };
    var xy = [document.getElementById('tidep0x').value, document.getElementById('tidep0y').value];
    if (xy[0].length > 0 && xy[1].length > 0) {
        for (var i = 0; i < 2; i++) {
            var ii = xy[i].split('d');
            ii = (ii.length > 1) ? [ii[0], ii[1].split('s')[0], (ii[1].split('s').length > 1) ? ii[1].split('s')[1] : "0"] : [ii[0], "0", "0"];
            xy[i] = parseFloat(ii[0]) + parseFloat(ii[1]) / 60 + parseFloat(ii[2]) / 3600;
            if (ii[1] + ii[2] > 0) {
                document.getElementById('tidep0' + ((i > 0) ? 'y' : 'x')).value = xy[i].toFixed(5);
            };
        };
        xy = ol.proj.transform(xy, 'EPSG:4326', 'EPSG:3857');
        var s = new ol.source.Vector();
        s.addFeature(new ol.Feature({
            type: 'Point',
            geometry: new ol.geom.Point(xy)
        }));
        tidedraw.setSource(s);
        if (tidept.getActive) {
            document.getElementById("bttide").checked = true;
            modtide = new ol.interaction.Modify({
                source: tidedraw.getSource()
            });
            tidept.setActive(false);
            map.addInteraction(modtide);
            modtide.on('modifyend', function (evt) {
                if (tidedraw.getSource() == null) {
                    return
                };
                var i = ol.proj.transform(tidedraw.getSource().getFeatures()[0].getGeometry().getLastCoordinate(),
                    'EPSG:3857', 'EPSG:4326');
                document.getElementById('tidep0x').value = i[0].toFixed(5);
                document.getElementById('tidep0y').value = i[1].toFixed(5);
                drawTidefig();
            });
        };
        if (iojshighchart === 0) {
            $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                iojshighchart = 1;
                drawTidefig();
            });
        } else {
            drawTidefig();
        };
    };
}; //end of func modDrawtide
function drawTidefig() {
    if (da7 <= da6) {
        if (da7 < da6) {
            return
        } else {
            if (parseInt($("#tidehr2").val()) <= parseInt($("#tidehr1").val())) {
                return
            }
        }
    };
    if (tidedraw.getSource().getFeatures().length < 1) {
        return
    };
    tidept.setActive(false);
    var s = tidedraw.getSource().getFeatures()[0];
    if (!ol.extent.containsCoordinate(imgextent, s.getGeometry().getCoordinates())) {
        document.getElementById("tide").scrollIntoView(true);
        var i = document.getElementById('tidefig');
        while (i.firstChild) {
            i.removeChild(i.firstChild);
        }
        i.style.display = 'none';
        document.getElementById('bttidecsv').disabled = true;
        document.getElementById('bttidetid').disabled = true;
        document.getElementById('btpnttide').disabled = true;
        tidedraw.getStyle().getText().setText((document.getElementById("infolangen").checked) ? "Out of range!" : "超出範圍！");
        tidedraw.changed();
        return;
    };
    var xy = ol.proj.transform(s.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
    var tideurl = "https://odbpo.oc.ntu.edu.tw/clim/tidexy/" + xy[0].toString() + "," + xy[1].toString() + "/json";
    var sf = "<div id=dragtidefig><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;P0&nbsp;&nbsp;(<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span>)</div><div id=tidechart></div><button type=button class='btclose6' id=btclose6 onclick=closeTidefig()>&#10006;</button><button type=button class='material-icons KUOclr-tide KUOfs-2 KUOc-p btpnttide' onclick=savetidefig() title='PNG'>get_app</button><div id=tiderose></div>";
    $('#tidefig').html(sf);
    tidedraw.getStyle().getText().setText("P0");
    tidedraw.changed();
    document.getElementById("tidefig").style.display = "block";
    dragfig(document.getElementById("tidefig"));
    //var tref=new Date(); tref.setUTCFullYear(1992,0,1); tref.setUTCHours(0,0,0,0);
    var tref = 192840; // tide ref hr
    var t0 = new Date();
    t0.setUTCFullYear(da6.slice(0, 4), da6.slice(4, 6) - 1, da6.slice(-2));
    t0.setUTCHours(document.getElementById("tidehr1").value, 0, 0, 0);
    var t1 = new Date();
    t1.setUTCFullYear(da7.slice(0, 4), da7.slice(4, 6) - 1, da7.slice(-2));
    t1.setUTCHours(document.getElementById("tidehr2").value, 0, 0, 0);
    var dt = ((t1 - t0) / 36e5 > 720) ? (((t1 - t0) / 36e5 > 4320) ? 6 : 3) : 1;
    var tzone = (document.getElementById("tidetmz").checked) ? 8 * 36e5 : 0;

    //Highcharts.setOptions({colors:["#d9ef8b","#90cf60","#4caf50","#ffc107","#ff5722","#FF0800"]});
    var aclr = ["#d9ef8b", "#90cf60", "#4caf50", "#ffc107", "#ff5722", "#FF0800"];
    $.getJSON(tideurl, function (g) {
        var ntide = g.length - 1;
        var nt = parseInt(((t1 - t0) / 36e5 + 1) / dt);
        var t = new Array(nt);
        var vec = new Array(nt),
            hel = new Array(nt),
            k = 0,
            mh = 0,
            mv = 0;
        var ros = new Array(6);
        for (var i = 0; i < ros.length; i++) {
            ros[i] = {
                data: new Array(16),
                legendIndex: i,
                name: (i * 20).toString() + "-" + (i * 20 + 20).toString() + " cm/s",
                states: {
                    inactive: {
                        opacity: 0.6
                    }
                },
                color: aclr[i]
            };
            for (var j = 0; j < 16; j++) {
                ros[i].data[j] = [j * 22.5, 0];
            };
        };
        ros[ros.length - 1].name = "> 100 cm/s";
        ros[1].legendIndex = 2;
        ros[2].legendIndex = 4;
        ros[3].legendIndex = 1;
        ros[4].legendIndex = 3;
        var drn = (document.getElementById("infolangen").checked) ? ['N', '', 'NE', '', 'E', '', 'SE', '', 'S', '', 'SW', '', 'W', '', 'NW', ''] : ['北', '', '東北', '', '東', '', '東南', '', '南', '', '西南', '', '西', '', '西北', '', '北'];
        var tagtide = (document.getElementById("infolangen").checked) ? ['Elevation', 'Current', 'Spd', 'Dir', 'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', "(cm)", "(cm/s)"] : ['潮位', '潮流', '流速', '流向', '北', '北北東', '東北', '東北東', '東', '東南東', '東南', '南南東', '南', '南南西', '西南', '西南西', '西', '西北西', '西北', '北北西', '北', "[公分]", "[公分/秒]"];
        for (var i = parseInt((t0 - tzone) / 36e5 - tref); i <= parseInt((t1 - tzone) / 36e5 - tref); i += dt) {
            var h = 0.0,
                u = 0.0,
                v = 0.0;
            t[k] = (i + tref) * 36e5 + tzone;
            for (var j = 0; j <= ntide; j++) {
                h += g[j].ha * Math.cos(g[j].freq * i - g[j].hp + g[j].ph) * 100;
                u += g[j].ua * Math.cos(g[j].freq * i - g[j].up + g[j].ph);
                v += g[j].va * Math.cos(g[j].freq * i - g[j].vp + g[j].ph);
            };
            var j = Math.atan(u / v) * 180 / Math.PI;
            j = (v < 0) ? ((u < 0) ? j : j + 360) : j + 180;
            var jj = parseInt(Math.sqrt(u * u + v * v));
            vec[k] = [t[k], 0, jj, Math.round(j)];
            hel[k] = [t[k], parseInt(h), parseInt(u), parseInt(v)];
            ros[Math.min(5, Math.floor(jj / 25))].data[Math.ceil(j / 22.5 + 8) % 16][1] += 1;
            mh = Math.max(Math.abs(h), mh);
            mv = Math.max(jj, mv);
            k = k + 1;
        };
        mh = Math.ceil(mh / 10) * 10;
        mv = Math.ceil(mv / 10) * 10;
        Highcharts.chart('tidechart', {
            chart: {
                zoomType: 'x',
                margin: [30, 60, 50, 60],
                spacing: [1, 1, 1, 1],
                height: $("#tidefig").height() - 36,
                alignTicks: false,
                plotBackgroundColor: "#edffdd",
                plotBorderColor: "#333",
                plotBorderWidth: 2,
                backgroundColor: "#eee",
                type: 'line',
                borderColor: "#000",
                borderWidth: 1
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'left',
                x: 65,
                y: 0,
                verticalAlign: 'top',
                floating: true,
                itemStyle: {
                    color: "#000",
                    fontWeight: 'bold',
                    fontSize: '16px',
                    fontFamily: 'Arial,"微軟正黑體"',
                    textDecoration: 'none'
                },
                itemHiddenStyle: {
                    color: "#888",
                    textDecoration: 'line-through'
                },
                itemDistance: 20
            },
            title: {
                text: da6.slice(0, 4) + "-" + da6.slice(4, 6) + "-" + da6.slice(6, 8) + " " + document.getElementById("tidehr1").value + ":00 ~ " + da7.slice(0, 4) + "-" + da7.slice(4, 6) + "-" + da7.slice(6, 8) + " " + document.getElementById("tidehr2").value + ":00  (GMT+0" + (document.getElementById("tidetmz").checked ? "8" : "0") + ") @ " + parseInt(xy[0]) + "\u00B0" + ("00" + ((xy[0] % 1) * 60).toFixed(2)).slice(-5) + "'E , " + parseInt(xy[1]) + "\u00B0" + ("00" + ((xy[1] % 1) * 60).toFixed(2)).slice(-5) + "'N",
                align: 'right',
                verticalAlign: 'top',
                x: -70,
                y: 20,
                margin: 0,
                floating: true,
                style: {
                    fontSize: "12px",
                    fontFamily: 'Arial,serif',
                    color: '#000'
                },
                widthAdjust: -240
            },
            tooltip: {
                borderRadius: 5,
                shared: true,
                split: true,
                shadow: true,
                borderWidth: 2,
                backgroundColor: "#fff",
                borderColor: "#888",
                outside: true,
                hideDelay: 50,
                useHTML: true,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Arial,"微軟正黑體"'
                },
                formatter: function () {
                    var i = Math.round((this.x - t0) / 36e5 / dt);
                    return ['<b>' + Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.x)) + '</b>',
                        tagtide[0] + ':<b>' + this.y + ' cm  </b><br>' + tagtide[2] + ':<b>' + vec[i][2] + ' cm/s</b><br>' + tagtide[3] + ':<b>' + tagtide[Math.floor(((vec[i][3] + 180) % 360) / 22.5) + 4] + '</b><small>&nbsp;' + (vec[i][3] + 180) % 360 + '&deg;</small><br>(u,v):(<b>' + hel[i][2] + '</b>,<b>' + hel[i][3] + '</b>)'
                    ];
                },
                xDateFormat: '%Y-%m-%d %H:%M',
                headerFormat: '<span style="font-size:16px;font-weight:bold">{point.key}</span>'
            },
            xAxis: {
                type: 'datetime',
                offset: 0,
                crosshair: {
                    snap: false,
                    width: 5,
                    color: "rgba(0,0,0,0.5)"
                },
                min: t[0],
                max: t[nt - 1],
                gridLineWidth: 0.5,
                gridLineColor: "rgba(0,0,0,0.5)",
                minorGridLineWidth: 0.2,
                minorGridLineColor: "rgba(0,0,0,0.5)",
                minorTickInterval: 'auto',
                dateTimeLabelFormats: {
                    hour: '%H:%M',
                    day: '<b>%d</b><br><b>%b</b>',
                    month: '%b<br>%Y'
                },
                labels: {
                    style: {
                        fontSize: '14px',
                        color: "#000",
                        fontFamily: 'Arial',
                        fontWeight: 'bold'
                    }
                },
                title: {
                    text: null
                },
                tickLength: 3,
                tickWidth: 2
            },
            yAxis: [{
                    crosshair: false,
                    min: -mh,
                    max: mh,
                    tickAmount: 9,
                    plotLines: [{
                        color: "#888",
                        width: 3,
                        value: 0
                    }],
                    title: {
                        text: tagtide[21],
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Arial,微軟正黑體'
                        },
                        rotation: 0,
                        align: 'high',
                        offset: 0,
                        y: -9
                    },
                    labels: {
                        style: {
                            fontSize: '12px',
                            color: "#000",
                            fontFamily: 'Arial'
                        },
                        x: -6
                    }
                },
                {
                    crosshair: false,
                    min: -mv,
                    max: mv,
                    tickAmount: 9,
                    opposite: true,
                    gridLineWidth: 0,
                    title: {
                        text: tagtide[22],
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Arial,微軟正黑體'
                        },
                        rotation: 0,
                        align: 'high',
                        offset: 0,
                        y: -9
                    },
                    labels: {
                        style: {
                            fontSize: '12px',
                            color: "#000",
                            fontFamily: 'Arial'
                        },
                        x: 6
                    },
                    marker: {
                        enabled: false
                    }
                }
            ],
            plotOptions: {
                series: {
                    pointStart: t[0],
                    pointInterval: 36e5 * dt,
                    shadow: true,
                    marker: {
                        enabled: (nt > 100) ? false : true
                    }
                }
            },
            background2: "#E0E0E8",
            series: [{
                    type: 'vector',
                    data: vec,
                    name: tagtide[1],
                    shadow: true,
                    vectorLength: 100,
                    enableMouseTracking: false,
                    rotationOrigin: 'start',
                    color: "#000",
                    lineWidth: (nt > 74) ? 1 : 2,
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    },
                    yAxis: 1,
                    legendIndex: 2
                },
                {
                    type: 'line',
                    data: hel,
                    name: tagtide[0],
                    shadow: true,
                    keys: ['x', 'y', 'u', 'v'],
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    },
                    color: "#00F",
                    negativeColor: "#F00",
                    legendIndex: 1
                }
            ]
        });
        var a = $("g.highcharts-axis-labels.highcharts-yaxis-labels")[0].getElementsByTagName("text");
        for (var i = 0; i < 4; i++) {
            a[i].style.fill = "#f00";
            a[8 - i].style.fill = "#00f";
        };

        Highcharts.chart("tiderose", {
            chart: {
                polar: true,
                type: 'column',
                backgroundColor: "rgba(0,0,0,0.8)",
                marginTop: 70
            },
            pane: {
                size: '80%',
                background: [{
                    backgroundColor: "rgba(44,44,0,0.8)"
                }]
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'top',
                floating: true,
                itemDistance: 5,
                /*useHTML:true,
                          labelFormatter:function(){return '<span style=color:'+this.color+'><b>'+this.name+'</b></span>';},*/
                labelFormatter: function () {
                    return '<text style="fill:' + this.color + '">' + this.name + '</text>';
                },
                itemStyle: {
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    textDecoration: 'none'
                },
                itemHiddenStyle: {
                    textDecoration: 'line-through'
                },
                itemHoverStyle: {
                    brightness: 1.2
                }
            },
            xAxis: {
                type: "",
                tickmarkPlacement: 'on',
                labels: {
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Arial,"微軟正黑體"',
                        color: "#fff",
                        padding: 0
                    },
                    formatter: function () {
                        return drn[this.value / 22.5]
                    }
                },
                gridLineColor: "#aaa",
                gridLineWidth: 0.5,
                title: {
                    text: null
                },
                tickLength: 0,
                min: 0,
                max: 360,
                tickInterval: 22.5,
                distance: 0,
                padding: 0,
                reserveSpace: false
            },
            yAxis: {
                min: 0,
                endOnTick: false,
                gridLineColor: "#fff",
                gridLineWidth: 0.6,
                title: {
                    text: null
                },
                reversedStacks: false,
                minorTicks: true,
                minorGridLineWidth: 0.2
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    groupPadding: 0,
                    pointPlacement: 'on',
                    borderColor: "#000",
                    borderWidth: 1,
                    shadow: true,
                    reserveSpace: true
                }
            },
            series: ros
        });

        document.getElementById('bttidecsv').disabled = false;
        document.getElementById('bttidetid').disabled = false;
        document.getElementById('btpnttide').disabled = false;
        $("#bttidecsv").off("click");
        $("#bttidetid").off("click");
        $("#bttidecsv").click(function () {
            var tidecsv = "";
            tidecsv = tidecsv + "Date,GMT+" + ((tzone == 0) ? "0" : "8") + ",el(cm),u(cm/s),v(cm/s)\n";
            for (var i = 0; i < nt; i++) {
                var j = Highcharts.dateFormat('%Y/%m/%d,%H', new Date(hel[i][0]));
                tidecsv = tidecsv + j + "," + (hel[i][1]).toString() + "," + (hel[i][2]).toString() + "," + (hel[i][3]).toString() + "\n";
            };
            var fn = "Hidy_tide_" + da6 + document.getElementById("tidehr1").value + "to" + da7 + document.getElementById("tidehr2").value + "_" + (document.getElementById("tidep0x").value).toString().replace(".", "E") + "_" + (document.getElementById("tidep0y").value).toString().replace(".", "N") + ".csv";
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(Blob([tidecsv], {
                    type: 'text/csv;charset=utf-8;'
                }), fn);
            } else {
                tidecsv = "data:text/csv;charset=utf-8," + tidecsv;
                if (document.getElementById("templinktide") === null) {
                    var b = document.createElement("a");
                    b.id = "templinktide";
                    document.body.appendChild(b);
                } else {
                    b = document.getElementById("templinktide");
                };
                b.href = encodeURI(tidecsv);
                b.download = fn;
                b.click();
            };
        });
        $("#bttidetid").click(function () {
            var tidetid = "--------\n";
            for (var i = 0; i < nt; i++) {
                var j = Highcharts.dateFormat('%Y/%m/%d %H:00:00.000', new Date(hel[i][0]));
                tidetid = tidetid + j + "  " + ((hel[i][1] / 100).toPrecision(3)).toString() + "\n";
            };
            var fn = "Hidy_tide_" + da6 + document.getElementById("tidehr1").value + "to" + da7 + document.getElementById("tidehr2").value + "_" + (document.getElementById("tidep0x").value).toString().replace(".", "E") + "_" + (document.getElementById("tidep0y").value).toString().replace(".", "N") + ".tid";
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(Blob([tidetid], {
                    type: 'text/csv;charset=utf-8;'
                }), fn);
            } else {
                tidetid = "data:text/csv;charset=utf-8," + tidetid;
                if (document.getElementById("templinktide") === null) {
                    var b = document.createElement("a");
                    b.id = "templinktide";
                    document.body.appendChild(b);
                } else {
                    b = document.getElementById("templinktide");
                };
                b.href = encodeURI(tidetid);
                b.download = fn;
                b.click();
            };
        });
    });
}; //end of func drawTidefig
function drawClimfig() {
    var j = document.getElementById("meanfieldvar").value;
    var l = [document.getElementById("climtsfig").style.display, document.getElementById("climpzfig").style.display, document.getElementById("climsectzfig").style.display];
    var m = [document.getElementById("mfgridtab1").dataset.mf, document.getElementById("mfgridtab2").dataset.mf];
    var n = [document.getElementById("mfxytab1").dataset.mf, document.getElementById("mfxytab2").dataset.mf];
    document.getElementById("btmeanfield").checked = true;
    document.getElementById('meanfield').scrollIntoView(true);
    if (document.getElementById("btclimts").checked) {
        if (climxymap.getVisible()) {
            toggleClimXYmap(false);
        };
        if (climgrid.getVisible()) {
            toggleClimGrid(false);
        };
        var i = parseInt(document.getElementById("divmfgrid").dataset.mf);
        if (i > 0 && !climpoly.getVisible()) {
            toggleClimPoly(true);
        };
        if (i > 0 && document.getElementById("mfarea" + (i + 2) + "x").value && document.getElementById("mfarea" + (i + 2) + "y").value) {
            var k = document.getElementById("mfarea" + (i + 2) + "x").value + "," + document.getElementById("mfarea" + (i + 2) + "y").value;
            switch (i) {
                case 1:
                    if (l[0] == 'none' || j + "," + k + "," + document.getElementById("mfarea3z").value != m[0]) {
                        if (iojshighchart === 0) {
                            $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                                iojshighchart = 1;
                                drawClimTimes();
                            });
                        } else {
                            drawClimTimes();
                        };
                    };
                    k = document.getElementById("mfarea3x").value + "," + document.getElementById("mfarea3y").value;
                    document.getElementById("mfarea4x").value = document.getElementById("mfarea3x").value;
                    document.getElementById("mfarea4y").value = document.getElementById("mfarea3y").value;
                    document.getElementById("mfarea1").value = document.getElementById("mfarea3z").value;
                    if (l[1] != 'none' && j + "," + k + "," + mfymd.toString() != m[1]) {
                        drawClimProfz();
                    };
                    break;
                case 2:
                    if (l[1] == 'none' || j + "," + k + "," + mfymd.toString() != m[1]) {
                        drawClimProfz();
                    };
                    k = document.getElementById("mfarea4x").value + "," + document.getElementById("mfarea4y").value;
                    document.getElementById("mfarea3x").value = document.getElementById("mfarea4x").value;
                    document.getElementById("mfarea3y").value = document.getElementById("mfarea4y").value;
                    if (l[0] != 'none' && j + "," + k + "," + document.getElementById("mfarea3z").value != m[0]) {
                        if (iojshighchart === 0) {
                            $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                                iojshighchart = 1;
                                drawClimTimes();
                            });
                        } else {
                            drawClimTimes();
                        };
                    };
                    break;
            };
        };
        if (l[2] != 'none') {
            if (n[1].split(",")[0] + "," + n[1].split(",")[2] != j + "," + mfymd.toString()) {
                drawClimContour();
            };
        };
    } else {
        if (climpoly.getVisible()) {
            toggleClimPoly(false);
        };
        var i = parseInt(document.getElementById("divmfxy").dataset.mf);
        if (i > 0 && mfymd > 999) {
            var k = [document.getElementById("mfarea1").value, document.getElementById("mfarea2").value];
            switch (i) {
                case 1:
                    if (climgrid.getVisible()) {
                        toggleClimGrid(false);
                    };
                    if (!climxymap.getVisible() || n[0] != j + "," + k[0] + "," + mfymd.toString()) {
                        toggleClimXYmap(true);
                    };
                    document.getElementById("mfarea3z").value = document.getElementById("mfarea1").value;
                    if (l[2] != 'none' && n[1] != j + "," + k[1] + "," + mfymd.toString()) {
                        drawClimContour();
                    };
                    break;
                case 2:
                    if (climxymap.getVisible()) {
                        toggleClimXYmap(false);
                    };
                    if (!climgrid.getVisible()) {
                        toggleClimGrid(true);
                    };
                    if (k[1]) {
                        if (l[2] == 'none' || n[1] != j + "," + k[1] + "," + mfymd.toString()) {
                            drawClimContour();
                        };
                    };
                    break;
            };
            if (l[0] != 'none' && j + "," + k[0] != m[0].split(",")[0] + "," + m[0].split(",")[3]) {
                if (iojshighchart === 0) {
                    $.getScript("/odbargo/static/js/highcharts-withvecmore.min.js", function () {
                        iojshighchart = 1;
                        drawClimTimes();
                    });
                } else {
                    drawClimTimes();
                };
            };
            if (l[1] != 'none' && j + "," + mfymd.toString() != m[1].split(",")[0] + "," + m[1].split(",")[3]) {
                drawClimProfz();
            };
        };
    };
}; //end of func drawClimfig
function drawClimContour() {
    if (!parseFloat(document.getElementById("mfarea2").value)) {
        return;
    };
    var sf = "<div id=dragclimsectzfig" + " data-vn=" + document.getElementById('meanfieldvar').value + "><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span></div><div id=climsectzchart></div><button type=button class=btclose8 id=btclose8 onclick=closeClimsectz()>&#10006;</button><button type=button class='material-icons KUOclr-meanfield KUOfs-1dot5 KUOc-p btpntcontour' title='PNG' onclick='saveclimfig(1);'>get_app</button>";
    $('#climsectzfig').html(sf);
    document.getElementById("climsectzfig").style.display = "block";
    dragfig(document.getElementById("climsectzfig"));
    document.getElementById("mfxytab2").dataset.mf = document.getElementById('meanfieldvar').value + "," + document.getElementById('mfarea2').value + "," + mfymd.toString();
    var cn = parseInt(document.getElementById('meanfieldvar').value, 10);
    var clonlat = parseFloat(document.getElementById("mfarea2").value);
    var dxy = 0.25; //var dxy=(cn<=1)?0.25:((mfymd>19000000)?0.25:1);
    var xylim = (clonlat < 100) ? [105, 135] : [2, 35];
    var xtklb = (clonlat < 100) ? "Longitude\u00b0E" : "Latitude\u00b0N";
    var ixy = (clonlat > 100) ? Math.floor(clonlat) + "\u00B0" + ("0" + parseInt((clonlat % 1) * 60).toString()).slice(-2) + "'E " : Math.floor(clonlat) + "\u00B0" + ("0" + parseInt((clonlat % 1) * 60).toString()).slice(-2) + "'N ";
    if (mfymd > 19000000) {
        ixy = ixy + mfymd.toString().substr(0, 4) + "/" + mfymd.toString().substr(4, 2);
    } else {
        ixy = ixy + mfd3tim[parseInt(mfymd.toString().substr(4, 2))];
    };
    var xy3857 = ol.proj.transform((clonlat > 100) ? [clonlat, 2] : [105, clonlat], 'EPSG:4326', 'EPSG:3857');
    climselect.setGeometry(new ol.geom.LineString([xy3857, (clonlat > 100) ? [xy3857[0], imgextent[3]] : [imgextent[2], xy3857[1]]]));
    climselect.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 4,
            color: "#f0f"
        })
    }));
    var cgp = new ol.layer.Vector({
        zIndex: 13,
        map: map,
        style: new ol.style.Style({
            image: new ol.style.RegularShape({
                radius: 8,
                points: 3,
                angle: 3.1416,
                fill: new ol.style.Fill({
                    color: '#f0f'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 1
                })
            })
        })
    });

    //var c; if (cn==2) { c=d3.scaleSequential(mfd3clr[cn]).domain(mfd3ctk[cn]); } else {
    var c = d3.scaleLinear().domain(mfd3ctk[cn]).range(mfd3clr[cn]).interpolate(d3.interpolateHcl);
    //}
    var dc = (mfd3clim[cn][1] - mfd3clim[cn][0]) / mfd3clim[cn][2];
    var cfigtrans = document.getElementById("climsectzchart");
    var m = [10, 30, 50, 50];
    var w = cfigtrans.clientWidth - m[3] - m[1] - 50;
    var h = cfigtrans.clientHeight - m[0] - m[2];
    var tp = d3.select(cfigtrans).append("div").attr("class", "contourtlp").style("display", "none");
    var lx = d3.select(cfigtrans).append("div").attr("class", "contourlnx").style("display", "none")
        .style("height", h + "px").style("top", m[0] + "px").style("left", "0px");
    var sx = d3.scaleLinear().domain(xylim).range([0, w]) //.nice();
    var sy = d3.scaleLinear().domain([-500, 0]).range([h, 0]) //.nice();
    var xis = d3.axisBottom(sx).tickSizeOuter(0);
    var yis = d3.axisLeft(sy).tickSizeOuter(0);
    var s = d3.select(cfigtrans).append("svg").attr("viewBox", "0 0 " + cfigtrans.clientWidth + " " + cfigtrans.clientHeight)
        .append("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    var gx = s.append("g").attr("class", "contouraxis").attr("transform", "translate(0," + h + ")").call(xis);
    var gy = s.append("g").attr("class", "contouraxis").attr("transform", "translate(0,0)").call(yis);
    s.append("g").attr("class", "contouraxis").call(d3.axisTop(sx).ticks(0).tickSizeOuter(0));
    s.append("g").attr("class", "contouraxis").attr("transform", "translate(" + w + ",0)").call(d3.axisRight(sy).ticks(0).tickSizeOuter(0));
    s.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("x", 1).attr("y", 1).attr("width", w - 1).attr("height", h - 1);
    s.append("text").attr("class", "contouraxistext").attr("x", (w - m[3]) / 2).attr("y", h + m[0] + m[2] / 2).text(xtklb);
    var s1 = s.append("g").attr("clip-path", "url(#clip)");

    d3.json("https://odbpo.oc.ntu.edu.tw/clim/zsect/" + mfvars[cn] + "/" + mfymd + "/" + (clonlat * 100) + "/json").then(function (v) {
        //d3.json("https://odbpo.oc.ntu.edu.tw/clim/sectz/"+mfvars[cn]+"/"+mfymd+"/"+clonlat+"/json").then(function(v){
        //d3.json("https://odbpo.oc.ntu.edu.tw/clim/sectd/"+mfvars[cn]+"/"+mfymd+"/"+clonlat+"/20/json").then(function(v){

        var nx = v.x.length,
            ny = v.y.length;
        s1.selectAll("path")
            .data(d3.contours().size([nx, ny]).smooth(true)
                .thresholds(d3.range(mfd3clim[cn][0], mfd3clim[cn][1], mfd3clim[cn][2]))(v.z))
            .enter().append("path")
            .attr("d", d3.geoPath(d3.geoIdentity()).projection(d3.geoTransform({
                point: function (x, y) {
                    return this.stream.point(x / nx * w, y / ny * h);
                }
            })))
            .attr("fill", function (d) {
                return c(d.value);
            })
            .style("stroke", "black").style("stroke-width", 0.4).style("cursor", "cell")
            .on("mouseover", function () {
                tp.style("display", "block");
                lx.style("display", "block");
            })
            .on("mousemove", function (d) {
                d3.select(this).style("stroke-width", 2);
                var i = d3.mouse(this),
                    j = xis.scale().domain(),
                    ii = Math.round((i[0] / w * (j[1] - j[0]) + j[0]) * 4 - 1) / 4;
                lx.style("left", (Math.round(i[0] + m[3]) - 1) + "px");
                tp.html((Math.round(d.value * 100) / 100) + " " + mfvaru[cn] + "<br>" + xtklb.substr(0, 3) + ": " + ii + "\u00b0" + xtklb.substr(-1))
                    .style("left", (i[0] + 100) + "px").style("top", (i[1] + 10) + "px");
                cgp.setSource(new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.Point((clonlat > 100) ? [xy3857[0], (ii - 2.0 - 0.75) / 33.0 * (imgextent[3] - imgextent[1]) + imgextent[1]] : [(ii - 105) / 30.0 * (imgextent[2] - imgextent[0]) + imgextent[0], xy3857[1]])
                    })]
                }));
            }).on("mouseout", function () {
                d3.select(this).style("stroke-width", 0.4);
                tp.style("display", "none");
                lx.style("display", "none");
                cgp.setSource(null);
            });
    });
    s.append("g").attr("transform", "translate(" + (w + 25) + ",5)")
        .call(d3.axisRight(d3.scaleLinear().domain([mfd3clim[cn][1], mfd3clim[cn][0]])
            .range([40, h - 6]).nice()).tickValues(mfd3ctk[cn]).tickSizeOuter(0).tickFormat(d3.format("")))
        .style("font-size", "16px").style("font-family", "Arial");
    s.selectAll(".contourscale").data(d3.range(mfd3clim[cn][0], mfd3clim[cn][1], mfd3clim[cn][2])).enter().append("rect")
        .attr("x", w + 10).attr("width", 15).attr("y", function (d, i) {
            return h - (h - 46) * (i + 1) / dc;
        }).attr("height", (h - 46) / dc)
        .attr("fill", function (d) {
            return c(d);
        }).style("stroke", "black").style("stroke-width", 0.5)
    s.append("text").attr("x", w + 10).attr("y", 25).text(mfvaru[cn]).style("font-size", "24px").style("font-family", "Arial");
    s.append("text").attr("class", "contouraxistext").attr("x", w + m[3]).attr("y", h + m[0] + m[2] / 2).text(ixy).style("text-anchor", "end");
    s.append("text").attr("class", "contouraxistext").attr("x", 5).attr("y", h + m[0] + m[2] / 2).text(mfvarn[cn]).style("text-anchor", "start").style("font-weight", "bold");
}; //end of func drawClimContour
function drawClimTimes() {
    var xy = [document.getElementById('mfarea3x').value, document.getElementById('mfarea3y').value];
    if (!xy[0] || !xy[1]) {
        return;
    } else {
        xy[0] = Math.round(parseFloat(xy[0]) * 4) / 4;
        xy[1] = Math.round(parseFloat(xy[1]) * 4) / 4;
    };
    document.getElementById('mfarea3x').value = xy[0].toFixed(2);
    document.getElementById('mfarea3y').value = xy[1].toFixed(2);
    if (xy[0] < 105 || xy[1] < 2 || xy[0] > 135 || xy[1] > 35) {
        return
    };
    var cn = parseInt(document.getElementById('meanfieldvar').value, 10);
    var ixy = parseInt(xy[0]) + "\u00B0" + ("0" + parseInt((xy[0] % 1) * 60).toString()).slice(-2) + "'E , ";
    ixy = ixy + parseInt(xy[1]) + "\u00B0" + ("0" + parseInt((xy[1] % 1) * 60).toString()).slice(-2) + "'N  ";
    ixy = ixy + document.getElementById("mfarea3z").value + " m";
    var climtsurl = "https://odbpo.oc.ntu.edu.tw/clim/times/" + mfvars[cn] + "/" + xy[0].toString() + "/" + xy[1].toString() + "/" + document.getElementById("mfarea3z").value + "/json";
    var xy3857 = [ol.proj.transform([parseFloat(xy[0]) - .125, parseFloat(xy[1]) - .125], 'EPSG:4326', 'EPSG:3857'),
        ol.proj.transform([parseFloat(xy[0]) + .125, parseFloat(xy[1]) + .125], 'EPSG:4326', 'EPSG:3857')
    ];
    climselectp.setGeometry(new ol.geom.Polygon([
        [
            [xy3857[0][0], xy3857[0][1]],
            [xy3857[1][0], xy3857[0][1]],
            [xy3857[1][0], xy3857[1][1]],
            [xy3857[0][0], xy3857[1][1]],
            [xy3857[0][0], xy3857[0][1]]
        ]
    ]));
    climselectp.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
            color: "#f0f"
        }),
        stroke: new ol.style.Stroke({
            width: 2
        })
    }));
    var sf = "<div id=dragclimtsfig><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;&nbsp;(<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span>)</div><div id=climtschart></div><button type=button class='btclose8' onclick=closeClimtsfig()>&#10006;</button><button type=button class='btpntcontour KUOd-n' id=btclimtscsv></button><button type=button class='material-icons KUOclr-meanfield KUOfs-2 KUOc-p btpntcontour' title='PNG' onclick=saveclimfig(2)>get_app</button>"; //id='btclose9'
    $('#climtsfig').html(sf);
    document.getElementById("climtsfig").style.display = "block";
    dragfig(document.getElementById("climtsfig"));
    document.getElementById("mfgridtab1").dataset.mf = cn + "," + document.getElementById('mfarea3x').value + "," + document.getElementById('mfarea3y').value + "," + document.getElementById("mfarea3z").value;
    //Highcharts.setOptions({colors:["#d9ef8b","#90cf60","#4caf50","#ffc107","#ff5722","#FF0800"]});
    var t0 = (new Date().getTimezoneOffset()) * 60000;
    $.getJSON(climtsurl, function (g) {
        var nt = g.length,
            nc = Math.floor(Math.random() * 10);
        for (var i = 0; i < nt; i++) {
            g[i][0] = new Date(g[i][0] / 10000, (g[i][0] % 10000) / 100, 1).getTime() + t0;
        };
        Highcharts.chart('climtschart', {
            chart: {
                zoomType: 'x',
                margin: [30, 20, 40, 50],
                spacing: [1, 1, 1, 1],
                height: $("#climtsfig").height(),
                plotBackgroundColor: "#222",
                plotBorderColor: "#aaa",
                plotBorderWidth: 0.5,
                backgroundColor: "#eee",
                type: 'area',
                borderColor: "#888",
                borderWidth: .5,
                plotShadow: true
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: mfvarn[cn] + " 1993 ~ 2018 @ <small>" + ixy + "</small>",
                align: 'right',
                verticalAlign: 'top',
                x: -20,
                y: 20,
                margin: 0,
                useHTML: true,
                floating: true,
                style: {
                    fontSize: "18px",
                    fontFamily: 'Arial,serif',
                    color: '#000'
                } //,widthAdjust:-24
            },
            tooltip: {
                borderRadius: 5,
                split: true,
                shadow: true,
                borderWidth: 0.5,
                backgroundColor: "#fff",
                borderColor: "#000",
                outside: false,
                hideDelay: 50,
                useHTML: true,
                style: {
                    fontSize: '16px',
                    fontFamily: 'Arial,"微軟正黑體"'
                },
                formatter: function () {
                    return ['<b>' + Highcharts.dateFormat('%Y-%m', new Date(this.x)) + '</b>', "<b>" + this.y + "</b> " + mfvaru[cn]]
                },
                xDateFormat: '%Y-%m' //,headerFormat:'<span style="font-size:16px;font-weight:bold">{point.key}</span>'
            },
            xAxis: {
                type: 'datetime',
                offset: 0,
                crosshair: {
                    snap: false,
                    width: 3,
                    color: "rgba(255,255,255,.5)"
                },
                min: g[0][0],
                max: g[nt - 1][0],
                gridLineWidth: 0.5,
                gridLineColor: "rgba(0,0,0,0.5)",
                minorGridLineWidth: 0.2,
                minorGridLineColor: "rgba(0,0,0,0.5)",
                tickColor: "#000",
                minorTickInterval: 'auto',
                labels: {
                    style: {
                        fontSize: '14px',
                        color: "#000",
                        fontFamily: 'Arial',
                        fontWeight: 'bold'
                    }
                },
                title: {
                    text: null
                },
                tickLength: 3,
                tickWidth: 2
            },
            yAxis: {
                crosshair: false,
                tickAmount: 9,
                plotLines: [{
                    color: "#666",
                    width: 2,
                    value: 0
                }],
                title: {
                    text: mfvaru[cn],
                    useHTML: true,
                    style: {
                        fontSize: '16px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold'
                    },
                    rotation: 0,
                    align: 'high',
                    offset: 0,
                    y: -12
                },
                gridLineWidth: 0.5,
                gridLineColor: "rgba(255,255,255,.5)",
                tickColor: "#000",
                tickLength: 2,
                tickWidth: 2,
                labels: {
                    style: {
                        fontSize: '14px',
                        color: "#000",
                        fontFamily: 'Arial',
                        fontWeight: 'bold'
                    },
                    x: -6
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[nc]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[nc]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 2,
                            color: "#fff"
                        }
                    },
                    threshold: null
                },
                colorByPoint: true
            },
            series: [{
                type: 'area',
                data: g,
                name: mfvars[cn],
                shadow: true,
                color: "#fff"
            }]
        });
        $("#btclimtscsv").click(function () {
            var climtscsv = "";
            climtscsv = climtscsv + "Date," + mfvarn[cn] + "\n";
            for (var i = 0; i < nt; i++) {
                var j = Highcharts.dateFormat('%Y/%m,', new Date(g[i][0]));
                climtscsv = climtscsv + j + (g[i][1]).toString() + "\n";
            };
            var fn = "Hidy_timeseries_" + mfvars[cn] + "_" + parseFloat(document.getElementById("mfarea3x").value) * 100 + "E_" + parseFloat(document.getElementById("mfarea3y").value) * 100 + "N_" + (document.getElementById("mfarea3z").value).toString() + "m" + ".csv";
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(Blob([climtscsv], {
                    type: 'text/csv;charset=utf-8;'
                }), fn);
            } else {
                climtscsv = "data:text/csv;charset=utf-8," + climtscsv;
                var b;
                if (document.getElementById("templinkclimts") === null) {
                    b = document.createElement("a");
                    b.id = "templinkclimts";
                    document.body.appendChild(b);
                } else {
                    b = document.getElementById("templinkclimts");
                };
                b.href = encodeURI(climtscsv);
                b.download = fn;
                b.click();
            };
        });
    });
}; //end of func drawClimTimes
function drawClimProfz() {
    var xy = [document.getElementById('mfarea4x').value, document.getElementById('mfarea4y').value];
    if (!xy[0] || !xy[1]) {
        return;
    } else {
        xy[0] = Math.round(parseFloat(xy[0]) * 4) / 4;
        xy[1] = Math.round(parseFloat(xy[1]) * 4) / 4;
    };
    document.getElementById('mfarea4x').value = xy[0].toFixed(2);
    document.getElementById('mfarea4y').value = xy[1].toFixed(2);
    if (xy[0] < 105 || xy[1] < 2 || xy[0] > 135 || xy[1] > 35 || mfymd < 10000000) {
        return
    };
    var cn = parseInt(document.getElementById('meanfieldvar').value, 10);
    var ixy = parseInt(xy[0]) + "\u00B0" + ("0" + parseInt((xy[0] % 1) * 60).toString()).slice(-2) + "'E,";
    ixy = ixy + parseInt(xy[1]) + "\u00B0" + ("0" + parseInt((xy[1] % 1) * 60).toString()).slice(-2) + "'N ";
    if (mfymd > 19000000) {
        ixy = ixy + mfymd.toString().substr(0, 4) + "/" + mfymd.toString().substr(4, 2);
    } else {
        ixy = ixy + mfd3tim[parseInt(mfymd.toString().substr(4, 2))];
    };

    var climpzurl = "https://odbpo.oc.ntu.edu.tw/clim/profz/" + mfvars[cn] + "/" + xy[0].toString() + "/" + xy[1].toString() + "/" + mfymd.toString() + "/json";
    var xy3857 = [ol.proj.transform([parseFloat(xy[0]) - .125, parseFloat(xy[1]) - .125], 'EPSG:4326', 'EPSG:3857'),
        ol.proj.transform([parseFloat(xy[0]) + .125, parseFloat(xy[1]) + .125], 'EPSG:4326', 'EPSG:3857')
    ];
    climselectp.setGeometry(new ol.geom.Polygon([
        [
            [xy3857[0][0], xy3857[0][1]],
            [xy3857[1][0], xy3857[0][1]],
            [xy3857[1][0], xy3857[1][1]],
            [xy3857[0][0], xy3857[1][1]],
            [xy3857[0][0], xy3857[0][1]]
        ]
    ]));
    climselectp.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
            color: "#f0f"
        }),
        stroke: new ol.style.Stroke({
            width: 2
        })
    }));
    var sf = "<div id=dragclimpzfig><i class='material-icons KUOclr-w KUOva-tt KUOrot-45deg KUOml-5px'>zoom_out_map</i>&nbsp;&nbsp;(<span class=txt0>Click&nbsp;here&nbsp;to&nbsp;drag</span><span class=txt1>點此拖曳圖窗</span>)</div><div id=climpzchart></div><button type=button class='btclose8' onclick=closeClimpzfig()>&#10006;</button><button type=button class='btpngcontour KUOd-n' id=btclimpzcsv></button><button type=button class='material-icons KUOclr-meanfield KUOfs-2 KUOc-p btpntcontour' onclick=saveclimfig(3) title='PNG'>get_app</button>";
    $('#climpzfig').html(sf);
    document.getElementById("climpzfig").style.display = "block";
    dragfig(document.getElementById("climpzfig"));
    document.getElementById("mfgridtab2").dataset.mf = cn + "," + document.getElementById('mfarea4x').value + "," + document.getElementById('mfarea4y').value + "," + mfymd.toString();
    var figclimpz = document.getElementById("climpzchart");
    var m = [42, 20, 36, 60];
    var w = figclimpz.clientWidth - m[1];
    var h = figclimpz.clientHeight - m[2];
    var svgpz = d3.select(figclimpz).append("svg").attr("width", w + m[1]).attr("height", h + m[2]);
    var tppz = d3.select(figclimpz).append("div").attr("class", "contourtlp").style("display", "none").style("pointer-events", "none");
    var lxpz = d3.select(figclimpz).append("div").attr("class", "contourlnx").style("display", "none")
        .style("height", (h - m[0]) + "px").style("top", m[0] + "px").style("left", m[3] + "px").style("pointer-events", "none");
    var lypz = d3.select(figclimpz).append("div").attr("class", "contourlny").style("display", "none")
        .style("width", (w - m[3]) + "px").style("top", m[0] + "px").style("left", m[3] + "px").style("pointer-events", "none");
    d3.json(climpzurl).then(function (g) {
        var c = d3.scaleLinear().domain(mfd3ctk[cn]).range(mfd3clr[cn]).interpolate(d3.interpolateHcl);
        var i = g[0].d;
        var z = new Array();
        var d = new Array();
        var v = new Array();
        for (var j = 0; j < i.length; j++) {
            if (i[j] > -990) {
                z.push(g[0].z[j] * -1);
                d.push(i[j]);
                v.push({
                    "d": i[j],
                    "z": g[0].z[j] * -1
                });
            };
        };
        var xs = d3.scaleLinear().domain([d3.min(d), Math.max(0, d3.max(d))]).range([0, w - m[3]]);
        var ys = d3.scaleLinear().domain([d3.min(z), 0]).range([h - m[0], 0]);
        var l = d3.line().x(function (i) {
            return xs(i.d)
        }).y(function (i) {
            return ys(i.z)
        }).curve(d3.curveBasis);
        var ab = svgpz.append("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        ab.append("g").attr("class", "grid").call(d3.axisBottom(xs).ticks(5).tickFormat("").tickSize(h - m[0]));
        ab.append("g").attr("class", "grid").call(d3.axisRight(ys).tickFormat("").tickSize(w - m[3]));
        var a = d3.area().curve(d3.curveBasis).x1(function (i) {
            return xs(i.d)
        }).x0(xs(Math.max(0, d3.min(d)))).y(function (i) {
            return ys(i.z)
        })
        ab.append("path").datum(v).attr("d", a).attr("fill", "#888888");
        var ll = ab.append("defs").append("linearGradient").attr("id", "linear-gradient");
        var j = d3.interpolateNumber(d3.min(d), d3.max(d));
        for (var i = 0; i <= 1; i = i + 0.2) {
            ll.append("stop").attr("offset", parseInt(i * 100) + "%").attr("stop-color", c(j(i)));
        };
        var xyln = ab.append("path").attr("d", l(v)).attr("stroke-width", 6).attr("fill", "none").attr("stroke", "#000");
        switch (Math.floor(Math.log(d3.max(d) - d3.min(d)) / Math.log(10))) {
            case -3:
                j = 4;
                break;
            case -2:
                j = 3;
                break;
            case -1:
                j = 2;
                break;
            case 0:
                j = 2;
                break;
            case 1:
                j = 1;
                break;
            default:
                j = 0;
        };
        ab.append("path").attr("class", "svgpzab").attr("d", l(v)).attr("stroke-width", 4).attr("fill", "none").attr("stroke", "url(#linear-gradient)");

        var s1pz = svgpz.append("circle").attr("r", 0).style("fill", "#FFF").style("stroke", "#000").style("stroke-width", 2).style("pointer-events", "none");
        ab.append("rect").attr("width", w - m[3]).attr("height", h - m[0])
            .style("fill", "none").style("pointer-events", "all").style("cursor", "cell")
            .on("mouseover", function () {
                tppz.style("display", "block");
                lxpz.style("display", "block");
                lypz.style("display", "block");
            })
            .on("mousemove", function () {
                var i = d3.mouse(this);
                var iy = ys.invert(i[1] - 4);
                var ix = 0;
                for (var ii = 0; ii < xyln.node().getTotalLength(); ii = ii + 10) {
                    if (xyln.node().getPointAtLength(ii).y >= i[1] - 4) {
                        ix = xs.invert(xyln.node().getPointAtLength(ii).x);
                        break;
                    };
                };
                lxpz.style("left", (xs(ix) + m[3] + 4) + "px");
                lypz.style("top", (i[1] + m[0] + 4) + "px");
                tppz.html("<b>" + ix.toFixed(j) + "</b> " + mfvaru[cn] + "<br>@" + parseInt(iy) + " m")
                    .style("left", (xs(ix) + 20) + "px").style("top", (i[1] + m[0] + 20) + "px");
                s1pz.attr("r", "5px").attr("cx", (xs(ix) + m[3]) + "px").attr("cy", (i[1] + m[0] - 3) + "px");
            }).on("mouseout", function () {
                tppz.style("display", "none");
                lxpz.style("display", "none");
                lypz.style("display", "none");
                s1pz.attr("r", 0);
            });
        var xa = d3.axisTop(xs);
        var ya = d3.axisLeft(ys);
        xa.tickValues(xs.ticks(5));
        svgpz.append("g").attr("class", "contouraxis").attr("transform", "translate(" + m[3] + "," + h + ")")
            .call(d3.axisBottom(xs).ticks(0));
        svgpz.append("g").attr("class", "contouraxis").attr("transform", "translate(" + w + "," + m[0] + ")")
            .call(d3.axisRight(ys).ticks(0));
        ab.append("g").attr("stroke-width", 2).call(xa).style("font-size", "12px");
        ab.append("g").attr("stroke-width", 2).attr("transform", "translate(0,0)").call(ya).style("font-size", "12px");
        ab.append("text").attr("class", "contouraxistext").attr("y", -m[0] / 2 - 5).attr("x", w / 2 - m[3] / 2).style("font-weight", "bold")
            .style("text-anchor", "middle").text(mfvarn[cn] + "  [ " + mfvaru[cn] + " ]");
        ab.append("text").attr("class", "contouraxistext").attr("y", h - m[0] / 2).attr("x", w / 2 - m[3] / 2).style("font-weight", "bold")
            .style("text-anchor", "middle").text(ixy);
        ab.append("text").attr("class", "contouraxistext").attr("y", -m[3] / 2 - 5).attr("x", -h / 2 + m[0]).style("font-weight", "bold")
            .style("text-anchor", "middle").text("Depth  [ m ]").attr("transform", "translate(0,0) rotate(-90)");
        $("#btclimpzcsv").click(function () {
            var climpzcsv = "";
            climpzcsv = climpzcsv + "Depth," + mfvarn[cn] + "\n";
            for (var i = 0; i < z.length; i++) {
                climpzcsv = climpzcsv + z[i].toString() + "," + d[i].toString() + "\n";
            };
            var fn = "Hidy_profile_" + mfvars[cn] + "_" + parseFloat(document.getElementById("mfarea4x").value) * 100 + "E_" + parseFloat(document.getElementById("mfarea4y").value) * 100 + "N_" + mfymd.toString() + ".csv";
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(Blob([climpzcsv], {
                    type: 'text/csv;charset=utf-8;'
                }), fn);
            } else {
                climpzcsv = "data:text/csv;charset=utf-8," + climpzcsv;
                var b;
                if (document.getElementById("templinkclimpz") === null) {
                    b = document.createElement("a");
                    b.id = "templinkclimpz";
                    document.body.appendChild(b);
                } else {
                    b = document.getElementById("templinkclimpz");
                };
                b.href = encodeURI(climpzcsv);
                b.download = fn;
                b.click();
            };
        });
    });
}; //end of func drawClimProfz
function getClimdata() {
    if (document.getElementById("btmeanfield").checked) {
        if (document.getElementById("btclimts").checked) {
            switch (parseInt(document.getElementById("divmfgrid").dataset.mf)) {
                case 1: // time series
                    document.getElementById((document.getElementById("btclimtscsv") == null) ? "btdrawclim" : "btclimtscsv").click();
                    break;
                case 2: // profile z
                    document.getElementById((document.getElementById("btclimpzcsv") == null) ? "btdrawclim" : "btclimpzcsv").click();
                    break;
            };
        } else {
            if (mfymd >= 10000000) {
                switch (parseInt(document.getElementById("divmfxy").dataset.mf)) {
                    case 1: // xy map
                        window.open("https://odbpo.oc.ntu.edu.tw/clim/xymap/" + mfvars[parseInt(document.getElementById('meanfieldvar').value)] + "/" + mfymd.toString() + "/" + document.getElementById("mfarea1").value + "/csv", "_blank");
                        break;
                    case 2: // z sect
                        if (parseInt(document.getElementById("mfarea2").value) > 1) {
                            window.open("https://odbpo.oc.ntu.edu.tw/clim/zsect/" + mfvars[parseInt(document.getElementById('meanfieldvar').value)] + "/" + mfymd.toString() + "/" + parseInt(parseFloat(document.getElementById("mfarea2").value) * 100) + "/csv", "_blank");
                        };
                        break;
                };
            };
        };
    };
}; //end of func getClimdata
function argolayer(feature) {
    Plotly.purge('abcchart');
    mk0.setStyle(null);
    pk0.setStyle(null);
    gk0.setStyle(null);
    mk0 = feature;
    feature.setStyle(hstyles);
    dragfig(document.getElementById("abc"));
    var ww = document.querySelector('input[name="argofig"]:checked').value;
    document.getElementById('abc').dataset.kuoplt = 1;
    if (ww >= 50) { //topo3D
        //var b = 0.5-0.2;
        var b = 0.5;
        var sxy = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        var sfile = "/grd/seaclim/depth/" + [(sxy[0] - b).toFixed(3), (sxy[1] - b).toFixed(3), (sxy[0] + b).toFixed(3), (sxy[1] + b).toFixed(3)] + "/csv";
        $.getJSON(sfile, function (data) {
            plotpnttopo(feature.get('tim'), data[0], sxy[0], sxy[1]);
        });
    } else { //2D
        var pfile = "/odbargo/get/argosvp/" + (document.getElementById('btbioargo').checked ? "bio" : "") + "prof/" + feature.get('pk') + "/";
        if (ww == 45) {
            $.getJSON(pfile, function (data) {
                plotargo_tsdiag(feature.get('tim'), data[0]);
            }); //t-s diagram
        } else {
            $.getJSON(pfile, function (data) {
                plotargo(feature.get('tim'), data[0]);
            }); //ts-z profile
        };
    };
    if (argo.getSource().getFeatures().indexOf(feature) >= 0) {
        argotraj.setSource(new ol.source.Vector({
            url: "/odbargo/get/argosvp/gettrajfrompk/" + feature.get('pk') + "/geojson",
            format: new ol.format.GeoJSON()
        }));
        argotraj.once('change', function () {
            if (argotraj.getSource() && argotraj.getSource().getState() == 'ready') {
                argo.changed();
            }
        })
    };
}; //end of func argolayer
function svplayer(feature) {
    if (document.getElementById("abc").dataset.kuoplt == 1) {
        closeABC();
    };
    Plotly.purge('abcchart');
    pk0.setStyle(null);
    mk0.setStyle(null);
    gk0.setStyle(null);
    pk0 = feature;

    var shstyles = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#F0F',
            width: 3
        })
    })];
    var pk0xy = [feature.getGeometry().getLastCoordinate(), feature.getGeometry().getCoordinateAt(0.95)];
    shstyles.push(new ol.style.Style({
        geometry: new ol.geom.Point([pk0xy[0][0], pk0xy[0][1]]),
        image: new ol.style.RegularShape({
            points: 3,
            radius: 8,
            angle: Math.PI / 2,
            rotation: -Math.atan2(pk0xy[1][0] - pk0xy[1][1], pk0xy[0][0] - pk0xy[1][0]),
            stroke: new ol.style.Stroke({
                color: '#f0f',
                width: 2
            })
        })
    }));
    feature.setStyle(shstyles);

    dragfig(document.getElementById("abc"));
    var ww = document.querySelector('input[name="svpfig"]:checked').value;
    document.getElementById('abc').dataset.kuoplt = 2;
    if (ww == 2) {
        var pfile = "https://odbpo.oc.ntu.edu.tw/svp/drifter/trajid/uvttim/" + feature.get('pk') + "/" + da3;
        $.getJSON(pfile, function (data) {
            plotsvptime(feature.get('tim1'), data[0]);
        });
    } else {
        var pfile = "https://odbpo.oc.ntu.edu.tw/svp/drifter/trajid/" + ((ww > 0) ? "spd" : "temp") + "/" + feature.get('pk') + "/" + da3;
        $.getJSON(pfile, function (data) {
            plotsvp(feature.get('tim1'), data[0], svpw[ww]);
        });
    };
}; //end of func svplayer
function gliderlayer(feature) {
    if (document.getElementById("abc").dataset.kuoplt == 1) {
        closeABC();
    };
    Plotly.purge('abcchart');
    mk0.setStyle(null);
    pk0.setStyle(null);
    gk0.setStyle(null);
    gk0 = feature;
    feature.setStyle(hstyles);
    dragfig(document.getElementById("abc"));
    var ww = document.querySelector('input[name="gliderfig"]:checked').value;
    document.getElementById('abc').dataset.kuoplt = 3;
    var gfile = "/glider/getdive/" + feature.get('pk') + "/";
    var odbsso = document.cookie.split("odbsso=")[1].substr(0, 32);
    switch (ww) {
        case "1":
            $.getJSON(gfile + "prof/json?ucode=" + odbsso, function (a) {
                plotglider(feature.get('tim1').substr(0, 19) + "Dive:" + feature.get('gliderdive'), a[0])
            });
            break;
        case "0":
            $.getJSON(gfile + "tsp/json?ucode=" + odbsso, function (a) {
                plotargo_tsdiag(feature.get('tim1').substr(0, 19) + "Dive:" + feature.get('gliderdive'), a[0])
            });
            break;
        case "2":
            $.getJSON(gfile + "txyz/json?ucode=" + odbsso, function (a) {
                plottracktopo(feature.get('tim1').substr(0, 19) + "Dive:" + feature.get('gliderdive'), a[0])
            });
            break;
    };
}; //end of func gliderlayer
function orshipoverlay(a) {
    if (a) {
        document.getElementById('ship').scrollIntoView(true);
        //or1ship.setSource(new ol.source.Vector({url:"/glider/getship/1/geojson?ucode="+document.cookie.split("odbsso=")[1].substr(0,32),format:new ol.format.GeoJSON()}));
        or1ship.setSource(new ol.source.Vector({
            url: "https://odbwms.oc.ntu.edu.tw/odbintl/midas/midas2geojson/?crname=latest&getPoints=no&ucode=" + document.cookie.split("odbsso=")[1].substr(0, 32),
            format: new ol.format.GeoJSON()
        }));
        $.getJSON("/glider/getship/0/geojson?ucode=" + document.cookie.split("odbsso=")[1].substr(0, 32), function (data) {
            or1now.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data[0].lon1, data[0].lat1])));
            or1now.setStyle([new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#000',
                        src: "/ntuglider/ship.png",
                        scale: 1.5
                    }))
                }),
                new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#ff0',
                        src: "/ntuglider/ship.png",
                        scale: 1.3
                    }))
                })
            ]);
            var or1tim = new Date(data[0].tim1.replace(" ", "T") + "Z");
            or1tim = or1tim.getFullYear() + "-" + ("0" + (or1tim.getMonth() + 1)).slice(-2) + "-" + ("0" + or1tim.getDate()).slice(-2) +
                " " + ("0" + or1tim.getHours()).slice(-2) + ":" + ("0" + or1tim.getMinutes()).slice(-2);
            document.getElementById("or1now").innerHTML = or1tim;;
            or2now.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data[0].lon2, data[0].lat2])));
            or2now.setStyle([new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#000',
                        src: "/ntuglider/ship.png",
                        scale: 1.2
                    }))
                }),
                new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#0ff',
                        src: "/ntuglider/ship.png",
                        scale: 1
                    }))
                })
            ]);
            document.getElementById("or2now").innerHTML = data[0].tim2.substr(0, 16);
            or3now.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data[0].lon3, data[0].lat3])));
            or3now.setStyle([new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#000',
                        src: "/ntuglider/ship.png",
                        scale: 1.2
                    }))
                }),
                new ol.style.Style({
                    image: new ol.style.Icon(({
                        color: '#f00',
                        src: "/ntuglider/ship.png",
                        scale: 1
                    }))
                })
            ]);
            document.getElementById("or3now").innerHTML = data[0].tim3.substr(0, 16);
        });
    } else {
        or1ship.setSource(null);
        or1now.setGeometry();
        or2now.setGeometry();
        or3now.setGeometry();
    }
}; //end of func orshipoverlay
function gettimfg1() {
    da1 = document.getElementById("fdate1").value;
    var dsa = new Date(da1.substring(0, 4), (Number(da1.substring(4, 6)) - 1).toString(), da1.substring(6, 8))
    da1 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate1").value = da1;
    document.getElementById("abc").style.display = "none";
    document.getElementById("btargo").checked = true;
    toggleArgo(true);
}; //end of func gettimfg1
function gettimfg2() {
    da2 = document.getElementById("fdate2").value;
    var dsa = new Date(da2.substring(0, 4), (Number(da2.substring(4, 6)) - 1).toString(), da2.substring(6, 8))
    da2 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate2").value = da2;
    document.getElementById("abc").style.display = "none";
    document.getElementById("btargo").checked = true;
    toggleArgo(true);
}; //end of func gettimfg2
function gettimfg3() {
    da3 = document.getElementById("fdate3").value;
    var dsa = new Date(da3.substring(0, 4), (Number(da3.substring(4, 6)) - 1).toString(), da3.substring(6, 8))
    da3 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate3").value = da3;
    document.getElementById("abc").style.display = "none";
    document.getElementById("bttraj").checked = true;
    toggleSvp(true);
}; //end of func gettimfg3
function gettimfg4() {
    da4 = document.getElementById("fdate4").value;
    var dsa = new Date(da4.substring(0, 4), (Number(da4.substring(4, 6)) - 1).toString(), da4.substring(6, 8))
    da4 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate4").value = da4;
    if (!(document.getElementById('btone').checked)) {
        var i = satimg.getSource().getUrl();
        i = i.replace('latest', da4);
        imgoverlay(i.substring(40, i.length - 12));
    };
    if (document.getElementById('btfront').checked) {
        toggleFront(true);
    };
    if (document.getElementById('bteddy').checked) {
        toggleEddy(true);
    };
    if (document.getElementById('btflow').checked) {
        toggleFlow('madt', true);
    };
    if (document.getElementById('btflowa').checked) {
        toggleFlow('msla', true);
    };
}; //end of func gettimfg4
function gettimfg5() {
    var i = document.getElementById("fdate5").value;
    if (i <= db5 && i >= "20181130") {
        da5 = document.getElementById("fdate5").value;
        document.getElementById("btmodel").checked = true;
        var dsa = new Date(da5.substring(0, 4), (Number(da5.substring(4, 6)) - 1).toString(), da5.substring(6, 8));
        da5 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
        document.getElementById("fdate5").value = da5;
        toggleModel();
    } else {
        document.getElementById("fdate5").value = da5;
    };
}; //end of func gettimfg5
function gettimfg6() {
    da6 = document.getElementById("fdate6").value;
    var dsa = new Date(da6.substring(0, 4), (Number(da6.substring(4, 6)) - 1).toString(), da6.substring(6, 8))
    da6 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate6").value = da6;
    if (document.getElementById("tidefig").style.display != "none") {
        drawTidefig();
    }
}; //end of func gettimfg6
function gettimfg7() {
    da7 = document.getElementById("fdate7").value;
    var dsa = new Date(da7.substring(0, 4), (Number(da7.substring(4, 6)) - 1).toString(), da7.substring(6, 8))
    da7 = dsa.getFullYear() + ("0" + (dsa.getMonth() + 1)).slice(-2) + ("0" + dsa.getDate()).slice(-2);
    document.getElementById("fdate7").value = da7;
    if (document.getElementById("tidefig").style.display != "none") {
        drawTidefig();
    }
}; //end of func gettimfg7
function gettimfg8() {
    var dsa = parseInt((document.getElementById("mfyear").value).toString() + document.getElementById("mfmon").value + "00");
    if (mfymd - dsa != 0) {
        mfymd = dsa;
        drawClimfig();
    };
}; //end of func gettimfg8
function gettidehr(i) {
    var a = document.getElementById("tidehr" + i);
    if (a.value < 0) {
        a.value = "23";
        document.getElementById("fdate" + (i + 5)).value = parseInt(document.getElementById("fdate" + (i + 5)).value) - 1;
        gettimfg7();
    } else if (a.value > 23) {
        a.value = "00";
        document.getElementById("fdate" + (i + 5)).value = parseInt(document.getElementById("fdate" + (i + 5)).value) + 1;
        gettimfg7();
    } else {
        a.value = ("0" + a.value).substr(-2);
        drawTidefig();
    }
}; //end of func gettidehr
function getclimtim(i) {
    var a = parseInt(document.getElementById("mfyear").value);
    if (parseInt(i.toString().substr(-1)) == 1) {
        document.getElementById("mfyear").value = Math.max(Math.min(2018, a + i), 1993);
    } else {
        var b = parseInt(document.getElementById("mfmon").value) + i / 2;
        if (b > 12) {
            if (a >= 2018) {
                b = "12";
            } else {
                b = "01";
                document.getElementById("mfyear").value = a + 1;
            }
        } else if (b < 1) {
            if (a <= 1993) {
                b = "01";
            } else {
                b = "12";
                document.getElementById("mfyear").value = a - 1;
            }
        } else {
            b = ("0" + b).substr(-2);
        };
        document.getElementById("mfmon").value = b;
    };
    gettimfg8();
}; //end of func getclimtim
function closeABC() {
    mk0.setStyle(null);
    pk0.setStyle(null);
    gk0.setStyle(null);
    document.getElementById("abc").style.display = "none";
    document.getElementById("abc").dataset.kuoplt = 0;
    if (argotraj.getSource()) {
        argotraj.setSource(null);
        argo.changed();
    }
}; //end of func closeABC
function closePVD() {
    pvd.getSource().refresh();
    document.getElementById("btclose2").style.visibility = "hidden";
    document.getElementById("btclose2").style.display = 'none';
    document.getElementById("btpvd").checked = false;
}; //end of func closePVD
function closeSegfig() {
    document.getElementById('segfig').style.visibility = 'hidden';
    var i = document.getElementById('segfig');
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    if (i.style.display != 'none') {
        if (segdraw.getSource().getFeatureById(3) != null) {
            segdraw.getSource().getFeatureById(3).setProperties({
                geometry: null
            })
        };
    };
    i.style.display = 'none';
}; //end of func closeSegfig
function closeContourfig() {
    glidertraj.setSource(null);
    var i = document.getElementById('contourfig');
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    i.style.display = 'none';
}; //end of func closeContourfig
function closeCKeyTable(a) {
    $("#ckeytable" + a).DataTable().destroy(true);
    $("#ckeycruise" + a).remove();
    document.getElementById("ckeytableio" + a).setAttribute("onclick", "this.innerHTML='grid_on';buildCkeyCruise(" +
        a + ",cplan[" + (a - 1) + "]);");
    document.getElementById("ckeytableio" + a).innerHTML = "grid_off";
    document.getElementById("ckeytableio" + a).className += " KUOclr-gray";
}; //end of func closeCKeyTable
function closeStylepanel() {
    document.getElementById("stylepanel").removeAttribute("style");
    var i = document.getElementsByClassName("KUOckeyset-hl");
    if (i.length > 0) {
        document.getElementsByClassName("KUOckeyset-hl")[0].className = i[0].className.replace(" KUOckeyset-hl", "");
    };
}; //end of func closeStylepanel
function closeTidefig() {
    var i = document.getElementById('tidefig'),
        j = tidedraw.getSource().getFeatures();
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    i.style.display = 'none';
    if (j.length > 0) {
        tidedraw.getSource().removeFeature(j[0]);
    };
    document.getElementById('bttidecsv').disabled = true;
    document.getElementById('bttidetid').disabled = true;
    document.getElementById('btpnttide').disabled = true;
    document.getElementById("bttide").checked = false;
}; //end of func closeTidefig
function closeClimsectz() {
    var i = document.getElementById("climsectzfig");
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    i.style.display = 'none';
    climselect.setGeometry(null);
}; //end of func closeClimsectz
function closeClimtsfig() {
    var i = document.getElementById("climtsfig");
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    i.style.display = 'none';
    climselectp.setGeometry(null);
}; //end of func closeClimtsfig
function closeClimpzfig() {
    var i = document.getElementById("climpzfig");
    while (i.firstChild) {
        i.removeChild(i.firstChild);
    }
    i.style.display = 'none';
    climselectp.setGeometry(null);
}; //end of func closeClimpzfig
function closeDragDropLayer(a) {
    var i = map.getLayers().getArray();
    for (var j = 0; j < i.length; j++) {
        if (i[j].get("name") == 'dgdp' + a) {
            map.removeLayer(i[j]);
            break;
        }
    };
    $("#btdgdp" + a).remove();
}; //end func closeDragDropLayer
function plotargo(data, pdata) {
    document.getElementById('abc').style.maxWidth = "450px";
    document.getElementById('abc').style.width = "30vh";
    document.getElementById('abc').style.maxHeight = "600px";
    document.getElementById('abc').style.height = "50vh";
    document.getElementById('abc').style.display = "block";
    var ABC = document.getElementById('abcchart');
    var iabc1 = [{
            x: pdata.t,
            y: pdata.p,
            type: 'scatter',
            xaxis: 'x1',
            hoverinfo: 'x+y+name',
            hovermode: 'x',
            name: "&#8451;",
            line: {
                color: "#00f",
                width: 2,
                size: 20
            }
        },
        {
            x: pdata.s,
            y: pdata.p,
            type: 'scatter',
            xaxis: 'x2',
            hoverinfo: 'x+y+name',
            name: "psu",
            line: {
                color: "rgb(224,0,0)",
                width: 2,
                size: 20
            }
        }
    ];
    var iabc2 = {
        hovermode: 'closest',
        margin: {
            t: 50,
            b: (pdata.o) ? 0 : 50,
            l: 60,
            r: 10,
            autoexpand: false
        },
        x0: 2,
        showlegend: false,
        plot_bgcolor: "#dedede",
        xaxis: {
            gridcolor: "#fff",
            hoverformat: ".1f",
            range: [Math.min.apply(Math, pdata.t) - 1, Math.max.apply(Math, pdata.t) + 1],
            showgrid: true,
            showticklabels: true,
            /*dtick:5,*/ showline: true,
            zeroline: false,
            tickformat: "f",
            ticklen: 4,
            ticks: 'outside',
            tickwidth: 2,
            tickcolor: "#00f",
            tickfont: {
                color: "#00f",
                size: 14
            },
            linecolor: "#00f",
            linewidth: 2,
            side: 'bottom',
            title: (pdata.o) ? "" : "Temperature (&#8451;)",
            titlefont: {
                color: "#00F",
                fillcolor: "#00F",
                size: 14
            }
        },
        xaxis2: {
            overlaying: 'x1',
            side: 'top',
            showgrid: false,
            hoverformat: ".2f",
            showticklabels: true,
            showline: true,
            zeroline: false,
            range: [Math.min.apply(Math, pdata.s) - 0.2, Math.max.apply(Math, pdata.s) + 0.2],
            tickformat: ".1f",
            ticklen: 4,
            ticks: 'outside',
            autotick: true,
            tickwidth: 2,
            tickcolor: "#f00",
            tickfont: {
                color: "#f00",
                size: 14
            },
            linecolor: "#f00",
            linewidth: 2,
            title: "Salinity (psu)",
            titlefont: {
                color: "#F00",
                size: 14
            }
        },
        yaxis: {
            hoverformat: ".0f",
            showgrid: true,
            range: [Math.min.apply(Math, pdata.p), 0],
            gridcolor: "#fff",
            showline: true,
            zeroline: false,
            borderwidth: 2,
            showticklabels: true,
            /*dtick:100,*/ tickformat: "i",
            tickfont: {
                color: "#000",
                size: 12
            },
            linewidth: 2,
            title: "Depth (m)",
            titlefont: {
                color: "#000",
                size: 14
            }
        }
    };
    iabc2.annotations = [{
            xref: 'paper',
            yref: 'paper',
            x: 0.1,
            xanchor: 'right',
            y: 1,
            yanchor: 'bottom',
            showarrow: false,
            align: 'left',
            text: data.substr(0, 10) + "<br>" + data.substr(11, 8) + "<br> ",
            font: {
                size: 12,
                color: '#000'
            }
        },
        {
            xref: 'paper',
            yref: 'paper',
            x: 0.1,
            xanchor: 'right',
            y: -0.1,
            yanchor: 'bottom',
            showarrow: false,
            align: 'left',
            text: "ID=" + (pdata.i[0]).toString(),
            font: {
                size: 12,
                color: '#222'
            }
        }
    ];
    if (pdata.o) {
        iabc2.annotations[1].y = 0.1;
        iabc1.push({
            x: pdata.o,
            y: pdata.z,
            type: 'scatter',
            xaxis: 'x3',
            hoverinfo: 'x+y+name',
            name: "&#956;M",
            connectgap: false,
            line: {
                color: "#f0f",
                width: 1.25,
                size: 20
            }
        });
        iabc1.push({
            x: pdata.c,
            y: pdata.z,
            type: 'scatter',
            xaxis: 'x4',
            hoverinfo: 'x+y+name',
            name: "&#956;g/L",
            connectgap: false,
            line: {
                color: "#080",
                width: 1.25,
                size: 20
            }
        });
        iabc2.xaxis4 = {
            side: 'bottom',
            showgrid: false,
            hoverformat: ".3f",
            showticklabels: true,
            showline: true,
            linecolor: "#080",
            ticks: 'outside',
            linewidth: 1.5,
            tickfont: {
                color: "#080",
                size: 12
            },
            ticklen: 4,
            tickwidth: 2,
            autotick: true,
            tickcolor: "#080",
            zeroline: false,
            range: [-0.9, Math.max(Math.max.apply(Math, pdata.c) * 1.5 + 1, .5)],
            position: .05
        };
        iabc2.xaxis3 = {
            overlaying: 'x4',
            side: 'bottom',
            showgrid: false,
            hoverformat: ".1f",
            showticklabels: true,
            showline: true,
            linecolor: "#f0f",
            ticks: 'outside',
            linewidth: 1.5,
            tickfont: {
                color: "#f0f",
                size: 12
            },
            ticklen: 4,
            tickwidth: 2,
            autotick: true,
            tickcolor: "#f0f",
            zeroline: false,
            range: [Math.min.apply(Math, pdata.o) - 30, Math.max.apply(Math, pdata.o) + 30],
            position: .1
        };
        iabc2.annotations.push({
            xref: 'paper',
            yref: 'paper',
            x: .5,
            xanchor: 'middle',
            y: .1,
            yanchor: 'bottom',
            showarrow: false,
            text: "Temperature (&#8451;)",
            font: {
                size: 14,
                color: '#00f'
            }
        });
        iabc2.annotations.push({
            xref: 'paper',
            yref: 'paper',
            x: 0,
            xanchor: 'right',
            y: .1,
            yanchor: 'top',
            showarrow: false,
            align: 'left',
            text: "DO  (&#956;M)",
            font: {
                size: 12,
                color: '#f0f'
            }
        });
        iabc2.annotations.push({
            xref: 'paper',
            yref: 'paper',
            x: 0,
            xanchor: 'right',
            y: .05,
            yanchor: 'top',
            showarrow: false,
            align: 'left',
            text: "Chl(&#956;g/L)",
            font: {
                size: 12,
                color: '#080'
            }
        });
        iabc2.xaxis.overlaying = 'x4';
        iabc2.xaxis2.overlaying = 'x4';
        iabc2.xaxis.position = 0.2;
        iabc2.yaxis.domain = [0.2, 1];
    };
    Plotly.newPlot(ABC, iabc1, iabc2, {
        modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d',
            'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian'
        ],
        displaylogo: false
    }, {
        showLink: false
    }); //end of Plot
}; //end of func plotargo
function closeODBS() {
    var b = document.getElementsByClassName('onoff-checkbox');
    for (var i = 0; i < b.length; i++) {
        if (b[i].checked) {
            b[i].click();
        }
    };
    if (document.getElementById('btngravity2').checked) {
        document.getElementById('btngravity2').click();
    };
}; //end of func closeODBS
function plotargo_tsdiag(data, pdata) {
    document.getElementById('abc').style.maxWidth = "600px";
    document.getElementById('abc').style.width = "50vh";
    document.getElementById('abc').style.maxHeight = "600px";
    document.getElementById('abc').style.height = "50vh";
    document.getElementById('abc').style.display = "block";
    var ABC = document.getElementById('abcchart');
    var tslim;
    var wmvis = "0.0)";
    if (data.length > 20) {
        tslim = [2, 32, 33.5, 35.2];
        wmvis = "0.7)";
    } else {
        tslim = [Math.min.apply(Math, pdata.t) - 1, Math.max.apply(Math, pdata.t) + 1,
            Math.min.apply(Math, pdata.s) - 0.1, Math.max.apply(Math, pdata.s) + 0.1
        ];
        tslim = [Math.max.apply(Math, [4, tslim[0]]), Math.min.apply(Math, [32, tslim[1]]),
            Math.max.apply(Math, [33.0, tslim[2]]), Math.min.apply(Math, [35.8, tslim[3]])
        ];
    };
    Plotly.newPlot(ABC,
        [{
                x: [34.55, 34.52, 34.49, 34.44, 34.38, 34.35, 34.33, 34.31, 34.31, 34.32, 34.33, 34.36, 34.39, 34.43, 34.47, 34.52, 34.57, 34.62, 34.67, 34.72, 34.77, 34.81, 34.86, 34.90, 34.94, 34.98, 35.01, 35.03, 35.05, 35.06, 35.05, 35.01, 34.93, 34.81, 34.63, 34.42, 34.30, 34.21, 34.13],
                y: [3.72, 4.42, 5.13, 5.83, 6.53, 7.23, 7.94, 8.64, 9.34, 10.04, 10.74, 11.45, 12.15, 12.85, 13.55, 14.26, 14.96, 15.66, 16.36, 17.06, 17.77, 18.47, 19.17, 19.87, 20.58, 21.28, 21.98, 22.68, 23.38, 24.09, 24.79, 25.49, 26.19, 26.90, 27.60, 28.30, 29.00, 29.70, 30.41],
                type: 'scatter',
                hoverinfo: 'none',
                mode: 'lines',
                xaxis: 'x1',
                yaxis: 'y1',
                line: {
                    color: "rgba(0,0,255," + wmvis,
                    width: 2,
                    dash: "solid"
                }
            },
            {
                x: [34.59, 34.56, 34.53, 34.50, 34.48, 34.46, 34.44, 34.43, 34.42, 34.42, 34.42, 34.42, 34.43, 34.45, 34.47, 34.49, 34.51, 34.53, 34.56, 34.58, 34.60, 34.60, 34.61, 34.60, 34.58, 34.56, 34.54, 34.51, 34.46, 34.41, 34.35, 34.28, 34.23, 34.17, 34.09, 34.03, 33.97, 33.90, 33.80],
                y: [2.80, 3.47, 4.15, 4.82, 5.50, 6.18, 6.85, 7.53, 8.20, 8.88, 9.56, 10.23, 10.91, 11.58, 12.26, 12.93, 13.61, 14.29, 14.96, 15.64, 16.31, 16.99, 17.66, 18.34, 19.02, 19.69, 20.37, 21.04, 21.72, 22.40, 23.07, 23.75, 24.42, 25.10, 25.77, 26.45, 27.13, 27.80, 28.48],
                type: 'scatter',
                hoverinfo: 'none',
                mode: 'lines',
                xaxis: 'x1',
                yaxis: 'y1',
                line: {
                    color: "rgba(255,0,0," + wmvis,
                    width: 2,
                    dash: "solid"
                }
            },
            {
                x: [34.57, 34.51, 34.45, 34.38, 34.31, 34.26, 34.23, 34.21, 34.22, 34.24, 34.26, 34.29, 34.33, 34.37, 34.42, 34.46, 34.51, 34.57, 34.62, 34.67, 34.72, 34.76, 34.80, 34.82, 34.84, 34.85, 34.85, 34.84, 34.82, 34.79, 34.75, 34.71, 34.66, 34.60, 34.53, 34.45, 34.36, 34.25, 34.09],
                y: [2.42, 3.14, 3.86, 4.58, 5.30, 6.01, 6.73, 7.45, 8.17, 8.89, 9.60, 10.32, 11.04, 11.76, 12.48, 13.19, 13.91, 14.63, 15.35, 16.07, 16.78, 17.50, 18.22, 18.94, 19.66, 20.37, 21.09, 21.81, 22.53, 23.25, 23.96, 24.68, 25.40, 26.12, 26.84, 27.55, 28.27, 28.99, 29.71],
                type: 'scatter',
                hoverinfo: 'none',
                mode: 'lines',
                xaxis: 'x1',
                yaxis: 'y1',
                line: {
                    color: "rgba(0,127,0," + wmvis,
                    width: 2,
                    dash: "solid"
                }
            },
            {
                x: pdata.s,
                y: pdata.t,
                type: 'scatter',
                hovermode: 'x',
                mode: 'lines+markers',
                xaxis: 'x1',
                yaxis: 'y1',
                text: pdata.p,
                showscale: true,
                hoverinfo: 'x+y+text',
                line: {
                    color: "#000",
                    dash: "dot",
                    width: 0.5
                },
                marker: {
                    size: 4,
                    color: pdata.p,
                    colorscale: 'Jet',
                    colorbar: {
                        thickness: 20,
                        thicknessmode: 'pixels',
                        outlinecolor: '#000',
                        len: 0.3,
                        lenmode: 'fraction',
                        outlinewidth: 2,
                        x: 1,
                        y: 0,
                        xanchor: 'left',
                        yanchor: 'bottom',
                        ticklen: 20,
                        ticks: 'inside',
                        tickwidth: 2,
                        title: 'm',
                        titleside: 'top',
                        titlefont: {
                            color: '#000',
                            size: 14
                        }
                    }
                }
            },
            {
                x: [33.0, 33.4, 33.8, 34.2, 34.6, 35.0, 35.4, 35.8],
                y: [0, 4, 8, 12, 16, 20, 24, 28, 32],
                z: [
                    [26.5, 26.8, 27.1, 27.5, 27.8, 28.1, 28.4, 28.8],
                    [26.2, 26.5, 26.8, 27.1, 27.5, 27.8, 28.1, 28.4],
                    [25.7, 26.0, 26.3, 26.6, 27.0, 27.3, 27.6, 27.9],
                    [25.0, 25.3, 25.7, 26.0, 26.3, 26.6, 26.9, 27.2],
                    [24.2, 24.5, 24.8, 25.1, 25.4, 25.7, 26.1, 26.4],
                    [23.2, 23.5, 23.8, 24.2, 24.5, 24.8, 25.1, 25.4],
                    [22.1, 22.4, 22.7, 23.0, 23.3, 23.6, 23.9, 24.2],
                    [20.9, 21.2, 21.5, 21.8, 22.1, 22.4, 22.7, 23.0],
                    [19.5, 19.8, 20.1, 20.4, 20.7, 21.0, 21.3, 21.6]
                ],
                type: 'contour',
                xaxis: 'x2',
                yaxis: 'y2',
                hoverinfo: 'none',
                showscale: true,
                contours: {
                    coloring: 'fill'
                },
                colorscale: 'Picnic',
                line: {
                    dash: "solid",
                    width: 1
                },
                ncontours: 30,
                colorbar: {
                    thickness: 20,
                    thicknessmode: 'pixels',
                    outlinecolor: '#000',
                    len: 0.3,
                    lenmode: 'fraction',
                    outlinewidth: 2,
                    x: 1,
                    y: 1,
                    xanchor: 'left',
                    yanchor: 'top',
                    ticklen: 20,
                    ticks: 'inside',
                    tickwidth: 2,
                    title: "kg/m" + "3".sup(),
                    titleside: 'top',
                    titlefont: {
                        color: '#000',
                        size: 14
                    }
                }
            }
        ], {
            hovermode: 'closest',
            margin: {
                t: 50,
                b: 50,
                l: 60,
                r: 80,
                autoexpand: false
            },
            showlegend: false,
            plot_bgcolor: "#c8c8c8",
            title: ((data.length > 20) ? data.substr(19) + "  " : "") + "<b>" + data.substr(0, 10) + " " + data.substr(11, 8) + "</b>",
            titlefont: {
                size: 22,
                color: '#000',
                family: 'Arial'
            },
            xaxis2: {
                range: [tslim[2], tslim[3]],
                showgrid: false,
                showticklabels: false,
                linewidth: 2
            },
            yaxis2: {
                range: [tslim[0], tslim[1]],
                showgrid: false,
                showticklabels: false,
                linewidth: 2
            },
            xaxis: {
                overlaying: 'x2',
                gridcolor: "#FFF",
                hoverformat: ".2f",
                range: [tslim[2], tslim[3]],
                showgrid: true,
                showline: true,
                dtick: .2,
                tickformat: ".1f",
                ticklen: 8,
                ticks: 'outside',
                tickwidth: 2,
                tickcolor: "#000",
                tickfont: {
                    color: "#000",
                    size: 14
                },
                showticklabels: true,
                linecolor: "#000",
                linewidth: 2,
                title: "Salinity (psu)",
                titlefont: {
                    color: "#000",
                    size: 14
                }
            },
            yaxis: {
                overlaying: 'y2',
                showgrid: true,
                hoverformat: ".1f",
                gridcolor: "#FFF",
                range: [tslim[0], tslim[1]],
                showline: true,
                showticklabels: true,
                tickformat: ".0f",
                ticklen: 8,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "#000",
                tickfont: {
                    color: "#000",
                    size: 14
                },
                linecolor: "#000",
                linewidth: 2,
                title: "Temperature (" + "o".sup() + "C)",
                titlefont: {
                    color: "#000",
                    size: 14
                }
            },
            text: {
                hoverformat: "i"
            }
        }, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d',
                'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian'
            ],
            displaylogo: false
        }, {
            showLink: false
        }
    ); //end of Plot
}; //end of func plotargo_tsdiag
function plotpnttopo(data, sdata, sx, sy) {
    document.getElementById('abc').style.maxWidth = "800px";
    document.getElementById('abc').style.width = "50vh";
    document.getElementById('abc').style.maxHeight = "600px";
    document.getElementById('abc').style.height = "50vh";
    document.getElementById('abc').style.display = "block";
    var ABCD = document.getElementById('abcchart');
    Plotly.newPlot(ABCD,
        [{
                x: sdata.x,
                y: sdata.y,
                z: sdata.z,
                type: 'surface',
                zaxis: 'z',
                hoverinfo: 'z',
                hovermode: 'closest',
                colorscale: 'Jet',
                reversescale: false,
                showscale: true,
                colorbar: {
                    thickness: 20,
                    thicknessmode: 'pixels',
                    outlinecolor: '#000',
                    len: 0.3,
                    lenmode: 'fraction',
                    outlinewidth: 2,
                    x: 1,
                    y: 0.6,
                    xanchor: 'right',
                    yanchor: 'bottom',
                    ticklen: 20,
                    ticks: 'inside',
                    tickvals: [0, -1000, -2000, -3000, -4000],
                    ticktext: ['0', '-1', '-2', '-3', '-4'],
                    tickwidth: 2,
                    title: 'km',
                    titleside: 'top',
                    titlefont: {
                        color: '#000',
                        size: 14
                    }
                },
                lighting: {
                    fresnel: 0.7,
                    specular: 0.2,
                    ambient: 0.4,
                    roughness: 0.5
                }
            },
            {
                x: [sx],
                y: [sy],
                z: [sdata.z[10][10] * 0.9],
                type: 'scatter3d',
                xaxis: 'x2',
                yaxis: 'y2',
                zaxis: 'z2',
                name: 'ArgoPosition',
                mode: 'markers',
                hovermode: 'closest',
                hoverinfo: 'name+x+y',
                showscale: false,
                autorange: false,
                marker: {
                    size: 6,
                    color: '#000',
                    line: {
                        color: '#fff',
                        width: 1
                    },
                    symbol: "circle",
                    opacity: 0.8
                }
            },
        ], {
            hovermode: 'closest',
            margin: {
                t: 0,
                b: 0,
                l: 0,
                r: 0,
                autoexpand: true
            },
            x0: 1,
            xpad: 0,
            ypad: 0,
            showlegend: false,
            paper_bgcolor: "#fff",
            title: "<br><b>" + data.substr(0, 10) + " " + data.substr(11, 8) + "</b>",
            titlefont: {
                size: 22,
                color: '#000',
                family: 'Arial'
            },
            scene: {
                camera: {
                    eye: {
                        x: 0.7,
                        y: -1.5,
                        z: 1.1
                    }
                },
                xaxis: {
                    backgroundcolor: "#555555",
                    showbackground: true,
                    showline: true,
                    linecolor: '#000',
                    linewidth: 6,
                    ticks: 'outside',
                    ticklen: 6,
                    tickwidth: 4,
                    hoverformat: '.1f',
                    showgrid: true,
                    gridwidth: 2,
                    gridcolor: '#fff'
                },
                yaxis: {
                    backgroundcolor: "#969696",
                    showbackground: true,
                    showline: true,
                    hoverformat: '.1f',
                    linecolor: '#000',
                    linewidth: 6,
                    ticks: 'outside',
                    ticklen: 6,
                    tickwidth: 4,
                    showgrid: true,
                    gridwidth: 2,
                    gridcolor: '#fff'
                },
                zaxis: {
                    backgroundcolor: "#282828",
                    showbackground: true,
                    showline: true,
                    zeroline: false,
                    linecolor: '#000',
                    linewidth: 6,
                    ticks: 'outside',
                    ticklen: 6,
                    tickwidth: 4,
                    hoverformat: '.0f',
                    showgrid: true,
                    gridwidth: 2,
                    gridcolor: '#fff'
                },
            },
            xaxis2: {
                overlaying: 'x1',
                side: 'top',
                hoverformat: ".2f"
            },
            yaxis2: {
                overlaying: 'y1',
                side: 'top',
                hoverformat: ".2f"
            },
            zaxis2: {
                overlaying: 'z1',
                side: 'top',
                hoverformat: ".0f"
            },
        }, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'zoom3d', 'pan2d', 'pan3d',
                'orbitRotation', 'tableRotation', 'resetCameraDefault3d', 'resetCameraLastSave3d', 'hoverClosest3d',
                'toggleHover', 'resetViews'
            ],
            displaylogo: false
        }, {
            showLink: false
        }
    ); //end of Plot
}; //end of func plotpnttopo
function plotsvp(data, pdata, svpww) {
    document.getElementById('abc').style.maxWidth = "600px";
    document.getElementById('abc').style.width = "50vh";
    document.getElementById('abc').style.maxHeight = "600px";
    document.getElementById('abc').style.height = "50vh";
    document.getElementById('abc').style.display = "block";
    var xr = [Math.min.apply(Math, pdata.x) - .1, Math.max.apply(Math, pdata.x) + .1];
    var yr = [Math.min.apply(Math, pdata.y) - .1, Math.max.apply(Math, pdata.y) + .1];
    var dxy = Math.max(xr[1] - xr[0], yr[1] - yr[0]) / 2;
    xr = (xr[1] + xr[0]) / 2;
    yr = (yr[1] + yr[0]) / 2;
    xr = [xr - dxy, xr + dxy];
    yr = [yr - dxy, yr + dxy];
    var nxy = pdata.x.length - 1;
    var pdatatm = pdata.tm;
    if (nxy < 0) {
        var sn = ((svpww[0]).substr(0, 1) == 'S') ? '"Speed" not found, please try "TempC"' : '"TempC" not found, please try "Speed"'
    } else {
        var sn = '';
        pdatatm = pdatatm.map(function (jj, j) {
            var i = String(jj);
            return i.substr(0, 4) + "-" + i.substr(4, 2) + "-" + i.substr(6, 2) + " " + i.substr(8, 2) + ":" + i.substr(10, 2) + "<br>" + pdata.a[j] + svpww[2]
        });
    };
    var ABC = document.getElementById('abcchart');
    Plotly.newPlot(ABC,
        [{
            x: pdata.x,
            y: pdata.y,
            type: 'scatter',
            text: pdatatm,
            /*name:svpww[0],*/ hoverinfo: 'x+y+text',
            xaxis: 'x1',
            mode: 'markers+lines',
            line: {
                color: '#000',
                dash: 'solid',
                width: 2
            },
            marker: {
                color: pdata.a,
                size: 10,
                colorscale: svpww[1],
                colorbar: {
                    thickness: 10,
                    thicknessmode: 'pixels',
                    outlinecolor: '#fff',
                    len: 0.6,
                    lenmode: 'fraction',
                    outlinewidth: 2,
                    ticklen: 10,
                    ticks: 'inside',
                    tickwidth: 2,
                    x: 1,
                    y: 0.8,
                    xanchor: 'left',
                    xpad: 5,
                    yanchor: 'top',
                    ypad: 0,
                    title: svpww[2],
                    titlefont: {
                        size: 14,
                        color: '#fff'
                    },
                    tickcolor: '#000',
                    tickfont: {
                        color: '#fff',
                        size: 12
                    }
                },
                reversescale: svpww[4]
            },
            hoverformat: "yyyy-mm-dd HH:MM",
            showscale: true
        }], {
            margin: {
                t: 50,
                b: 50,
                l: 60,
                r: 50,
                autoexpand: false
            },
            hovermode: 'closest',
            paper_bgcolor: "rgba(0,0,0,0.8)",
            showlegend: false,
            plot_bgcolor: "rgba(92,92,92,1)",
            hoverlabel: {
                bordercolor: '#000'
            },
            annotations: [{
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.6,
                    xanchor: 'center',
                    y: 1,
                    yanchor: 'bottom',
                    align: 'center',
                    text: svpww[3] + '<br> ',
                    showarrow: false,
                    font: {
                        size: 20,
                        color: '#fff'
                    }
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0,
                    xanchor: 'left',
                    y: 1,
                    yanchor: 'bottom',
                    showarrow: false,
                    text: "latest:<br>" + data.substr(0, 10) + " " + data.substr(11, 8),
                    font: {
                        size: 12,
                        color: '#f9f'
                    },
                    align: 'left'
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.05,
                    y: 0.9,
                    text: "<i>" + sn + "</i>",
                    showarrow: false,
                    align: 'center',
                    font: {
                        size: 24,
                        color: '#f9f'
                    }
                },
                {
                    x: pdata.x[nxy],
                    y: pdata.y[nxy],
                    xref: 'x',
                    yref: 'y',
                    text: '<b>*</b>',
                    showarrow: false,
                    font: {
                        size: 28,
                        color: '#f9f'
                    },
                    align: 'center'
                }
            ],
            xaxis: {
                gridcolor: "#aaa",
                hoverformat: ".2f",
                range: xr,
                gridwidth: 0.5,
                zeroline: false,
                showgrid: true,
                showline: true,
                showticklabels: true,
                borderwidth: 2,
                tickformat: "f",
                ticklen: 8,
                ticks: 'outside',
                tickwidth: 2,
                linewidth: 2,
                tickfont: {
                    color: "#fff",
                    size: 14
                },
                linecolor: "#fff",
                title: "Longitude (" + "o".sup() + "E)",
                titlefont: {
                    color: "#fff",
                    size: 14
                }
            },
            yaxis: {
                gridcolor: "#aaa",
                hoverformat: ".2f",
                range: yr,
                gridwidth: 0.5,
                zeroline: false,
                showgrid: true,
                showline: true,
                borderwidth: 2,
                showticklabels: true,
                tickformat: "f",
                ticklen: 8,
                ticks: 'outside',
                tickwidth: 2,
                linecolor: "#fff",
                tickfont: {
                    color: "#fff",
                    size: 14
                },
                linewidth: 2,
                title: "Latitude (" + "o".sup() + "N)",
                titlefont: {
                    color: "#fff",
                    size: 14
                }
            }
        }, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d',
                'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian'
            ],
            displaylogo: false
        }, {
            showLink: false
        }
    ); //end of Plot
}; //end of func plotsvp
function plotsvptime(data, pdata) {
    document.getElementById('abc').style.maxWidth = "800px";
    document.getElementById('abc').style.width = "65vw";
    document.getElementById('abc').style.maxHeight = "600px";
    document.getElementById('abc').style.height = "50vh";
    document.getElementById('abc').style.display = "block";
    var um = [Math.min.apply(Math, [Math.min.apply(Math, pdata.u), Math.min.apply(Math, pdata.v)]) - 0.2,
        Math.max.apply(Math, [Math.max.apply(Math, pdata.u), Math.max.apply(Math, pdata.v)]) + 0.2
    ];
    var ABC = document.getElementById('abcchart');
    Plotly.newPlot(ABC,
        [{
                x: pdata.tmt,
                y: pdata.t,
                type: 'scatter',
                name: "T (degC)",
                line: {
                    color: "#0ff",
                    width: 3,
                    size: 20
                }
            },
            {
                x: pdata.tmu,
                y: pdata.u,
                type: 'scatter',
                xaxis: 'x2',
                yaxis: 'y2',
                name: "U (m/s)",
                line: {
                    color: "#ffff66",
                    width: 2,
                    size: 20
                }
            },
            {
                x: pdata.tmu,
                y: pdata.v,
                type: 'scatter',
                xaxis: 'x2',
                yaxis: 'y3',
                name: "V (m/s)",
                line: {
                    color: "#81ef78",
                    width: 3,
                    size: 20
                }
            }
        ], {
            hovermode: 'x',
            margin: {
                t: 50,
                b: 50,
                l: 60,
                r: 60,
                autoexpand: false
            },
            paper_bgcolor: "rgba(0,0,0,0.8)",
            showlegend: false,
            plot_bgcolor: "rgba(92,92,92,1)",
            hoverlabel: {
                bordercolor: '#000'
            },
            annotations: [{
                xref: 'paper',
                yref: 'paper',
                x: 0.5,
                xanchor: 'center',
                y: 1,
                yanchor: 'bottom',
                align: 'center',
                showarrow: false,
                text: "Time-Series",
                font: {
                    size: 20,
                    color: '#fff'
                }
            }],
            xaxis: {
                domain: [0, 1],
                gridcolor: "#ccc",
                gridwidth: 0.2,
                zeroline: false,
                type: 'date',
                hoverformat: "",
                showgrid: true,
                showticklabels: true,
                showline: true,
                borderwidth: 2,
                zeroline: false,
                ticklen: 8,
                ticks: 'outside',
                tickwidth: 2,
                tickfont: {
                    color: "#fff",
                    size: 14
                },
                linecolor: "#fff",
                linewidth: 2
            },
            yaxis: {
                domain: [0.55, 1],
                hoverformat: ".2f",
                showgrid: true,
                gridcolor: "#ccc",
                gridwidth: 0.2,
                ticklen: 8,
                ticks: 'outside',
                range: [Math.min.apply(Math, pdata.t) - 1, Math.max.apply(Math, pdata.t) + 1],
                tickwidth: 2,
                tickcolor: '#0ff',
                showline: true,
                linecolor: '#0ff',
                zeroline: false,
                borderwidth: 2,
                showticklabels: true,
                tickformat: "i",
                tickfont: {
                    color: "#0ff",
                    size: 14
                },
                linewidth: 2,
                title: "Temperature " + "o".sup() + "C",
                titlefont: {
                    color: "#0ff",
                    size: 14
                }
            },
            xaxis2: {
                domain: [0, 1],
                side: 'bottom',
                anchor: 'y2',
                gridcolor: "#ccc",
                gridwidth: 0.2,
                zeroline: false,
                type: 'date',
                hoverformat: "",
                showgrid: true,
                showticklabels: true,
                showline: true,
                borderwidth: 2,
                zeroline: false,
                ticklen: 8,
                ticks: 'outside',
                tickwidth: 2,
                tickfont: {
                    color: "#fff",
                    size: 14
                },
                linecolor: "#fff",
                linewidth: 2,
                title: "Time (UTC)",
                titlefont: {
                    color: "#ccc",
                    size: 16
                }
            },
            yaxis2: {
                domain: [0, 0.45],
                anchor: 'x2',
                showgrid: true,
                range: um,
                hoverformat: ".2f",
                gridwidth: 0.2,
                gridcolor: '#ccc',
                showticklabels: true,
                showline: true,
                zeroline: false,
                tickformat: ".1f",
                ticklen: 8,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "#ffff66",
                tickfont: {
                    color: "#ffff66",
                    size: 14
                },
                linecolor: "#ffff66",
                linewidth: 2,
                title: "U velocity (m/s)",
                titlefont: {
                    color: "#ffff66",
                    size: 14
                }
            },
            yaxis3: {
                domain: [0, 0.45],
                anchor: 'x2',
                overlaying: 'y2',
                side: 'right',
                showgrid: false,
                range: um,
                hoverformat: ".2f",
                showticklabels: true,
                showline: true,
                zeroline: true,
                zerolinecolor: '#fff',
                zerolinewidth: 3,
                tickformat: ".1f",
                ticklen: 8,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "#81ef78",
                tickfont: {
                    color: "#81ef78",
                    size: 14
                },
                linecolor: "#81ef78",
                linewidth: 2,
                title: "V velocity (m/s)",
                titlefont: {
                    color: "#81ef78",
                    size: 14
                }
            }
        }, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d',
                'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian'
            ],
            displaylogo: false
        }, {
            showLink: false
        }
    ); //end of Plot
}; //end of func plotsvptime
function plotglider(data, pdata) {
    document.getElementById('abc').style.maxWidth = "500px";
    document.getElementById('abc').style.width = "45vh";
    document.getElementById('abc').style.maxHeight = "900px";
    document.getElementById('abc').style.height = "75vh";
    document.getElementById('abc').style.display = "block";
    var ABC = document.getElementById('abcchart');
    //KUOtemp 2019.01.04 (1 line)
    //KUOc 20190519
    //  var dox=(document.getElementById('sgmod').value=='628')?(pdata.o.map(function(x){return x*1.1524+6.8641})):(pdata.o.map(function(x){return x*1.0954+10.289}));
    var dox = (document.getElementById('sgmod').value == '628') ? ((parseInt(document.getElementById('sgcrmod').value) < 7) ? pdata.o.map(function (x) {
        return x * 1.1524 + 6.8641
    }) : pdata.o.map(function (x) {
        return x * 0.9934 + 7.7484
    })) : ((parseInt(document.getElementById("sgcrmod").value) == 2) ? pdata.o.map(function (x) {
        return x * 1.0954 + 10.289
    }) : pdata.o.map(function (x) {
        return x * 1.0624 + 11.805
    }));

    Plotly.newPlot(ABC,
        [{
                x: pdata.t,
                y: pdata.p,
                type: 'scatter',
                xaxis: 'x1',
                hoverinfo: 'x+y+name',
                hovermode: 'x',
                name: "Temp (&#8451;)",
                line: {
                    color: "rgb(0,0,255)",
                    width: 2,
                    size: 20
                }
            },
            {
                x: pdata.s,
                y: pdata.p,
                type: 'scatter',
                xaxis: 'x2',
                hoverinfo: 'x+y+name',
                name: "Salinity (psu)",
                line: {
                    color: "rgb(224,0,0)",
                    width: 2,
                    size: 20
                }
            },
            {
                x: pdata.r,
                y: pdata.p,
                type: 'scatter',
                xaxis: 'x3',
                hoverinfo: 'x+y+name',
                name: "&#961; (kg/m&sup3;)",
                line: {
                    color: "rgb(0,127,0)",
                    width: 1,
                    size: 20
                }
            },
            {
                x: dox,
                y: pdata.p,
                type: 'scatter',
                xaxis: 'x4',
                hoverinfo: 'x+y+name',
                name: "DO (&#956;M)",
                marker: {
                    size: 2,
                    color: "rgb(255,0,255)"
                },
                mode: "markers"
            },
            {
                x: pdata.c,
                y: pdata.p,
                type: 'scatter',
                xaxis: 'x5',
                hoverinfo: 'x+y+name',
                mode: 'markers',
                name: "Chl (&#956g/L)",
                marker: {
                    color: "rgb(255,255,0)",
                    width: 1,
                    size: 3
                }
            }
        ], {
            hovermode: 'closest',
            margin: {
                t: 50,
                b: 0,
                l: 80,
                r: 10,
                autoexpand: false
            },
            x0: 2,
            showlegend: false,
            plot_bgcolor: "#c8c8c8",
            annotations: [{
                    xref: 'paper',
                    yref: 'paper',
                    x: 0,
                    xanchor: 'right',
                    y: 1,
                    yanchor: 'bottom',
                    text: "<b>" + data.substr(19) + "</b><br>" + data.substr(0, 10) + "<br>" + data.substr(11, 8),
                    showarrow: false,
                    font: {
                        size: 12,
                        color: '#555'
                    },
                    align: 'left'
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    xanchor: 'middle',
                    y: 0.15,
                    yanchor: 'bottom',
                    text: "Temperature (&#8451;)",
                    showarrow: false,
                    font: {
                        size: 14,
                        color: '#00f'
                    },
                    align: 'left'
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0,
                    xanchor: 'right',
                    y: 0.15,
                    yanchor: 'top',
                    text: "&#961;(kg/m&sup3;) ",
                    showarrow: false,
                    font: {
                        size: 13,
                        color: '#070'
                    },
                    align: 'left'
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0,
                    xanchor: 'right',
                    y: 0.1,
                    yanchor: 'top',
                    text: "DO  (&#956;M) ",
                    showarrow: false,
                    font: {
                        size: 13,
                        color: '#f0f'
                    },
                    align: 'left'
                },
                {
                    xref: 'paper',
                    yref: 'paper',
                    x: 0,
                    xanchor: 'right',
                    y: 0.05,
                    yanchor: 'top',
                    text: "Chl (&#956;g/L)",
                    showarrow: false,
                    font: {
                        size: 13,
                        color: '#990'
                    },
                    align: 'left'
                }
            ],
            xaxis5: {
                showgrid: false,
                hoverformat: ".2f",
                range: [-0.3, Math.max.apply(Math, pdata.c) + 0.02],
                showticklabels: true,
                showline: true,
                zeroline: false,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "rgb(185,185,0)",
                side: 'bottom',
                position: 0.05,
                tickfont: {
                    color: "rgb(185,185,0)",
                    size: 12
                },
                linecolor: "rgb(185,185,0)",
                linewidth: 2,
                ticklen: 4
            },
            xaxis4: {
                overlaying: 'x5',
                showgrid: false,
                hoverformat: ".1f",
                range: [50, 330],
                connectgaps: false,
                showticklabels: true,
                showline: true,
                zeroline: false,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "rgb(255,0,255)",
                side: 'bottom',
                position: 0.1,
                tickfont: {
                    color: "rgb(255,0,255)",
                    size: 12
                },
                linecolor: "rgb(255,0,255)",
                linewidth: 2,
                ticklen: 4
            },
            xaxis3: {
                overlaying: 'x5',
                showgrid: false,
                hoverformat: ".1f",
                range: [Math.min.apply(Math, pdata.r) - 0.2, Math.max.apply(Math, pdata.r) + 0.2],
                showticklabels: true,
                showline: true,
                zeroline: false,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "rgb(0,127,0)",
                side: 'bottom',
                position: 0.15,
                tickfont: {
                    color: "rgb(0,127,0)",
                    size: 12
                },
                linecolor: "rgb(0,127,0)",
                linewidth: 2,
                ticklen: 4
            },
            xaxis2: {
                overlaying: 'x5',
                showgrid: false,
                hoverformat: ".2f",
                range: [33, 35],
                showticklabels: true,
                showline: true,
                zeroline: false,
                tickformat: ".1f",
                ticklen: 4,
                ticks: 'outside',
                autotick: true,
                tickwidth: 2,
                tickcolor: "rgb(255,0,0)",
                side: 'top',
                tickfont: {
                    color: "rgb(255,0,0)",
                    size: 14
                },
                linecolor: "rgb(255,0,0)",
                linewidth: 2,
                title: "Salinity (psu)",
                titlefont: {
                    color: "#F00",
                    size: 14
                }
            },
            xaxis: {
                overlaying: 'x5',
                side: 'bottom',
                gridcolor: "rgb(255,255,255)",
                hoverformat: ".1f",
                range: [Math.min.apply(Math, pdata.t) - 1, Math.max.apply(Math, pdata.t) + 1],
                showgrid: true,
                showticklabels: true,
                showline: true,
                zeroline: false,
                autotick: true,
                tickformat: "f",
                ticklen: 4,
                ticks: 'outside',
                tickwidth: 2,
                tickcolor: "rgb(0,0,255)",
                tickfont: {
                    color: "rgb(0,0,255)",
                    size: 14
                },
                linecolor: "rgb(0,0,255)",
                linewidth: 2
                /*,
                          title:"Temperature (&#8451;)",titlefont:{color:"#00F",size:14}*/
            },
            yaxis: {
                hoverformat: ".0f",
                domain: [0.23, 1],
                showgrid: true,
                range: [Math.min.apply(Math, pdata.p), 0],
                gridcolor: "rgb(255,255,255)",
                showline: true,
                zeroline: false,
                borderwidth: 2,
                showticklabels: true,
                /*dtick: 100,*/
                tickformat: "i",
                tickfont: {
                    color: "#000",
                    size: 12
                },
                linewidth: 2,
                title: "Depth (m)",
                titlefont: {
                    color: "#000",
                    size: 14
                }
            },
        }, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d',
                'zoomOut2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian'
            ],
            displaylogo: false
        }, {
            showLink: false
        }
    ); //end of Plot
}; //end of func plotglider
function plottracktopo(data, pdata) {
    var b = 0.35;
    var xy = [Math.min.apply(Math, pdata.x) - b, Math.min.apply(Math, pdata.y) - b,
        Math.max.apply(Math, pdata.x) + b, Math.max.apply(Math, pdata.y) + b
    ];
    $.getJSON("/grd/seaclim/depthsea/" + xy + "/csv", function (a) {
        var sdata = a[0];
        document.getElementById('abc').style.maxWidth = "750px";
        document.getElementById('abc').style.width = "65vh";
        document.getElementById('abc').style.maxHeight = "750px";
        document.getElementById('abc').style.height = "65vh";
        document.getElementById('abc').style.display = "block";
        var ABC = document.getElementById('abcchart');
        Plotly.newPlot(ABC,
            [{
                    x: sdata.x,
                    y: sdata.y,
                    z: sdata.z,
                    type: 'surface',
                    zaxis: 'z',
                    hoverinfo: 'z',
                    hovermode: 'closest',
                    colorscale: 'Blackbody',
                    reversescale: false,
                    showscale: true,
                    colorbar: {
                        thickness: 20,
                        thicknessmode: 'pixels',
                        outlinecolor: '#000',
                        tickvals: [0, -1000, -2000, -3000, -4000],
                        ticktext: ['0', '-1', '-2', '-3', '-4'],
                        len: 0.3,
                        lenmode: 'fraction',
                        outlinewidth: 2,
                        x: 1,
                        y: 0.6,
                        xanchor: 'right',
                        yanchor: 'bottom',
                        ticklen: 20,
                        ticks: 'inside',
                        tickwidth: 2,
                        title: 'km',
                        titleside: 'top',
                        titlefont: {
                            color: '#000',
                            size: 14
                        }
                    },
                    lighting: {
                        fresnel: 0.7,
                        specular: 0.2,
                        ambient: 0.4,
                        roughness: 0.5
                    }
                },
                {
                    x: pdata.x,
                    y: pdata.y,
                    z: pdata.z,
                    type: 'scatter3d',
                    xaxis: 'x2',
                    yaxis: 'y2',
                    zaxis: 'z2',
                    name: 'Glider',
                    mode: 'lines+markers',
                    text: pdata.t,
                    range: [8, 28],
                    hovermode: 'closest',
                    hoverinfo: 'x+y+z+text',
                    showscale: true,
                    line: {
                        width: 6,
                        color: pdata.t,
                        colorscale: 'Jet'
                    },
                    marker: {
                        size: 1,
                        color: pdata.t,
                        colorscale: 'Jet',
                        colorbar: {
                            thickness: 20,
                            thicknessmode: 'pixels',
                            outlinecolor: '#000',
                            len: 0.3,
                            lenmode: 'fraction',
                            outlinewidth: 2,
                            x: 1,
                            y: 0,
                            xanchor: 'right',
                            yanchor: 'bottom',
                            ticklen: 20,
                            ticks: 'inside',
                            tickwidth: 2,
                            title: 'o'.sup() + 'C',
                            titleside: 'top',
                            titlefont: {
                                color: '#000',
                                size: 14
                            }
                        }
                    }
                }
            ], {
                hovermode: 'closest',
                margin: {
                    t: 0,
                    b: 0,
                    l: 0,
                    r: 0,
                    autoexpand: true
                },
                x0: 1,
                showlegend: false,
                paper_bgcolor: "#fff",
                xpad: 0,
                ypad: 0,
                title: data.substr(19) + "  <b>" + data.substr(0, 10) + " " + data.substr(11, 8) + "</b><br> ",
                titlefont: {
                    size: 22,
                    color: '#000',
                    family: 'Arial'
                },
                scene: {
                    camera: {
                        eye: {
                            x: 0.7,
                            y: -1.5,
                            z: 1.1
                        }
                    },
                    xaxis: {
                        backgroundcolor: "rgb(85,85,85)",
                        showbackground: true,
                        showline: true,
                        linecolor: '#000',
                        linewidth: 6,
                        ticks: 'outside',
                        ticklen: 6,
                        tickwidth: 4,
                        hoverformat: '.1f',
                        showgrid: true,
                        gridwidth: 2,
                        gridcolor: '#fff'
                    },
                    yaxis: {
                        backgroundcolor: "rgb(150,150,150)",
                        showbackground: true,
                        showline: true,
                        linecolor: '#000',
                        linewidth: 6,
                        ticks: 'outside',
                        ticklen: 6,
                        tickwidth: 4,
                        hoverformat: '.1f',
                        showgrid: true,
                        gridwidth: 2,
                        gridcolor: '#fff'
                    },
                    zaxis: {
                        backgroundcolor: "rgb(40,40,40)",
                        showbackground: true,
                        showline: true,
                        linecolor: '#000',
                        linewidth: 6,
                        ticks: 'outside',
                        ticklen: 6,
                        tickwidth: 4,
                        hoverformat: '.0f',
                        showgrid: true,
                        gridwidth: 2,
                        gridcolor: '#fff',
                        zeroline: false
                    }
                },
                xaxis2: {
                    overlaying: 'x1',
                    side: 'top',
                    hoverformat: ".1f"
                },
                yaxis2: {
                    overlaying: 'y1',
                    side: 'top',
                    hoverformat: ".1f"
                },
                zaxis2: {
                    overlaying: 'z1',
                    side: 'top',
                    hoverformat: ".0f"
                }
            }, {
                modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian', 'zoom2d', 'zoom3d', 'pan2d', 'pan3d', 'orbitRotation',
                    'tableRotation', 'resetCameraDefault3d', 'resetCameraLastSave3d', 'hoverClosest3d', 'toggleHover', 'resetViews'
                ],
                displaylogo: false
            }, {
                showLink: false
            }
        ); //end of Plot
    });
}; //end of func plottracktopo
function toggleModel() {
    let imgextent_guam
    if (da5 >= 20201203) {
        imgextent_guam = new ol.extent.applyTransform([105, 2, 150, 35], ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
    } else {
        imgextent_guam = imgextent;
    };
    if (document.getElementById("btmodel").checked) {
        var i = document.querySelector("input[name=modelfig]:checked").value;
        var j = document.getElementById("modeldep").value;
        j = ($.inArray(i, ['z', 'b', 'm']) >= 0) ? 0 : j;
        model.setSource(new ol.source.ImageStatic({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/forecast/" + da5 + "/" + i + j + ".png",
            projection: 'EPSG:' + pj,
            imageExtent: imgextent_guam,
            crossOrigin: 'anonymous'
        }));
        model.setVisible(true);
        model.setOpacity(1 - document.getElementById("alphabarmodel").value / 10);
        document.getElementById("colorbar3").src = "https://odbpo.oc.ntu.edu.tw/static/figs/forecast/colorbar/" + i + ".png";
        document.getElementById("colorbar3").style.visibility = "visible";
    } else {
        model.setVisible(false);
        document.getElementById("colorbar3").src = "";
        document.getElementById("colorbar3").style.visibility = "hidden";
    };
}; //end of func toggleModel
function toggleMeanfield(a) {
    if (a) {
        document.getElementById('meanfield').scrollIntoView(true);
        drawClimfig();
    } else {
        if (climgrid.getVisible()) {
            toggleClimGrid(false);
        };
        if (climpoly.getVisible()) {
            toggleClimPoly(false);
        };
        toggleClimXYmap(false);
        closeClimsectz();
        closeClimtsfig();
        closeClimpzfig();
    };
}; //end of func toggleMeanfield
function toggleClimXYmap(a) {
    climxymap.setSource(null);
    climxymap.setVisible(a);
    var i = document.getElementById("colorbar4");
    var cn = mfvars[parseInt(document.getElementById('meanfieldvar').value)];
    if (a) {
        if (climgrid.getVisible()) {
            toggleClimGrid(false);
        };
        document.getElementById("btmeanfield").checked = true;
        climxymap.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/clim/xygeo/" + cn + "/" + mfymd + "/" + document.getElementById('mfarea1').value + "/geojson",
            defaultDataProjection: "EPSG:4326",
            format: new ol.format.GeoJSON()
        }));
        if (i.src.length < 2 || i.src[54] != cn) {
            document.getElementById("colorbar4").src = "https://odbpo.oc.ntu.edu.tw/static/figs/clim/colorbar/a" + cn + "colorbar.png";
        };
        document.getElementById("acolorbar4").style.display = "block";
        climxymap.once("change", function () {
            if (climxymap.getSource() != null && climxymap.getSource().getState() == 'ready') {
                $.getJSON(climxymap.getSource().getUrl() + "json", function (ii) {
                    document.getElementById("colorbar4min").innerHTML = ii.min;
                    document.getElementById("colorbar4max").innerHTML = ii.max;
                })
            }
        });
        document.getElementById("mfxytab1").dataset.mf = document.getElementById('meanfieldvar').value + "," + document.getElementById('mfarea1').value + "," + mfymd.toString();
    } else {
        document.getElementById("acolorbar4").style.display = "none";
    };
}; //end of func toggleClimXYmap
function toggleClimGrid(a) {
    if (a) {
        climgrid.setSource(new ol.source.Vector({
            url: "https://odbpo.oc.ntu.edu.tw/static/figs/clim/climgridxy4s.topojson",
            defaultDataProjection: "EPSG:4326",
            format: new ol.format.TopoJSON()
        }));
        climgrid.setVisible(true);
        grid.setVisible(false); //grid.strokeStyle_.color_="transparent";
        climgrid.getSource().addFeature(climselect);
        climpoly.setVisible(false);
    } else {
        climgrid.setSource(null);
        climgrid.setVisible(false);
        grid.setVisible(true);
        //climgrid.getSource().removeFeature(climselect);
    };
}; //end of func toggleClimGrid
function toggleClimPoly(a) {
    if (a) {
        if (climpoly.getOpacity() < 0.5) {
            climpoly.setSource(new ol.source.Vector({
                url: "https://odbpo.oc.ntu.edu.tw/static/figs/clim/climgridpolygon4.topojson",
                defaultDataProjection: "EPSG:4326",
                format: new ol.format.TopoJSON(),
                overlaps: false
            }));
            climpoly.setOpacity(1);
        };
        climpoly.setVisible(true);
        grid.setVisible(false);
        climpoly.getSource().addFeature(climselectp);
        climgrid.setVisible(false);
    } else {
        climpoly.setVisible(false);
        grid.setVisible(true);
        climpoly.getSource().removeFeature(climselectp);
    };
}; //end of func toggleClimPoly
function toggleFlow(t, e) {
    if (e) {
        document.getElementById("satexpandbtn").checked = true;
        document.getElementById("divsatblock").style.display = "block";
        if (windy != null) {
            windy.stop();
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        };
        //fetch('/odbargo/static/data/json/'+t+'/'+da4+'.json').then(function(response){return response.json();}).then(
        //function (json) {  windy=new Windy({canvas: canvas,data: json}); refreshWindy();});
        //console.log($.getJSON('/odbargo/get/argosvp/imgexist/'+t+'SLASH'+t+da4+'/io').responseJSON);
        $.getJSON('/odbargo/static/data/json/' + t + '/' + da4 + '.json', function (json) {
            windy = new Windy({
                canvas: canvas,
                data: json
            });
            refreshWindy();
        });
    } else {
        windy.stop();
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
}; //end of func toggleFlow
function refreshWindy() {
    //if(!windy) {console.log('no'); return; }
    if (document.getElementById('btone2').checked) {
        return;
    }
    windy.stop();
    var mapSize = map.getSize();
    var extent = map.getView().calculateExtent(mapSize)
    extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    canvas.width = mapSize[0];
    canvas.height = mapSize[1];
    windy.start([
            [0, 0],
            [canvas.width, canvas.height]
        ], canvas.width, canvas.height,
        [
            [extent[0], extent[1]],
            [extent[2], extent[3]]
        ]);
    map.once('moveend', refreshWindy);
}; //end of func refreshWindy
function select_savemapbox() {
    var oldset = [document.querySelector('input[name="radios2"]:checked').id, document.getElementById("btlive").checked];
    if (!document.getElementById("btone2").checked) {
        document.getElementById("btone2").click();
    };
    document.getElementById("btlive").checked = false;
    document.getElementById("colorbar2").style.display = "none";
    document.getElementById("maptoggleform").style.display = "none";
    document.getElementById("pntcropmsg").innerHTML = (document.getElementById("infolangen").checked) ? "&nbsp;Click and drag on the map<button id=btncropo class=btncropox disabled>&#10004;OK</button><button id=btncropx class=btncropox>&#10006;<span class='KUOd-ib KUOfs-1 KUOlh-1'>CAN<br>CEL</span></button><div class='KUOml-dot5vw KUOfs-1'>or&nbsp;input&nbsp;:&nbsp;<span id=cropinspan></span></div>" : "&nbsp;於地圖上框選所需範圍<button id=btncropo class=btncropox disabled>&#10004;確定</button><button id=btncropx class=btncropox>&#10006;取消</button><div class='KUOml-dot5vw KUOfs-1'>或輸入：<span id=cropinspan></span></div>";
    document.getElementById('cropinspan').innerHTML = "<input type=text class=cropinput placeholder='West (0-360)'>&nbsp;&#8210;&nbsp;<input type=text class=cropinput placeholder='East (0-360)'><sup>o</sup>E&nbsp;,&nbsp;<input type=text class=cropinput placeholder='South (&#177;90)'>&nbsp;&#8210;&nbsp;<input type=text class=cropinput placeholder='North (&#177;90)'><sup>o</sup>N</span>";
    $(".cropinput").on("change", function () {
        var i = document.getElementsByClassName("cropinput");
        var j = [i[0].value, i[2].value, i[1].value, i[3].value].map(function (ii) {
            return parseFloat(ii);
        });
        if (j.every(function (ii) {
                return ii
            })) {
            pntpreparemap(new ol.proj.transformExtent(j, 'EPSG:4326', 'EPSG:3857'));
        };
    });

    document.getElementById("pntcropmsg").style.display = "block";
    document.getElementById("mapcontainer").style.cursor = "crosshair";
    $("#btncropx").on("click", function () {
        pntcropover();
    });
    $("#btncropo").on("click", function () {
        savemapbox();
        setTimeout(function () {
            pntcropover();
        }, 1000);
    });
    var dragbox = new ol.interaction.DragBox();
    map.addInteraction(dragbox);
    var wh = [$("#map").width(), $("#map").height()];
    var oldview = map.getView();
    dragbox.on('boxend', function () {
        pntpreparemap(dragbox.getGeometry().getExtent());
    });

    function pntpreparemap(ext) {
        //var ext=dragbox.getGeometry().getExtent();
        var dxy = (ext[2] - ext[0]) / (ext[3] - ext[1]);
        if (wh[0] * wh[0] / dxy > wh[1] * wh[1] * dxy) {
            $("#map").width(Math.round(wh[1] * dxy) + "px");
            $("#map").height(Math.round(wh[1]) + "px");
        } else {
            $("#map").height(Math.round(wh[0] / dxy) + "px");
            $("#map").width(Math.round(wh[0]) + "px");
        };
        map.updateSize();
        map.getView().fit(ext);
        map.renderSync();
        dragbox.setActive(false);

        if (oldset[0] != "btone2") {
            canvas.setAttribute('style', "width:" + Math.round($("#map").width()) + "px;height:" + Math.round($("#map").height()) + "px");
            document.getElementById(oldset[0]).click();
        };
        baselayer.once("postrender", function () {
            setTimeout(function () {
                document.getElementById('btncropo').disabled = false;
            }, 1000);
        });
    };

    function pntcropover() {
        document.getElementById("map").removeAttribute("style");
        document.getElementById("mapcontainer").removeAttribute("style");
        map.setView(oldview);
        map.removeInteraction(dragbox);
        map.updateSize();
        var i = document.getElementById('pntcropmsg');
        while (i.firstChild) {
            i.removeChild(i.firstChild)
        };
        i.removeAttribute("style");
        document.getElementById("btlive").checked = oldset[1];
        document.getElementById("colorbar2").style.display = "block";
        if (oldset[0] !== "btone2") {
            canvas.removeAttribute("style");
        };
        document.getElementById("maptoggleform").removeAttribute("style");
    };
}; //end of select_savemapbox
function savemapbox() {
    //  var bs=window.devicePixelRatio;
    var bs = 1;
    //b=[borderwidth,topmargin,leftmargin];
    var b = [10, 100, 100];
    var xgrid = grid.getMeridians();
    var ygrid = grid.getParallels();
    var xyg0 = [map.getPixelFromCoordinate(xgrid[0].getCoordinates()[0]),
        map.getPixelFromCoordinate(xgrid[0].getCoordinates()[1]),
        map.getPixelFromCoordinate(ygrid[0].getCoordinates()[0]),
        map.getPixelFromCoordinate(ygrid[0].getCoordinates()[1])
    ];
    var xg = new Array(xgrid.length + 2);
    var yg = new Array(ygrid.length + 2);
    var xt = new Array(xgrid.length);
    var yt = new Array(ygrid.length);
    var xgridlen = xgrid.length;
    var ygridlen = ygrid.length;
    for (var i = 0; i < xgridlen; i++) {
        xg[i + 1] = map.getPixelFromCoordinate(xgrid[i].getCoordinates()[0])[0];
        xt[i] = Math.round((ol.proj.toLonLat(xgrid[i].getCoordinates()[0], 'EPSG:3857')[0]) * 1000) / 1000;
        if (xt[i] < 0) {
            xt[i] = xt[i] + 360.0;
        };
    };
    for (var i = 0; i < ygridlen; i++) {
        yg[i + 1] = map.getPixelFromCoordinate(ygrid[i].getCoordinates()[1])[1];
        yt[i] = Math.round((ol.proj.toLonLat(ygrid[i].getCoordinates()[0], 'EPSG:3857')[1]) * 1000) / 1000;
    };
    xg[xgrid.length + 1] = xyg0[2][0];
    yg[ygrid.length + 1] = xyg0[0][1];
    xg[0] = xyg0[3][0];
    yg[0] = xyg0[1][1];
    xg = xg.sort(function (aa, bb) {
        return aa - bb
    });
    yg = yg.sort(function (aa, bb) {
        return aa - bb
    });
    xt = xt.sort(function (aa, bb) {
        return aa - bb
    });
    yt = yt.sort(function (aa, bb) {
        return bb - aa
    });
    if (xg[0] < 0) {
        for (var i = 1; i < xg.length; i++) {
            xg[i] = xg[i] - xg[0] + 0.25;
        };
        xg[0] = 0.25;
    };
    var xymax = [xg[xg.length - 1], yg[yg.length - 1]];
    var isdrawmodeon = (zseg == null) ? false : zseg.getActive();
    if (isdrawmodeon) {
        zseg.setActive(false);
    };
    var istidemodeon = (tidept == null) ? false : tidept.getActive();
    if (istidemodeon) {
        tidept.setActive(false);
    };
    //map.once('rendercomplete',function(event) {  var mapcanvas=event.context.canvas;
    map.once('rendercomplete', function () {
        //var mapcanvas=map.getTargetElement().firstElementChild.getElementsByTagName("canvas")[0];
        var mapcanvas = document.getElementById('map').querySelector('canvas');
        var pntmap = document.createElement("canvas");
        pntmap.width = mapcanvas.width + b[2] * 2;
        pntmap.height = mapcanvas.height + b[1] * 2;
        var pntctx = pntmap.getContext("2d");
        var ii = Math.max(Math.max(pntmap.height / 1100, pntmap.width / 1600), 1);
        pntctx.drawImage(mapcanvas, b[2], b[1]);
        if (!document.getElementById('btone2').checked) {
            //      var mapcanvas2=document.getElementById('flowmap'); pntctx.drawImage(mapcanvas2,b[2],b[1]);
            pntctx.drawImage(canvas, b[2], b[1]);
        };
        pntctx.beginPath();
        pntctx.font = 'bold ' + Math.round(16 + ii) + 'px Arial';
        pntctx.textAlign = 'right';
        pntctx.fillStyle = 'white';
        pntctx.fillRect(0, 0, xymax[0] * bs + b[2] * 2, b[1]);
        pntctx.fillRect(0, b[1], b[2], xymax[1] * bs + b[1]);
        pntctx.fillRect(b[2], xymax[1] * bs + b[1], xymax[0] * bs + b[2], b[1]);
        pntctx.fillRect(xymax[0] * bs + b[2], b[1], b[2], xymax[1] * bs);
        for (var i = 0; i < yg.length - 1; i++) {
            pntctx.fillStyle = (i % 2 > 0) ? 'black' : 'white';
            pntctx.fillRect(b[2] - b[0], yg[i] * bs + b[1], b[0], (yg[i + 1] - yg[i]) * bs);
            pntctx.fillRect(xymax[0] * bs + b[2], yg[i] * bs + b[1], b[0], (yg[i + 1] - yg[i]) * bs);
            pntctx.fillStyle = 'black';
            if (i > 0) {
                pntctx.fillText(yt[i - 1] + "\u00B0" + "N", b[2] - b[0], yg[i] * bs + b[1] + 10);
            };
        };
        pntctx.textAlign = 'center';
        for (var i = 0; i < xg.length - 1; i++) {
            pntctx.fillStyle = (i % 2 > 0) ? 'black' : 'white';
            pntctx.fillRect(xg[i] * bs + b[2], b[1] - b[0], (xg[i + 1] - xg[i]) * bs, b[0]);
            pntctx.fillRect(xg[i] * bs + b[2], xymax[1] * bs + b[1], (xg[i + 1] - xg[i]) * bs, b[0]);
            pntctx.fillStyle = 'black';
            if (i > 0) {
                pntctx.fillText(xt[i - 1] + "\u00B0" + "E", xg[i] * bs + b[2], xymax[1] * bs + b[1] + b[0] * 2 + 10);
            };
        };
        pntctx.fillStyle = 'black';
        pntctx.fillRect(b[2] - b[0], b[1] - b[0], b[0], b[0]);
        pntctx.fillRect(b[2] + xymax[0] * bs, b[1] - b[0], b[0], b[0]);
        pntctx.fillStyle = 'white';
        pntctx.fillRect(b[2] - b[0], xymax[1] * bs + b[1], b[0], b[0]);
        pntctx.fillRect(b[2] + xymax[0] * bs, xymax[1] * bs + b[1], b[0], b[0]);
        pntctx.lineWidth = 1;
        pntctx.strokeStyle = 'white';
        pntctx.strokeRect(b[2], b[1], mapcanvas.width, mapcanvas.height);
        pntctx.strokeStyle = 'black';
        pntctx.strokeRect(b[2] - b[0], b[1] - b[0], mapcanvas.width + b[0] * 2, mapcanvas.height + b[0] * 2);
        pntmap.style.position = "absolute";
        pntmap.style.top = "0";
        pntmap.style.left = "0";
        pntctx.closePath();
        var imgcb = document.getElementById('colorbar');
        var fn = 'Hidy';
        if (imgcb.style.visibility == 'visible') {
            pntctx.drawImage(imgcb, b[2] + xymax[0] * bs - imgcb.naturalWidth, 5);
            fn = fn + '_' + (['sst', 'ssh', 'ssha', 'chla'])[document.querySelector('input[name="radios"]:checked').value - 1] + da4;
        };
        if (pntmap.width > 1600 || pntmap.height > 1100) {
            var pntmap2 = document.createElement("canvas");
            var pntctx2 = pntmap2.getContext("2d");
            pntmap2.height = (pntmap.height) / ii;
            pntmap2.width = (pntmap.width) / ii;
            pntctx2.drawImage(pntmap, 0, 0, pntmap.width, pntmap.height, 0, 0, pntmap2.width, pntmap2.height);
            pntmap = pntmap2;
        };
        document.body.appendChild(pntmap);
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(pntmap.msToBlob(), fn + '.png');
        } else {
            pntmap.toBlob(function (blob) {
                saveAs(blob, fn + '.png');
            });
        };
        document.body.removeChild(pntmap);
        if (isdrawmodeon) {
            zseg.setActive(true);
        };
        if (istidemodeon) {
            tidept.setActive(true);
        };
    });
    map.renderSync();
}; //end of func savemapbox
function savesegfig() {
    var pntseg = document.getElementById("segchart");
    var fn = "Hidy_zseg_" + $("#drawp1x").val().replace(".", "E") + "_" + $("#drawp1y").val().replace(".", "N") + "_" + $("#drawp2x").val().replace(".", "E") + "_" + $("#drawp2y").val().replace(".", "N");
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(pntseg.msToBlob(), fn + '.png');
    } else {
        pntseg.toBlob(function (blob) {
            saveAs(blob, fn + '.png');
        });
    };
}; //end of func savesegfig
function savecontourfig() {
    var fn = "Hidy_SG" + $("#sgmod").val() + "_" + $("#sgcrmod").val() + "_Dive" + ("000" + glider.getSource().getClosestFeatureToCoordinate(glidertraj.getSource().getFeatures()[0].getGeometry().getFirstCoordinate()).get("gliderdive")).slice(-3) + "to" + ("000" + glider.getSource().getClosestFeatureToCoordinate(glidertraj.getSource().getFeatures()[0].getGeometry().getLastCoordinate()).get("gliderdive")).slice(-3);
    fn = fn + '.png';
    var i = new Image();
    var pntcontour = document.getElementById("contourchart");
    pntcontour.getElementsByTagName("svg")[0].setAttribute("width", pntcontour.clientWidth.toString());
    pntcontour.getElementsByTagName("svg")[0].setAttribute("height", pntcontour.clientHeight.toString());
    var s = (new XMLSerializer).serializeToString(pntcontour.getElementsByTagName("svg")[0]);
    i.crossOrigin = 'Anonymous';
    i.onload = function () {
        //if (navigator.msSaveBlob) { navigator.msSaveBlob(b.msToBlob(),fn); } else { b.toBlob(function(bb){saveAs(bb,fn);}); };
        if (navigator.msSaveBlob) {
            var b = document.createElement("div");
            b.className = 'KUOsvgienosave';
            b.innerHTML = (document.getElementById("infolangen").checked) ? "&nbsp;For IE: Right-click on contour &#8594; choose 'SaveAs' &#8594; change filetype to PNG&nbsp;" : "&nbsp;IE瀏覽器：於圖上點滑鼠右鍵&#8594;另存圖片&#8594;更改存檔類型為.png&nbsp;";
            document.getElementById('contourfig').appendChild(b);
            setTimeout(function () {
                document.getElementById('contourfig').removeChild(b);
            }, 5000);
        } else {
            var b = document.createElement("canvas");
            b.width = pntcontour.clientWidth;
            b.height = pntcontour.clientHeight;
            b.getContext("2d").fillStyle = "white";
            b.getContext("2d").fillRect(0, 0, b.width, b.height);
            b.getContext("2d").drawImage(i, 0, 0);
            document.body.appendChild(b);
            b.toBlob(function (bb) {
                saveAs(bb, fn);
            });
            document.body.removeChild(b);
        };
    };
    i.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(s)));
}; //end of func savecontourfig
function savetidefig() {
    var fn = "Hidy_tide_" + $("#tidep0x").val().replace(".", "E") + "_" + $("#tidep0y").val().replace(".", "N") + "_" + da6 + $("#tidehr1").val() + "_" + da7 + $("#tidehr2").val() + ".png";
    var i = new Image();
    var pnttide = document.getElementById("tidechart");
    pnttide.getElementsByTagName("svg")[0].setAttribute("width", pnttide.clientWidth.toString());
    pnttide.getElementsByTagName("svg")[0].setAttribute("height", pnttide.clientHeight.toString());
    var s = (new XMLSerializer).serializeToString(pnttide.getElementsByTagName("svg")[0]);

    var j = new Image();
    var pntrose = document.getElementById("tiderose");
    pntrose.getElementsByTagName("svg")[0].setAttribute("width", pntrose.clientWidth.toString());
    pntrose.getElementsByTagName("svg")[0].setAttribute("height", pntrose.clientHeight.toString());
    var srose = (new XMLSerializer).serializeToString(pntrose.getElementsByTagName("svg")[0]);

    i.crossOrigin = 'Anonymous';
    j.crossOrigin = 'Anonymous';
    i.onload = function () {
        if (navigator.msSaveBlob) {
            var b = document.createElement("div");
            b.className = 'KUOsvgienosave';
            b.innerHTML = (document.getElementById("infolangen").checked) ? "&nbsp;For IE: Right-click on contour &#8594; choose 'SaveAs' &#8594; change filetype to PNG&nbsp;" : "&nbsp;IE瀏覽器：於圖上點滑鼠右鍵&#8594;另存圖片&#8594;更改存檔類型為.png&nbsp;";
            document.getElementById('tidefig').appendChild(b);
            setTimeout(function () {
                document.getElementById('tidefig').removeChild(b);
            }, 5000);
        } else {
            var b = document.createElement("canvas");
            b.width = pnttide.clientWidth + pntrose.clientWidth;
            b.height = pnttide.clientHeight;
            b.getContext("2d").fillStyle = "white";
            b.getContext("2d").fillRect(0, 0, b.width, b.height);
            b.getContext("2d").drawImage(i, 0, 0);
            j.onload = function () {
                b.getContext("2d").drawImage(j, pnttide.clientWidth, 0);
                document.body.appendChild(b);
                b.toBlob(function (bb) {
                    saveAs(bb, fn);
                });
                document.body.removeChild(b);
            };
        };
    };
    i.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(s)));
    j.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(srose)));
}; //end of func savetidefig
function saveclimfig(a) {
    var fn = "Hidy_";
    var f;
    switch (a) {
        case 1:
            fn = fn + "transect_" + mfvars[parseInt($("#meanfieldvar").val())] + "_" + (parseFloat($("#mfarea2").val()) * 100).toString() + ((parseFloat($("#mfarea2").val()) > 100.0) ? "E_" : "N_") + mfymd.toString() + ".png";
            f = "climsectzchart";
            break;
        case 2:
            fn = fn + "timeseries_" + mfvars[parseInt($("#meanfieldvar").val())] + "_" + (parseFloat($("#mfarea3x").val()) * 100).toString() + "E_" + (parseFloat($("#mfarea3y").val()) * 100).toString() + "N_" + $("#mfarea3z").val() + "m.png";
            f = "climtschart";
            break;
        case 3:
            fn = fn + "profilez_" + mfvars[parseInt($("#meanfieldvar").val())] + "_" + (parseFloat($("#mfarea4x").val()) * 100).toString() + "E_" + (parseFloat($("#mfarea4y").val()) * 100).toString() + "N_" + mfymd.toString() + ".png";
            f = "climpzchart";
            break;
    };
    var i = new Image();
    var pntclim = document.getElementById(f);
    pntclim.getElementsByTagName("svg")[0].setAttribute("width", pntclim.clientWidth.toString());
    pntclim.getElementsByTagName("svg")[0].setAttribute("height", pntclim.clientHeight.toString());
    var s = (new XMLSerializer).serializeToString(pntclim.getElementsByTagName("svg")[0]);

    i.crossOrigin = 'Anonymous';
    i.onload = function () {
        if (navigator.msSaveBlob) {
            var b = document.createElement("div");
            b.className = 'KUOsvgienosave';
            b.innerHTML = (document.getElementById("infolangen").checked) ? "&nbsp;For IE: Right-click on contour &#8594; choose 'SaveAs' &#8594; change filetype to PNG&nbsp;" : "&nbsp;IE瀏覽器：於圖上點滑鼠右鍵&#8594;另存圖片&#8594;更改存檔類型為.png&nbsp;";
            document.getElementById(f.substr(0, 6) + 'fig').appendChild(b);
            setTimeout(function () {
                document.getElementById(f.substr(0, 6) + 'fig').removeChild(b);
            }, 5000);
        } else {
            var b = document.createElement("canvas");
            b.width = pntclim.clientWidth;
            b.height = pntclim.clientHeight;
            b.getContext("2d").fillStyle = "white";
            b.getContext("2d").fillRect(0, 0, b.width, b.height);
            b.getContext("2d").drawImage(i, 0, 0);
            document.body.appendChild(b);
            b.toBlob(function (bb) {
                saveAs(bb, fn);
            });
            document.body.removeChild(b);
        };
    };
    i.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(s)));
}; //end of func saveclimfig
function sgchange(sg, aa) {
    if (document.getElementById("abc").dataset.kuoplt == 3) {
        closeABC();
    };
    var sm = document.getElementById("sgcrmod");
    sm.options.length = 0;
    for (var i = 0; i < sglist[sg].length; i++) {
        var o = document.createElement("option");
        o.value = sglist[sg][i];
        o.innerHTML = ('000' + sglist[sg][i].toString()).substr(-4);
        sm.appendChild(o);
    };
    sm.value = sglist[sg][0];
    if (aa) {
        document.getElementById("btglider").checked = true;
        toggleGlider(true);
    };
}; //end of func sgchange
function mfchange(a, b, ia) {
    if (ia) {
        var ab = ['tim', 'xy', 'grid'];
        document.getElementById('mf' + ab[a] + 'tab0').style.display = 'none';
        document.getElementById('mf' + ab[a] + 'tab' + (3 - b)).style.display = 'none';
        document.getElementById('mf' + ab[a] + 'btn' + (3 - b)).className = 'KUOmf-tablinks';
        document.getElementById('mf' + ab[a] + 'tab' + b).style.display = 'block';
        document.getElementById('mf' + ab[a] + 'btn' + b).className = 'KUOmf-tablinks KUOmf-tabactive';
        document.getElementById('divmf' + ab[a]).dataset.mf = b;
        //document.getElementById('spanmfarea').style.display='inline-block';
        if (a == 2) {
            document.getElementById('mfclim0').style.display = (b == 2) ? 'block' : 'none';
        };
    };
    switch (a) {
        case 0:
            switch (b) {
                case 1:
                    var i = parseInt(document.querySelector("input[name='mftim']:checked").value);
                    mfymd = 10000000 + i * 100;
                    break;
                case 2:
                    mfymd = parseInt(document.getElementById("mfyear").value + "" + document.getElementById("mfmon").value + "00");
                    break;
            };
            break;
        case 1:
            if (b == 2) {
                var i = document.getElementById("mfarea" + b).value;
                if (i) {
                    i = Math.min(Math.max(Math.round(parseFloat(i) * 4) / 4, 2), 135);
                    if (i > 35 && i < 105) {
                        i = ((i - 70) > 0) ? 105 : 35;
                    }
                    document.getElementById("mfarea2").value = i.toFixed(2);
                };
            };
            break;
        case 2:
            var i = document.getElementById("mfarea" + (b + 2) + "x").value,
                j = document.getElementById("mfarea" + (b + 2) + "y").value;
            if ((i + j).length > 3) {
                document.getElementById("mfarea" + (b + 2) + "x").value = Math.min(Math.max(Math.round(parseFloat(i) * 4) / 4, 105), 135).toFixed(2)
                document.getElementById("mfarea" + (b + 2) + "y").value = Math.min(Math.max(Math.round(parseFloat(j) * 4) / 4, 2), 35).toFixed(2);
            };
            break;
    };
    drawClimfig();
}; //end of func mfchange
function set_ixxx_icon() {
    var a = ['argo', 'svp', 'sat', 'pvd', 'draw', 'cplan', 'odbs', 'glider', 'ship', 'model', 'tide', 'meanfield'];
    var b = ['fiber_manual_record', 'gesture', 'visibility', 'trending_up', 'straighten', 'multiline_chart', 'extension', 'gps_fixed', 'directions_boat', 'layers', 'broken_image', 'equalizer'];
    var c = document.getElementById('mainixxx');
    while (c.firstChild) {
        c.removeChild(c.firstChild);
    }
    for (var i = 0; i < a.length; i++) {
        var j = document.getElementsByClassName("KUOclr-" + a[i] + " KUOixxx")[0].style.visibility == 'hidden';
        if (document.getElementById(a[i]).style.display != 'none' || j) {
            var k = document.createElement("LABEL");
            k.className = "material-icons KUOclr-" + a[i];
            if (j) {
                k.setAttribute('style', 'color:#000;text-shadow:0 0 5px #fff')
            }
            k.innerHTML = "<input type=checkbox class='KUOd-n' onchange=toggleIXXX(this.checked,'" + a[i] + "') autocomplete='off'" + (j ? " checked>" : ">") + b[i];
            document.getElementById("mainixxx").appendChild(k);
        };
    };
}; //end of func set_ixxx_icon
function toggle_ixxx_icon(a) {
    document.getElementById('divixxx').style.right = a ? 0 : '-17vw';
    document.querySelectorAll('.btixxx i')[0].innerHTML = a ? 'backspace' : 'more';
    var i = document.getElementsByClassName('KUOixxx');
    for (var j = 0; j < i.length; j++) {
        i[j].innerHTML = 'backspace';
        i[j].style.display = a ? 'block' : 'none';
        i[j].setAttribute('onclick', "toggleIXXX(true,'" + i[j].className.split('KUOclr-')[1].split(' ')[0] + "')");
    };
    document.getElementById('mainixxx').style.display = a ? 'inline' : 'none';
}; //end of func toggle_ixxx_icon
function toggleIXXX(a, b) {
    document.getElementById(b).style.display = a ? 'none' : 'inline-block';
    $("#" + b + "+br").css("display", a ? "none" : "block");
    document.getElementsByClassName("KUOclr-" + b + " KUOixxx")[0].style.visibility = a ? 'hidden' : 'visible';
    document.getElementById("mainixxx").querySelectorAll("label.KUOclr-" + b + " input[type=checkbox]")[0].checked = a;
    if (a) {
        document.getElementById("mainixxx").querySelectorAll("label.KUOclr-" + b)[0].setAttribute("style", 'color:#000;text-shadow:0 0 5px #fff');
    } else {
        document.getElementById("mainixxx").querySelectorAll("label.KUOclr-" + b)[0].removeAttribute("style");
    };
}; //end of func toggleIXXX
function BaselayerMenu(a) {
    if (a && document.getElementById("baselayermenu").innerHTML.length < 10) {
        var c = document.createElement("P");
        c.innerHTML = "<span class=txt0>BaseMap</span><span class=txt1>底圖切換</span>";
        c.className = "KUOfs-2 KUO-m0-p0 KUOta-c KUOfw-b KUObb-1dw";
        document.getElementById("baselayermenu").appendChild(c);
        var blnm = ['Bing', 'Mapbox', 'Stamen', 'NOAA', 'Esri', 'MOI', 'MOI', 'Mapbox', 'Mapbox'];
        var b = document.createElement("OL");
        for (var i = 0; i < 9; i++) {
            var c = document.createElement("LI");
            c.innerHTML = "<img src='https://odbpo.oc.ntu.edu.tw/static/figs/misc/baselayer/a" + i + ".png'><span>" + blnm[i] + "</span>";
            c.setAttribute("onclick", "toggleBaselayer(" + i + ")");
            b.appendChild(c);
        };
        document.getElementById("baselayermenu").appendChild(b);
        toggleBaselayer(document.getElementById("baselayermenu").dataset.bb);
    };
    document.getElementById("baselayermenu").style.width = a ? "230px" : "0";
    document.getElementById("baselayermenu").style.display = a ? "block" : "none";
    document.getElementById("btblayermenu").checked = a;
}; //end of func BaselayerMenu
function toggleBaselayer(a) {
    var i = document.getElementById("baselayermenu").dataset.bb;
    if (a != i) {
        var baselayerurl = [
            "https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/etopo1_hillshade/MapServer/tile/{z}/{y}/{x}?blankTile=True",
            "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
            "https://oceanmaps.moi.gov.tw/arcgis/rest/services/Oceanicmap/MOI_topography_blank/MapServer//tile/{z}/{y}/{x}",
            "https://wmts.nlsc.gov.tw/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
            "EMAP&STYLE=_null&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png",
            "https://api.mapbox.com/styles/v1/kuoth/ck8cgnrk522ta1ipekjiyppe9/tiles/256/{z}/{x}/{y}?" +
            "access_token=pk.eyJ1Ijoia3VvdGgiLCJhIjoiY2piNWY3YmpoMmY4NDJxbjI3b3d3ZzMwdCJ9.IF-gn1bcXl8kPtp7wL30ew",
            "https://b.tiles.mapbox.com/v3/aj.Sketchy2/{z}/{x}/{y}.png"
        ];
        var baselayermaxzoom = [21, 18, 15, 7, 12, 12, 18, 18, 5];
        switch (a) {
            case 0: //Bing
                baselayer.setSource(new ol.source.BingMaps({
                    imagerySet: 'Aerial',
                    key: 'AtxhFL61gkrGg34Rd6hUnrZbAYu3s_fpbocD79mi7w3YEWzY0SoK2wD0HJJlgg4I'
                }));
                break;
            case 1: //Mapbox_fold
                baselayer.setSource(new ol.source.TileJSON({
                    crossOrigin: 'anonymous',
                    url: "https://a.tiles.mapbox.com/v4/aj.1x1-degrees." +
                        "json?access_token=pk.eyJ1Ijoia3VvdGgiLCJhIjoiY2piNWY3YmpoMmY4NDJxbjI3b3d3ZzMwdCJ9.IF-gn1bcXl8kPtp7wL30ew"
                }));
                break;
            case 2: //Stamen
                baselayer.setSource(new ol.source.Stamen({
                    layer: 'watercolor',
                    maxZoom: baselayermaxzoom[a]
                }));
                break;
            default:
                baselayer.setSource(new ol.source.XYZ({
                    url: baselayerurl[a - 3],
                    crossOrigin: 'anonymous',
                    maxZoom: baselayermaxzoom[a]
                }));
        };
    };
    if (document.getElementById("baselayermenu").innerHTML.length > 10) {
        if (i) {
            document.getElementById("baselayermenu").getElementsByTagName("img")[i].removeAttribute('style');
        };
        document.getElementById("baselayermenu").getElementsByTagName("img")[a].setAttribute('style',
            "border:1px solid #f00;box-shadow:0 0 5px 5px #fff;border-radius:50px");
    };
    document.getElementById("baselayermenu").dataset.bb = a;
}; //end of func toggleBaselayer
function gen_login() {
    $.getJSON("https://odbsso.oc.ntu.edu.tw/sso/odbauth/genucode/", function (a) {
        //var tt=new Date(); tt.setDate(tt.getDate()+36500); document.cookie="odbsso="+a.ucode+"; expires="+tt.toString()+";";
        document.cookie = "odbsso=" + a.ucode + "; expires=" + '"Sun, 31 Jul 2118 09:23:19 GMT"' + ";";
        gen_iframe_forlogin(a.ucode);
    });
}; //end of func gen_login
function gen_logout() {
    var tt = new Date();
    tt.setTime(tt.getTime() - 1);
    document.cookie = "odbsso=; expires=" + tt.toGMTString();
    document.getElementById('acname').innerHTML = "Hi,";
    document.getElementById('acname').removeAttribute("style");
    document.getElementById('btlogin').style.display = "inline-block";
    document.getElementById('btsignup').style.display = "inline-block";
    document.getElementById('btlogout').style.display = "none";
    toggle_odbs(false);
    document.getElementById("glider").style.display = "none";
    document.getElementById("glidernum").innerHTML = "<span class='KUOml-3px material-icons KUOclr-glider KUOfs-2 KUOlh-2 KUOd-i KUOva-tt'>gps_fixed</span>";
    //glider.setSource(null);
    toggleGlider(false);
    toggleGliderKMLlayer(false);
    closeContourfig();
    $("#glider+br").css("display", "none");
    document.getElementById("ship").style.display = "none";
    or1ship.setSource(null);
    or1now.setGeometry();
    or2now.setGeometry();
    or3now.setGeometry();
    histship.setSource(null);
    $("#ship+br").css("display", "none");
    updcplanckeylist(false);
    set_ixxx_icon();
    //if (document.getElementById("gliderlog").childElementCount>0) {window.location.reload();};
}; //end of func gen_logout

function gen_iframe_forlogin(a) {
    var odbsso = a;
    document.getElementById("login0").style.display = "inline-block";
    document.getElementById("ssologin").innerHTML = "<iframe src=https://odbsso.oc.ntu.edu.tw/sso/odbauth/login/?ucode=" +
        odbsso + " style='width:100%;height:100%;overflow:auto;'></iframe>";
}; //end of gen_iframe_forlogin

function gen_iframe_register() {
    document.getElementById("login0").style.display = "inline-block";
    document.getElementById("ssologin").innerHTML = "<iframe src=https://odbsso.oc.ntu.edu.tw/sso/odbauth/signup/" +
        " style='width:100%;height:100%;overflow:auto;'></iframe>";
}; //end of gen_iframe_register

function chk_login_done(odbsso) {
    $.getJSON("https://odbsso.oc.ntu.edu.tw/sso/odbauth/chkuser/?ucode=" + odbsso, function (a) {
        if (a.securitylevel > 0) {
            document.getElementById('acname').innerHTML = "Hi, " + a.username;
            if (a.username.length > 6) {
                document.getElementById('acname').style.fontSize = (a.username.length > 10) ? "2vw" : "2.5vw";
            };
            document.getElementById('btlogout').style.display = "inline-block";
            document.getElementById('btsignup').style.display = "none";
            document.getElementById('btlogin').style.display = "none";
            if (window.location.href.indexOf("ckey=") > 0) {
                updcplanckeylist(true);
                for (var i = 1; i <= parseInt((window.location.href.split("ckey=")[1]).split("&")[0].split(",")[0]); i++) {
                    document.getElementById("cplanbtn" + i).setAttribute("onclick", "cplanremovelayer(" + i + ");updcplanckeylist(true);");
                };
            };
            toggle_odbs(true);
            if (a.groupL.indexOf(3) >= 0 || a.groupL.indexOf(1) >= 0 || a.securitylevel > 5) {
                toggleGlider(document.getElementById("btglider").checked);
                // KUO: comment out next line when glider's not on-duty.
                //if (!document.getElementById("btglider").checked && a.groupL.indexOf(5)>=0) { toggleGliderKMLlayer(true); }
                document.getElementById("glider").style.display = "inline-block";
                $("#glider+br").css("display", "block");
                orshipoverlay(document.getElementById("btship").checked);
                toggleShipCr(document.getElementById("bthistship").checked);
                document.getElementById("ship").style.display = "inline-block";
                $("#ship+br").css("display", "block");
            } else {
                document.getElementById("glider").style.display = "none";
                document.getElementById("glidernum").innerHTML = "";
                glider.setSource(null);
                $("#glider+br").css("display", "none");
                if (a.groupL.indexOf(2) >= 0 || a.groupL.indexOf(4) >= 0) {
                    orshipoverlay(document.getElementById("btship").checked);
                    toggleShipCr(document.getElementById("bthistship").checked);
                    document.getElementById("ship").style.display = "inline-block";
                    $("#ship+br").css("display", "block");
                } else {
                    document.getElementById("ship").style.display = "none";
                    or1ship.setSource(null);
                    or1now.setGeometry();
                    or2now.setGeometry();
                    or3now.setGeometry();
                    histship.setSource(null);
                    $("#ship+br").css("display", "none");
                };
            };
            set_ixxx_icon();
        } else {
            gen_logout();
        };
    });
}; //end of func chk_login_done

var saveAs = saveAs || function (e) {
    "use strict";
    if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return
    }
    var t = e.document,
        n = function () {
            return e.URL || e.webkitURL || e
        },
        r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        o = "download" in r,
        a = function (e) {
            var t = new MouseEvent("click");
            e.dispatchEvent(t)
        },
        i = /constructor/i.test(e.HTMLElement) || e.safari,
        f = /CriOS\/[\d]+/.test(navigator.userAgent),
        u = function (t) {
            (e.setImmediate || e.setTimeout)(function () {
                throw t
            }, 0)
        },
        s = "application/octet-stream",
        d = 1e3 * 40,
        c = function (e) {
            var t = function () {
                if (typeof e === "string") {
                    n().revokeObjectURL(e)
                } else {
                    e.remove()
                }
            };
            setTimeout(t, d)
        },
        l = function (e, t, n) {
            t = [].concat(t);
            var r = t.length;
            while (r--) {
                var o = e["on" + t[r]];
                if (typeof o === "function") {
                    try {
                        o.call(e, n || e)
                    } catch (a) {
                        u(a)
                    }
                }
            }
        },
        p = function (e) {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
                return new Blob([String.fromCharCode(65279), e], {
                    type: e.type
                })
            }
            return e
        },
        v = function (t, u, d) {
            if (!d) {
                t = p(t)
            }
            var v = this,
                w = t.type,
                m = w === s,
                y, h = function () {
                    l(v, "writestart progress write writeend".split(" "))
                },
                S = function () {
                    if ((f || m && i) && e.FileReader) {
                        var r = new FileReader;
                        r.onloadend = function () {
                            var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                            var n = e.open(t, "_blank");
                            if (!n) e.location.href = t;
                            t = undefined;
                            v.readyState = v.DONE;
                            h()
                        };
                        r.readAsDataURL(t);
                        v.readyState = v.INIT;
                        return
                    }
                    if (!y) {
                        y = n().createObjectURL(t)
                    }
                    if (m) {
                        e.location.href = y
                    } else {
                        var o = e.open(y, "_blank");
                        if (!o) {
                            e.location.href = y
                        }
                    }
                    v.readyState = v.DONE;
                    h();
                    c(y)
                };
            v.readyState = v.INIT;
            if (o) {
                y = n().createObjectURL(t);
                setTimeout(function () {
                    r.href = y;
                    r.download = u;
                    a(r);
                    h();
                    c(y);
                    v.readyState = v.DONE
                });
                return
            }
            S()
        },
        w = v.prototype,
        m = function (e, t, n) {
            return new v(e, t || e.name || "download", n)
        };
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (e, t, n) {
            t = t || e.name || "download";
            if (!n) {
                e = p(e)
            }
            return navigator.msSaveOrOpenBlob(e, t)
        }
    }
    w.abort = function () {};
    w.readyState = w.INIT = 0;
    w.WRITING = 1;
    w.DONE = 2;
    w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
    return m
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
    define("FileSaver.js", function () {
        return saveAs
    })
}

var windFieldArea = new ol.layer.Vector({
    name: "Windfield",
    zIndex: 100,
    source: new ol.source.Vector({
        url: "https://odbgo.oc.ntu.edu.tw/hidypro/windarea/windarea.json",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [255, 0, 0, 1],
            width: 1
        })
    })
});

var CHIRP2010 = new ol.layer.Vector({
    name: "chirp2010",
    zIndex: 99,
    source: new ol.source.Vector({
        url: "https://odbgo.oc.ntu.edu.tw/hidypro/windarea/chirp_bathy2010.json",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [0, 139, 0, 1],
            width: 1
        })
    })
});

function windfield() {
    let layerNames = map
        .getLayers()
        .getArray()
        .map((item) => item.get("name"));
    if (layerNames.includes("Windfield")) {
        map.removeLayer(windFieldArea)
    } else {
        map.addLayer(windFieldArea)
    }
}

function chirp2010(ev) {
    if (ev.ctrlKey) {
        let layerNames = map
            .getLayers()
            .getArray()
            .map((item) => item.get("name"));

        if (layerNames.includes("chirp2010")) {
            map.removeLayer(CHIRP2010)
        } else {
            map.addLayer(CHIRP2010)
            console.log(map
                .getLayers()
                .getArray())
        }
    }
}