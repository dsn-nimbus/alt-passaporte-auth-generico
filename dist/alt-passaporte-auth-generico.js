;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-auth-generico', [])
  .constant('CHAVE_USUARIO', 'pass_usuario_auth')
  .constant('CHAVE_INFORMACOES', 'info')
  .constant('CHAVE_ID_PRODUTO', 'idProduto')
  .constant('PASSAPORTE_API_AUTHORIZATION_BASE',  'https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization')
  .config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With']; // fix para que não vá OPTIONS ao invés de GET na requisição feita ao servidor
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])
  .provider('PaginaUsuarioLogado', function() {
    this.url = '/';

    this.$get = function() {
      return this.url;
    };
  })
  .service('LeitorUrl', ['$location', function($location) {
    this.getValorPor = function getValorPor(chave) {
      return $location.search()[chave];
    };
  }])
  .service('PassaporteService', ['$http', 'LeitorUrl', 'PASSAPORTE_API_AUTHORIZATION_BASE', function($http, LeitorUrl, PASSAPORTE_API_AUTHORIZATION_BASE) {
    this.pegaInformacoesPorToken = function(tokenPassaporte, idProduto) {
      return $http.get(PASSAPORTE_API_AUTHORIZATION_BASE + '?token=' + tokenPassaporte + '&idProduto=' + idProduto)
                  .then(function(info) {
                    return info.data;
                  });
    };
  }])
  .factory('redirecionaPaginaUsuarioLogado', ['$window', 'PaginaUsuarioLogado', function($window, PaginaUsuarioLogado) {
    return function() {
      $window.location.replace(PaginaUsuarioLogado);
    }
  }])
  .service('UsuarioInfo', ['$window', '$log', '$q', 'redirecionaPaginaUsuarioLogado', 'LeitorUrl', 'PassaporteService', 'CHAVE_USUARIO', 'CHAVE_INFORMACOES', 'CHAVE_ID_PRODUTO', 'PaginaUsuarioLogado',
  function($window, $log, $q, redirecionaPaginaUsuarioLogado, LeitorUrl, PassaporteService, CHAVE_USUARIO, CHAVE_INFORMACOES, CHAVE_ID_PRODUTO, PaginaUsuarioLogado) {

    var _infoTokenPassaporte = LeitorUrl.getValorPor(CHAVE_INFORMACOES);
    var _idProduto = LeitorUrl.getValorPor(CHAVE_ID_PRODUTO);

    this.registraInformacoesRedireciona = function registraInformacoes() {
      this.registraInformacoesApenas().then(redirecionaPaginaUsuarioLogado);
    };

    this.registraInformacoesApenas = function registraInformacoesSemRedirecionamento() {
      return PassaporteService
              .pegaInformacoesPorToken(_infoTokenPassaporte, _idProduto)
              .then(function(usuario) {
                $window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));

                return usuario;
              })
              .catch(function(erro) {
                $window.alert('Erro ao buscar as informações pelo token (passaporte).');
                $log.error(erro);

                return $q.reject(erro);
              });
    };
  }])
  .controller('AuthCtrl', ['UsuarioInfo', function(UsuarioInfo) {
    ;(function() {
      UsuarioInfo.registraInformacoesRedireciona();
    }());
  }]);
}(window.angular));
