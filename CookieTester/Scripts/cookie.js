$(document).ready(function () {
    $("#set-client-cookie").click(function (event) {
        SetCookie($("#cookie-key").val(), $("#cookie-value").val(), $("#cookie-domain").val());
        DisplayCookies();
    });

    $("#set-server-cookie").click(function (event) {
        SetServerCookie($("#cookie-key").val(), $("#cookie-value").val(), $("#cookie-domain").val())
            .done(DisplayCookies);
    });

    $("#refresh-cookies").click(function (event) {
        DisplayCookies();
    });

    $("#delete-cookies-client").click(function (event) {
        DeleteAllCookiesClient();
        DisplayCookies();
    });

    $("#delete-cookies-server").click(function (event) {
        DeleteAllCookiesServer()
            .then(function () { DisplayCookies() });
    });

    $("#custom-client-action-01").click(function (event) {
        SetCookie("foo", "Step 1: No Domain");
        SetCookie("foo", "Step 2: Domain", "cookietester.com");
        SetCookie("bar", "Step 3: Domain", "cookietester.com");
        SetCookie("bar", "Step 4: No Domain" );
        DisplayCookies();
    });

    $("#custom-server-action-01").click(function (event) {
        SetServerCookie("foo", "Step 1: No Domain")
            .then(function () { return SetServerCookie("foo", "Step 2: Domain", "cookietester.com"); })
            .then(function () { return SetServerCookie("bar", "Step 3: Domain", "cookietester.com"); })
            .then(function () { return SetServerCookie("bar", "Step 4: No Domain"); })
            .then(function () { DisplayCookies() });
        
    });

    function SetCookie(key, value, domain) {
        if (domain) {
            document.cookie = key + "=" + value + ";domain=" + domain;
        } else {
            document.cookie = key + "=" + value;
        }

    }

    function SetServerCookie(key, value, domain) {
        return $.ajax({
            url: "/api/SetCookie",
            method: "POST",
            data: { key: key, value: value, domain: domain }
        });
    }

    function DisplayCookies() {
        DisplayClientCookies();
        DisplayServerCookies();
    }

    function DisplayClientCookies() {
        $("#current-client-cookies").val(ParseCookieString(document.cookie));
    }

    function DisplayServerCookies() {
        $.ajax({
            url: "/api/SetCookie/details",
            method: "GET",
            success: function (data) {
                var cookies = "";
                for (i = 0; i < data.MyCookies.length; i++) {
                    cookies += data.MyCookies[i].key + "=" + data.MyCookies[i].value+"\n";
                }
                $("#current-server-cookies").val(cookies);

                $("#server-foo").val(data.Foo);
                $("#server-bar").val(data.Bar);
            }
        });
    }

    function ParseCookieString(rawCookie) {
        var cookies = rawCookie.split("; ")
        var cookiesDisplay = "";
        for (i = 0; i < cookies.length; i++) {
            cookiesDisplay += decodeURIComponent(cookies[i]) + "\n";
        }
        return cookiesDisplay
    }

    function DeleteAllCookiesClient() {
        var cookies = document.cookie.split("; ");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var cookieNameValue = cookie.split("=");

            DeleteCookie(cookieNameValue[0]);
            
        }
    }

    function DeleteAllCookiesServer() {
        return $.ajax({
            url: "/api/SetCookie/clear"
        });
    }

    function DeleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = name + "=;domain=cookietester.com;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    DisplayCookies();

});