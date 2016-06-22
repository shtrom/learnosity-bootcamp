/**
 *--------------------------------------------------------------------------
 * Learnosity SDK - Init
 *--------------------------------------------------------------------------
 *
 * Used to generate the necessary security and request data (in the
 * correct format) to integrate with any of the Learnosity API services.
 *
 * HISTORY
 * 01-Feb-2016: Removed UI warning, leaving console and made v0.2
 * 17-Feb-2016: Added Author & Data support in switch statement
 * 06-Apr-2016: Fixes for Data - requestPacket can be string, action is supported
 */
var Learnosity = {
    /**
     * SDK Version
     * @var string
     */
    version: 'v0.2.1',

    /**
     * Most services add the request packet (if passed) to the signature
     * for security reasons. This flag can override that behaviour for
     * services that don't require this.
     * @var boolean
     */
    signRequestData: true,
    /**
     * Keynames that are valid in the securityPacket, they are also in
     * the correct order for signature generation.
     * @var array
     */
    validSecurityKeys: ['consumer_key', 'domain', 'timestamp', 'user_id'],

    /**
     * Service names that are valid for `service`
     * @var array
     */
    validServices: ['assess', 'author', 'items', 'questions', 'reports'],

    init: function(service, securityPacket, secret, requestPacket, action) {
        if (!this.helper.isNodeJS) {
            this.helper.injectNotice(this.version);
        }

        if (!securityPacket.domain && !this.helper.isNodeJS) {
            securityPacket.domain = window.location.hostname;
        }

        if (!securityPacket.timestamp) {
            securityPacket.timestamp = this.helper.timestamp();
        }

        this.service = service;
        this.securityPacket = securityPacket;
        this.secret = secret;
        if (requestPacket) {
            this.requestPacket = requestPacket;
            this.requestString = typeof requestPacket == 'string' ? requestPacket : JSON.stringify(requestPacket);
        }
        this.action = action;

        // Set any service specific options
        this.setServiceOptions(this.securityPacket, this.requestPacket, this.service, this.secret);

        // Generate the signature based on the arguments provided
        this.securityPacket.signature = this.generateSignature();

//NOTE: if we support { 'security': {}, 'request': {} } this goes away!
        var output;
        if(this.service == 'questions') {
            output = this.helper.extend(this.securityPacket, this.requestPacket);
        } else {
            output = {
                'security': this.securityPacket,
                'request': this.requestPacket
            };
        }

        return output;
    },

    /**
     * Generate a signature hash for the request, this includes:
     *  - the security credentials
     *  - the `request` packet (a JSON string) if passed
     *  - the `action` value if passed
     *
     * @return string A signature hash for the request authentication
     */
    generateSignature: function() {
        var self = this;
        signatureArray = [];

        // Create a pre-hash string based on the security credentials
        // The order is important
        this.validSecurityKeys.forEach(function(key) {
            if (self.securityPacket[key]) {
                signatureArray.push(self.securityPacket[key]);
            }
        });

        // Add the secret
        signatureArray.push(this.secret);

        // Add the requestPacket if necessary
        if (this.signRequestData && this.requestString && this.requestString.length > 0) {
            signatureArray.push(this.requestString);
        }

        // Add the action if necessary
        if (this.action && this.action.length > 0) {
            signatureArray.push(this.action);
        }

        return this.hashValue(signatureArray);
    },

    /**
     * Hash an array value
     *
     * @param  array  value An array to hash
     *
     * @return string The hashed string
     */
    hashValue: function(value) {
        return CryptoJS.SHA256(value.join('_')).toString();
    },

    /**
     * Set any options for services that aren't generic
     */
    setServiceOptions: function(security, request, service, secret) {
        switch (this.service) {
            case 'assess':
            case 'questions':
                this.signRequestData = false;
                // The Assess API holds data for the Questions API that includes
                // security information and a signature. Retrieve the security
                // information from this and generate a signature for the
                // Questions API
                if (this.service === 'assess' && request.questionsApiActivity) {
                    questionsApi = request.questionsApiActivity;
                    var domain = 'assess.learnosity.com';
                    if (security.domain) {
                        domain = security.domain;
                    } else if (questionsApi.domain) {
                        domain = questionsApi.domain;
                    }

                    request.questionsApiActivity = {
                        'consumer_key': security.consumer_key,
                        'timestamp': security.timestamp,
                        'user_id': security.user_id,
                        'signature': this.hashValue(
                            {
                                'consumer_key': security.consumer_key,
                                'domain': domain,
                                'timestamp': security.timestamp,
                                'user_id': security.user_id,
                                'secret': secret
                            }
                        )
                    };

                    delete questionsApi.consumer_key;
                    delete questionsApi.domain;
                    delete questionsApi.timestamp;
                    delete questionsApi.user_id;
                    delete questionsApi.signature;

                    requestPacket.questionsApiActivity = request.questionsApiActivity.concat(questionsApi);
                }
                break;
            case 'author':
            case 'data':
            case 'items':
            case 'reports':
                // The Events API requires a user_id, so we make sure it's a part
                // of the security packet as we share the signature in some cases
                if (!security.user_id && request && request.user_id) {
                    this.securityPacket.user_id = request.user_id;
                }

                break;
            default:
                // do nothing
                break;
        }
    },

    helper: {
        timestamp: function() {
            var now = new Date(Date.now()),
                date = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);

            return $D(date).strftime("%Y%m%d-%H%M");
        },

        extend: function(a, b) {
            for(var key in b) {
                if(b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
            return a;
        },

        isNodeJS: typeof exports !== 'undefined' && this.exports !== exports,

        injectNotice: function(version) {
            console.log('%c', 'padding: 0 6px;');
            console.log('%c Learnosity API Notice: JS API is *NOT FOR PRODUCTION USE* on the client side. You consumer secret can\'t be exposed in the browser.', 'background: red; color: white; padding: 12px; margin: 0 6px;');
            console.log('%c', 'padding: 0 6px;');
        }
    }

};

/* Vendor Utilities */
/*
sha256.js from http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},t=f.lib={},g=function(){},j=t.Base={extend:function(a){g.prototype=this;var c=new g;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=t.WordArray=j.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||u).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new q.init(c,a)}}),v=f.enc={},u=v.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new q.init(d,c/2)}},k=v.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new q.init(d,c)}},l=v.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
x=t.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=l.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var m=0;m<a;m+=e)this._doProcessBlock(d,m);m=d.splice(0,a);c.sigBytes-=b}return new q.init(m,b)},clone:function(){var a=j.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});t.Hasher=x.extend({cfg:j.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){x.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new w.HMAC.init(a,
d)).finalize(c)}}});var w=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);

/**
 * JavaScript Date instance methods
 *
 * @copyright 2012 Ken Snyder (kendsnyder at gmail dot com)
 * @version 3.4.1, June 2012 (http://sandbox.kendsnyder.com/date)
 * @license MIT http://www.opensource.org/licenses/MIT
 */
(function(){var h=24*60*60*1000;function e(m,n){m=m+"";var i=n-m.length;if(i<=0){return m}return Array(i+1).join("0")+m}function f(n,i){for(var m in i){if(Object.prototype.hasOwnProperty.call(i,m)){n[m]=i[m]}}}var b={millisecond:1,second:1000,minute:60*1000,hour:60*60*1000,day:h,week:7*h,month:{add:function(o,m){var i=o.getDate();b.year.add(o,Math[m>0?"floor":"ceil"](m/12));var n=o.getMonth()+(m%12);if(n==12){n=0;o.setYear(o.getFullYear()+1)}else{if(n==-1){n=11;o.setYear(o.getFullYear()-1)}}o.setMonth(n);if(o.getDate()!=i){o.add(-1,"month");o.setDate(o.daysInMonth())}},diff:function(p,n){var i=p.getFullYear()-n.getFullYear();var m=p.getMonth()-n.getMonth()+(i*12);var o=p.getDate()-n.getDate();return m+(o/30)}},year:{add:function(m,i){m.setYear(m.getFullYear()+Math[i>0?"floor":"ceil"](i))},diff:function(m,i){return b.month.diff(m,i)/12}}};var a=b;a.milliseconds=a.millisecond;a.seconds=a.second;a.minutes=a.minute;a.hours=a.hour;a.weeks=a.week;a.days=a.day;a.months=a.month;a.years=a.year;var g={succ:function(i){return this.clone().add(1,i)},add:function(n,m){var i=b[m]||b.day;if(typeof i=="number"){this.setTime(this.getTime()+(i*n))}else{i.add(this,n)}return this},diff:function(m,p,i){var o;m=Date.create(m);if(m===null){return NaN}var n=b[p]||b.day;if(typeof n=="number"){o=(this.getTime()-m.getTime())/n}else{o=n.diff(this,m)}return(i?o:Math[o>0?"floor":"ceil"](o))},_applyFormat:function(m,n){var p=m||n.defaultFormat,i="",o;while(p.length>0){if((o=p.match(n.matcher))){i+=p.slice(0,o.index);i+=(o[1]||"")+this._applyFormatChar(o[2],n);p=p.slice(o.index+o[0].length)}else{i+=p,p=""}}return i},_applyFormatChar:function(o,m){if(m.shortcuts&&m.shortcuts[o]){return this._applyFormat(m.shortcuts[o],m)}else{if(m.codes&&m.codes[o]){var i=m.codes[o].split(".");var n=this["get"+i[0]]?this["get"+i[0]]():"";if(i[1]){n=e(n,i[1])}return n}}return o},format:function(i){i=i||Date.formatting.strftime.defaultFormat;if(i.indexOf("%")>-1){return this.strftime(i)}return this.formatPhp(i)},getShortYear:function(){return this.getYear()%100},getMonthNumber:function(){return this.getMonth()+1},getMonthName:function(){return Date.MONTHNAMES[this.getMonth()]},getAbbrMonthName:function(){return Date.ABBR_MONTHNAMES[this.getMonth()]},getDayName:function(){return Date.DAYNAMES[this.getDay()]},getAbbrDayName:function(){return Date.ABBR_DAYNAMES[this.getDay()]},getDayOrdinal:function(){return Date.ORDINALNAMES[this.getDate()%10]},getHours12:function(){var i=this.getHours();return i>12?i-12:(i==0?12:i)},getAmPm:function(){return this.getHours()>=12?"PM":"AM"},getAmPmLower:function(){return this.getHours()>=12?"pm":"am"},getUnix:function(){return Math.round(this.getTime()/1000,0)},getUTCOffset:function(){var i=this.getTimezoneOffset()/60;var m=i<0?"+":"-";i=Math.abs(i);return m+e(Math.floor(i),2)+":"+e((i%1)*60,2)},setUTCOffset:function(n){var m=this.getTimezoneOffset()*-1;var i=this.getTime()+(m*60000);this.setTime(i-(n*60000));return this},setUTCOffsetString:function(n){var i=n.match(/([+-]?)([01]\d|2[0-3])\:?([0-5]\d)/);if(i){var m=parseFloat(i[2])*60;m+=parseFloat(i[3]);if(i[1]=="-"){m*=-1}this.setUTCOffset(m)}return this},getUTCOffsetNumber:function(){return this.getUTCOffset().replace(":","")},getTimezoneName:function(){var i=/(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());return i[1]||i[2]||"GMT"+this.getUTCOffset()},toYmdInt:function(){return(this.getFullYear()*10000)+(this.getMonthNumber()*100)+this.getDate()},clone:function(){return new Date(this.getTime())},diffText:function(o){var q=this.diff(o||Date.current(),"seconds");var p=Math.abs(q);var m;if(p<120){return q>=0?"in a moment":"moments ago"}else{if(p<3600){m=floor(p/60)+" minutes"}else{if(p<86400){var i=floor(p/3600);var n=hour==1?"":"s";m=i+" hour"+n+" ago"}else{if(p<172800){return q>0?"tomorrow":"yesterday"}else{if(p<604800){m=floor(p/86400)+" days"}else{if(p<1209600){return q>0?"next week":"last week"}else{if(p<2419200){m=floor(p/604800)+" weeks"}else{if(p<5184000){return q>0?"next month":"last month"}else{if(p<31536000){m=floor(p/2592000)+" months"}else{if(p<63072000){return q>0?"next year":"last year"}else{m=floor(p/31536000)+" years"}}}}}}}}}}return(q>0?"in "+m:m+" ago")},daysInMonth:function(){return Date.daysInMonth(this.getFullYear(),this.getMonth()+1)},isLeapYear:function(){return Date.daysInMonth(this.getFullYear(),1)==29?1:0}};f(Date.prototype,g);if(!Date.prototype.toISOString){Date.prototype.toISOString=function(){return this.setUTCOffset(0).strftime(Date.ISO)}}var c={create:function(n){if(typeof n=="undefined"){return Date.current()}if(n instanceof Date){return n}var u=arguments;switch(u.length){case 1:if(Object.prototype.toString.call(n)=="[object Number]"){return new Date(n)}n=String(n).replace(/^\s*(.*)\s*$/,"$1");if(n===""){return Date.current()}var p=0,r,m,o,q,t,s;while((r=Date.create.patterns[p++])){if(typeof r[0]=="string"){t=r[1];s=r[2]}else{t=r[0];s=r[1]}if(!(q=n.match(t))){continue}if(typeof s=="function"){o=s(q,n);if(o instanceof Date){return o}}else{m=Date.parse(n.replace(t,s));if(!isNaN(m)){return new Date(m)}}}return NaN;case 2:return new Date(u[0],u[1],1);case 3:return new Date(u[0],u[1],u[2]);case 4:return new Date(u[0],u[1],u[2],u[3]);case 5:return new Date(u[0],u[1],u[2],u[3],u[4]);case 6:return new Date(u[0],u[1],u[2],u[3],u[4],u[5]);default:return new Date(u[0],u[1],u[2],u[3],u[4],u[5],u[6])}},MONTHNAMES:"January February March April May June July August September October November December".split(" "),ABBR_MONTHNAMES:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAYNAMES:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),ABBR_DAYNAMES:"Sun Mon Tue Wed Thu Fri Sat".split(" "),ORDINALNAMES:"th st nd rd th th th th th th".split(" "),ISO:"%Y-%m-%dT%H:%M:%S.%N%G",SQL:"%Y-%m-%d %H:%M:%S",SCRIPT_LOAD:new Date,daysInMonth:function(i,m){if(m==2){return new Date(i,1,29).getDate()==29?29:28}return[undefined,31,undefined,31,30,31,30,31,31,30,31,30,31][m]},autoFormat:function(m,i){m=(typeof m=="string"?document.getElementById(m):m);var n=function(){var o=Date.create(m.value);if(o){m.value=o.format(i)}};if(typeof m.attachEvent=="function"){m.attachEvent("onblur",n)}else{if(typeof m.addEventListener=="function"){m.addEventListener("blur",n,false)}else{m.onblur=n}}return m},addFormat:function(i,m){Date.prototype[i]=function(n){return this._applyFormat(n,m)};return this},addPattern:function(m,o){if(o){var n=0,p;while((p=Date.create.patterns[n++])){if(p[0]==o||p[1]==o){Date.create.patterns.splice(n,0,m);return this}}}Date.create.patterns.unshift(m);return this},removePattern:function(m){var n=0,o;while((o=Date.create.patterns[n++])){if(o[0]==m||o[1]==m){return Date.create.patterns.splice(n-1,1)[0]}}return false},current:function(){return new Date}};f(Date,c);if(!("now" in Date)){Date.now=function(){return Date.current().setUTCOffset(0).getTime()}}Date.addFormat("strftime",{matcher:/()%(#?(%|[a-z]))/i,defaultFormat:"%Y-%m-%d %H:%M:%s",codes:{Y:"FullYear",y:"ShortYear.2",m:"MonthNumber.2","#m":"MonthNumber",B:"MonthName",b:"AbbrMonthName",d:"Date.2","#d":"Date",e:"Date",A:"DayName",a:"AbbrDayName",w:"Day",o:"DayOrdinal",H:"Hours.2","#H":"Hours",I:"Hours12.2","#I":"Hours12",P:"AmPmLower",p:"AmPm",M:"Minutes.2","#M":"Minutes",S:"Seconds.2","#S":"Seconds",s:"Unix",N:"Milliseconds.3","#N":"Milliseconds",O:"TimezoneOffset",Z:"TimezoneName",G:"UTCOffset"},shortcuts:{F:"%Y-%m-%d",T:"%H:%M:%S",X:"%H:%M:%S",x:"%m/%d/%y",D:"%m/%d/%y","#c":"%a %b %e %H:%M:%S %Y",v:"%e-%b-%Y",R:"%H:%M",r:"%I:%M:%S %p",t:"\t",n:"\n","%":"%"}});Date.addFormat("formatPhp",{matcher:/(\\)?([a-z])/i,defaultFormat:"Y-m-d H:i:s",codes:{Y:"FullYear",y:"ShortYear.2",L:"isLeapYear",m:"MonthNumber.2",n:"MonthNumber",F:"MonthName",M:"AbbrMonthName",t:"daysInMonth",d:"Date.2",j:"Date",l:"DayName",D:"AbbrDayName",w:"Day",S:"DayOrdinal",H:"Hours.2",G:"Hours",h:"Hours12.2",g:"Hours12",a:"AmPmLower",A:"AmPm",i:"Minutes.2",s:"Seconds.2",U:"Unix",Z:"TimezoneOffset",e:"TimezoneName",P:"UTCOffset",O:"UTCOffsetNumber"},shortcuts:{c:"Y-m-d\\TH:i:sP",r:"D, j M Y H:i:s O"}});var j={matcher:/()(mi|am|pm|ss|yyyy|yy|m{1,4}|d{1,4}|w|hh?24|hh?12)/i,defaultFormat:"yyyy-mm-dd hh24:mi:ss",codes:{yyyy:"FullYear",yy:"ShortYear.2",mm:"MonthNumber.2",m:"MonthNumber",mmm:"AbbrMonthName",mmmm:"MonthName",dd:"Date.2",d:"Date",ddd:"AbbrDayName",dddd:"DayName",w:"Day",hh24:"Hours.2",h24:"Hours",hh:"Hours12.2",hh12:"Hours12.2",h12:"Hours12",am:"AmPm",pm:"AmPm",mi:"Minutes.2",ss:"Seconds.2"},shortcuts:{}};var l="yyyy yy mm m mmm mmmm dd d ddd dddd w hh24 h24 hh12 h12 am pm mi ss".split(" "),d=0,k;while((k=l[d++])){j.codes[k.toUpperCase()]=j.codes[k]}Date.addFormat("formatSql",j);Date.create.patterns=[["iso_8601",/^([1-9]\d{3})\s*-\s*(1[0-2]|0?[1-9])\s*-\s*(3[01]|[12]\d|0?[1-9])$/,"$2/$3/$1"],["us",/^(1[0-2]|0?[1-9])\s*[\/-]\s*(3[01]|[12]\d|0?[1-9])\s*[\/-]\s*([1-9]\d{3})$/,"$1/$2/$3"],["world",/^(3[01]|[12]\d|0?[1-9])\s*([\.\/])s*(1[0-2]|0?[1-9])\s*\2\s*([1-9]\d{3})$/,"$3/$1/$4"],["chicago",/^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s+)?(3[01]|[0-2]\d|\d)\s*([ -])\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s*\2\s*([1-9]\d{3})$/i,"$3 $1, $4"],["conversational",/^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s+)?(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(3[01]|[0-2]\d|\d),?\s*([1-9]\d{3})$/i,"$1 $2, $3"],["unix",/^@(-?\d+)$/,function(i){return Date.create(i[1]*1000)}],["24_hour",/^(?:(.+?)(?:\s+|T))?([01]\d|2[0-3])(?:\s*\:\s*([0-5]\d))(?:\s*\:\s*([0-5]\d))?\s*(?:\.(\d+))?(\s*(?:GMT)?[+-](?:[01]\d|2[0-3])\:?[0-5]\d)?(?: \(.+?\))?$/i,function(i){var m;if(i[1]){m=Date.create(i[1]);if(isNaN(m)){return false}}else{m=Date.current();m.setMilliseconds(0)}m.setHours(parseFloat(i[2]),parseFloat(i[3]),parseFloat(i[4]||0));if(i[5]){m.setMilliseconds(+String(i[5]).slice(0,3))}if(i[6]){m.setUTCOffsetString(i[6])}return m}],["12_hour",/^(?:(.+)\s+)?(0?[1-9]|1[012])(?:\s*\:\s*([0-5]\d))?(?:\s*\:\s*([0-5]\d))?\s*(am|pm)\s*$/i,function(m){var n;if(m[1]){n=Date.create(m[1]);if(isNaN(n)){return false}}else{n=Date.current();n.setMilliseconds(0)}var i=parseFloat(m[2]);i=m[5].toLowerCase()=="am"?(i==12?0:i):(i==12?12:i+12);n.setHours(i,parseFloat(m[3]||0),parseFloat(m[4]||0));return n}],["weeks_months_before_after",/^(\d+)\s+(year|month|week|day|hour|minute|second|millisecond)s?\s+(before|from|after)\s+(.+)$/i,function(i){var m=Date.create(i[4]);if(m instanceof Date){return m.add((i[3].toLowerCase()=="before"?-1:1)*i[1],i[2])}return false}],["time_ago",/^(\d+)\s+(year|month|week|day|hour|minute|second|millisecond)s?\s+ago$/i,function(i){return Date.current().add(-1*i[1],i[2])}],["in_time",/^in\s+(\d+)\s+(year|month|week|day|hour|minute|second|millisecond)s?$/i,function(i){return Date.current().add(i[1],i[2])}],["plus_minus",/^([+-])\s*(\d+)\s+(year|month|week|day|hour|minute|second|millisecond)s?$/i,function(i){var m=i[1]=="-"?-1:1;return Date.current().add(m*i[2],i[3])}],["asp_json",/^\/Date\((\d+)([+-]\d{4})?\)\/$/i,function(i){var m=new Date;m.setTime(i[1]);if(i[2]){m.setUTCOffsetString(i[2])}return m}],["today_tomorrow",/^(tod|now|tom|yes)/i,function(m){var i=Date.current();switch(m[1].toLowerCase()){case"tod":case"now":return i;case"tom":return i.add(1,"day");case"yes":return i.add(-1,"day")}}],["this_next_last",/^(this|next|last)\s+(?:(year|month|week|day|hour|minute|second|millisecond)|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|(sun|mon|tue|wed|thu|fri|sat))/i,function(p){var u=p[1].toLowerCase()=="last"?-1:1;var m=Date.current();var n=Date.ABBR_MONTHNAMES;var o;if(p[2]){return m.add(u,p[2])}else{if(p[3]){var r=p[3].toLowerCase(),s;for(o=0;o<n.length;o++){if(r==n[o].toLowerCase()){s=12-(m.getMonth()-o);s=s>12?s-12:s;return m.add(u*s,"month")}}}else{if(p[4]){var q=p[4].toLowerCase();var t=Date.ABBR_DAYNAMES;for(o=0;o<t.length;o++){if(q==t[o].toLowerCase()){s=m.getDay()-o+7;return m.add(u*(s==0?7:s),"day")}}}}}return false}],["conversational_sans_year",/^(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)(?:the\s+)?(\d+)(?:st|nd|rd|th)?$/i,function(m){var o=Date.current();if(m[1]){var n=Date.ABBR_MONTHNAMES.length;while(n--){if(Date.ABBR_MONTHNAMES[n].toLowerCase()==m[1].toLowerCase()){o.setMonth(n);break}}}o.setDate(m[2]);return o}]];if(typeof module!="undefined"&&module.exports){module.exports=Date.create}else{if(typeof window!="undefined"){window.$D=Date.create}}})();