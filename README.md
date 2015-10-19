# alt-passaporte-auth-generico
[![Build Status](https://secure.travis-ci.org/dsn-nimbus/alt-passaporte-auth-generico.png?branch=master)](https://travis-ci.org/dsn-nimbus/alt-passaporte-auth-generico)
[![Coverage Status](https://coveralls.io/repos/dsn-nimbus/alt-passaporte-auth-generico/badge.svg?branch=master&service=github)](https://coveralls.io/r/dsn-nimbus/alt-passaporte-auth-generico/?branch=master)

## Exemplo de uso

```html
<!-- auth.html-->

<!DOCTYPE html>
<html lang="pt" ng-app="pass-auth-app">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="favicon.ico" type="image/x-icon"/>

        <base href="/" />

        <title>Exemplo Sistema</title>
	</head>
	
	<body ng-controller="AuthCtrl">
		
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
		
		<script>
		!function(o){"use strict";o.module("alt.passaporte-auth-generico",[])
		.constant("CHAVE_USUARIO","pass_usuario_auth")
		.constant("CHAVE_INFORMACOES","info")
		.constant("PASSAPORTE_API_AUTHORIZATION_BASE","https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization")
		.config(["$httpProvider",function(o){delete o.defaults.headers.common["X-Requested-With"]}])
		.config(["$locationProvider",function(o){o.html5Mode(!0)}])
		.provider("PaginaUsuarioLogado",function(){this.url="/",this.$get=function(){return this.url}})
		.service("LeitorUrl",["$location",function(o){this.getValorPor=function(t){return o.search()[t]}}])
		.service("PassaporteService",["$http","PASSAPORTE_API_AUTHORIZATION_BASE",function(o,t){this.pegaInformacoesPorToken=function(r){return o.get(t+"?token="+r).then(function(o){return o.data})}}])
		.service("UsuarioInfo",["$window","$log","LeitorUrl","PassaporteService","CHAVE_USUARIO","CHAVE_INFORMACOES","PaginaUsuarioLogado",function(o,t,r,e,n,a,i){var s=r.getValorPor(a);this.registraInformacoes=function(){e.pegaInformacoesPorToken(s).then(function(t){o.localStorage.setItem(n,JSON.stringify(t)),o.location.replace(i)})["catch"](function(r){o.alert("Erro ao buscar as informações pelo token (passaporte)."),t.error(r)})}}])
		.controller("AuthCtrl",["UsuarioInfo",function(o){!function(){o.registraInformacoes()}()}])}(window.angular);
		</script>
		
		<script>
			angular
			  .module('pass-auth-app', ['alt.passaporte-auth-generico'])
			  .config(['PaginaUsuarioLogadoProvider', function(PaginaUsuarioLogadoProvider) {
			    PaginaUsuarioLogadoProvider.url = '/minha-url-usuario-logado';
			  }]);
		</script>
	</body>
</html>
```

