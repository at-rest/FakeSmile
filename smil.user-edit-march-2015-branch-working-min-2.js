var mpf=33,splinePrecision=25,svgns="http://www.w3.org/2000/svg",smilanimns="http://www.w3.org/2001/smil-animation",smil2ns="http://www.w3.org/2001/SMIL20",smil21ns="http://www.w3.org/2005/SMIL21",smil3ns="http://www.w3.org/ns/SMIL30",timesheetns="http://www.w3.org/2007/07/SMIL30/Timesheets",xlinkns="http://www.w3.org/1999/xlink",animators=[],animations=[],timeZero;
function initSMIL(){if(!document.implementation.hasFeature(smil3ns,"3.0")&&"fake"!=document.documentElement.getAttribute("smiling")){document.documentElement.setAttribute("smiling","fake");smile(document);timeZero=new Date;for(var a=0,b=animators.length;a<b;++a)animators[a].register(),window.setInterval(animate,mpf)}}
function smile(a){a=a.querySelectorAll("animate , animateMotion , animateTransform , animateColor , set");var b,c;b=0;for(c=a.length;b<c;++b){for(var d=getTargets(a[b]),e=[],f=0;f<d.length;++f){var g=new Animator(a[b],d[f],f);animators.push(g);e[f]=g}a[b].animators=e}}
function getTargets(a){if(a.hasAttribute("select"))return select(a);var b=a.getAttributeNS(xlinkns,"href");if(null!==b&&""!==b)return[document.getElementById(b.substring(1))];a=a.parentNode;return"item"!=a.localName||a.namespaceURI!=timesheetns&&a.namespaceURI!=smil3ns?[a]:select(a)}function getEventTargetsById(a,b){var c=null;if("prev"==a)for(c=b.previousSibling;c&&1!=c.nodeType;)c=c.previousSibling;null===c&&(c=document.getElementById(a));return null===c?null:c.animators?c.animators:[c]}
Animator.prototype={register:function(){var a=this.anim.getAttribute("begin");a||(a="0");this.schedule(a,this.begin);(a=this.anim.getAttribute("end"))&&this.schedule(a,this.finish)},schedule:function(a,b){for(var c=a.split(";"),d=0;d<c.length;++d){var e=c[d].trim();if(11<e.length&&"wallclock("==e.substring(0,10)){var f=new Date;f.setISO8601(e.substring(10,e.length-1));b.call(this,f-new Date)}else if(isNaN(parseInt(e,10))){var g=0,h=e.indexOf("+");-1==h&&(h=e.indexOf("-"));-1!=h&&(g=toMillis(e.substring(h).replace(/ /g,
"")),e=e.substring(0,h).trim());h=e.indexOf(".");f=[];-1==h?f=[this.target]:(f=e.substring(0,h),0===f.indexOf("index(")&&(f=f.substring(6,f.length-1)+this.index),f=getEventTargetsById(f,this.anim));e=e.substring(h+1);g=funk(b,this,g);for(h=0;h<f.length;++h){var k=f[h];null!==k&&k.addEventListener(e,g,!1)}}else e=toMillis(e),b.call(this,e)}},getCurVal:function(){return"CSS"==this.attributeType?this.target.style.getPropertyValue(this.attributeName):this.target.getAttributeNS(this.namespace,this.attributeName)},
begin:function(a){var b=0,c=0;if(!("never"==this.restart||this.running&&"whenNotActive"==this.restart))if(this.running&&this.finish(),null!==a&&0<=a){var d=this,e=this.begin;window.setTimeout(function(){e.call(d)},a)}else{this.startTime=new Date;if(a&&0>a&&(this.startTime.setTime(this.startTime.getTime()+a),this.startTime<timeZero))return;this.stop();this.running=!0;this.realInitVal=b=this.getCurVal();!b&&propDefaults[this.attributeName]&&(b=propDefaults[this.attributeName]);this.attributeName.match(/^(fill|stroke|stop-color|flood-color|lighting-color)$/)&&
this.color();"set"==this.anim.nodeName&&this.step(this.normalize(this.to));this.iteration=0;if(this.values)for(this.animVals=this.values.split(";"),b=0;b<this.animVals.length;++b)this.animVals[b]=this.normalize(this.animVals[b].trim());else this.animVals=[],this.animVals[0]=this.from?this.normalize(this.from):this.normalize(b),this.animVals[1]=this.by&&this.animVals[0]?this.add(this.normalize(this.animVals[0]),this.normalize(this.by)):this.normalize(this.to);if(this.animVals[this.animVals.length-
1]&&(this["final"]=this.animVals[this.animVals.length-1],this.animVals[0]&&!this.attributeName.match(/^(fill|stroke|stop-color|flood-color|lighting-color)$/))){a=[];var f=this.animVals[0],f=getUnit(f);a[0]=f[0];this.unit=f[1];b=1;for(c=this.animVals.length;b<c;++b)if(f=this.animVals[b],f=getUnit(f),f[1]==this.unit)a[b]=f[0];else{a=this.animVals;break}this.animVals=a}this.iterBegin=this.startTime;animations.push(this);b=0;for(c=this.beginListeners.length;b<c;++b)this.beginListeners[b].call();(b=this.anim.getAttribute("onbegin"))&&
eval(b)}},normalize:function(a){return a},add:function(a,b){return""+(parseFloat(a)+parseFloat(b))},f:function(a){var b=this.anim,c=this.computedDur;if(isNaN(c))return!0;var d=(a-this.iterBegin)/c;if(1<=d)return this.end();var e=parseFloat(this.iteration);if(this.repeatCount&&"indefinite"!=this.repeatCount&&e+d>=this.repeatCount)return"freeze"==this.fill&&(this["final"]=this.valueAt(this.repeatCount-e)),this.end();if(this.repeatDur&&"indefinite"!=this.repeatDur&&a-this.startTime>=toMillis(this.repeatDur))return"freeze"==
this.fill&&(a=toMillis(this.repeatDur)/c,this["final"]=this.valueAt(a-Math.floor(a))),this.end();if("set"==b.localName)return!0;a=this.valueAt(d);this.step(a);return!0},isInterpolable:function(a,b){var c=!isNaN(a)&&!isNaN(b);if(!c&&-1!=a.trim().indexOf(" ")&&-1!=b.trim().indexOf(" ")){var d=a.trim().split(" "),e=b.trim().split(" "),c=!0;if(d.length==e.length)for(var f=0;f<e.length;++f)if(!this.isInterpolable(d[f],e[f]))return!1}return c},valueAt:function(a){var b=this.animVals,c=0,c=0;if(1==a)return b[b.length-
1];if("discrete"!=this.calcMode&&this.isInterpolable(b[0],b[1])){var d;if(this.keyTimes)for(c=1;c<this.keyTimes.length;++c){if(this.keyTimes[c]>a){d=c-1;var e=this.keyTimes[d];a=(a-e)/(this.keyTimes[c]-e);break}}else c=b.length-1,d=Math.floor(a*c),a=a%(1/c)*c;"spline"==this.calcMode&&(a=this.spline(a,d));return this.interpolate(this.normalize(b[d]),this.normalize(b[d+1]),a)}if(this.keyTimes){for(c=1;c<this.keyTimes.length;++c)if(this.keyTimes[c]>a)return b[c-1];return b[b.length-1]}c=b.length;return b[Math.floor(a*
c)]},spline:function(a,b){for(var c=this.keySplines[b],d=c.getTotalLength(),e=d/splinePrecision,f=0,g=0,g=0;g<=d;g+=e)if(f=c.getPointAtLength(g),f.x>a)return g=c.getPointAtLength(g-e),a-=g.x,a/=f.x-g.x,g.y+(f.y-g.y)*a;f=c.getPointAtLength(d);g=c.getPointAtLength(d-e);a-=g.x;a/=f.x-g.x;return g.y+(f.y-g.y)*a},interpolate:function(a,b,c){if(!this.isInterpolable(a,b))return.5>c?a:b;if(-1!=a.trim().indexOf(" ")){a=a.split(" ");b=b.split(" ");for(var d=[],e=0;e<b.length;++e)d[e]=parseFloat(a[e])+(b[e]-
a[e])*c;return d.join(" ")}return parseFloat(a)+(b-a)*c},step:function(a){this.unit&&(a+=this.unit);var b=this.attributeName;"CSS"==this.attributeType?("font-size"!=b||isNaN(a)||(a+="px"),this.target.style.setProperty(b,a,"")):this.target.setAttributeNS(this.namespace,b,a)},end:function(){var a=0;if(this.repeatCount||this.repeatDur){++this.iteration;var b=new Date;if(this.repeatCount&&"indefinite"!=this.repeatCount&&this.iteration>=this.repeatCount||this.repeatDur&&"indefinite"!=this.repeatDur&&b-
this.startTime>=toMillis(this.repeatDur))return this.finish();if("sum"==this.accumulate){var c=this.getCurVal();!c&&propDefaults[this.attributeName]&&(c=propDefaults[this.attributeName]);if(this.by&&!this.from)this.animVals[0]=c,this.animVals[1]=this.add(this.normalize(c),this.normalize(this.by));else for(a=0;a<this.animVals.length;++a)this.animVals[a]=this.add(this.normalize(c),this.normalize(this.animVals[a]));this["final"]=this.animVals[this.animVals.length-1]}this.iterBegin=b;for(a=0;a<this.repeatIterations.length;++a)this.repeatIterations[a]==
this.iteration&&this.repeatListeners[a].call();(a=this.anim.getAttribute("onrepeat"))&&eval(a)}else return this.finish();return!0},finish:function(a){var b=new Date;if(this.min&&"indefinite"!=this.min&&b-this.startTime>=toMillis(this.min))return!0;if(a&&0<a){var c=this,d=this.finish;window.setTimeout(function(){d.call(c)},a);return!0}if(a&&0>a&&(b.setTime(b.getTime()+a),b<this.startTime))return!0;a=!0;"freeze"==this.fill?this.freeze():(this.stop(),this.step(this.realInitVal),a=!1);if(this.running){for(b=
0;b<this.endListeners.length;++b)this.endListeners[b].call();(b=this.anim.getAttribute("onend"))&&eval(b);this.running=!1}return a},stop:function(){for(var a=0,b=animations.length;a<b;++a)if(animations[a]==this){animations.splice(a,1);break}},freeze:function(){this.step(this["final"])},addEventListener:function(a,b,c){"begin"==a?this.beginListeners.push(b):"end"==a?this.endListeners.push(b):7<a.length&&"repeat"==a.substring(0,6)&&(a=a.substring(7,a.length-1),this.repeatListeners.push(b),this.repeatIterations.push(a))},
getPath:function(){var a=this.anim.getElementsByTagNameNS(svgns,"mpath")[0];return a?(a=a.getAttributeNS(xlinkns,"href"),document.getElementById(a.substring(1))):(a=this.anim.getAttribute("path"))?createPath(a):null},translation:function(){this.by&&-1==this.by.indexOf(",")&&(this.by+=",0");this.normalize=function(a){a=a.replace(/,/g," ").replace(/ +/," ").split(/ /);1==a.length&&(a[1]="0");a[0]=parseFloat(a[0]);a[1]=parseFloat(a[1]);return a};this.add=function(a,b){return a[0]+b[0]+","+(a[1]+b[1])};
this.isInterpolable=function(a,b){return!0};this.interpolate=function(a,b,c){return a[0]+(b[0]-a[0])*c+","+(a[1]+(b[1]-a[1])*c)}},color:function(){this.isInterpolable=function(a,b){return!0};this.interpolate=function(a,b,c){var d=Math.round(a[0]+(b[0]-a[0])*c),e=Math.round(a[1]+(b[1]-a[1])*c);a=Math.round(a[2]+(b[2]-a[2])*c);return"rgb("+d+","+e+","+a+")"};this.normalize=function(a){return toRGB(a)};this.add=function(a,b){for(var c=[],d=0;d<a.length;++d)c.push(Math.min(a[d],255)+Math.min(b[d],255));
return c.join(",")}},d:function(){this.isInterpolable=function(a,b){return!0};this.interpolate=function(a,b,c){var d="";a=a.myNormalizedPathSegList;b=b.myNormalizedPathSegList;for(var e,f,g,h,k=0;k<a.numberOfItems&&k<b.numberOfItems;++k)if(e=a.getItem(k),f=b.getItem(k),g=e.pathSegType,h=f.pathSegType,1==g||1==h)d+=" z ";else var n=e.x+(f.x-e.x)*c,p=e.y+(f.y-e.y)*c,d=2==g||2==h?d+" M ":4==g||4==h?d+" L ":d+(" C "+(e.x1+(f.x1-e.x1)*c)+","+(e.y1+(f.y1-e.y1)*c)+" "+(e.x2+(f.x2-e.x2)*c)+","+(e.y2+(f.y2-
e.y2)*c)+" "),d=d+(n+","+p);return d};this.normalize=function(a){return createPath(a)}}};
function Animator(a,b,c){var d=0,e=0;this.anim=a;this.target=b;this.index=c;a.targetElement=b;this.attributeType=a.getAttribute("attributeType");this.attributeName=a.getAttribute("attributeName");"CSS"!=this.attributeType&&"XML"!=this.attributeType&&(propDefaults[this.attributeName]&&this.target.style.getPropertyValue(this.attributeName)?this.attributeType="CSS":this.attributeType="XML");if("XML"==this.attributeType&&this.attributeName&&(this.namespace=null,c=this.attributeName.indexOf(":"),-1!=c))for(d=
this.attributeName.substring(0,c),this.attributeName=this.attributeName.substring(c+1);b&&1==b.nodeType;){if(c=b.getAttributeNS("http://www.w3.org/2000/xmlns/",d)){this.namespace=c;break}b=b.parentNode}"d"==this.attributeName?this.d():"points"==this.attributeName&&(this.isInterpolable=function(a,b){return!0},this.interpolate=function(a,b,c){for(var d=[],e,f,m,l=0;l<a.length&&l<b.length;++l)e=a[l].split(","),f=b[l].split(","),m=parseFloat(e[0])+(parseFloat(f[0])-e[0])*c,e=parseFloat(e[1])+(parseFloat(f[1])-
e[1])*c,d.push(m+","+e);return d.join(" ")},this.normalize=function(a){a=a.split(" ");for(var b=a.length-1;0<=b;--b)""===a[b]&&a.splice(b,1);return a});this.from=a.getAttribute("from");this.to=a.getAttribute("to");this.by=a.getAttribute("by");if(this.values=a.getAttribute("values"))this.values=this.values.trim(),";"==this.values.substring(this.values.length-1)&&(this.values=this.values.substring(0,this.values.length-1));this.calcMode=a.getAttribute("calcMode");if(this.keyTimes=a.getAttribute("keyTimes")){this.keyTimes=
this.keyTimes.split(";");d=0;for(e=this.keyTimes.length;d<e;++d)this.keyTimes[d]=parseFloat(this.keyTimes[d]);if(this.keyPoints=a.getAttribute("keyPoints"))for(this.keyPoints=this.keyPoints.split(";"),d=0,e=this.keyPoints.length;d<e;++d)this.keyPoints[d]=parseFloat(this.keyPoints[d])}if(this.keySplines=a.getAttribute("keySplines"))for(this.keySplines=this.keySplines.split(";"),d=0,this.keySplines.length;d<e;++d)this.keySplines[d]=createPath("M 0 0 C "+this.keySplines[d]+" 1 1");(this.dur=a.getAttribute("dur"))&&
"indefinite"!=this.dur&&(this.computedDur=toMillis(this.dur));(this.max=a.getAttribute("max"))&&"indefinite"!=this.max&&(this.computedMax=toMillis(this.max),!isNaN(this.computedMax)&&0<this.computedMax&&(!this.computedDur||this.computedDur>this.computedMax)&&(this.computedDur=this.computedMax));if(this.min=a.getAttribute("min"))if(this.computedMin=toMillis(this.min),!this.computedDur||this.computedDur<this.computedMin)this.computedDur=this.computedMin;this.fill=a.getAttribute("fill");this.type=a.getAttribute("type");
this.repeatCount=a.getAttribute("repeatCount");this.repeatDur=a.getAttribute("repeatDur");this.accumulate=a.getAttribute("accumulate");this.additive=a.getAttribute("additive");this.restart=a.getAttribute("restart");this.restart||(this.restart="always");this.beginListeners=[];this.endListeners=[];this.repeatListeners=[];this.repeatIterations=[];e=a.localName;if("animateColor"==e)this.color();else if("animateMotion"==e)this.isInterpolable=function(a,b){return!0},this.getCurVal=function(){var a=this.target.transform;
return a&&0<a.animVal.numberOfItems?decompose(a.animVal.getItem(0).matrix,"translate"):"0,0"},(this.path=this.getPath())?this.valueAt=function(a){var b=this.path.getTotalLength();a=this.path.getPointAtLength(a*b);return a.x+","+a.y}:this.translation(),this.freeze=function(){var a=this.valueAt(1);this.step(a)},this.keyPoints&&this.keyTimes&&(this.pathKeyTimes=this.keyTimes,this.keyTimes=null,this.superValueAt=this.valueAt,this.valueAt=function(a){for(var b=1;b<this.keyPoints.length;++b){var c=this.keyPoints[this.keyPoints.length-
1];if(this.pathKeyTimes[b]>a){c=this.keyPoints[b-1];if("discrete"!=this.calcMode){var d=this.pathKeyTimes[b-1];a=(a-d)/(this.pathKeyTimes[b]-d);c+=(this.keyPoints[b]-c)*a}break}}return this.superValueAt(c)}),this.step=function(a){this.target.setAttribute("transform","translate("+a+")")};else if("animateTransform"==e){this.isInterpolable=function(a,b){return!0};this.getCurVal=function(){var a=this.type,b=this.target.transform;return b&&0<b.animVal.numberOfItems?decompose(b.animVal.getItem(0).matrix,
a):"scale"==a?"1,1":"translate"==a?"0,0":"rotate"==a?"0,0,0":0};"scale"==this.type?(this.normalize=function(a){a=a.replace(/,/g," ");a=a.split(" ");1==a.length&&(a[1]=a[0]);a[0]=parseFloat(a[0]);a[1]=parseFloat(a[1]);return a},this.add=function(a,b){for(var c=[],d=0;d<a.length;++d)c.push(a[d]*b[d]);return c.join(",")}):"translate"==this.type?this.translation():"rotate"==this.type&&(this.normalize=function(a){a=a.replace(/,/g," ");a=a.split(" ");3>a.length?(a[0]=parseFloat(a[0]),a[1]=0,a[2]=0):(a[0]=
parseFloat(a[0]),a[1]=parseFloat(a[1]),a[2]=parseFloat(a[2]));return a},this.add=function(a,b){for(var c=[],d=0;d<a.length;++d)c.push(a[d]+b[d]);return c.join(",")});if("scale"==this.type||"rotate"==this.type){this.from&&(this.from=this.normalize(this.from).join(","));this.to&&(this.to=this.normalize(this.to).join(","));this.by&&(this.by=this.normalize(this.by).join(","));if(this.values){a=this.values.split(";");d=0;for(e=a.length;d<e;++d)a[d]=this.normalize(a[d]).join(",");this.values=a.join(";")}this.interpolate=
function(a,b,c){for(var d=[],e=0;e<a.length;++e)d.push(a[e]+(b[e]-a[e])*c);return d.join(",")}}this.step=function(a){var b=this.attributeName;a=this.type+"("+a+")";this.target.setAttribute(b,a)}}var f=this;this.anim.beginElement=function(){f.begin();return!0};this.anim.beginElementAt=function(a){f.begin(1E3*a);return!0};this.anim.endElement=function(){f.finish();return!0};this.anim.endElementAt=function(a){f.finish(1E3*a);return!0};this.anim.getStartTime=function(){return parseFloat(f.iterBegin-timeZero)/
1E3};this.anim.getCurrentTime=function(){return parseFloat(new Date-f.iterBegin)/1E3}}function animate(){for(var a=new Date,b=0,c=animations.length;b<c;++b)try{animations[b].f(a)||(--b,--c)}catch(d){"Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIDOMSVGPathElement.getTotalLength]"!==d.message&&(window.console&&console.log?console.log(d):alert(d))}}
function toMillis(a){a=a.trim();var b=a.length;if(-1!=a.indexOf(":")){var c=a.split(":"),b=c.length;a=0;3==c.length&&(a+=36E5*parseInt(c[0],10));a+=6E4*parseInt(c[b-2],10);a+=1E3*parseFloat(c[b-1])}else 2<b&&"ms"==a.substring(b-2)?a=a.substring(0,a.length-2):1<b&&"s"==a.substring(b-1)?(a=a.substring(0,a.length-1),a*=1E3):3<b&&"min"==a.substring(b-3)?(a=a.substring(0,a.length-3),a*=6E4):1<b&&"h"==a.substring(b-1)?(a=a.substring(0,a.length-1),a*=36E5):a*=1E3;return parseFloat(a)}
function decompose(a,b){if("translate"==b)return a.e+","+a.f;var c=a.a,d=a.b,e=a.c,f=a.d;if("rotate"==b)return Math.atan2(e,c)+",0,0";var g=Math.sqrt(c*c+e*e),h=Math.sqrt(d*d+f*f);if("scale"==b)return c=c*f-d*e,(0===c?0:c/g)+","+h;c=c*d+e*f;return 180*(Math.PI/2-Math.acos(0===c?0:c/(h*g)))/Math.PI}
function toRGB(a){var b=[];if("string"!==typeof a)return console.log("Error: in function toRGB, string expected"),a;if("rgb"!==a.substring(0,3)&&"#"!==a.charAt(0)&&"undefined"!==getComputedStyle){var c=document.createElementNS("http://www.w3.org/2000/svg","g");c.setAttribute("id","smil-ie-g_colour");document.documentElement.appendChild(c);c=document.documentElement.getElementById("smil-ie-g_colour");c.style.color=a;a=getComputedStyle(c,null).getPropertyValue("color")}if("rgb"==a.substring(0,3)){a=
a.replace(/ /g,"");a=a.replace("rgb(","");a=a.replace(")","");b=a.split(",");for(a=0;a<b.length;++a)c=b[a].length-1,"%"==b[a].substring(c)?b[a]=Math.round(2.55*b[a].substring(0,c)):b[a]=parseInt(b[a],10);return b}if("#"==a.charAt(0))return a=a.trim(),7==a.length?(b[0]=parseInt(a.substring(1,3),16),b[1]=parseInt(a.substring(3,5),16),b[2]=parseInt(a.substring(5,7),16)):(b[0]=a.substring(1,2),b[1]=a.substring(2,3),b[2]=a.substring(3,4),b[0]=parseInt(b[0]+b[0],16),b[1]=parseInt(b[1]+b[1],16),b[2]=parseInt(b[2]+
b[2],16)),b}function createPath(a){var b=document.createElementNS(svgns,"path");b.setAttribute("d",a);try{b.normalizedPathSegList&&(b.myNormalizedPathSegList=b.normalizedPathSegList)}catch(c){}b.myNormalizedPathSegList||(b.myNormalizedPathSegList=b.pathSegList);return b}var units="grad deg rad kHz Hz em em px pt pc mm cm in ms s %".split(" ");
function getUnit(a){if(a&&a.substring)for(var b=0,c=units.length;b<c;++b){var d=a.length-units[b].length;if(0<d&&a.substring(d)==units[b]&&(d=a.substring(0,d),!isNaN(d)))return[d,units[b]]}return[a,null]}
var propDefaults={font:"see individual properties","font-family":"Arial","font-size":"medium","font-size-adjust":"none","font-stretch":"normal","font-style":"normal","font-variant":"normal","font-weight":"normal",direction:"ltr","letter-spacing":"normal","text-decoration":"none","unicode-bidi":"normal","word-spacing":"normal",clip:"auto",color:"depends on user agent",cursor:"auto",display:"inline",overflow:"hidden",visibility:"visible","clip-path":"none","clip-rule":"nonzero",mask:"none",opacity:1,
"enable-background":"accumulate",filter:"none","flood-color":"black","flood-opacity":1,"lighting-color":"white","stop-color":"black","stop-opacity":1,"pointer-events":"visiblePainted","color-interpolation":"sRGB","color-interpolation-filters":"linearRGB","color-profile":"auto","color-rendering":"auto",fill:"black","fill-opacity":1,"fill-rule":"nonzero","image-rendering":"auto","marker-end":"none","marker-mid":"none","marker-start":"none","shape-rendering":"auto",stroke:"none","stroke-dasharray":"none",
"stroke-dashoffset":0,"stroke-linecap":"butt","stroke-linejoin":"miter","stroke-miterlimit":4,"stroke-opacity":1,"stroke-width":1,"text-rendering":"auto","alignment-baseline":0,"baseline-shift":"baseline","dominant-baseline":"auto","glyph-orientation-horizontal":0,"glyph-orientation-vertical":"auto",kerning:"auto","text-anchor":"start","writing-mode":"lr-tb"};function funk(a,b,c){return function(){a.call(b,c)}}
"function"!==typeof String.prototype.trim&&(window._trimRegExp=RegExp("^\\s+|\\s+$","g"),String.prototype.trim=function(){return this.replace(window._trimRegExp,"")});
isNaN(Date.parse("2012-04-22T19:53:32Z"))?(window._setISO8601RegExp=/([0-9]{4})(?:-([0-9]{2})(?:-([0-9]{2})(?:T([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:.([0-9]+))?)?(?:Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?/,Date.prototype.setISO8601=function(a){a=window._setISO8601RegExp.exec(a);var b=0,c=new Date(a[1],0,1);a[2]&&c.setMonth(a[2]-1);a[3]&&c.setDate(a[3]);a[4]&&c.setHours(a[4]);a[5]&&c.setMinutes(a[5]);a[6]&&c.setSeconds(a[6]);a[7]&&c.setMilliseconds(1E3*parseFloat("0."+a[7]));a[8]&&(b=(60*parseInt(a[10]),
10)+parseInt(a[11],10),b*="-"==a[9]?1:-1);b-=c.getTimezoneOffset();this.setTime(c.getTime()+6E4*b)}):Date.prototype.setISO8601=function(a){this.setTime(Date.parse(a))};try{window.addEventListener("load",initSMIL,!1)}catch(exc$$2){};