(this["webpackJsonpascii-diagrams"]=this["webpackJsonpascii-diagrams"]||[]).push([[109],{224:function(t,a,n){!function(t){"use strict";t.defineMode("troff",(function(){var t={};function a(a){if(a.eatSpace())return null;var n=a.sol(),e=a.next();if("\\"===e)return a.match("fB")||a.match("fR")||a.match("fI")||a.match("u")||a.match("d")||a.match("%")||a.match("&")?"string":a.match("m[")?(a.skipTo("]"),a.next(),"string"):a.match("s+")||a.match("s-")?(a.eatWhile(/[\d-]/),"string"):a.match("(")||a.match("*(")?(a.eatWhile(/[\w-]/),"string"):"string";if(n&&("."===e||"'"===e)&&a.eat("\\")&&a.eat('"'))return a.skipToEnd(),"comment";if(n&&"."===e){if(a.match("B ")||a.match("I ")||a.match("R "))return"attribute";if(a.match("TH ")||a.match("SH ")||a.match("SS ")||a.match("HP "))return a.skipToEnd(),"quote";if(a.match(/[A-Z]/)&&a.match(/[A-Z]/)||a.match(/[a-z]/)&&a.match(/[a-z]/))return"attribute"}a.eatWhile(/[\w-]/);var r=a.current();return t.hasOwnProperty(r)?t[r]:null}function n(t,n){return(n.tokens[0]||a)(t,n)}return{startState:function(){return{tokens:[]}},token:function(t,a){return n(t,a)}}})),t.defineMIME("text/troff","troff"),t.defineMIME("text/x-troff","troff"),t.defineMIME("application/x-troff","troff")}(n(23))}}]);
//# sourceMappingURL=109.8c1513ad.chunk.js.map