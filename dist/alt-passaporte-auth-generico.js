;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-auth-generico', [])
  .constant('CHAVE_USUARIO', 'pass_usuario_auth')
  .constant('CHAVE_INFORMACOES', 'info')
  .constant('PASSAPORTE_API_AUTHORIZATION_BASE',  'https://passaporte2-dev.alterdata.com.br/passaporte-rest-api/rest/authorization')
  .config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With']; // fix para que não vá OPTIONS ao invés de GET na requisição feita ao servidor
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
  .service('PassaporteService', ['$http', 'PASSAPORTE_API_AUTHORIZATION_BASE', function($http, PASSAPORTE_API_AUTHORIZATION_BASE) {
    this.pegaInformacoesPorToken = function(tokenPassaporte) {
      return $http.get(PASSAPORTE_API_AUTHORIZATION_BASE + '?token=' + tokenPassaporte)
                  .then(function(info) {
                    return info.data;
                  });
    };
  }])
  .service('UsuarioInfo', ['$window', '$log', 'LeitorUrl', 'PassaporteService', 'CHAVE_USUARIO', 'CHAVE_INFORMACOES', 'PaginaUsuarioLogado',
  function($window, $log, LeitorUrl, PassaporteService, CHAVE_USUARIO, CHAVE_INFORMACOES, PaginaUsuarioLogado) {

    var _infoTokenPassaporte = LeitorUrl.getValorPor(CHAVE_INFORMACOES);

    this.registraInformacoes = function registraInformacoes() {
      PassaporteService
        .pegaInformacoesPorToken(_infoTokenPassaporte)
        .then(function(usuario) {
          $window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
          $window.location.replace(PaginaUsuarioLogado);
        })
        .catch(function(erro) {
          $window.alert('Erro ao buscar as informações pelo token (passaporte).');
          $log.error(erro);
        });
    };
  }])
  .controller('AuthCtrl', ['UsuarioInfo', function(UsuarioInfo) {
    ;(function() {
      UsuarioInfo.registraInformacoes();
    }());
  }]);
}(window.angular));
