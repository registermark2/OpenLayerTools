function fnGetNSIland(x, y) {
    //var x=219698.555;
    //var y=2672577.859;
    try {} catch (err) {}
    var MAP5 = "-------@@- -----@@@@@ -----@@@@@ ----@@@@@- ----@@@@@- ---@@@@@@- ---@@@@@@- --@@@@@@@- --@@@@@@@- --@@@@@@-- -@@@@@@@-- -@@@@@@@-- -@@@@@@@-- @@@@@@@@-- -@@@@@@@-- @@@@@@@--- @@@@@@@--- -@@@@@@--- -@@@@@@--- -@@@@@---- -@@@@----- --@@@----- ---@@----- ---@------";
    var MAP10 = "----@- ---@@@ --@@@@ --@@@@ -@@@@@ -@@@@- -@@@@- @@@@@- @@@@@- @@@@@- @@@@-- -@@@-- -@@@-- --@--- --@---";
    //97轉67
    var A = 0.00001549;
    var B = 0.000006521;
    x = parseFloat(x) - 807.8 - parseFloat(A) * x - parseFloat(B) * y;
    y = parseFloat(y) + 248.6 - parseFloat(A) * parseFloat(y) - parseFloat(B) * parseFloat(x);
    x = parseInt(x);
    y = parseInt(y);
    document.getElementById("SNIsland").innerHTML = "";
    //##50000
    {

        var page, yl, yp;
        var xp = x - 138000;

        if (y <= 2439000) { //#南島71圖頭行座標「斷層」
            page = 132;
            yl = (2439000 - y) / 1000;
        } else {
            yp = 2799000 - y;
            var page1 = MAP5.substring(0, 1 + parseInt(xp / 22000) + 11 * parseInt(yp / 15000));
            page1 = page1.replace(/ /g, "");
            page1 = page1.replace(/-/g, "");
            page = page1.length;
            yl = yp % 15000 / 1000 + 1;

        }

        var r1 = (page > 61) ? "南" : "北";
        var r2 = (page > 61) ? page - 61 : page;

        var r3 = 65 + (page > 130 ? xp - 13000 : xp) % 22000 / 1000;

        //輸出 1:50000
        //document.write("1:50000 "+r1+"島"+parseInt(r2)+"圖"+String.fromCharCode(parseInt(r3))+parseInt(yl));
        //document.getElementById("SNIsland").innerHTML="1:50000 "+r1+"島"+parseInt(r2)+"圖"+String.fromCharCode(parseInt(r3))+parseInt(yl);
        document.getElementById("SNIsland").innerHTML = "" + r1 + "島" + parseInt(r2) + "頁" + String.fromCharCode(parseInt(r3)) + parseInt(yl) + "方格";
        //document.write("<br>");
    }
    //##1/100000
    {
        var xp = x - 130000;
        var yp = 2812000 - y;
        var r1 = MAP10.substring(0, 1 + 7 * parseInt(yp / 26000) + parseInt(xp / 38000));

        r1 = r1.replace(/ /g, "");
        r1 = r1.replace(/-/g, "");
        var r2 = 65 + xp % 38000 / 2000;
        var r3 = 2 + yp % 26000 / 2000;
        //輸出 1:100000
        //document.write("1:100000  "+r1.length+"圖"+String.fromCharCode(parseInt(r2))+parseInt(r3));
        //document.getElementById("SNIsland").innerHTML = document.getElementById("SNIsland").innerHTML +  "<BR>1:100000  "+r1.length+"圖"+String.fromCharCode(parseInt(r2))+parseInt(r3);
    }
}