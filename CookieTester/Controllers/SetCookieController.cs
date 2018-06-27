using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace CookieTester.Controllers
{
    public class SetCookieController : ApiController
    {
        public class MyCookie
        {
            public string key { get; set; }
            public string value { get; set; }
            public string domain { get; set; }
        }

        public class MyResults
        {
            public List<MyCookie> MyCookies { get; set; }
            public string Foo { get; set; }
            public string Bar { get; set; }
        }

        [Route("api/SetCookie/details")]
        public MyResults GetDetails()
        {
            var myCookies = new List<MyCookie>();
            for(var i = 0; i < HttpContext.Current.Request.Cookies.Count; i++)
            {
                myCookies.Add(new MyCookie
                {
                    key = HttpContext.Current.Request.Cookies[i].Name,
                    value = HttpUtility.UrlDecode(HttpContext.Current.Request.Cookies[i].Value)
                });
            }

            var myResults = new MyResults
            {
                MyCookies = myCookies,
                Bar = HttpContext.Current.Request.Cookies["bar"]?.Value,
                Foo = HttpContext.Current.Request.Cookies["foo"]?.Value
            };
            

            return myResults;
        }

        public void Post(MyCookie myCookie)
        {
            //var response = new HttpResponseMessage();

            var cookie = new HttpCookie(myCookie.key, myCookie.value);
            cookie.Domain = myCookie.domain;
            //cookie.Path = "/";
            HttpContext.Current.Response.SetCookie(cookie);

            //return response;
        }

        [Route("api/SetCookie/clear")]
        [AcceptVerbs("GET", "POST")]
        public int DeleteCookies()
        {
            var myCookies = new List<MyCookie>();
            var cookieCount = HttpContext.Current.Request.Cookies.Count;
            for (var i = 0; i < cookieCount; i++)
            {

                var cookie = new HttpCookie(HttpContext.Current.Request.Cookies[i].Name);
                var noDomainCookie = new HttpCookie(HttpContext.Current.Request.Cookies[i].Name);

                cookie.Expires = DateTime.Now.AddDays(-1);
                noDomainCookie.Expires = DateTime.Now.AddDays(-1);

                cookie.Domain = "cookietester.com";

                HttpContext.Current.Response.Cookies.Add(cookie);

                HttpContext.Current.Response.Cookies.Add(noDomainCookie);

            }


            return 0;
        }
    }
}
