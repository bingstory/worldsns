// JavaScript Document
(function () {
    var index = 0;
    var cm = new common(document);
    var init = function () {
        var reg_oid = cm.get("reg_oid").val();
        var reg_auth = cm.get("reg_auth").val();
        var reg_alias = cm.get("reg_alias").val();
        var reg_pwd = cm.get("reg_pwd").val();
        var reg_email = cm.get("reg_email").val();
        var reg_gender = cm.get("reg_gender").val();
        var reg_year = cm.get("reg_year").val();
        var reg_month = cm.get("reg_month").val();
        var reg_day = cm.get("reg_day").val();
        var reg_fid = cm.get("reg_fid").val();
        var reg_sid = cm.get("reg_sid").val();

        cm.print("reg_auth:" + reg_auth);
        cm.print("reg_oid:" + reg_oid);
        cm.print("reg_alias:" + reg_alias);
        cm.print("reg_pwd:" + reg_pwd);
        cm.print("reg_email:" + reg_email);
        cm.print("reg_gender:" + reg_gender);
        cm.print("reg_year:" + reg_year);
        cm.print("reg_month:" + reg_month);
        cm.print("reg_birth:" + reg_day);
        cm.print("reg_fid:" + reg_fid);
        cm.print("reg_day:" + reg_sid);

        cm.get("getCode").onclick = function () {
            var phone = cm.get("phone").val();
            if (/^\d{7,12}$/.test(phone)) {
                cm.get("tip").html("");
                cm.ajax("index.php?m=Index&c=Phone&a=sendMsg", {phone: phone, countryCode: cm.get("country_code").val()}, function (res) {
                    if (res["status"] == 'success') {
                        cm.get("phone").disabled = true;
                        cm.get("row_code").show("table-row");
                        cm.get("finish").show("table-cell");
                        cm.get("getCode").hide();
                        alert(res.data);
                    } else {
                        cm.get("tip").html(document.i18n["exist_phone"]);
                    }
                });
            } else {
                cm.get("tip").html(document.i18n["check_phone"]);
            }
        };

        cm.get("finish").onclick = function () {
            var phone = cm.get("phone").val();
            var user = {
                code: cm.get("code").val(),
                phone: phone,
                countryCode: cm.get("country_code").val(),
                alias: reg_alias,
                pwd: reg_pwd,
                email: reg_email,
                gender: reg_gender,
                year: reg_year,
                month: reg_month,
                day: reg_day,
                fid: cm.get("reg_fid").val(),
                sid: cm.get("reg_sid").val(),
                device: 0
            };
            if (reg_oid) {
                user["oid"] = reg_oid;
                user["auth"] = reg_auth;
            }
            if (/^\d{7,12}$/.test(phone)) {
                cm.ajax("index.php?m=Index&c=index&a=register", user, function (res) {
                    if (res["status"] == 1) {
                        cm.setCookie("name", res["name"], 150);
                        cm.setCookie("token", res["token"], 150);
                        top.location = "index.php?m=Index&c=Home&a=Index";
                    } else if (res["status"] == 2) {
                        cm.get("tip").html(document.i18n["exist_phone"]);
                    } else if (res["status"] == 3){
                        cm.get("tip").html(document.i18n["check_code"]);
                    } else {
                        cm.get("tip").html(document.i18n["register failed"]);
                    }
                })
            } else {
                cm.get("tip").html(document.i18n["check_phone"]);
            }
        };
    };
    var initCountryList = function () {
        var select = cm.get("country_list");
        var generalCountryArr = document.i18n["country"];
        var generalCountryCodeArr = [86, 886, 852, 7, 1, 1, 81, 82, 49, 34, 33, 39, 31, 351, 64, 44, 61];
        var allCountryAndCode = getAllCountry();
        var group1 = cm.mk("OPTGROUP");
        var group2 = cm.mk("OPTGROUP");
        group1.label = document.i18n["group1"];
        group2.label = document.i18n["group2"];
        select.append(group1);
        for (var i = 0; i < generalCountryArr.length; i++) {
            var code = generalCountryCodeArr[i];
            var opt = cm.get(new Option());
            opt.val(code);
            opt.html(generalCountryArr[i] + "   (+" + code + ")");
            select.append(opt);
        }
        select.append(group2);
        for (var j = 0; j < allCountryAndCode.length; j++) {
            var elem = allCountryAndCode[j];
            var code2 = elem["code"];
            var opt2 = cm.get(new Option());
            opt2.val(code2);
            opt2.html(elem["country"] + "   (+" + code2 + ")");
            select.append(opt2);
        }

        cm.get("country_list").onchange = function () {
            cm.get("country_code").val("+" + this.val());
        }
    };
    var getAllCountry = function () {
        return [{"country": "Andorra", "code": 376}, {
            "country": "Afghanistan",
            "code": 93
        }, {"country": "AntiguaandBarbuda", "code": 1}, {"country": "Anguilla", "code": 1}, {
            "country": "Albania",
            "code": 355
        }, {"country": "Armenia", "code": 374}, {"country": "Angola", "code": 244}, {
            "country": "Argentina",
            "code": 54
        }, {"country": "AmericanSamoa", "code": 1}, {"country": "Austria", "code": 43}, {
            "country": "Australia",
            "code": 61
        }, {"country": "Aruba", "code": 297}, {"country": "Azerbaijan", "code": 994}, {
            "country": "Algeria",
            "code": 213
        }, {"country": "BosniaandHerzegovina", "code": 387}, {
            "country": "Barbados",
            "code": 1
        }, {"country": "Bangladesh", "code": 880}, {"country": "Belgium", "code": 32}, {
            "country": "BurkinaFaso",
            "code": 226
        }, {"country": "Bulgaria", "code": 359}, {"country": "Bahrain", "code": 973}, {
            "country": "Burundi",
            "code": 257
        }, {"country": "Benin", "code": 229}, {"country": "Bermuda", "code": 1}, {
            "country": "Brunei",
            "code": 673
        }, {"country": "Bolivia", "code": 591}, {
            "country": "Bonaire,SintEustatiusandSaba",
            "code": 599
        }, {"country": "Brazil", "code": 55}, {"country": "Bahamas", "code": 1}, {
            "country": "Bhutan",
            "code": 975
        }, {"country": "Botswana", "code": 267}, {"country": "Belarus", "code": 375}, {
            "country": "Belize",
            "code": 501
        }, {"country": "BritishIndianOceanTerritory", "code": 246}, {
            "country": "BritishVirginIslands",
            "code": 1
        }, {"country": "Canada", "code": 1}, {
            "country": "CocosIslands",
            "code": 61
        }, {"country": "CentralAfricanRepublic", "code": 236}, {
            "country": "Congo",
            "code": 242
        }, {"country": "C么ted'Ivoire", "code": 225}, {"country": "CookIslands", "code": 682}, {
            "country": "Chile",
            "code": 56
        }, {"country": "Cameroon", "code": 237}, {"country": "China", "code": 86}, {
            "country": "Colombia",
            "code": 57
        }, {"country": "CostaRica", "code": 506}, {"country": "Cuba", "code": 53}, {
            "country": "CapeVerde",
            "code": 238
        }, {"country": "Cura莽ao", "code": 599}, {"country": "ChristmasIsland", "code": 61}, {
            "country": "Cyprus",
            "code": 357
        }, {"country": "CzechRepublic", "code": 420}, {"country": "Croatia", "code": 385}, {
            "country": "Cambodia",
            "code": 855
        }, {"country": "Comoros", "code": 269}, {"country": "CaymanIslands", "code": 1}, {
            "country": "Chad",
            "code": 235
        }, {"country": "Djibouti", "code": 253}, {"country": "Denmark", "code": 45}, {
            "country": "Dominica",
            "code": 1
        }, {"country": "DominicanRepublic", "code": 1}, {"country": "Ecuador", "code": 593}, {
            "country": "Estonia",
            "code": 372
        }, {"country": "Egypt", "code": 20}, {"country": "Eritrea", "code": 291}, {
            "country": "Ethiopia",
            "code": 251
        }, {"country": "EquatorialGuinea", "code": 240}, {"country": "ElSalvador", "code": 503}, {
            "country": "Finland",
            "code": 358
        }, {"country": "Fiji", "code": 679}, {"country": "FalklandIslands", "code": 500}, {
            "country": "FaroeIslands",
            "code": 298
        }, {"country": "France", "code": 33}, {"country": "FrenchGuiana", "code": 594}, {
            "country": "FrenchPolynesia",
            "code": 689
        }, {"country": "Germany", "code": 49}, {"country": "Gabon", "code": 241}, {
            "country": "Grenada",
            "code": 1
        }, {"country": "Georgia", "code": 995}, {"country": "Guernsey", "code": 44}, {
            "country": "Ghana",
            "code": 233
        }, {"country": "Gibraltar", "code": 350}, {"country": "Greenland", "code": 299}, {
            "country": "Gambia",
            "code": 220
        }, {"country": "Guinea", "code": 224}, {"country": "Guadeloupe", "code": 590}, {
            "country": "Greece",
            "code": 30
        }, {"country": "Guatemala", "code": 502}, {"country": "Guam", "code": 1}, {
            "country": "Guinea-Bissau",
            "code": 245
        }, {"country": "Guyana", "code": 592}, {"country": "HongKong", "code": 852}, {
            "country": "Honduras",
            "code": 504
        }, {"country": "Haiti", "code": 509}, {"country": "Hungary", "code": 36}, {
            "country": "Indonesia",
            "code": 62
        }, {"country": "Ireland", "code": 353}, {"country": "Israel", "code": 972}, {
            "country": "IsleOfMan",
            "code": 44
        }, {"country": "India", "code": 91}, {"country": "Iraq", "code": 964}, {
            "country": "Iran",
            "code": 98
        }, {"country": "Iceland", "code": 354}, {"country": "Italy", "code": 39}, {
            "country": "Jersey",
            "code": 44
        }, {"country": "Jamaica", "code": 1}, {"country": "Jordan", "code": 962}, {
            "country": "Japan",
            "code": 81
        }, {"country": "Kenya", "code": 254}, {"country": "Kyrgyzstan", "code": 996}, {
            "country": "Kiribati",
            "code": 686
        }, {"country": "Kuwait", "code": 965}, {"country": "Kazakhstan", "code": 7}, {
            "country": "Laos",
            "code": 856
        }, {"country": "Lebanon", "code": 961}, {"country": "Liechtenstein", "code": 423}, {
            "country": "Liberia",
            "code": 231
        }, {"country": "Lesotho", "code": 266}, {"country": "Lithuania", "code": 370}, {
            "country": "Luxembourg",
            "code": 352
        }, {"country": "Latvia", "code": 371}, {"country": "Libya", "code": 218}, {
            "country": "Micronesia",
            "code": 691
        }, {"country": "Morocco", "code": 212}, {"country": "Monaco", "code": 377}, {
            "country": "Moldova",
            "code": 373
        }, {"country": "Montenegro", "code": 382}, {
            "country": "Madagascar",
            "code": 261
        }, {"country": "MarshallIslands", "code": 692}, {"country": "Macedonia", "code": 389}, {
            "country": "Mali",
            "code": 223
        }, {"country": "Myanmar", "code": 95}, {"country": "Mongolia", "code": 976}, {
            "country": "Macao",
            "code": 853
        }, {"country": "Martinique", "code": 596}, {"country": "Mauritania", "code": 222}, {
            "country": "Montserrat",
            "code": 1
        }, {"country": "Malta", "code": 356}, {"country": "Mauritius", "code": 230}, {
            "country": "Maldives",
            "code": 960
        }, {"country": "Malawi", "code": 265}, {"country": "Mexico", "code": 52}, {
            "country": "Malaysia",
            "code": 60
        }, {"country": "Mozambique", "code": 258}, {"country": "Mayotte", "code": 262}, {
            "country": "NorthKorea",
            "code": 850
        }, {"country": "NorthernMarianaIslands", "code": 1}, {
            "country": "Namibia",
            "code": 264
        }, {"country": "NewCaledonia", "code": 687}, {"country": "Niger", "code": 227}, {
            "country": "NorfolkIsland",
            "code": 672
        }, {"country": "Nigeria", "code": 234}, {"country": "Nicaragua", "code": 505}, {
            "country": "Netherlands",
            "code": 31
        }, {"country": "Norway", "code": 47}, {"country": "Nepal", "code": 977}, {
            "country": "Nauru",
            "code": 674
        }, {"country": "Niue", "code": 683}, {"country": "NewZealand", "code": 64}, {
            "country": "Oman",
            "code": 968
        }, {"country": "Panama", "code": 507}, {"country": "Peru", "code": 51}, {
            "country": "PapuaNewGuinea",
            "code": 675
        }, {"country": "Philippines", "code": 63}, {"country": "Pakistan", "code": 92}, {
            "country": "Poland",
            "code": 48
        }, {"country": "PuertoRico", "code": 1}, {"country": "Palestine", "code": 970}, {
            "country": "Portugal",
            "code": 351
        }, {"country": "Palau", "code": 680}, {"country": "Paraguay", "code": 595}, {
            "country": "Qatar",
            "code": 974
        }, {"country": "Reunion", "code": 262}, {"country": "Romania", "code": 40}, {
            "country": "Russia",
            "code": 7
        }, {"country": "Rwanda", "code": 250}, {"country": "SaintBarth茅lemy", "code": 590}, {
            "country": "Switzerland",
            "code": 41
        }, {"country": "Spain", "code": 34}, {"country": "SaintKittsAndNevis", "code": 1}, {
            "country": "SouthKorea",
            "code": 82
        }, {"country": "SaintLucia", "code": 1}, {"country": "SriLanka", "code": 94}, {
            "country": "SaintMartin",
            "code": 590
        }, {"country": "SaintPierreAndMiquelon", "code": 508}, {
            "country": "Serbia",
            "code": 381
        }, {"country": "SaudiArabia", "code": 966}, {
            "country": "SolomonIslands",
            "code": 677
        }, {"country": "Seychelles", "code": 248}, {"country": "Sudan", "code": 249}, {
            "country": "Sweden",
            "code": 46
        }, {"country": "Singapore", "code": 65}, {"country": "SaintHelena", "code": 290}, {
            "country": "Slovenia",
            "code": 386
        }, {"country": "SvalbardAndJanMayen", "code": 47}, {
            "country": "Slovakia",
            "code": 421
        }, {"country": "SierraLeone", "code": 232}, {"country": "SanMarino", "code": 378}, {
            "country": "Senegal",
            "code": 221
        }, {"country": "Somalia", "code": 252}, {"country": "Suriname", "code": 597}, {
            "country": "SaoTomeAndPrincipe",
            "code": 239
        }, {"country": "SintMaarten(Dutchpart)", "code": 1}, {"country": "Syria", "code": 963}, {
            "country": "Swaziland",
            "code": 268
        }, {"country": "SaintVincentAndTheGrenadines", "code": 1}, {
            "country": "Samoa",
            "code": 685
        }, {"country": "SouthAfrica", "code": 27}, {
            "country": "TheDemocraticRepublicOfCongo",
            "code": 243
        }, {"country": "TurksAndCaicosIslands", "code": 1}, {"country": "Togo", "code": 228}, {
            "country": "Thailand",
            "code": 66
        }, {"country": "Tajikistan", "code": 992}, {"country": "Tokelau", "code": 690}, {
            "country": "Timor-Leste",
            "code": 670
        }, {"country": "Turkmenistan", "code": 993}, {"country": "Tunisia", "code": 216}, {
            "country": "Tonga",
            "code": 676
        }, {"country": "Turkey", "code": 90}, {"country": "TrinidadandTobago", "code": 1}, {
            "country": "Tuvalu",
            "code": 688
        }, {"country": "Taiwan", "code": 886}, {"country": "Tanzania", "code": 255}, {
            "country": "UnitedArabEmirates",
            "code": 971
        }, {"country": "UnitedKingdom", "code": 44}, {"country": "Ukraine", "code": 380}, {
            "country": "Uganda",
            "code": 256
        }, {"country": "UnitedStates", "code": 1}, {"country": "Uruguay", "code": 598}, {
            "country": "Uzbekistan",
            "code": 998
        }, {"country": "U.S.VirginIslands", "code": 1}, {"country": "Vatican", "code": 379}, {
            "country": "Venezuela",
            "code": 58
        }, {"country": "Vietnam", "code": 84}, {"country": "Vanuatu", "code": 678}, {
            "country": "WesternSahara",
            "code": 212
        }, {"country": "WallisAndFutuna", "code": 681}, {"country": "Yemen", "code": 967}, {
            "country": "Zambia",
            "code": 260
        }, {"country": "Zimbabwe", "code": 263}];
    };
    init();
    initCountryList();
})();
