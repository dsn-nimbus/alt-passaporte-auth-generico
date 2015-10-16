;(function(ng) {
  "use strict";

  ng.module('alt.koopon.passaporte-auth-generico', ['emd.ng-xtorage'])
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
    this.getValorPor = function(chave) {
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
  .service('UsuarioInfo', ['$window', '$log', '$xtorage', 'LeitorUrl', 'PassaporteService', 'CHAVE_USUARIO', 'CHAVE_INFORMACOES', 'PaginaUsuarioLogado',
  function($window, $log, $xtorage, LeitorUrl, PassaporteService, CHAVE_USUARIO, CHAVE_INFORMACOES, PaginaUsuarioLogado) {

    var _infoTokenPassaporte = LeitorUrl.getValorPor(CHAVE_INFORMACOES);

    var _registraInformacoes = function() {
      PassaporteService
        .pegaInformacoesPorToken(_infoTokenPassaporte)
        .then(function(usuario) {
          $xtorage.save(CHAVE_USUARIO, usuario);
          $window.location.replace(PaginaUsuarioLogado);
        })
        .catch(function(erro) {
          $window.alert('Erro ao buscar as informações pelo token (passaporte).');
          $log.error(erro);
        });
    };

    this.registraInformacoes = _registraInformacoes;
  }])
  .controller('AuthCtrl', ['UsuarioInfo', function(UsuarioInfo) {
    ;(function() {
      UsuarioInfo.registraInformacoes();
    }());
  }]);
}(window.angular));
